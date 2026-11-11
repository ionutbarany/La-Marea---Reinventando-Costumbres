// Respaldo local si Google Sheets no está configurado o falla la red.
// Copia de la carta definitiva (hoja de Google, noviembre de 2026). Si cambian platos o precios, conviene regenerarla.
// En producción la carta suele venir de config.js + Apps Script.
// precio: número en euros (se formatea solo en pantalla) o un texto, como "Consultar".
// precios: varios tamaños de la misma bebida, cada uno con nombre y precio.
// imagen: ruta opcional de la foto. Se muestra a la derecha de la descripción.
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
        descripcionEn: "With mashed potato and Padrón peppers.",
        alergenos: "Gluten, Lácteos",
        precio: 13.9
      },
      {
        nombre: "Bravas Crujientes",
        descripcion: "Con nuestra salsa brava casera.",
        descripcionEn: "With our homemade bravas sauce.",
        alergenos: "Gluten, Huevo",
        precio: 8.5,
        imagen: "img/platos/IMG_6826.jpeg"
      },
      {
        nombre: "Ensaladilla Rusa de la Casa con Huevo Poché",
        descripcion: "Cremosa de patata, zanahoria, guisantes y atún, con huevo poché templado y finas rebanadas de hogaza.",
        descripcionEn: "Creamy potato, carrot, pea and tuna salad, with a warm poached egg and thin slices of country loaf.",
        alergenos: "Huevo, Pescado, Gluten",
        precio: 10.9
      },
      {
        nombre: "Tosta de Sardina Ahumada",
        descripcion: "Sobre pan de masa madre tostado, tomate semiseco confitado, brotes de albahaca fresca y aceite de oliva virgen extra.",
        descripcionEn: "On toasted sourdough bread, with confit semi-dried tomato, fresh basil shoots and extra virgin olive oil.",
        alergenos: "Pescado, Gluten",
        precio: 6.9
      },
      {
        nombre: "Gambones Crujientes en Panko con Cítricos",
        descripcion: "Colas de gambón envueltas en crujiente pan rallado japonés, con crema casera perfumada con lima, limón y naranja.",
        descripcionEn: "King prawn tails in a crispy Japanese breadcrumb coating, with a homemade cream scented with lime, lemon and orange.",
        alergenos: "Gluten, Crustáceos, Huevo",
        precio: 14.9
      },
      {
        nombre: "Rejos Crujientes con Emulsión de Lima y Albahaca",
        descripcion: "Tiernas patas de calamar fritas, acompañadas de una crema suave y refrescante de lima fresca y albahaca.",
        descripcionEn: "Tender fried squid tentacles, served with a smooth, refreshing cream of fresh lime and basil.",
        alergenos: "Moluscos, Gluten, Huevo",
        precio: 12.9
      },
      {
        nombre: "Bacalao en Tempura con Mayonesa de Pimiento Asado",
        descripcion: "Crujientes bocados de bacalao en tempura ligera con mayonesa casera de pimientos rojos asados al horno.",
        descripcionEn: "Crispy bites of cod in a light tempura batter, with homemade mayonnaise made from oven-roasted red peppers.",
        alergenos: "Pescado, Gluten, Huevo",
        precio: 15.9
      },
      {
        nombre: "Titaina Marinera del Cabanyal",
        descripcion: "Auténtico guiso marinero con su tradicional tonyina de sorra y piñones, acompañado de pan de masa madre.",
        descripcionEn: "Authentic fisherman's stew with the traditional tonyina de sorra (salt-cured tuna belly) and pine nuts, served with sourdough bread.",
        alergenos: "Pescado, Frutos de cáscara, Gluten",
        precio: 13.5
      },
      {
        nombre: "Bao de Calamar Crujiente con Mayonesa Dulce-Picante",
        descripcion: "Pan bao relleno de calamar frito, acompañado de salsa casera sriracha, miel y sésamo tostado.",
        descripcionEn: "Bao bun filled with fried squid, served with homemade sriracha sauce, honey and toasted sesame.",
        alergenos: "Moluscos, Gluten, Huevo, Sésamo",
        precio: 4.9
      },
      {
        nombre: "Pulpo Crujiente con Parmentier de Pimentón",
        descripcion: "Pata de pulpo a la plancha terminada al fuego directo, sobre puré sedoso de patata al pimentón de la Vera.",
        descripcionEn: "Griddled octopus leg finished over an open flame, on a silky potato purée with smoked La Vera paprika.",
        alergenos: "Moluscos, Lácteos",
        precio: 16.9,
        imagen: "img/platos/IMG_6786.jpeg"
      },
      {
        nombre: "Alcachofas Confitadas con Panceta Ibérica",
        descripcion: "Corazones de alcachofa doradas a la plancha, cubiertos con finas láminas de panceta ibérica.",
        descripcionEn: "Artichoke hearts browned on the griddle, topped with thin slices of Iberian pancetta.",
        precio: 14.9
      },
      {
        nombre: "Croqueta Cremosa de Tartufo y Parmesano (ud.)",
        descripcion: "Casera infusionada con trufa negra y queso parmesano, asentada sobre reducción de vino dulce Marsala.",
        descripcionEn: "Homemade, infused with black truffle and Parmesan cheese, set on a reduction of sweet Marsala wine.",
        alergenos: "Gluten, Lácteos, Huevo, Sulfitos",
        precio: 2.1
      },
      {
        nombre: "Gilda de la Casa (ud.)",
        descripcion: "Bocado clásico marinero con aceituna gordal, piparra en vinagre y anchoa con aceite sobre cama de patatas fritas.",
        descripcionEn: "Classic seafarer's bite with gordal olive, pickled piparra pepper and anchovy in oil, on a bed of potato crisps.",
        alergenos: "Pescado, Sulfitos",
        precio: 2.9,
        imagen: "img/platos/IMG_6824.jpeg"
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
        descripcionEn: "Gulas (imitation baby eels) sautéed with garlic over straw-cut fries, topped with a fried egg and crispy ham.",
        alergenos: "Huevo, Pescado, Gluten",
        precio: 14.5
      },
      {
        nombre: "Jachapuri: Pan Relleno de Quesos y Huevo",
        descripcion: "Tradicional barca de pan georgiana horneada al momento, rellena de mezcla fundente de quesos, yema de huevo y mantequilla.",
        descripcionEn: "Traditional Georgian bread boat baked to order, filled with a melting blend of cheeses, egg yolk and butter.",
        alergenos: "Gluten, Lácteos, Huevo",
        precio: 15.9
      },
      {
        nombre: "Pinsa de la Burrata con Cecina de León y Trufa",
        descripcion: "Masa romana extra crujiente coronada en frío con stracciatella, finas lonchas de cecina de León y aceite de trufa negra.",
        descripcionEn: "Extra-crispy Roman-style dough topped cold with stracciatella, thin slices of cecina de León (cured beef) and black truffle oil.",
        alergenos: "Gluten, Lácteos, Soja",
        precio: 16.5
      },
      {
        nombre: "Steak Tartar con Brioche Tostado",
        descripcion: "Solomillo de vaca cortado finamente a cuchillo, aliñado al momento con su receta clásica, con lingotes de brioche a la plancha.",
        descripcionEn: "Beef tenderloin finely hand-cut with a knife, dressed to order with the classic recipe, served with griddled brioche bars.",
        alergenos: "Mostaza, Huevo, Pescado, Gluten, Lácteos, Soja",
        precio: 18.9
      },
      {
        nombre: "Lingotes de Patata Confitada con Sobrasada y Foie",
        descripcion: "Lingote de patata crujiente sobre base de sobrasada templada, con medallones de foie fresco a la plancha caramelizados.",
        descripcionEn: "Crispy potato bar on a base of warm sobrasada (Mallorcan cured sausage), with caramelised medallions of griddled fresh foie gras.",
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
        descripcionEn: "Angus beef, melted scamorza cheese, crispy bacon, caramelised onion, fresh rocket and a brioche bun.",
        alergenos: "Gluten, Lácteos, Huevo",
        precio: 15.9
      },
      {
        nombre: "Crispy Potato Chicken",
        descripcion: "Pollo extra crujiente, queso fundido, lechuga fresca y salsa secreta de la casa en tierno pan de patata.",
        descripcionEn: "Extra-crispy chicken, melted cheese, fresh lettuce and the house secret sauce in a soft potato bun.",
        alergenos: "Gluten, Lácteos, Huevo",
        precio: 13.5
      },
      {
        nombre: "The Veggie Bun",
        descripcion: "Hamburguesa de verdura, queso fundido, vegetales variados y salsa de la casa en pan de sésamo tostado.",
        descripcionEn: "Vegetable patty, melted cheese, assorted vegetables and house sauce in a toasted sesame bun.",
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
        descripcionEn: "Iberian pork secreto, Padrón peppers and honey aioli on seeded bread.",
        alergenos: "Gluten, Huevo, Frutos de cáscara",
        precio: 5.2,
        imagen: "img/platos/IMG_6780.jpeg"
      },
      {
        nombre: "Montadito Mallorquín",
        descripcion: "Sobrasada artesana templada, medallón de queso de cabra caramelizado, hilos de miel y nueces en pan artesanal.",
        descripcionEn: "Warm artisan sobrasada (Mallorcan cured sausage), caramelised goat's cheese medallion, honey drizzle and walnuts on artisan bread.",
        alergenos: "Gluten, Lácteos, Frutos de cáscara",
        precio: 5.2,
        imagen: "img/platos/IMG_6820.jpeg"
      },
      {
        nombre: "Montadito de Foie y Manzana",
        descripcion: "Medallón de foie fresco a la plancha, manzana caramelizada, escamas de sal negra y reducción de Pedro Ximénez.",
        descripcionEn: "Griddled medallion of fresh foie gras, caramelised apple, black salt flakes and a Pedro Ximénez reduction.",
        alergenos: "Gluten, Lácteos, Sulfitos",
        precio: 6.5
      },
      {
        nombre: "Montadito Nórdico",
        descripcion: "Salmón ahumado sobre base de queso crema, láminas de aguacate y un toque de eneldo fresco en pan de cristal.",
        descripcionEn: "Smoked salmon on a base of cream cheese, avocado slices and a touch of fresh dill on pan de cristal (thin, crisp-crusted bread).",
        alergenos: "Gluten, Lácteos, Pescado",
        precio: 5.2,
        imagen: "img/platos/IMG_6789.jpeg"
      },
      {
        nombre: "La Trilogía de Montaditos",
        descripcion: "Elige tus 3 montaditos favoritos para combinar (Máximo 1 de Foie).",
        descripcionEn: "Choose your 3 favourite montaditos to mix and match (maximum 1 foie gras).",
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
        descripcionEn: "Our traditional baked recipe, with a soft texture and an incredibly creamy centre on a biscuit base.",
        alergenos: "Gluten, Lácteos, Huevo",
        precio: 6.5
      },
      {
        nombre: "Brownie Deluxe",
        descripcion: "Bizcocho casero de chocolate negro puro con trozos de galleta Oreo, servido templado con helado de vainilla.",
        descripcionEn: "Homemade pure dark chocolate sponge with Oreo cookie pieces, served warm with vanilla ice cream.",
        alergenos: "Gluten, Lácteos, Huevo",
        precio: 6.2
      },
      {
        nombre: "Torrija de Brioche al Licor de Naranja",
        descripcion: "Tierno pan brioche con un toque sutil de licor de naranja, junto a una bola de helado artesano de leche merengada.",
        descripcionEn: "Tender brioche bread with a subtle hint of orange liqueur, served with a scoop of artisan leche merengada ice cream (a traditional Spanish cinnamon-milk flavour).",
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
                  { nombre: "Doble", nombreEn: "Large Beer", precio: 2.9 },
                  { nombre: "Tanque", nombreEn: "Half-Litre Beer", precio: 3.8 },
                  { nombre: "Jarra", nombreEn: "Jug", precio: 9.9 },
                  { nombre: "Caña", nombreEn: "Small Beer", precio: 2.4 }
                ]
              },
              {
                nombre: "Barril Amstel Oro",
                precios: [
                  { nombre: "Doble", nombreEn: "Large Beer", precio: 3 },
                  { nombre: "Tanque", nombreEn: "Half-Litre Beer", precio: 4 },
                  { nombre: "Jarra", nombreEn: "Jug", precio: 10.1 },
                  { nombre: "Caña", nombreEn: "Small Beer", precio: 2.6 }
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
                nombreEn: "Águila Unfiltered",
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
                nombreEn: "Heineken Alcohol-Free",
                precio: 3.2
              },
              {
                nombre: "Amstel Oro Sin Alcohol",
                nombreEn: "Amstel Oro Alcohol-Free",
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
            nombreEn: "Sparkling Water",
            precio: 2.6
          },
          {
            nombre: "Agua Natural",
            nombreEn: "Still Water",
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
            nombreEn: "Aquarius (Lemon / Orange)",
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
            nombreEn: "Tonic Water",
            precio: 2.5
          }
        ]
      },
      {
        nombre: "Cafés e infusiones",
        nombreEn: "Coffee and infusions",
        nota: "Suplemento tiempo: +0,20 €",
        notaEn: "Iced coffee: +0.20 €",
        platos: [
          {
            nombre: "Café Solo",
            nombreEn: "Espresso",
            precio: 1.5
          },
          {
            nombre: "Cortado",
            nombreEn: "Cortado (espresso with a dash of milk)",
            precio: 1.6
          },
          {
            nombre: "Bombón",
            nombreEn: "Bombón (espresso with condensed milk)",
            precio: 1.8
          },
          {
            nombre: "Café con Leche",
            nombreEn: "Coffee with Milk",
            precio: 2
          },
          {
            nombre: "Infusiones",
            nombreEn: "Herbal Teas",
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
            nombreEn: "Wine Sangria",
            precios: [
              { nombre: "Copa", nombreEn: "Glass", precio: 4 },
              { nombre: "Jarra", nombreEn: "Jug", precio: 13.5 }
            ]
          },
          {
            nombre: "Sangría de Cava",
            nombreEn: "Cava Sangria",
            precios: [
              { nombre: "Copa", nombreEn: "Glass", precio: 4 },
              { nombre: "Jarra", nombreEn: "Jug", precio: 15 }
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
              { nombre: "Copa", nombreEn: "Glass", precio: 3.5 },
              { nombre: "Botella", nombreEn: "Bottle", precio: 16 }
            ]
          },
          {
            nombre: "Ceramic Tinto",
            precios: [
              { nombre: "Copa", nombreEn: "Glass", precio: 3.5 },
              { nombre: "Botella", nombreEn: "Bottle", precio: 16 }
            ]
          },
          {
            nombre: "Ramon Bilbao Tinto",
            precios: [
              { nombre: "Botella", nombreEn: "Bottle", precio: 20 }
            ]
          },
          {
            nombre: "Protos Tinto",
            precios: [
              { nombre: "Botella", nombreEn: "Bottle", precio: 22 }
            ]
          },
          {
            nombre: "Finca del Mar Tinto",
            precios: [
              { nombre: "Copa", nombreEn: "Glass", precio: 3 },
              { nombre: "Botella", nombreEn: "Bottle", precio: 12.5 }
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
              { nombre: "Copa", nombreEn: "Glass", precio: 3.5 },
              { nombre: "Botella", nombreEn: "Bottle", precio: 18 }
            ]
          },
          {
            nombre: "Protos Blanco",
            precios: [
              { nombre: "Botella", nombreEn: "Bottle", precio: 22 }
            ]
          },
          {
            nombre: "Finca del Mar Blanco",
            precios: [
              { nombre: "Copa", nombreEn: "Glass", precio: 3 },
              { nombre: "Botella", nombreEn: "Bottle", precio: 12.5 }
            ]
          },
          {
            nombre: "Cava Valenciano",
            nombreEn: "Valencian Cava",
            precios: [
              { nombre: "Copa", nombreEn: "Glass", precio: "-" },
              { nombre: "Botella", nombreEn: "Bottle", precio: 13 }
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
                  { nombre: "Chupito", nombreEn: "Shot", precio: 2.5 },
                  { nombre: "Copa", nombreEn: "Glass", precio: 4.5 }
                ]
              },
              {
                nombre: "JB",
                precios: [
                  { nombre: "Chupito", nombreEn: "Shot", precio: 2.5 },
                  { nombre: "Copa", nombreEn: "Glass", precio: 5.5 }
                ]
              },
              {
                nombre: "Cutty Sark",
                precios: [
                  { nombre: "Chupito", nombreEn: "Shot", precio: 2.5 },
                  { nombre: "Copa", nombreEn: "Glass", precio: 5.5 }
                ]
              },
              {
                nombre: "Johnnie Walker",
                precios: [
                  { nombre: "Chupito", nombreEn: "Shot", precio: 3 },
                  { nombre: "Copa", nombreEn: "Glass", precio: 6.5 }
                ]
              },
              {
                nombre: "Chivas",
                precios: [
                  { nombre: "Chupito", nombreEn: "Shot", precio: 4 },
                  { nombre: "Copa", nombreEn: "Glass", precio: 8 }
                ]
              },
              {
                nombre: "Jack Daniel's",
                precios: [
                  { nombre: "Chupito", nombreEn: "Shot", precio: 3 },
                  { nombre: "Copa", nombreEn: "Glass", precio: 6.5 }
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
                  { nombre: "Chupito", nombreEn: "Shot", precio: 3 },
                  { nombre: "Copa", nombreEn: "Glass", precio: 7.5 }
                ]
              },
              {
                nombre: "Orujo Blanco",
                nombreEn: "White Orujo (pomace brandy)",
                precios: [
                  { nombre: "Chupito", nombreEn: "Shot", precio: 2 },
                  { nombre: "Copa", nombreEn: "Glass", precio: 4 }
                ]
              },
              {
                nombre: "Orujo Hierbas",
                nombreEn: "Herb Orujo (herbal pomace brandy)",
                precios: [
                  { nombre: "Chupito", nombreEn: "Shot", precio: 2.5 },
                  { nombre: "Copa", nombreEn: "Glass", precio: 4 }
                ]
              },
              {
                nombre: "Tequila (chupito)",
                nombreEn: "Tequila (shot)",
                precio: 3
              },
              {
                nombre: "Cassalla (chupito)",
                nombreEn: "Cassalla (shot)",
                precio: 2.5
              },
              {
                nombre: "Crema de Orujo (chupito)",
                nombreEn: "Orujo Cream (shot)",
                precio: 2.5
              },
              {
                nombre: "Crema de Arroz (chupito)",
                nombreEn: "Crema de Arroz (shot)",
                precio: 2.5
              },
              {
                nombre: "Baileys",
                precios: [
                  { nombre: "Chupito", nombreEn: "Shot", precio: 2.5 },
                  { nombre: "Copa", nombreEn: "Glass", precio: 5 }
                ]
              },
              {
                nombre: "Pacharán",
                nombreEn: "Pacharán (sloe liqueur)",
                precios: [
                  { nombre: "Chupito", nombreEn: "Shot", precio: 2 },
                  { nombre: "Copa", nombreEn: "Glass", precio: 3.5 }
                ]
              },
              {
                nombre: "Magno (Coñac)",
                nombreEn: "Magno (Cognac)",
                precios: [
                  { nombre: "Chupito", nombreEn: "Shot", precio: 2 },
                  { nombre: "Copa", nombreEn: "Glass", precio: 4 }
                ]
              },
              {
                nombre: "Terry (Coñac)",
                nombreEn: "Terry (Cognac)",
                precios: [
                  { nombre: "Chupito", nombreEn: "Shot", precio: 2 },
                  { nombre: "Copa", nombreEn: "Glass", precio: 4 }
                ]
              },
              {
                nombre: "Limoncello",
                precios: [
                  { nombre: "Chupito", nombreEn: "Shot", precio: 2.5 },
                  { nombre: "Copa", nombreEn: "Glass", precio: 4 }
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
            nombreEn: "White Vermouth (Martini)",
            precio: 4.5
          },
          {
            nombre: "Vermut Tinto (Martini)",
            nombreEn: "Red Vermouth (Martini)",
            precio: 4.5
          }
        ]
      }
    ]
  }
];
