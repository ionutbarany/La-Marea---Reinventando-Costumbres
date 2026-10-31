// Respaldo local si Google Sheets no está configurado o falla la red.
// En producción la carta suele venir de config.js + Apps Script.
// precio: número en euros (se formatea solo en pantalla) o un texto, como "Consultar".
// precios: varios tamaños de la misma bebida, cada uno con nombre y precio.
// grupos: títulos dentro de una sección; pueden llevar nota y otros grupos.
// Campos *En: opcionales; si faltan en inglés, la web muestra el texto en español.

const MENU_FALLBACK = [
  {
    id: "para-compartir",
    nombre: "Para compartir",
    nombreEn: "To share",
    platos: [
      {
        nombre: "Torrezno de la Casa",
        descripcion: "Con puré de patata y pimientos de Padrón.",
        alergenos: "Gluten, Lácteos",
        precio: 13.9
      },
      {
        nombre: "Bravas Crujientes",
        descripcion: "Con nuestra salsa brava casera.",
        alergenos: "Gluten, Huevos",
        precio: 8.5
      },
      {
        nombre: "Ensaladilla Rusa de la Casa con Huevo Poché",
        descripcion: "Cremosa de patata, zanahoria, guisantes y atún, con huevo poché templado y finas rebanadas de hogaza.",
        alergenos: "Huevo, Pescado, Gluten",
        precio: 10.9
      },
      {
        nombre: "Tosta de Sardina Ahumada",
        descripcion: "Sobre pan de masa madre tostado, tomate semiseco confitado, brotes de albahaca fresca y aceite de oliva virgen extra.",
        alergenos: "Pescado, Gluten",
        precio: 6.9
      },
      {
        nombre: "Gambones Crujientes en Panko con Cítricos",
        descripcion: "Colas de gambón envueltas en crujiente pan rallado japonés, con crema casera perfumada con lima, limón y naranja.",
        alergenos: "Gluten, Crustáceo, Huevo",
        precio: 14.9
      },
      {
        nombre: "Rejos Crujientes con Emulsión de Lima y Albahaca",
        descripcion: "Tiernas patas de calamar fritas, acompañadas de una crema suave y refrescante de lima fresca y albahaca.",
        alergenos: "Moluscos, Gluten, Huevo",
        precio: 12.9
      },
      {
        nombre: "Bacalao en Tempura con Mayonesa de Pimiento Asado",
        descripcion: "Crujientes bocados de bacalao en tempura ligera con mayonesa casera de pimientos rojos asados al horno.",
        alergenos: "Pescado, Gluten, Huevo",
        precio: 15.9
      },
      {
        nombre: "Titaina Marinera del Cabanyal",
        descripcion: "Auténtico guiso marinero con su tradicional tonyina de sorra y piñones, acompañado de pan de masa madre.",
        alergenos: "Pescado, Frutos de cáscara, Gluten",
        precio: 13.5
      },
      {
        nombre: "Bao de Calamar Crujiente con Mayonesa Dulce-Picante",
        descripcion: "Pan bao relleno de calamar frito, acompañado de salsa casera sriracha, miel y sésamo tostado.",
        alergenos: "Moluscos, Gluten, Huevo, Sésamo",
        precio: 4.9
      },
      {
        nombre: "Pulpo Crujiente con Parmentier de Pimentón",
        descripcion: "Pata de pulpo a la plancha terminada al fuego directo, sobre puré sedoso de patata al pimentón de la Vera.",
        alergenos: "Moluscos, Lácteos",
        precio: 16.9
      },
      {
        nombre: "Alcachofas Confitadas con Panceta Ibérica",
        descripcion: "Corazones de alcachofa doradas a la plancha, cubiertos con finas láminas de panceta ibérica.",
        precio: 14.9
      },
      {
        nombre: "Croqueta Cremosa de Tartufo y Parmesano (ud.)",
        descripcion: "Casera infusionada con trufa negra y queso parmesano, asentada sobre reducción de vino dulce Marsala.",
        alergenos: "Gluten, Lácteos, Huevo, Sulfitos",
        precio: 2.1
      },
      {
        nombre: "Gilda de la Casa (ud.)",
        descripcion: "Bocado clásico marinero con aceituna gordal, piparra en vinagre y anchoa con aceite sobre cama de patatas fritas.",
        alergenos: "Pescado, Sulfitos",
        precio: 2.9
      }
    ]
  },
  {
    id: "de-la-casa",
    nombre: "De la casa",
    nombreEn: "House specials",
    platos: [
      {
        nombre: "Huevos Rotos Marineros con Gulas y Jamón",
        descripcion: "Gulas salteadas al ajillo sobre patatas pajas, coronada con huevo frito y crujiente de jamón.",
        alergenos: "Huevo, Pescado, Gluten",
        precio: 14.5
      },
      {
        nombre: "Jachapuri: Pan Relleno de Quesos y Huevo",
        descripcion: "Tradicional barca de pan georgiana horneada al momento, rellena de mezcla fundente de quesos, yema de huevo y mantequilla.",
        alergenos: "Gluten, Lácteos, Huevo",
        precio: 15.9
      },
      {
        nombre: "Pinsa de la Burrata con Cecina de León y Trufa",
        descripcion: "Masa romana extra crujiente coronada en frío con stracciatella, finas lonchas de cecina de León y aceite de trufa negra.",
        alergenos: "Gluten, Lácteos, Soja",
        precio: 16.5
      },
      {
        nombre: "Steak Tartar con Brioche Tostado",
        descripcion: "Solomillo de vaca cortado finamente a cuchillo, aliñado al momento con su receta clásica, con lingotes de brioche a la plancha.",
        alergenos: "Mostaza, Huevo, Pescado, Gluten, Lácteos, Soja",
        precio: 18.9
      },
      {
        nombre: "Lingotes de Patata Confitada con Sobrasada y Foie",
        descripcion: "Lingote de patata crujiente sobre base de sobrasada templada, con medallones de foie fresco a la plancha caramelizados.",
        precio: 17.5
      }
    ]
  },
  {
    id: "burgers",
    nombre: "Burgers",
    nombreEn: "Burgers",
    platos: [
      {
        nombre: "Burger Angus y Escamorza Ahumada",
        descripcion: "Carne de Angus, queso escamorza fundido, bacon crujiente, cebolla caramelizada, rúcula fresca y pan brioche.",
        alergenos: "Gluten, Lácteos, Huevo",
        precio: 15.9
      },
      {
        nombre: "Crispy Potato Chicken",
        descripcion: "Pollo extra crujiente, queso fundido, lechuga fresca y salsa secreta de la casa en tierno pan de patata.",
        alergenos: "Gluten, Lácteos, Huevo",
        precio: 13.5
      },
      {
        nombre: "The Veggie Bun",
        descripcion: "Hamburguesa de verdura, queso fundido, vegetales variados y salsa de la casa en pan de sésamo tostado.",
        alergenos: "Gluten, Lácteos, Huevo",
        precio: 12.9
      }
    ]
  },
  {
    id: "montaditos",
    nombre: "Montaditos",
    nombreEn: "Montaditos",
    platos: [
      {
        nombre: "Secreto con Padrón y Miel",
        descripcion: "Secreto ibérico, pimientos de Padrón y alioli de miel sobre pan de semillas.",
        alergenos: "Gluten, Huevo, Frutos de cáscara",
        precio: 5.2
      },
      {
        nombre: "Montadito Mallorquín",
        descripcion: "Sobrasada artesana templada, medallón de queso de cabra caramelizado, hilos de miel y nueces en pan artesanal.",
        alergenos: "Gluten, Lácteos, Frutos de cáscara",
        precio: 5.2
      },
      {
        nombre: "Montadito de Foie y Manzana",
        descripcion: "Medallón de foie fresco a la plancha, manzana caramelizada, escamas de sal negra y reducción de Pedro Ximénez.",
        alergenos: "Gluten, Lácteos, Sulfitos",
        precio: 6.5
      },
      {
        nombre: "Montadito Nórdico",
        descripcion: "Salmón ahumado sobre base de queso crema, láminas de aguacate y un toque de eneldo fresco en pan de cristal.",
        alergenos: "Gluten, Lácteos, Pescado",
        precio: 5.2
      },
      {
        nombre: "La Trilogía de Montaditos",
        descripcion: "Elige tus 3 montaditos favoritos para combinar (Máximo 1 de Foie).",
        precio: 14.9
      }
    ]
  },
  {
    id: "dulce-final",
    nombre: "Dulce final",
    nombreEn: "Sweet ending",
    platos: [
      {
        nombre: "Tarta de Queso Horneada",
        descripcion: "Nuestra receta tradicional horneada, con una textura suave y un corazón increíblemente cremoso sobre base de galleta.",
        alergenos: "Gluten, Lácteos, Huevo",
        precio: 6.5
      },
      {
        nombre: "Brownie Deluxe",
        descripcion: "Bizcocho casero de chocolate negro puro con trozos de galleta Oreo, servido templado con helado de vainilla.",
        alergenos: "Gluten, Lácteos, Huevo",
        precio: 6.2
      },
      {
        nombre: "Torrija de Brioche al Licor de Naranja",
        descripcion: "Tierno pan brioche con un toque sutil de licor de naranja, junto a una bola de helado artesano de leche merengada.",
        alergenos: "Gluten, Lácteos, Huevo",
        precio: 6.9
      }
    ]
  },
  {
    id: "bebidas",
    nombre: "Bebidas",
    nombreEn: "Drinks",
    grupos: [
      {
        nombre: "Cervezas",
        nombreEn: "Beers",
        grupos: [
          {
            nombre: "De barril",
            nombreEn: "On tap",
            platos: [
              {
                nombre: "Barril 1870",
                precios: [
                  { nombre: "Doble", precio: 2.9 },
                  { nombre: "Tanque", precio: 3.8 },
                  { nombre: "Jarra", precio: 9.9 },
                  { nombre: "Caña", precio: 2.4 }
                ]
              },
              {
                nombre: "Barril Amstel Oro",
                precios: [
                  { nombre: "Doble", precio: 3 },
                  { nombre: "Tanque", precio: 4 },
                  { nombre: "Jarra", precio: 10.1 },
                  { nombre: "Caña", precio: 2.6 }
                ]
              }
            ]
          },
          {
            nombre: "En botella",
            nombreEn: "Bottled",
            platos: [
              {
                nombre: "Águila sin Filtrar",
                precio: 3.2
              },
              {
                nombre: "Heineken",
                precio: 3.2
              },
              {
                nombre: "Radler",
                precio: 2.9
              },
              {
                nombre: "Amstel",
                precio: 2.9
              },
              {
                nombre: "Águila",
                precio: 2.9
              },
              {
                nombre: "Heineken Sin Alcohol",
                precio: 3.2
              },
              {
                nombre: "Amstel Oro Sin Alcohol",
                precio: 3.2
              }
            ]
          }
        ]
      },
      {
        nombre: "Agua y refrescos",
        nombreEn: "Water and soft drinks",
        platos: [
          {
            nombre: "Agua con Gas",
            precio: 2.6
          },
          {
            nombre: "Agua Natural",
            precio: 1.8
          },
          {
            nombre: "Coca-Cola",
            precio: 2.8
          },
          {
            nombre: "Coca-Cola Zero",
            precio: 2.8
          },
          {
            nombre: "Aquarius (Limón / Naranja)",
            precio: 2.8
          },
          {
            nombre: "Fanta",
            precio: 2.8
          },
          {
            nombre: "Nestea",
            precio: 2.8
          },
          {
            nombre: "Tónica",
            precio: 2.5
          }
        ]
      },
      {
        nombre: "Cafés e infusiones",
        nombreEn: "Coffee and infusions",
        nota: "Suplemento tiempo: +0,20 €",
        notaEn: "Time supplement: +0.20 €",
        platos: [
          {
            nombre: "Café Solo",
            precio: 1.5
          },
          {
            nombre: "Cortado",
            precio: 1.6
          },
          {
            nombre: "Bombón",
            precio: 1.8
          },
          {
            nombre: "Café con Leche",
            precio: 2
          },
          {
            nombre: "Infusiones",
            precio: 2
          }
        ]
      },
      {
        nombre: "Sangrías",
        nombreEn: "Sangria",
        platos: [
          {
            nombre: "Sangría de Vino",
            precios: [
              { nombre: "Copa", precio: 4 },
              { nombre: "Jarra", precio: 13.5 }
            ]
          },
          {
            nombre: "Sangría de Cava",
            precios: [
              { nombre: "Copa", precio: 4 },
              { nombre: "Jarra", precio: 15 }
            ]
          }
        ]
      },
      {
        nombre: "Vinos tintos",
        nombreEn: "Red wines",
        platos: [
          {
            nombre: "Poda Tinto (Ribera del Duero)",
            precios: [
              { nombre: "Copa", precio: 3.5 },
              { nombre: "Botella", precio: 16 }
            ]
          },
          {
            nombre: "Ceramic Tinto",
            precios: [
              { nombre: "Copa", precio: 3.5 },
              { nombre: "Botella", precio: 16 }
            ]
          },
          {
            nombre: "Ramón Bilbao Tinto",
            precios: [
              { nombre: "Copa", precio: 3.5 },
              { nombre: "Botella", precio: 20 }
            ]
          },
          {
            nombre: "Protos Tinto",
            precios: [
              { nombre: "Copa", precio: 3.5 },
              { nombre: "Botella", precio: 22 }
            ]
          },
          {
            nombre: "Finca del Mar Tinto",
            precios: [
              { nombre: "Copa", precio: 3 },
              { nombre: "Botella", precio: 12.5 }
            ]
          }
        ]
      },
      {
        nombre: "Vinos blancos y cava",
        nombreEn: "White wines and cava",
        platos: [
          {
            nombre: "Poda Blanco (Albariño)",
            precios: [
              { nombre: "Copa", precio: 3.5 },
              { nombre: "Botella", precio: 18 }
            ]
          },
          {
            nombre: "Protos Blanco",
            precios: [
              { nombre: "Copa", precio: 3.5 },
              { nombre: "Botella", precio: 22 }
            ]
          },
          {
            nombre: "Finca del Mar Blanco",
            precios: [
              { nombre: "Copa", precio: 3 },
              { nombre: "Botella", precio: 12.5 }
            ]
          },
          {
            nombre: "Cava Valenciano",
            precios: [
              { nombre: "Copa", precio: "-" },
              { nombre: "Botella", precio: 13 }
            ]
          }
        ]
      },
      {
        nombre: "Combinados y licores",
        nombreEn: "Spirits",
        grupos: [
          {
            nombre: "Whisky",
            nombreEn: "Whisky",
            platos: [
              {
                nombre: "Charles House",
                precios: [
                  { nombre: "Chupito", precio: 2.5 },
                  { nombre: "Copa", precio: 4.5 }
                ]
              },
              {
                nombre: "JB",
                precios: [
                  { nombre: "Chupito", precio: 2.5 },
                  { nombre: "Copa", precio: 5.5 }
                ]
              },
              {
                nombre: "Cutty Sark",
                precios: [
                  { nombre: "Chupito", precio: 2.5 },
                  { nombre: "Copa", precio: 5.5 }
                ]
              },
              {
                nombre: "Johnnie Walker",
                precios: [
                  { nombre: "Chupito", precio: 3 },
                  { nombre: "Copa", precio: 6.5 }
                ]
              },
              {
                nombre: "Chivas",
                precios: [
                  { nombre: "Chupito", precio: 4 },
                  { nombre: "Copa", precio: 8 }
                ]
              },
              {
                nombre: "Jack Daniel's",
                precios: [
                  { nombre: "Chupito", precio: 3 },
                  { nombre: "Copa", precio: 6.5 }
                ]
              }
            ]
          },
          {
            nombre: "Ron/Cubatas",
            nombreEn: "Rum and mixers",
            platos: [
              {
                nombre: "Barceló",
                precio: 8
              },
              {
                nombre: "Brugal",
                precio: 8
              },
              {
                nombre: "Bacardí",
                precio: 7
              },
              {
                nombre: "Negrita",
                precio: "Consultar"
              }
            ]
          },
          {
            nombre: "Ginebras",
            nombreEn: "Gins",
            platos: [
              {
                nombre: "Seagram's",
                precio: 8
              },
              {
                nombre: "Beefeater",
                precio: 8
              },
              {
                nombre: "Puerto de Indias",
                precio: 8.5
              },
              {
                nombre: "Martin Miller's",
                precio: 10
              }
            ]
          },
          {
            nombre: "Otros licores y anís",
            nombreEn: "Other spirits and anise",
            platos: [
              {
                nombre: "Vodka",
                precios: [
                  { nombre: "Chupito", precio: 3 },
                  { nombre: "Copa", precio: 7.5 }
                ]
              },
              {
                nombre: "Orujo Blanco",
                precios: [
                  { nombre: "Chupito", precio: 2 },
                  { nombre: "Copa", precio: 4 }
                ]
              },
              {
                nombre: "Orujo Hierbas",
                precios: [
                  { nombre: "Chupito", precio: 2.5 },
                  { nombre: "Copa", precio: 4 }
                ]
              },
              {
                nombre: "Tequila (chupito)",
                precio: 3
              },
              {
                nombre: "Cassalla (chupito)",
                precio: 2.5
              },
              {
                nombre: "Crema de Orujo (chupito)",
                precio: 2.5
              },
              {
                nombre: "Crema de Arroz (chupito)",
                precio: 2.5
              },
              {
                nombre: "Baileys",
                precios: [
                  { nombre: "Chupito", precio: 2.5 },
                  { nombre: "Copa", precio: 5 }
                ]
              },
              {
                nombre: "Pacharán",
                precios: [
                  { nombre: "Chupito", precio: 2 },
                  { nombre: "Copa", precio: 3.5 }
                ]
              },
              {
                nombre: "Magno (Coñac)",
                precios: [
                  { nombre: "Chupito", precio: 2 },
                  { nombre: "Copa", precio: 4 }
                ]
              },
              {
                nombre: "Terry (Coñac)",
                precios: [
                  { nombre: "Chupito", precio: 2 },
                  { nombre: "Copa", precio: 4 }
                ]
              },
              {
                nombre: "Limoncello",
                precios: [
                  { nombre: "Chupito", precio: 2.5 },
                  { nombre: "Copa", precio: 4 }
                ]
              }
            ]
          }
        ]
      },
      {
        nombre: "Cócteles y aperitivos",
        nombreEn: "Cocktails and aperitifs",
        platos: [
          {
            nombre: "Aperol Spritz",
            precio: 6.5
          },
          {
            nombre: "Mojito",
            precio: 7
          },
          {
            nombre: "Piña Colada",
            precio: 7
          },
          {
            nombre: "Vermut Blanco (Martini)",
            precio: 4.5
          },
          {
            nombre: "Vermut Tinto (Martini)",
            precio: 4.5
          }
        ]
      }
    ]
  }
];
