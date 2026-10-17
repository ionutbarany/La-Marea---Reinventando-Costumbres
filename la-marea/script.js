// Navegación entre inicio y sección, y pintado de platos.
// Los textos se insertan con textContent (nunca innerHTML).

const LANG_KEY = "la-marea-lang";

const UI = {
  es: {
    navSecciones: "Secciones de la carta",
    volver: "Volver a la carta",
    verEnIngles: "Ver carta en inglés",
    verEnEspanol: "Ver carta en español",
    proximamente: "Próximamente.",
    cargando: "Cargando carta…",
    errorCarta:
      "No se pudo cargar la carta en línea. Mostrando copia de respaldo."
  },
  en: {
    navSecciones: "Menu sections",
    volver: "Back to menu",
    verEnIngles: "View menu in English",
    verEnEspanol: "View menu in Spanish",
    proximamente: "Coming soon.",
    cargando: "Loading menu…",
    errorCarta: "Could not load the online menu. Showing a backup copy."
  }
};

const viewHome = document.getElementById("view-home");
const viewSection = document.getElementById("view-section");
const sectionList = document.getElementById("section-list");
const sectionTitle = document.getElementById("section-title");
const sectionNote = document.getElementById("section-note");
const sectionEmpty = document.getElementById("section-empty");
const dishList = document.getElementById("dish-list");
const cartaStatus = document.getElementById("carta-status");
const navSecciones = document.getElementById("nav-secciones");
const topbarBack = document.querySelector(".topbar__back");
const langToggle = document.getElementById("lang-toggle");

let MENU = [];
let appLista = false;

function leerIdiomaGuardado() {
  try {
    return localStorage.getItem(LANG_KEY) === "en" ? "en" : "es";
  } catch {
    return "es";
  }
}

function guardarIdioma() {
  try {
    localStorage.setItem(LANG_KEY, idioma);
  } catch {
    /* modo privado o almacenamiento lleno */
  }
}

let idioma = leerIdiomaGuardado();

function localePrecio() {
  return idioma === "en" ? "en-GB" : "es-ES";
}

function formatoPrecio() {
  return new Intl.NumberFormat(localePrecio(), {
    style: "currency",
    currency: "EUR"
  });
}

function t(clave) {
  return UI[idioma][clave] || UI.es[clave] || "";
}

function textoCampo(obj, campoEs, campoEn) {
  if (idioma === "en" && campoEn) {
    const en = obj[campoEn];
    if (typeof en === "string" && en.trim()) return en.trim();
  }
  const es = obj[campoEs];
  return typeof es === "string" ? es : "";
}

function actualizarTextosUI() {
  document.documentElement.lang = idioma;
  if (navSecciones) navSecciones.setAttribute("aria-label", t("navSecciones"));
  if (topbarBack) topbarBack.setAttribute("aria-label", t("volver"));
  if (sectionEmpty) sectionEmpty.textContent = t("proximamente");
  if (langToggle) {
    const enIngles = idioma === "en";
    langToggle.textContent = enIngles ? "ES" : "EN";
    langToggle.setAttribute(
      "aria-label",
      enIngles ? t("verEnEspanol") : t("verEnIngles")
    );
    langToggle.setAttribute("aria-pressed", enIngles ? "true" : "false");
  }
}

function alternarIdioma() {
  idioma = idioma === "en" ? "es" : "en";
  guardarIdioma();
  actualizarTextosUI();
  if (!appLista) return;
  pintarInicio();
  const id = decodeURIComponent(location.hash.slice(1));
  const seccion = MENU.find((s) => s.id === id);
  if (seccion) pintarSeccion(seccion);
}

function pintarInicio() {
  sectionList.replaceChildren();
  MENU.forEach((seccion) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.className = "section-link";
    a.href = "#" + seccion.id;
    a.textContent = textoCampo(seccion, "nombre", "nombreEn");
    li.appendChild(a);
    sectionList.appendChild(li);
  });
}

function crearPlato(plato) {
  const li = document.createElement("li");
  li.className = "dish";

  const fila = document.createElement("div");
  fila.className = "dish__row";

  const titulo = document.createElement("span");
  titulo.className = "dish__title";

  const nombre = document.createElement("span");
  nombre.className = "dish__name";
  nombre.textContent = textoCampo(plato, "nombre", "nombreEn");
  titulo.appendChild(nombre);

  const textoAlergenos = textoCampo(plato, "alergenos", "alergenosEn");
  if (textoAlergenos) {
    const alergenos = document.createElement("span");
    alergenos.className = "dish__allergens";
    alergenos.textContent = " · " + textoAlergenos;
    titulo.appendChild(alergenos);
  }

  const precio = document.createElement("span");
  precio.className = "dish__price";
  precio.textContent = formatoPrecio().format(plato.precio);

  fila.append(titulo, precio);
  li.appendChild(fila);

  const descripcion = textoCampo(plato, "descripcion", "descripcionEn");
  if (descripcion) {
    const desc = document.createElement("p");
    desc.className = "dish__desc";
    desc.textContent = descripcion;
    li.appendChild(desc);
  }

  return li;
}

function pintarSeccion(seccion) {
  sectionTitle.textContent = textoCampo(seccion, "nombre", "nombreEn");

  const nota = textoCampo(seccion, "nota", "notaEn");
  sectionNote.textContent = nota;
  sectionNote.hidden = !nota;

  dishList.replaceChildren(...seccion.platos.map(crearPlato));
  sectionEmpty.hidden = seccion.platos.length > 0;
}

function mostrarVista() {
  if (!appLista) return;

  const id = decodeURIComponent(location.hash.slice(1));
  const seccion = MENU.find((s) => s.id === id);

  if (seccion) {
    pintarSeccion(seccion);
    viewHome.hidden = true;
    viewSection.hidden = false;
  } else {
    viewSection.hidden = true;
    viewHome.hidden = false;
  }
  window.scrollTo(0, 0);
  quitarFoco();
}

function quitarFoco() {
  if (document.activeElement && document.activeElement !== document.body) {
    document.activeElement.blur();
  }
}

function mostrarEstado(mensaje, tipo) {
  if (!cartaStatus) return;
  cartaStatus.textContent = mensaje;
  cartaStatus.hidden = !mensaje;
  cartaStatus.classList.remove("carta-status--loading", "carta-status--error");
  if (tipo) cartaStatus.classList.add("carta-status--" + tipo);
}

function campoOpcionalString(valor) {
  return valor === undefined || typeof valor === "string";
}

function menuValido(datos) {
  if (!Array.isArray(datos)) return false;
  return datos.every(
    (s) =>
      s &&
      typeof s.id === "string" &&
      typeof s.nombre === "string" &&
      campoOpcionalString(s.nombreEn) &&
      campoOpcionalString(s.notaEn) &&
      Array.isArray(s.platos) &&
      s.platos.every((p) => {
        if (
          !p ||
          typeof p.nombre !== "string" ||
          typeof p.precio !== "number" ||
          Number.isNaN(p.precio)
        ) {
          return false;
        }
        if (p.alergenos !== undefined && typeof p.alergenos !== "string") {
          return false;
        }
        if (!campoOpcionalString(p.nombreEn)) return false;
        if (!campoOpcionalString(p.descripcionEn)) return false;
        if (!campoOpcionalString(p.alergenosEn)) return false;
        return true;
      })
  );
}

function iniciarApp() {
  appLista = true;
  pintarInicio();
  mostrarVista();
}

async function cargarCarta() {
  const url = typeof CARTA_URL === "string" ? CARTA_URL.trim() : "";

  if (!url) {
    MENU = MENU_FALLBACK;
    iniciarApp();
    return;
  }

  mostrarEstado(t("cargando"), "loading");
  viewHome.hidden = true;
  viewSection.hidden = true;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const datos = await res.json();
    if (!menuValido(datos)) throw new Error("formato");
    MENU = datos;
    mostrarEstado("", null);
    iniciarApp();
  } catch {
    MENU = MENU_FALLBACK;
    mostrarEstado(t("errorCarta"), "error");
    iniciarApp();
  }
}

if (langToggle) {
  langToggle.addEventListener("click", alternarIdioma);
}

actualizarTextosUI();
window.addEventListener("hashchange", mostrarVista);
window.addEventListener("pageshow", quitarFoco);
cargarCarta();
