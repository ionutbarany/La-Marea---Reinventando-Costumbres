/**
 * Copia TODO este archivo en Extensiones → Apps Script de tu Google Sheet.
 * Despliega como aplicación web (solo doGet). Ver CARTA-SHEETS-SETUP.md
 *
 * Carta, además de Sección y Plato, puede llevar:
 *   Grupo, Subgrupo, Tamaño, Grupo EN, Subgrupo EN, Tamaño EN, Nota grupo, Nota grupo EN.
 * Varias filas con el mismo plato y distinto Tamaño salen como un solo producto.
 * La Nota grupo de cualquier fila se muestra bajo el título de ese Grupo.
 * Secciones sigue siendo solo la lista del inicio (Bebidas es una sola).
 * Si la hoja aún no tiene esas columnas, la carta se lee como antes.
 */

/** Si la pestaña Secciones está vacía, se usa esta lista (compatibilidad). */
const ORDEN_SECCIONES_RESPALDO = [
  "Para compartir",
  "De la casa",
  "Burgers",
  "Montaditos",
  "Dulce final",
  "Bebidas"
];

function normalizarClave(texto) {
  return String(texto)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function slugify(texto) {
  return normalizarClave(texto)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function construirMapaSecciones(nombres) {
  const mapa = {};
  nombres.forEach(function (nombre) {
    const clave = normalizarClave(nombre);
    if (clave && !mapa[clave]) mapa[clave] = nombre;
  });
  return mapa;
}

function canonSeccion(texto, mapaSeccion) {
  const clave = normalizarClave(texto);
  if (mapaSeccion && mapaSeccion[clave]) return mapaSeccion[clave];
  return String(texto).trim();
}

function parsePrecio(valor) {
  if (valor === null || valor === undefined || valor === "") return NaN;
  if (typeof valor === "number") return isNaN(valor) ? NaN : valor;
  if (Object.prototype.toString.call(valor) === "[object Date]") return NaN;

  let s = String(valor).trim().replace(/\u00a0/g, " ");
  s = s.replace(/[€$]/g, "").replace(/\s/g, "");
  if (!s) return NaN;

  const coma = s.lastIndexOf(",");
  const punto = s.lastIndexOf(".");
  if (coma !== -1 && punto !== -1) {
    s = coma > punto
      ? s.replace(/\./g, "").replace(",", ".")
      : s.replace(/,/g, "");
  } else if (coma !== -1) {
    s = s.replace(",", ".");
  }

  const n = parseFloat(s);
  return isNaN(n) ? NaN : n;
}

function esVisible(valor) {
  if (valor === "" || valor === null || valor === undefined) return true;
  const v = String(valor).trim().toLowerCase();
  if (["no", "n", "false", "0", "oculto", "oculta"].indexOf(v) !== -1) return false;
  return true;
}

function indiceColumna(cabeceras, nombre) {
  const clave = normalizarClave(nombre);
  for (let j = 0; j < cabeceras.length; j++) {
    if (cabeceras[j] === clave) return j;
  }
  return -1;
}

function leerFilas(hoja) {
  if (!hoja) return [];
  const datos = hoja.getDataRange().getValues();
  if (datos.length < 2) return [];

  const cabeceras = datos[0].map(normalizarClave);
  const filas = [];

  for (let i = 1; i < datos.length; i++) {
    const fila = datos[i];
    if (!fila.some(function (c) { return String(c).trim() !== ""; })) continue;

    const obj = {};
    for (let j = 0; j < cabeceras.length; j++) {
      if (cabeceras[j]) obj[cabeceras[j]] = fila[j];
    }
    filas.push(obj);
  }
  return filas;
}

function nombresDesdeFilasSecciones(filas) {
  const nombres = [];
  filas.forEach(function (r) {
    const nombre = String(r.seccion || "").trim();
    if (nombre) nombres.push(nombre);
  });
  return nombres;
}

function leerSeccionesParaMenu(filas) {
  const items = [];

  filas.forEach(function (r, index) {
    const nombre = String(r.seccion || "").trim();
    if (!nombre) return;
    if (!esVisible(r.visible)) return;

    let orden = index;
    if (r.orden !== undefined && r.orden !== null && String(r.orden).trim() !== "") {
      const n = Number(r.orden);
      if (!isNaN(n)) orden = n;
    }

    const nombreEn = String(r["seccion en"] || "").trim();
    const notaEn = String(r["nota en"] || "").trim();

    items.push({
      nombre: nombre,
      nombreEn: nombreEn,
      nota: String(r.nota || "").trim(),
      notaEn: notaEn,
      orden: orden,
      index: index
    });
  });

  items.sort(function (a, b) {
    if (a.orden !== b.orden) return a.orden - b.orden;
    return a.index - b.index;
  });

  return items;
}

function textoCelda(valor) {
  return String(valor == null ? "" : valor).trim();
}

function contenidoVacio() {
  return { platos: [], grupos: [] };
}

function buscarPorNombre(lista, nombre) {
  for (var i = 0; i < lista.length; i++) {
    if (lista[i].nombre === nombre) return lista[i];
  }
  return null;
}

function asegurarGrupo(lista, nombre, nombreEn, nota, notaEn) {
  var grupo = buscarPorNombre(lista, nombre);
  if (!grupo) {
    grupo = { nombre: nombre, platos: [], grupos: [] };
    if (nombreEn) grupo.nombreEn = nombreEn;
    lista.push(grupo);
  } else if (nombreEn && !grupo.nombreEn) {
    grupo.nombreEn = nombreEn;
  }
  if (nota && !grupo.nota) grupo.nota = nota;
  if (notaEn && !grupo.notaEn) grupo.notaEn = notaEn;
  return grupo;
}

function buscarPlatoConPrecios(lista, nombre) {
  for (var i = 0; i < lista.length; i++) {
    if (lista[i].nombre === nombre && Array.isArray(lista[i].precios)) return lista[i];
  }
  return null;
}

function exportarGrupo(grupo) {
  var out = { nombre: grupo.nombre };
  if (grupo.nombreEn) out.nombreEn = grupo.nombreEn;
  if (grupo.nota) out.nota = grupo.nota;
  if (grupo.notaEn) out.notaEn = grupo.notaEn;
  if (grupo.grupos && grupo.grupos.length) out.grupos = grupo.grupos.map(exportarGrupo);
  if (grupo.platos && grupo.platos.length) out.platos = grupo.platos;
  return out;
}

function leerPlatosCarta(hoja, mapaSeccion) {
  if (!hoja) return {};

  const rango = hoja.getDataRange();
  const datos = rango.getValues();
  const displays = rango.getDisplayValues();
  if (datos.length < 2) return {};

  const cabeceras = datos[0].map(normalizarClave);
  const idxSeccion = indiceColumna(cabeceras, "seccion");
  const idxGrupo = indiceColumna(cabeceras, "grupo");
  const idxSubgrupo = indiceColumna(cabeceras, "subgrupo");
  const idxPlato = indiceColumna(cabeceras, "plato");
  const idxTamano = indiceColumna(cabeceras, "tamaño");
  const idxDescripcion = indiceColumna(cabeceras, "descripcion");
  const idxAlergenos = indiceColumna(cabeceras, "alergenos");
  const idxPlatoEn = indiceColumna(cabeceras, "plato en");
  const idxDescripcionEn = indiceColumna(cabeceras, "descripcion en");
  const idxAlergenosEn = indiceColumna(cabeceras, "alergenos en");
  const idxGrupoEn = indiceColumna(cabeceras, "grupo en");
  const idxSubgrupoEn = indiceColumna(cabeceras, "subgrupo en");
  const idxTamanoEn = indiceColumna(cabeceras, "tamaño en");
  const idxNotaGrupo = indiceColumna(cabeceras, "nota grupo");
  const idxNotaGrupoEn = indiceColumna(cabeceras, "nota grupo en");
  const idxPrecio = indiceColumna(cabeceras, "precio");
  const idxVisible = indiceColumna(cabeceras, "visible");

  const contenidos = {};

  function contenidoDe(sec) {
    if (!contenidos[sec]) contenidos[sec] = contenidoVacio();
    return contenidos[sec];
  }

  for (let i = 1; i < datos.length; i++) {
    const fila = datos[i];
    const display = displays[i];
    if (!fila.some(function (c) { return String(c).trim() !== ""; })) continue;

    if (idxVisible >= 0 && !esVisible(fila[idxVisible])) continue;

    const sec = canonSeccion(idxSeccion >= 0 ? fila[idxSeccion] : "", mapaSeccion);
    const nombrePlato = idxPlato >= 0 ? textoCelda(fila[idxPlato]) : "";
    if (!sec || !nombrePlato) continue;

    let precio = NaN;
    let precioTexto = "";
    if (idxPrecio >= 0) {
      precio = parsePrecio(fila[idxPrecio]);
      if (isNaN(precio)) precio = parsePrecio(display[idxPrecio]);
      if (isNaN(precio)) {
        const bruto = fila[idxPrecio];
        const mostrado = String(display[idxPrecio] || "").trim();
        if (typeof bruto === "string" && bruto.trim()) precioTexto = bruto.trim();
        else if (mostrado && Object.prototype.toString.call(bruto) !== "[object Date]") {
          precioTexto = mostrado;
        }
      }
    }
    if (isNaN(precio) && !precioTexto) continue;

    const descripcion = idxDescripcion >= 0 ? textoCelda(fila[idxDescripcion]) : "";
    const alergenos = idxAlergenos >= 0 ? textoCelda(fila[idxAlergenos]) : "";
    const nombreEn = idxPlatoEn >= 0 ? textoCelda(fila[idxPlatoEn]) : "";
    const descripcionEn = idxDescripcionEn >= 0 ? textoCelda(fila[idxDescripcionEn]) : "";
    const alergenosEn = idxAlergenosEn >= 0 ? textoCelda(fila[idxAlergenosEn]) : "";
    const grupoNombre = idxGrupo >= 0 ? textoCelda(fila[idxGrupo]) : "";
    const subgrupoNombre = idxSubgrupo >= 0 ? textoCelda(fila[idxSubgrupo]) : "";
    const tamanoNombre = idxTamano >= 0 ? textoCelda(fila[idxTamano]) : "";
    const grupoEn = idxGrupoEn >= 0 ? textoCelda(fila[idxGrupoEn]) : "";
    const subgrupoEn = idxSubgrupoEn >= 0 ? textoCelda(fila[idxSubgrupoEn]) : "";
    const tamanoEn = idxTamanoEn >= 0 ? textoCelda(fila[idxTamanoEn]) : "";
    const notaGrupo = idxNotaGrupo >= 0 ? textoCelda(fila[idxNotaGrupo]) : "";
    const notaGrupoEn = idxNotaGrupoEn >= 0 ? textoCelda(fila[idxNotaGrupoEn]) : "";
    const valorPrecio = isNaN(precio) ? precioTexto : precio;

    const plato = {
      nombre: nombrePlato,
      descripcion: descripcion,
      precio: valorPrecio
    };
    if (alergenos) plato.alergenos = alergenos;
    if (nombreEn) plato.nombreEn = nombreEn;
    if (descripcionEn) plato.descripcionEn = descripcionEn;
    if (alergenosEn) plato.alergenosEn = alergenosEn;

    const contenido = contenidoDe(sec);
    if (!grupoNombre) {
      contenido.platos.push(plato);
      continue;
    }

    var destino;
    if (subgrupoNombre) {
      var padre = asegurarGrupo(contenido.grupos, grupoNombre, grupoEn, notaGrupo, notaGrupoEn);
      destino = asegurarGrupo(padre.grupos, subgrupoNombre, subgrupoEn, "", "");
    } else {
      destino = asegurarGrupo(contenido.grupos, grupoNombre, grupoEn, notaGrupo, notaGrupoEn);
    }

    if (!tamanoNombre) {
      destino.platos.push(plato);
      continue;
    }

    var existente = buscarPlatoConPrecios(destino.platos, nombrePlato);
    if (!existente) {
      delete plato.precio;
      plato.precios = [];
      destino.platos.push(plato);
      existente = plato;
    }
    var linea = { nombre: tamanoNombre, precio: valorPrecio };
    if (tamanoEn) linea.nombreEn = tamanoEn;
    existente.precios.push(linea);
  }

  return contenidos;
}

function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const filasSecciones = leerFilas(ss.getSheetByName("Secciones"));

  let nombresParaMapa = nombresDesdeFilasSecciones(filasSecciones);
  if (nombresParaMapa.length === 0) {
    nombresParaMapa = ORDEN_SECCIONES_RESPALDO.slice();
  }
  const mapaSeccion = construirMapaSecciones(nombresParaMapa);

  const cartaPorSeccion = leerPlatosCarta(ss.getSheetByName("Carta"), mapaSeccion);

  let seccionesMenu = leerSeccionesParaMenu(filasSecciones);
  if (seccionesMenu.length === 0 && filasSecciones.length === 0) {
    seccionesMenu = ORDEN_SECCIONES_RESPALDO.map(function (nombre, index) {
      return { nombre: nombre, nota: "", orden: index, index: index };
    });
  }

  const menu = seccionesMenu.map(function (sec) {
    const contenido = cartaPorSeccion[sec.nombre] || contenidoVacio();
    const item = {
      id: slugify(sec.nombre),
      nombre: sec.nombre,
      nota: sec.nota || "",
      platos: contenido.platos
    };
    if (sec.nombreEn) item.nombreEn = sec.nombreEn;
    if (sec.notaEn) item.notaEn = sec.notaEn;
    if (contenido.grupos.length) item.grupos = contenido.grupos.map(exportarGrupo);
    return item;
  });

  return ContentService.createTextOutput(JSON.stringify(menu)).setMimeType(
    ContentService.MimeType.JSON
  );
}
