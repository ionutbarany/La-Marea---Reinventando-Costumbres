// Navegación entre inicio y sección, y pintado de platos.
// Los textos se insertan con textContent (nunca innerHTML).

const formatoPrecio = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR"
});

const viewHome = document.getElementById("view-home");
const viewSection = document.getElementById("view-section");
const sectionList = document.getElementById("section-list");
const sectionTitle = document.getElementById("section-title");
const sectionNote = document.getElementById("section-note");
const sectionEmpty = document.getElementById("section-empty");
const dishList = document.getElementById("dish-list");
const cartaStatus = document.getElementById("carta-status");

let MENU = [];
let appLista = false;

function pintarInicio() {
  sectionList.replaceChildren();
  MENU.forEach((seccion) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.className = "section-link";
    a.href = "#" + seccion.id;
    a.textContent = seccion.nombre;
    li.appendChild(a);
    sectionList.appendChild(li);
  });
}

function crearPlato(plato) {
  const li = document.createElement("li");
  li.className = "dish";

  const fila = document.createElement("div");
  fila.className = "dish__row";

  const nombre = document.createElement("span");
  nombre.className = "dish__name";
  nombre.textContent = plato.nombre;

  const precio = document.createElement("span");
  precio.className = "dish__price";
  precio.textContent = formatoPrecio.format(plato.precio);

  fila.append(nombre, precio);
  li.appendChild(fila);

  if (plato.descripcion) {
    const desc = document.createElement("p");
    desc.className = "dish__desc";
    desc.textContent = plato.descripcion;
    li.appendChild(desc);
  }

  return li;
}

function pintarSeccion(seccion) {
  sectionTitle.textContent = seccion.nombre;

  sectionNote.textContent = seccion.nota || "";
  sectionNote.hidden = !seccion.nota;

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

function menuValido(datos) {
  if (!Array.isArray(datos)) return false;
  return datos.every(
    (s) =>
      s &&
      typeof s.id === "string" &&
      typeof s.nombre === "string" &&
      Array.isArray(s.platos) &&
      s.platos.every(
        (p) =>
          p &&
          typeof p.nombre === "string" &&
          typeof p.precio === "number" &&
          !Number.isNaN(p.precio)
      )
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

  mostrarEstado("Cargando carta…", "loading");
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
    mostrarEstado(
      "No se pudo cargar la carta en línea. Mostrando copia de respaldo.",
      "error"
    );
    iniciarApp();
  }
}

window.addEventListener("hashchange", mostrarVista);
window.addEventListener("pageshow", quitarFoco);
cargarCarta();
