// Datos de la carta.
// Más adelante este archivo se sustituirá por la lectura de una Google Sheet,
// manteniendo esta misma forma de datos.
// precio: número en euros (se formatea solo en pantalla)

const MENU = [
  {
    id: "para-compartir",
    nombre: "Para compartir",
    nota: "",
    platos: [
      { nombre: "Torrezno de la casa", descripcion: "Puré de patata, pimientos de Padrón", precio: 12.5 },
      { nombre: "Bravas", descripcion: "Crujientes, nuestra salsa brava", precio: 8.5 },
      { nombre: "Ensaladilla rusa", descripcion: "Huevo poché, pan cristal", precio: 8.5 },
      { nombre: "Tosta de sardina ahumada", descripcion: "Tomate seco, aceite de hierbas", precio: 9.5 },
      { nombre: "Gambones crujientes", descripcion: "Panko, mayonesa cítrica", precio: 11.5 },
      { nombre: "Rejos", descripcion: "Lima, albahaca", precio: 10.5 },
      { nombre: "Bacalao en tempura", descripcion: "Mayonesa de pimiento rojo asado", precio: 11.5 },
      { nombre: "Titaina del Cabanyal", descripcion: "Pan cristal tostado", precio: 9.5 },
      { nombre: "Bao de calamar crujiente", descripcion: "Salsa de la casa", precio: 10.5 }
    ]
  },
  {
    id: "de-la-casa",
    nombre: "De la casa",
    nota: "",
    platos: [
      { nombre: "Huevos rotos con pulpo", descripcion: "Patata, huevo y pulpo", precio: 14.5 },
      { nombre: "Jachapuri", descripcion: "Receta tradicional georgiana, queso y huevo", precio: 13.5 },
      { nombre: "Pinsa burrata", descripcion: "Burrata, tomate seco, albahaca", precio: 14.5 },
      { nombre: "Steak tartar", descripcion: "Brioche tostado", precio: 16.5 },
      { nombre: "Crujiente de alga", descripcion: "Salmón, aguacate, queso crema y sriracha", precio: 12.5 },
      { nombre: "Foie, patata y sobrasada", descripcion: "Nuestra combinación de sabores", precio: 13.5 }
    ]
  },
  {
    id: "burgers",
    nombre: "Burgers",
    nota: "Todas nuestras burgers se sirven con patatas",
    platos: [
      { nombre: "Angus ahumada", descripcion: "Angus, scamorza ahumada, bacon, rúcula, cebolla caramelizada, brioche", precio: 15.5 },
      { nombre: "Crispy chicken", descripcion: "Pollo crujiente, queso, lechuga, salsa de la casa, brioche", precio: 14.5 },
      { nombre: "Veggie", descripcion: "Burger vegetal, queso, vegetales, salsa de la casa, brioche", precio: 14.0 }
    ]
  },
  {
    id: "montaditos",
    nombre: "Montaditos",
    nota: "",
    platos: [
      { nombre: "Secreto ibérico", descripcion: "", precio: 5.5 },
      { nombre: "Presa ibérica", descripcion: "", precio: 5.5 },
      { nombre: "Pulpo", descripcion: "", precio: 6.5 },
      { nombre: "Foie & manzana", descripcion: "", precio: 6.0 },
      { nombre: "Escalivada & brie", descripcion: "", precio: 5.5 },
      { nombre: "Sobrasada, cabra & miel", descripcion: "", precio: 5.5 },
      { nombre: "Tabla de 3 montaditos", descripcion: "Elige tus tres favoritos", precio: 15.0 }
    ]
  },
  {
    id: "dulce-final",
    nombre: "Dulce final",
    nota: "",
    platos: [
      { nombre: "Torrija de brioche", descripcion: "Helado de leche merengada", precio: 6.5 },
      { nombre: "Tarta de queso", descripcion: "", precio: 6.0 },
      { nombre: "Brownie", descripcion: "Helado de vainilla", precio: 6.0 }
    ]
  },
  {
    // Pendiente: en la imagen solo aparecen los iconos (cerveza, vino, vermut,
    // refrescos, café), sin lista ni precios.
    id: "bebidas",
    nombre: "Bebidas",
    nota: "",
    platos: []
  }
];
