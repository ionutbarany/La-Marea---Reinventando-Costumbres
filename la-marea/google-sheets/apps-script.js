/**
 * Copia TODO este archivo en Extensiones → Apps Script de tu Google Sheet.
 * Despliega como aplicación web (solo doGet). Ver CARTA-SHEETS-SETUP.md
 */

const ORDEN_SECCIONES = [
  "Para compartir",
  "De la casa",
  "Burgers",
  "Montaditos",
  "Dulce final",
  "Bebidas"
];

const MAPA_SECCION = {};
ORDEN_SECCIONES.forEach(function (nombre) {
  MAPA_SECCION[normalizarClave(nombre)] = nombre;
});

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

function canonSeccion(texto) {
  const clave = normalizarClave(texto);
  return MAPA_SECCION[clave] || String(texto).trim();
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

function leerPlatosCarta(hoja) {
  if (!hoja) return {};

  const rango = hoja.getDataRange();
  const datos = rango.getValues();
  const displays = rango.getDisplayValues();
  if (datos.length < 2) return {};

  const cabeceras = datos[0].map(normalizarClave);
  const idxSeccion = indiceColumna(cabeceras, "seccion");
  const idxPlato = indiceColumna(cabeceras, "plato");
  const idxDescripcion = indiceColumna(cabeceras, "descripcion");
  const idxPrecio = indiceColumna(cabeceras, "precio");
  const idxVisible = indiceColumna(cabeceras, "visible");

  const platosPorSeccion = {};

  for (let i = 1; i < datos.length; i++) {
    const fila = datos[i];
    const display = displays[i];
    if (!fila.some(function (c) { return String(c).trim() !== ""; })) continue;

    if (idxVisible >= 0 && !esVisible(fila[idxVisible])) continue;

    const sec = canonSeccion(idxSeccion >= 0 ? fila[idxSeccion] : "");
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

    if (!platosPorSeccion[sec]) platosPorSeccion[sec] = [];
    platosPorSeccion[sec].push({
      nombre: nombrePlato,
      descripcion: descripcion,
      precio: precio
    });
  }

  return platosPorSeccion;
}

function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const platosPorSeccion = leerPlatosCarta(ss.getSheetByName("Carta"));
  const filasSecciones = leerFilas(ss.getSheetByName("Secciones"));

  const notasPorNombre = {};
  filasSecciones.forEach(function (r) {
    const nombre = canonSeccion(r.seccion || "");
    if (nombre) notasPorNombre[nombre] = String(r.nota || "").trim();
  });

  const menu = ORDEN_SECCIONES.map(function (nombre) {
    return {
      id: slugify(nombre),
      nombre: nombre,
      nota: notasPorNombre[nombre] || "",
      platos: platosPorSeccion[nombre] || []
    };
  });

  return ContentService.createTextOutput(JSON.stringify(menu)).setMimeType(
    ContentService.MimeType.JSON
  );
}
