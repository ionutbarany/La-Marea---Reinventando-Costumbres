// Navegación entre inicio y sección, y pintado de platos.
// Los textos se insertan con textContent (nunca innerHTML).

const LANG_KEY = "la-marea-lang";

const INFO_ID = "info";

const UI = {
  es: {
    navSecciones: "Secciones de la carta",
    volver: "Volver a la carta",
    verEnIngles: "Ver carta en inglés",
    verEnEspanol: "Ver carta en español",
    proximamente: "Próximamente.",
    cargando: "Cargando carta…",
    errorCarta:
      "No se pudo cargar la carta en línea. Mostrando copia de respaldo.",
    infoTitulo: "Información",
    infoHorario: "Horario",
    infoDonde: "Dónde estamos",
    infoTelefono: "Teléfono",
    infoRedes: "Redes sociales",
    infoComoLlegar: "Cómo llegar",
    homeInfo: "Sobre nosotros",
    homeResena: "Déjanos una reseña",
    phHoras: "[00:00 - 00:00]",
    phCalle: "[Calle y número]",
    phCiudad: "[Código postal, ciudad]",
    phTelefono: "[+34 000 000 000]",
    redInstagram: "Instagram",
    redFacebook: "Facebook",
    redTiktok: "TikTok"
  },
  en: {
    navSecciones: "Menu sections",
    volver: "Back to menu",
    verEnIngles: "View menu in English",
    verEnEspanol: "View menu in Spanish",
    proximamente: "Coming soon.",
    cargando: "Loading menu…",
    errorCarta: "Could not load the online menu. Showing a backup copy.",
    infoTitulo: "Information",
    infoHorario: "Opening hours",
    infoDonde: "Where we are",
    infoTelefono: "Phone",
    infoRedes: "Social media",
    infoComoLlegar: "Get directions",
    homeInfo: "About us",
    homeResena: "Leave us a review",
    phHoras: "[00:00 - 00:00]",
    phCalle: "[Street and number]",
    phCiudad: "[Postcode, city]",
    phTelefono: "[+34 000 000 000]",
    redInstagram: "Instagram",
    redFacebook: "Facebook",
    redTiktok: "TikTok"
  }
};

const viewHome = document.getElementById("view-home");
const viewInfo = document.getElementById("view-info");
const viewSection = document.getElementById("view-section");
const reviewLink = document.getElementById("review-link");
const homeInfoLabel = document.getElementById("home-info-label");
const homeReviewLabel = document.getElementById("home-review-label");
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
let INFO = INFO_FALLBACK;
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

function textoOPlaceholder(valor, placeholder) {
  const s = typeof valor === "string" ? valor.trim() : "";
  return s || placeholder;
}

function marcarPlaceholder(el, esPlaceholder) {
  if (!el) return;
  el.classList.toggle("info-placeholder", esPlaceholder);
}

function telefonoHref(numero) {
  const limpio = String(numero).replace(/[^\d+]/g, "");
  return limpio ? "tel:" + limpio : "#";
}

function iconoSocial(red) {
  const svgNs = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNs, "svg");
  svg.setAttribute("width", "22");
  svg.setAttribute("height", "22");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");

  if (red === "instagram") {
    svg.setAttribute("fill", "none");
    const rect = document.createElementNS(svgNs, "rect");
    rect.setAttribute("x", "4");
    rect.setAttribute("y", "4");
    rect.setAttribute("width", "16");
    rect.setAttribute("height", "16");
    rect.setAttribute("rx", "4");
    rect.setAttribute("stroke", "currentColor");
    rect.setAttribute("stroke-width", "1.75");
    const circle = document.createElementNS(svgNs, "circle");
    circle.setAttribute("cx", "12");
    circle.setAttribute("cy", "12");
    circle.setAttribute("r", "3.5");
    circle.setAttribute("stroke", "currentColor");
    circle.setAttribute("stroke-width", "1.75");
    const dot = document.createElementNS(svgNs, "circle");
    dot.setAttribute("cx", "17");
    dot.setAttribute("cy", "7");
    dot.setAttribute("r", "1");
    dot.setAttribute("fill", "currentColor");
    svg.append(rect, circle, dot);
  } else if (red === "facebook") {
    svg.setAttribute("fill", "currentColor");
    const path = document.createElementNS(svgNs, "path");
    path.setAttribute(
      "d",
      "M14 8h2V5h-2c-2.2 0-3.5 1.3-3.5 3.5V12H8v3h2.5v8h3v-8h2.5l.5-3H13.5V9c0-.6.4-1 1.5-1z"
    );
    svg.appendChild(path);
  } else {
    svg.setAttribute("fill", "currentColor");
    const path = document.createElementNS(svgNs, "path");
    path.setAttribute(
      "d",
      "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
    );
    svg.appendChild(path);
  }
  return svg;
}

function pintarInfo() {
  const infoTitle = document.getElementById("info-title");
  const labelHorario = document.getElementById("info-label-horario");
  const labelDonde = document.getElementById("info-label-donde");
  const labelTelefono = document.getElementById("info-label-telefono");
  const labelRedes = document.getElementById("info-label-redes");
  const horarioList = document.getElementById("info-horario-list");
  const addr1 = document.getElementById("info-address-line1");
  const addr2 = document.getElementById("info-address-line2");
  const mapsBtn = document.getElementById("info-maps-btn");
  const phoneLink = document.getElementById("info-phone-link");
  const phoneText = document.getElementById("info-phone-text");
  const socialList = document.getElementById("info-social-list");

  if (infoTitle) infoTitle.textContent = t("infoTitulo");
  if (labelHorario) labelHorario.textContent = t("infoHorario");
  if (labelDonde) labelDonde.textContent = t("infoDonde");
  if (labelTelefono) labelTelefono.textContent = t("infoTelefono");
  if (labelRedes) labelRedes.textContent = t("infoRedes");

  if (horarioList) {
    horarioList.replaceChildren();
    const filas = Array.isArray(INFO.horario) ? INFO.horario : [];
    filas.forEach((fila) => {
      const li = document.createElement("li");
      li.className = "info-row";

      const dia = document.createElement("span");
      dia.textContent = textoCampo(fila, "etiqueta", "etiquetaEn");

      const horas = document.createElement("span");
      const horasVal = typeof fila.horas === "string" ? fila.horas.trim() : "";
      const ph = t("phHoras");
      horas.textContent = textoOPlaceholder(horasVal, ph);
      marcarPlaceholder(horas, !horasVal);

      li.append(dia, horas);
      horarioList.appendChild(li);
    });
  }

  const dir = INFO.direccion || {};
  const l1raw = textoCampo(dir, "linea1", "linea1En");
  const l2raw = textoCampo(dir, "linea2", "linea2En");
  if (addr1) {
    addr1.textContent = textoOPlaceholder(l1raw, t("phCalle"));
    marcarPlaceholder(addr1, !l1raw.trim());
  }
  if (addr2) {
    addr2.textContent = textoOPlaceholder(l2raw, t("phCiudad"));
    marcarPlaceholder(addr2, !l2raw.trim());
  }
  if (mapsBtn) {
    mapsBtn.textContent = t("infoComoLlegar");
    const mapsUrl =
      typeof dir.mapsUrl === "string" ? dir.mapsUrl.trim() : "";
    mapsBtn.href = mapsUrl || "#";
    mapsBtn.setAttribute("aria-disabled", mapsUrl ? "false" : "true");
    mapsBtn.classList.toggle("info-btn--disabled", !mapsUrl);
  }

  const telRaw = typeof INFO.telefono === "string" ? INFO.telefono.trim() : "";
  if (phoneText) {
    phoneText.textContent = textoOPlaceholder(telRaw, t("phTelefono"));
    marcarPlaceholder(phoneText, !telRaw);
  }
  if (phoneLink) {
    phoneLink.href = telRaw ? telefonoHref(telRaw) : "#";
    phoneLink.classList.toggle("info-row--disabled", !telRaw);
  }

  if (socialList) {
    socialList.replaceChildren();
    const redes = INFO.redes || {};
    const items = [
      { id: "instagram", nombre: t("redInstagram") },
      { id: "facebook", nombre: t("redFacebook") },
      { id: "tiktok", nombre: t("redTiktok") }
    ];

    items.forEach((item) => {
      const data = redes[item.id] || {};
      const url = typeof data.url === "string" ? data.url.trim() : "";

      const li = document.createElement("li");
      const enlace = document.createElement(url ? "a" : "div");
      enlace.className = "info-social__row";
      if (url) {
        enlace.href = url;
        enlace.target = "_blank";
        enlace.rel = "noopener noreferrer";
      } else {
        enlace.classList.add("info-social__row--static");
      }

      const iconWrap = document.createElement("span");
      iconWrap.className = "info-social__icon";
      iconWrap.appendChild(iconoSocial(item.id));

      const name = document.createElement("span");
      name.className = "info-social__name";
      name.textContent = item.nombre;

      const chevron = document.createElement("span");
      chevron.className = "info-row__chevron";
      chevron.setAttribute("aria-hidden", "true");

      enlace.append(iconWrap, name, chevron);
      li.appendChild(enlace);
      socialList.appendChild(li);
    });
  }
}

function actualizarEnlacesHome() {
  if (homeInfoLabel) homeInfoLabel.textContent = t("homeInfo");
  if (homeReviewLabel) homeReviewLabel.textContent = t("homeResena");
  if (reviewLink) {
    const url =
      typeof INFO.resenaUrl === "string" ? INFO.resenaUrl.trim() : "";
    reviewLink.href = url || "#";
    reviewLink.classList.toggle("home-action--disabled", !url);
    reviewLink.setAttribute("aria-disabled", url ? "false" : "true");
  }
  document.querySelectorAll(".topbar__back--info").forEach((el) => {
    el.setAttribute("aria-label", t("volver"));
  });
}

function actualizarTextosUI() {
  document.documentElement.lang = idioma;
  if (navSecciones) navSecciones.setAttribute("aria-label", t("navSecciones"));
  if (topbarBack) topbarBack.setAttribute("aria-label", t("volver"));
  if (sectionEmpty) sectionEmpty.textContent = t("proximamente");
  actualizarEnlacesHome();
  if (appLista) pintarInfo();
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
  if (id === INFO_ID) {
    pintarInfo();
    return;
  }
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

  if (id === INFO_ID) {
    pintarInfo();
    viewHome.hidden = true;
    viewSection.hidden = true;
    if (viewInfo) viewInfo.hidden = false;
  } else if (seccion) {
    pintarSeccion(seccion);
    viewHome.hidden = true;
    if (viewInfo) viewInfo.hidden = true;
    viewSection.hidden = false;
  } else {
    viewSection.hidden = true;
    if (viewInfo) viewInfo.hidden = true;
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
  actualizarEnlacesHome();
  pintarInfo();
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
  if (viewInfo) viewInfo.hidden = true;

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

if (reviewLink) {
  reviewLink.addEventListener("click", (e) => {
    const url =
      typeof INFO.resenaUrl === "string" ? INFO.resenaUrl.trim() : "";
    if (!url) e.preventDefault();
  });
}

actualizarTextosUI();
window.addEventListener("hashchange", mostrarVista);
window.addEventListener("pageshow", quitarFoco);
cargarCarta();
