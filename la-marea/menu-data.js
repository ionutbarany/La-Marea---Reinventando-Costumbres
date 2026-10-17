// Respaldo local si Google Sheets no está configurado o falla la red.
// En producción la carta suele venir de config.js + Apps Script.
// precio: número en euros (se formatea solo en pantalla)
// Campos *En: opcionales; si faltan en inglés, la web muestra el texto en español.

const MENU_FALLBACK = [
  {
    id: "para-compartir",
    nombre: "Para compartir",
    nombreEn: "To share",
    nota: "",
    platos: [
      {
        nombre: "Torrezno de la casa",
        nombreEn: "House torrezno",
        descripcion: "Puré de patata, pimientos de Padrón",
        descripcionEn: "Potato purée, Padrón peppers",
        precio: 12.5
      },
      {
        nombre: "Bravas",
        nombreEn: "Bravas",
        descripcion: "Crujientes, nuestra salsa brava",
        descripcionEn: "Crispy, our brava sauce",
        precio: 8.5
      },
      {
        nombre: "Ensaladilla rusa",
        nombreEn: "Russian salad",
        descripcion: "Huevo poché, pan cristal",
        descripcionEn: "Poached egg, crystal bread",
        precio: 8.5
      },
      {
        nombre: "Tosta de sardina ahumada",
        nombreEn: "Smoked sardine toast",
        descripcion: "Tomate seco, aceite de hierbas",
        descripcionEn: "Sun-dried tomato, herb oil",
        precio: 9.5
      },
      {
        nombre: "Gambones crujientes",
        nombreEn: "Crispy prawns",
        descripcion: "Panko, mayonesa cítrica",
        descripcionEn: "Panko, citrus mayonnaise",
        precio: 11.5
      },
      {
        nombre: "Rejos",
        nombreEn: "Rejos",
        descripcion: "Lima, albahaca",
        descripcionEn: "Lime, basil",
        precio: 10.5
      },
      {
        nombre: "Bacalao en tempura",
        nombreEn: "Cod tempura",
        descripcion: "Mayonesa de pimiento rojo asado",
        descripcionEn: "Roasted red pepper mayonnaise",
        precio: 11.5
      },
      {
        nombre: "Titaina del Cabanyal",
        nombreEn: "Titaina del Cabanyal",
        descripcion: "Pan cristal tostado",
        descripcionEn: "Toasted crystal bread",
        precio: 9.5
      },
      {
        nombre: "Bao de calamar crujiente",
        nombreEn: "Crispy squid bao",
        descripcion: "Salsa de la casa",
        descripcionEn: "House sauce",
        precio: 10.5
      }
    ]
  },
  {
    id: "de-la-casa",
    nombre: "De la casa",
    nombreEn: "House favourites",
    nota: "",
    platos: [
      {
        nombre: "Huevos rotos con pulpo",
        nombreEn: "Broken eggs with octopus",
        descripcion: "Patata, huevo y pulpo",
        descripcionEn: "Potato, egg and octopus",
        precio: 14.5
      },
      {
        nombre: "Jachapuri",
        nombreEn: "Khachapuri",
        descripcion: "Receta tradicional georgiana, queso y huevo",
        descripcionEn: "Traditional Georgian recipe, cheese and egg",
        precio: 13.5
      },
      {
        nombre: "Pinsa burrata",
        nombreEn: "Burrata pinsa",
        descripcion: "Burrata, tomate seco, albahaca",
        descripcionEn: "Burrata, sun-dried tomato, basil",
        precio: 14.5
      },
      {
        nombre: "Steak tartar",
        nombreEn: "Steak tartare",
        descripcion: "Brioche tostado",
        descripcionEn: "Toasted brioche",
        precio: 16.5
      },
      {
        nombre: "Crujiente de alga",
        nombreEn: "Seaweed crisp",
        descripcion: "Salmón, aguacate, queso crema y sriracha",
        descripcionEn: "Salmon, avocado, cream cheese and sriracha",
        precio: 12.5
      },
      {
        nombre: "Foie, patata y sobrasada",
        nombreEn: "Foie, potato and sobrasada",
        descripcion: "Nuestra combinación de sabores",
        descripcionEn: "Our flavour combination",
        precio: 13.5
      }
    ]
  },
  {
    id: "burgers",
    nombre: "Burgers",
    nombreEn: "Burgers",
    nota: "Todas nuestras burgers se sirven con patatas",
    notaEn: "All our burgers are served with fries",
    platos: [
      {
        nombre: "Angus ahumada",
        nombreEn: "Smoked Angus",
        descripcion:
          "Angus, scamorza ahumada, bacon, rúcula, cebolla caramelizada, brioche",
        descripcionEn:
          "Angus, smoked scamorza, bacon, rocket, caramelised onion, brioche",
        precio: 15.5
      },
      {
        nombre: "Crispy chicken",
        nombreEn: "Crispy chicken",
        descripcion: "Pollo crujiente, queso, lechuga, salsa de la casa, brioche",
        descripcionEn: "Crispy chicken, cheese, lettuce, house sauce, brioche",
        precio: 14.5
      },
      {
        nombre: "Veggie",
        nombreEn: "Veggie",
        descripcion: "Burger vegetal, queso, vegetales, salsa de la casa, brioche",
        descripcionEn: "Plant-based burger, cheese, vegetables, house sauce, brioche",
        precio: 14.0
      }
    ]
  },
  {
    id: "montaditos",
    nombre: "Montaditos",
    nombreEn: "Montaditos",
    nota: "",
    platos: [
      { nombre: "Secreto ibérico", nombreEn: "Iberian secreto", descripcion: "", precio: 5.5 },
      { nombre: "Presa ibérica", nombreEn: "Iberian presa", descripcion: "", precio: 5.5 },
      { nombre: "Pulpo", nombreEn: "Octopus", descripcion: "", precio: 6.5 },
      { nombre: "Foie & manzana", nombreEn: "Foie & apple", descripcion: "", precio: 6.0 },
      { nombre: "Escalivada & brie", nombreEn: "Escalivada & brie", descripcion: "", precio: 5.5 },
      {
        nombre: "Sobrasada, cabra & miel",
        nombreEn: "Sobrasada, goat cheese & honey",
        descripcion: "",
        precio: 5.5
      },
      {
        nombre: "Tabla de 3 montaditos",
        nombreEn: "Board of 3 montaditos",
        descripcion: "Elige tus tres favoritos",
        descripcionEn: "Choose your three favourites",
        precio: 15.0
      }
    ]
  },
  {
    id: "dulce-final",
    nombre: "Dulce final",
    nombreEn: "Desserts",
    nota: "",
    platos: [
      {
        nombre: "Torrija de brioche",
        nombreEn: "Brioche torrija",
        descripcion: "Helado de leche merengada",
        descripcionEn: "Meringued milk ice cream",
        precio: 6.5
      },
      { nombre: "Tarta de queso", nombreEn: "Cheesecake", descripcion: "", precio: 6.0 },
      {
        nombre: "Brownie",
        nombreEn: "Brownie",
        descripcion: "Helado de vainilla",
        descripcionEn: "Vanilla ice cream",
        precio: 6.0
      }
    ]
  },
  {
    id: "bebidas",
    nombre: "Bebidas",
    nombreEn: "Drinks",
    nota: "",
    platos: []
  }
];
