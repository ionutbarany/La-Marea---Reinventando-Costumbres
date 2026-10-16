/**
 * Copia TODO este archivo en Extensiones → Apps Script de tu Google Sheet.
 * Despliega como aplicación web (solo doGet). Ver CARTA-SHEETS-SETUP.md
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

    items.push({
      nombre: nombre,
      nota: String(r.nota || "").trim(),
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

function leerPlatosCarta(hoja, mapaSeccion) {
  if (!hoja) return {};

  const rango = hoja.getDataRange();
  const datos = rango.getValues();
  const displays = rango.getDisplayValues();
  if (datos.length < 2) return {};

  const cabeceras = datos[0].map(normalizarClave);
  const idxSeccion = indiceColumna(cabeceras, "seccion");
  const idxPlato = indiceColumna(cabeceras, "plato");
  const idxDescripcion = indiceColumna(cabeceras, "descripcion");
  const idxAlergenos = indiceColumna(cabeceras, "alergenos");
  const idxPrecio = indiceColumna(cabeceras, "precio");
  const idxVisible = indiceColumna(cabeceras, "visible");

  const platosPorSeccion = {};

  for (let i = 1; i < datos.length; i++) {
    const fila = datos[i];
    const display = displays[i];
    if (!fila.some(function (c) { return String(c).trim() !== ""; })) continue;

    if (idxVisible >= 0 && !esVisible(fila[idxVisible])) continue;

    const sec = canonSeccion(idxSeccion >= 0 ? fila[idxSeccion] : "", mapaSeccion);
    const nombrePlato = idxPlato >= 0 ? String(fila[idxPlato] || "").trim() : "";
    if (!sec || !nombrePlato) continue;

    let precio = NaN;
    if (idxPrecio >= 0) {
      precio = parsePrecio(fila[idxPrecio]);
      if (isNaN(precio)) precio = parsePrecio(display[idxPrecio]);
    }
    if (isNaN(precio)) continue;

    const descripcion = idxDescripcion >= 0
      ? String(fila[idxDescripcion] || "").trim()
      : "";
    const alergenos = idxAlergenos >= 0
      ? String(fila[idxAlergenos] || "").trim()
      : "";

    const plato = {
      nombre: nombrePlato,
      descripcion: descripcion,
      precio: precio
    };
    if (alergenos) plato.alergenos = alergenos;

    if (!platosPorSeccion[sec]) platosPorSeccion[sec] = [];
    platosPorSeccion[sec].push(plato);
  }

  return platosPorSeccion;
}

function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const filasSecciones = leerFilas(ss.getSheetByName("Secciones"));

  let nombresParaMapa = nombresDesdeFilasSecciones(filasSecciones);
  if (nombresParaMapa.length === 0) {
    nombresParaMapa = ORDEN_SECCIONES_RESPALDO.slice();
  }
  const mapaSeccion = construirMapaSecciones(nombresParaMapa);

  const platosPorSeccion = leerPlatosCarta(ss.getSheetByName("Carta"), mapaSeccion);

  let seccionesMenu = leerSeccionesParaMenu(filasSecciones);
  if (seccionesMenu.length === 0 && filasSecciones.length === 0) {
    seccionesMenu = ORDEN_SECCIONES_RESPALDO.map(function (nombre, index) {
      return { nombre: nombre, nota: "", orden: index, index: index };
    });
  }

  const menu = seccionesMenu.map(function (sec) {
    return {
      id: slugify(sec.nombre),
      nombre: sec.nombre,
      nota: sec.nota || "",
      platos: platosPorSeccion[sec.nombre] || []
    };
  });

  return ContentService.createTextOutput(JSON.stringify(menu)).setMimeType(
    ContentService.MimeType.JSON
  );
}
