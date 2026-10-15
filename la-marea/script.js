// Esqueleto de la carta: navegación entre inicio y sección, y pintado de platos.
// Los textos se insertan con textContent (nunca innerHTML), para que cuando los
// datos vengan de una hoja de cálculo no se pueda colar HTML.

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

// Evita que un botón se quede "marcado" (sombreado gris) al volver atrás
// con el gesto del móvil.
function quitarFoco() {
  if (document.activeElement && document.activeElement !== document.body) {
    document.activeElement.blur();
  }
}

pintarInicio();
window.addEventListener("hashchange", mostrarVista);
window.addEventListener("pageshow", quitarFoco);
mostrarVista();
