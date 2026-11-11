// Navegación entre inicio y sección, y pintado de platos.
// Los textos se insertan con textContent (nunca innerHTML).
// Una sección puede llevar grupos (títulos), y un plato puede llevar varios precios.

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
    redTiktok: "TikTok",
    alergenosDe: "Alérgenos: ",
    navGrupos: "Grupos de esta sección"
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
    redTiktok: "TikTok",
    alergenosDe: "Allergens: ",
    navGrupos: "Groups in this section"
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
const groupNav = document.getElementById("group-nav");
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
      const horasVal = textoCampo(fila, "horas", "horasEn").trim();
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

// Iconos tal cual los archivos de img/alergenos: el círculo y el nombre ya van dentro.
const ALERGENOS = [
  { id: "gluten", es: "Gluten", en: "Gluten", icono: "img/alergenos/gluten.svg", alias: ["gluten", "cereales", "trigo"] },
  { id: "crustaceos", es: "Crustáceos", en: "Crustaceans", icono: "img/alergenos/crustaceos.svg", alias: ["crustaceo", "crustaceos", "crustacean", "crustaceans"] },
  { id: "huevo", es: "Huevo", en: "Egg", icono: "img/alergenos/huevo.svg", alias: ["huevo", "huevos", "egg", "eggs"] },
  { id: "pescado", es: "Pescado", en: "Fish", icono: "img/alergenos/pescado.svg", alias: ["pescado", "fish"] },
  { id: "cacahuete", es: "Cacahuete", en: "Peanuts", icono: "img/alergenos/cacahuete.svg", alias: ["cacahuete", "cacahuetes", "mani", "peanut", "peanuts"] },
  { id: "soja", es: "Soja", en: "Soy", icono: "img/alergenos/soja.svg", alias: ["soja", "soya", "soy", "soybean", "soybeans"] },
  { id: "lacteos", es: "Lácteos", en: "Milk", icono: "img/alergenos/lacteos.svg", alias: ["lacteos", "lacteo", "leche", "milk", "dairy"] },
  { id: "frutos", es: "Frutos de cáscara", en: "Tree nuts", icono: "img/alergenos/frutos.svg", alias: ["frutos de cascara", "frutos secos", "tree nuts"] },
  { id: "apio", es: "Apio", en: "Celery", icono: "img/alergenos/apio.svg", alias: ["apio", "celery"] },
  { id: "mostaza", es: "Mostaza", en: "Mustard", icono: "img/alergenos/mostaza.svg", alias: ["mostaza", "mustard"] },
  { id: "sesamo", es: "Sésamo", en: "Sesame", icono: "img/alergenos/sesamo.svg", alias: ["sesamo", "sesame", "sesame seeds"] },
  { id: "sulfitos", es: "Sulfitos", en: "Sulphites", icono: "img/alergenos/sulfitos.svg", alias: ["sulfitos", "sulfito", "sulfites", "sulphites", "so2", "dioxido de azufre", "sulfur dioxide", "sulphur dioxide"] },
  { id: "altramuces", es: "Altramuces", en: "Lupin", icono: "img/alergenos/altramuces.svg", alias: ["altramuces", "altramuz", "lupino", "lupin", "lupins", "lupine"] },
  { id: "moluscos", es: "Moluscos", en: "Molluscs", icono: "img/alergenos/moluscos.svg", alias: ["molusco", "moluscos", "mollusc", "molluscs", "mollusk", "mollusks"] }
];

const ALERGENO_POR_CLAVE = {};
ALERGENOS.forEach(function (item) {
  item.alias.forEach(function (alias) {
    ALERGENO_POR_CLAVE[claveAlergeno(alias)] = item;
  });
});

function claveAlergeno(texto) {
  return String(texto)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.]/g, "")
    .replace(/\s+/g, " ");
}

function nombreAlergeno(item) {
  return idioma === "en" ? item.en : item.es;
}

function textoAlergenosPlato(plato) {
  if (!plato) return "";
  if (typeof plato.alergenos === "string" && plato.alergenos.trim()) return plato.alergenos;
  if (typeof plato.alergenosEn === "string") return plato.alergenosEn;
  return "";
}

function interpretarAlergenos(plato) {
  const partes = textoAlergenosPlato(plato)
    .split(/[,;]|\s+y\s+/i)
    .map(function (parte) { return parte.trim(); })
    .filter(Boolean);
  const conocidos = [];
  const desconocidos = [];
  const vistos = new Set();
  partes.forEach(function (parte) {
    const item = ALERGENO_POR_CLAVE[claveAlergeno(parte)];
    if (!item) {
      desconocidos.push(parte);
      return;
    }
    if (vistos.has(item.id)) return;
    vistos.add(item.id);
    conocidos.push(item);
  });
  return { conocidos: conocidos, desconocidos: desconocidos };
}

function vigilarImagen(img) {
  img.addEventListener("error", function () {
    if (img.dataset.reintento) return;
    const src = img.getAttribute("src");
    if (!src) return;
    img.dataset.reintento = "1";
    const sep = src.indexOf("?") >= 0 ? "&" : "?";
    img.src = src + sep + "reintento=1";
  });
}

function crearMarcaAlergeno(item) {
  const marca = document.createElement("span");
  marca.className = "allergen-icon";
  marca.setAttribute("aria-hidden", "true");
  const img = document.createElement("img");
  img.alt = "";
  img.width = 262;
  img.height = 372;
  vigilarImagen(img);
  img.src = item.icono;
  marca.appendChild(img);
  return marca;
}

function anadirAlergenos(contenedor, plato) {
  const leido = interpretarAlergenos(plato);
  if (!leido.conocidos.length && !leido.desconocidos.length) return;

  const fila = document.createElement("span");
  fila.className = "dish__allergens";
  const nombres = leido.conocidos.map(nombreAlergeno).concat(leido.desconocidos);
  const oculto = document.createElement("span");
  oculto.className = "visually-hidden";
  oculto.textContent = t("alergenosDe") + nombres.join(", ");
  fila.appendChild(oculto);

  leido.conocidos.forEach(function (item) {
    fila.appendChild(crearMarcaAlergeno(item));
  });
  if (leido.desconocidos.length) {
    const extra = document.createElement("span");
    extra.className = "dish__allergen-extra";
    extra.setAttribute("aria-hidden", "true");
    extra.textContent = leido.desconocidos.join(", ");
    fila.appendChild(extra);
  }
  contenedor.appendChild(fila);
}

function cadaPlato(nodo, fn) {
  const platos = Array.isArray(nodo.platos) ? nodo.platos : [];
  platos.forEach(fn);
  const grupos = Array.isArray(nodo.grupos) ? nodo.grupos : [];
  grupos.forEach(function (grupo) { cadaPlato(grupo, fn); });
}

function crearTituloPlato(plato) {
  const titulo = document.createElement("span");
  titulo.className = "dish__title";

  const nombre = document.createElement("span");
  nombre.className = "dish__name";
  nombre.textContent = textoCampo(plato, "nombre", "nombreEn");
  titulo.appendChild(nombre);

  return titulo;
}

function crearDescripcion(plato) {
  const descripcion = textoCampo(plato, "descripcion", "descripcionEn");
  if (!descripcion) return null;
  const desc = document.createElement("p");
  desc.className = "dish__desc";
  desc.textContent = descripcion;
  return desc;
}

function crearFoto(plato) {
  const src = typeof plato.imagen === "string" ? plato.imagen.trim() : "";
  if (!src) return null;
  const foto = document.createElement("img");
  foto.className = "dish__photo";
  foto.alt = textoCampo(plato, "nombre", "nombreEn");
  foto.width = 104;
  foto.height = 72;
  vigilarImagen(foto);
  foto.src = src;
  return foto;
}

function anadirDetalle(li, plato) {
  const desc = crearDescripcion(plato);
  const foto = crearFoto(plato);
  if (!foto) {
    if (desc) li.appendChild(desc);
    anadirAlergenos(li, plato);
    return;
  }

  const fila = document.createElement("div");
  fila.className = "dish__detail";
  const texto = document.createElement("div");
  texto.className = "dish__copy";
  if (desc) texto.appendChild(desc);
  anadirAlergenos(texto, plato);
  fila.append(texto, foto);
  li.appendChild(fila);
}

// La carta en línea todavía no trae fotos. Estas se asignan por nombre del plato.
const FOTOS_PLATOS = {
  "secreto con padron y miel": "img/platos/IMG_6780.jpeg",
  "bravas crujientes": "img/platos/IMG_6826.jpeg",
  "pulpo crujiente con parmentier de pimenton": "img/platos/IMG_6786.jpeg",
  "montadito nordico": "img/platos/IMG_6789.jpeg",
  "montadito mallorquin": "img/platos/IMG_6820.jpeg",
  "gilda de la casa (ud)": "img/platos/IMG_6824.jpeg"
};

function aplicarFotosLocales(menu) {
  menu.forEach(function (seccion) {
    cadaPlato(seccion, function (plato) {
      if (typeof plato.imagen === "string" && plato.imagen.trim()) return;
      const foto = FOTOS_PLATOS[claveAlergeno(plato.nombre || "")];
      if (foto) plato.imagen = foto;
    });
  });
}

function crearPlato(plato) {
  const li = document.createElement("li");
  li.className = "dish";

  const fila = document.createElement("div");
  fila.className = "dish__row";
  fila.appendChild(crearTituloPlato(plato));

  const precios = Array.isArray(plato.precios) ? plato.precios : null;
  if (precios && precios.length) {
    li.appendChild(fila);

    const lista = document.createElement("ul");
    lista.className = "dish__sizes";
    precios.forEach((tamano) => {
      const item = document.createElement("li");
      item.className = "dish__size";

      const etiqueta = document.createElement("span");
      etiqueta.className = "dish__size-name";
      etiqueta.textContent = textoCampo(tamano, "nombre", "nombreEn");

      const precio = document.createElement("span");
      precio.className = "dish__price";
      precio.textContent = textoPrecio(tamano.precio);

      item.append(etiqueta, precio);
      lista.appendChild(item);
    });
    li.appendChild(lista);
    anadirDetalle(li, plato);
    return li;
  }

  const precio = document.createElement("span");
  precio.className = "dish__price";
  precio.textContent = textoPrecio(plato.precio);
  fila.appendChild(precio);
  li.appendChild(fila);
  anadirDetalle(li, plato);
  return li;
}

function irAGrupo(destino) {
  const sticky = document.querySelector(".section-sticky");
  const alto = sticky ? sticky.getBoundingClientRect().height : 0;
  const top = destino.getBoundingClientRect().top + window.scrollY - alto - 8;
  const suave = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: Math.max(0, top), behavior: suave ? "smooth" : "auto" });
  destino.focus({ preventScroll: true });
}

function pintarAtajos(grupos) {
  if (!groupNav) return;
  groupNav.replaceChildren();
  if (grupos.length < 2) {
    groupNav.hidden = true;
    return;
  }

  groupNav.hidden = false;
  groupNav.setAttribute("aria-label", t("navGrupos"));

  const lista = document.createElement("ul");
  lista.className = "group-nav__list";
  grupos.forEach((grupo, i) => {
    const item = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "group-nav__btn";
    btn.textContent = textoCampo(grupo, "nombre", "nombreEn");
    btn.setAttribute("aria-controls", "grupo-" + i);
    btn.addEventListener("click", () => {
      const destino = document.getElementById("grupo-" + i);
      if (destino) irAGrupo(destino);
    });
    item.appendChild(btn);
    lista.appendChild(item);
  });
  groupNav.appendChild(lista);
}

function crearGrupo(grupo, nivel, indice) {
  const li = document.createElement("li");
  const anidado = nivel > 1;
  li.className = anidado ? "menu-subgroup" : "menu-group";

  const titulo = document.createElement(anidado ? "h4" : "h3");
  titulo.className = anidado ? "menu-subgroup__title" : "menu-group__title";
  titulo.textContent = textoCampo(grupo, "nombre", "nombreEn");
  if (!anidado) {
    titulo.id = "grupo-" + indice;
    titulo.tabIndex = -1;
  }
  li.appendChild(titulo);

  const nota = textoCampo(grupo, "nota", "notaEn");
  if (nota) {
    const p = document.createElement("p");
    p.className = "menu-group__note";
    p.textContent = nota;
    li.appendChild(p);
  }

  const subgrupos = Array.isArray(grupo.grupos) ? grupo.grupos : [];
  if (subgrupos.length) {
    const ul = document.createElement("ul");
    ul.className = "menu-subgroups";
    subgrupos.forEach((sub) => ul.appendChild(crearGrupo(sub, nivel + 1)));
    li.appendChild(ul);
  }

  const platos = Array.isArray(grupo.platos) ? grupo.platos : [];
  if (platos.length) {
    const ul = document.createElement("ul");
    ul.className = "dish-list";
    platos.forEach((plato) => ul.appendChild(crearPlato(plato)));
    li.appendChild(ul);
  }

  return li;
}

function pintarSeccion(seccion) {
  sectionTitle.textContent = textoCampo(seccion, "nombre", "nombreEn");

  const nota = textoCampo(seccion, "nota", "notaEn");
  sectionNote.textContent = nota;
  sectionNote.hidden = !nota;

  const nodos = [];
  const grupos = Array.isArray(seccion.grupos) ? seccion.grupos : [];
  const platos = Array.isArray(seccion.platos) ? seccion.platos : [];
  pintarAtajos(grupos);
  grupos.forEach((grupo, i) => nodos.push(crearGrupo(grupo, 1, i)));
  platos.forEach((plato) => nodos.push(crearPlato(plato)));

  dishList.replaceChildren(...nodos);
  sectionEmpty.hidden = nodos.length > 0;
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
    viewHome.hidden = true;
    if (viewInfo) viewInfo.hidden = true;
    viewSection.hidden = false;
    pintarSeccion(seccion);
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

function precioValido(precio) {
  if (typeof precio === "number") return !Number.isNaN(precio);
  return typeof precio === "string" && precio.trim() !== "";
}

// Precios que en la hoja se escriben con texto y que tienen versión en inglés. Se comparan sin
// mayúsculas ni tildes; cualquier otro texto (por ejemplo "-") se muestra tal cual.
const PRECIOS_TEXTO_EN = { consultar: "Ask Us" };

function textoPrecio(precio) {
  if (typeof precio === "number") return formatoPrecio().format(precio);
  const texto = String(precio).trim();
  if (idioma === "en") {
    const clave = texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    if (Object.prototype.hasOwnProperty.call(PRECIOS_TEXTO_EN, clave)) return PRECIOS_TEXTO_EN[clave];
  }
  return texto;
}

function tamanoValido(t) {
  if (!t || typeof t.nombre !== "string" || !t.nombre.trim()) return false;
  if (!campoOpcionalString(t.nombreEn)) return false;
  return precioValido(t.precio);
}

function platoValido(p) {
  if (!p || typeof p.nombre !== "string") return false;
  if (p.alergenos !== undefined && typeof p.alergenos !== "string") return false;
  if (!campoOpcionalString(p.nombreEn)) return false;
  if (!campoOpcionalString(p.descripcionEn)) return false;
  if (!campoOpcionalString(p.alergenosEn)) return false;
  if (!campoOpcionalString(p.imagen)) return false;
  if (Array.isArray(p.precios)) {
    return p.precios.length > 0 && p.precios.every(tamanoValido);
  }
  return precioValido(p.precio);
}

function grupoValido(g) {
  if (!g || typeof g.nombre !== "string" || !g.nombre.trim()) return false;
  if (!campoOpcionalString(g.nombreEn)) return false;
  if (!campoOpcionalString(g.nota)) return false;
  if (!campoOpcionalString(g.notaEn)) return false;
  const tienePlatos = Array.isArray(g.platos);
  const tieneGrupos = Array.isArray(g.grupos);
  if (!tienePlatos && !tieneGrupos) return false;
  if (tienePlatos && !g.platos.every(platoValido)) return false;
  if (tieneGrupos && !g.grupos.every(grupoValido)) return false;
  const nPlatos = tienePlatos ? g.platos.length : 0;
  const nGrupos = tieneGrupos ? g.grupos.length : 0;
  return nPlatos + nGrupos > 0;
}

function menuValido(datos) {
  if (!Array.isArray(datos)) return false;
  return datos.every((s) => {
    if (!s || typeof s.id !== "string" || typeof s.nombre !== "string") {
      return false;
    }
    if (!campoOpcionalString(s.nombreEn) || !campoOpcionalString(s.notaEn)) {
      return false;
    }
    const tienePlatos = Array.isArray(s.platos);
    const tieneGrupos = Array.isArray(s.grupos);
    if (!tienePlatos && !tieneGrupos) return false;
    if (tienePlatos && !s.platos.every(platoValido)) return false;
    if (tieneGrupos && !s.grupos.every(grupoValido)) return false;
    return true;
  });
}

function iniciarApp() {
  appLista = true;
  aplicarFotosLocales(MENU);
  pintarInicio();
  actualizarEnlacesHome();
  pintarInfo();
  mostrarVista();
}

// El horario viene de la pestaña Info de la hoja, con una petición aparte (?info=1).
// Si falla o no tiene el formato esperado, se queda el de info-data.js.
function horarioValido(datos) {
  if (!datos || !Array.isArray(datos.horario) || datos.horario.length === 0) return false;
  return datos.horario.every(
    (fila) =>
      fila &&
      typeof fila.etiqueta === "string" && fila.etiqueta.trim() !== "" &&
      typeof fila.horas === "string" && fila.horas.trim() !== "" &&
      campoOpcionalString(fila.etiquetaEn) &&
      campoOpcionalString(fila.horasEn)
  );
}

// Última carta y último horario buenos, guardados en el navegador de cada cliente.
// Se enseñan al instante mientras llega la versión nueva, y si falla la red o el script
// se sigue viendo lo último correcto en vez de la copia fija de menu-data.js.
// Cada copia lleva la URL de la que salió: si cambia CARTA_URL, se ignora.
const CARTA_GUARDADA_KEY = "la-marea-carta-v1";
const HORARIO_GUARDADO_KEY = "la-marea-horario-v1";

function leerGuardado(clave, url, campo, esValido) {
  try {
    const crudo = localStorage.getItem(clave);
    if (!crudo) return null;
    const g = JSON.parse(crudo);
    if (!g || g.url !== url || !esValido(g[campo])) return null;
    return g[campo];
  } catch {
    return null;
  }
}

function escribirGuardado(clave, url, campo, valor) {
  try {
    const g = { url: url };
    g[campo] = valor;
    localStorage.setItem(clave, JSON.stringify(g));
  } catch {
    /* modo privado o almacenamiento lleno: la carta funciona igual, sin copia local */
  }
}

// Cuando llega una carta distinta con la web ya pintada: repinta sin volver al inicio.
function repintarCarta() {
  if (!appLista) return;
  aplicarFotosLocales(MENU);
  pintarInicio();
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id || id === INFO_ID) return;
  const seccion = MENU.find((s) => s.id === id);
  if (seccion) {
    const y = window.scrollY;
    pintarSeccion(seccion);
    window.scrollTo(0, y);
  } else {
    mostrarVista(); // la sección ya no existe: vuelve al inicio
  }
}

function aplicarHorarioGuardado(url) {
  const horario = leerGuardado(HORARIO_GUARDADO_KEY, url, "horario", (h) => horarioValido({ horario: h }));
  if (horario) INFO = Object.assign({}, INFO_FALLBACK, { horario: horario });
}

async function cargarHorarioRemoto(urlCarta) {
  try {
    const sep = urlCarta.indexOf("?") >= 0 ? "&" : "?";
    const res = await fetch(urlCarta + sep + "info=1", { cache: "no-store" });
    if (!res.ok) return;
    const datos = await res.json();
    if (!horarioValido(datos)) return;
    INFO = Object.assign({}, INFO_FALLBACK, { horario: datos.horario });
    escribirGuardado(HORARIO_GUARDADO_KEY, urlCarta, "horario", datos.horario);
    if (appLista) pintarInfo();
  } catch {
    /* sin horario en línea: se queda el último guardado o el de info-data.js */
  }
}

async function cargarCarta() {
  const url = typeof CARTA_URL === "string" ? CARTA_URL.trim() : "";

  if (!url) {
    MENU = MENU_FALLBACK;
    iniciarApp();
    return;
  }

  aplicarHorarioGuardado(url);
  cargarHorarioRemoto(url);

  const guardada = leerGuardado(CARTA_GUARDADA_KEY, url, "menu", (m) => menuValido(m) && m.length > 0);
  let enPantalla = "";
  if (guardada) {
    MENU = guardada;
    enPantalla = JSON.stringify(guardada);
    iniciarApp();
  } else {
    mostrarEstado(t("cargando"), "loading");
    viewHome.hidden = true;
    viewSection.hidden = true;
    if (viewInfo) viewInfo.hidden = true;
  }

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const datos = await res.json();
    if (!menuValido(datos)) throw new Error("formato");
    // El texto se calcula antes de iniciar la web: aplicarFotosLocales añade campos a MENU.
    const texto = JSON.stringify(datos);
    if (datos.length > 0) escribirGuardado(CARTA_GUARDADA_KEY, url, "menu", datos);
    mostrarEstado("", null);
    if (!guardada) {
      MENU = datos;
      iniciarApp();
    } else if (texto !== enPantalla) {
      MENU = datos;
      repintarCarta();
    }
  } catch {
    mostrarEstado(t("errorCarta"), "error");
    if (!guardada) {
      MENU = MENU_FALLBACK;
      iniciarApp();
    }
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
