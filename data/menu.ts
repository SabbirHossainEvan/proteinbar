import type { MenuCategory } from "@/types";

export const menuCategories: MenuCategory[] = [
  {
    id: "high-protein-breakfast",
    name: "BREAKFAST",
    description: "Petits Déjeuners",
    items: [
      {
        id: "leggs-day",
        name: "L’EGGS DAY",
        description:
          "Omelette (min 2 - max 6) œufs complets aux épinards et tomates cerises, patate douce au four, mesclun de salade, 200ml jus d’orange frais. Proteins: 48g | Glucides: 52g | Lipides: 38g",
        priceMad: 45,
        calories: 794,
      },
      {
        id: "good-morning",
        name: "GOOD MORNING",
        description:
          "Bagel œuf-guacamole, bagel banane-beurre de cacahuète maison, 2 œufs au plat, mesclun de salade, 200ml jus d’orange frais. Proteins: 36g | Glucides: 90g | Lipides: 28g",
        priceMad: 65,
        calories: 756,
      },
      {
        id: "coleman",
        name: "COLEMAN",
        description:
          "Pancakes salés, bresaola, œuf au plat, sirop d’érable, graine de sésame, jus d'orange 200ml. Proteins: 36g | Glucides: 60g | Lipides: 15g",
        priceMad: 65,
        calories: 528,
      },
      {
        id: "omega",
        name: "OMEGA",
        description:
          "Pancakes salés, saumon fumé, avocat, sauce tzatziki maison, aneth, jus d'orange 200ml. Proteins: 25g | Glucides: 36g | Lipides: 24g",
        priceMad: 75,
        calories: 581,
      },
      {
        id: "le-bench",
        name: "LE BENCH",
        description:
          "100 gr saucisses, 100 gr patate douce au four, 2 œufs brouillés, oignons et tomates cerises sautées, mini pancakes protéinés, overnight pudding chia, 200ml jus d’orange frais, pain complet, fromage blanc, huile d’olive, miel. Proteins: 55g | Glucides: 107g | Lipides: 46g",
        priceMad: 95,
        calories: 1062,
      },
    ],
  },
  {
    id: "signature-bowls",
    name: "Compose Ton Porridge",
    description: "COMPOSEZ VOTRE PORRIDGE",
    items: [
      {
        id: "inshape",
        name: "Inshape",
        description: "(Orange, whey vanille, banane) Proteins: 47g | Glucides: 63g | Lipides: 1g",
        priceMad: 45,
        calories: 427,
      },
      {
        id: "hulk",
        name: "Hulk",
        description: "(Lait, whey vanille, avocat, beurre de cacahuète) Proteins: 61g | Glucides: 42g | Lipides: 47g",
        priceMad: 45,
        calories: 792,
      },
      {
        id: "summer-body",
        name: "Summer Body",
        description: "(Lait de coco, whey vanille, ananas, banane) Proteins: 45g | Glucides: 85g | Lipides: 12g",
        priceMad: 45,
        calories: 525,
      },
      {
        id: "arnold",
        name: "Arnold",
        description:
          "(Lait, gainer chocolat, banane, avocat, avoine, beurre de cacahuète) Proteins: 62g | Glucides: 127g | Lipides: 62g",
        priceMad: 55,
        calories: 1279,
      },
    ],
  },
  {
    id: "fit-burgers-wraps",
    name: "Petits Plaisirs Healthy",
    description: "Petits Plaisirs Healthy",
    items: [
      {
        id: "pancakes-proteines",
        name: "Pancakes Protéinés",
        description: "Proteins: 33g | Glucides: 61g | Lipides: 08g",
        priceMad: 38,
        calories: 448,
      },
      {
        id: "crepe-proteinee",
        name: "Crêpe Protéinée",
        description: "Proteins: 26g | Glucides: 39g | Lipides: 12g",
        priceMad: 38,
        calories: 368,
      },
      {
        id: "gaufre-proteinee",
        name: "Gaufre Protéinée",
        description: "Proteins: 29g | Glucides: 43g | Lipides: 10g",
        priceMad: 38,
        calories: 378,
      },
      {
        id: "panflex-proteine",
        name: "Panflex Protéiné",
        description: "(Mini pancakes façon cornflakes) Proteins: 29g | Glucides: 41g | Lipides: 06g",
        priceMad: 38,
        calories: 434,
      },
    ],
  },
  {
    id: "smoothies-drinks",
    name: "Healthy Wraps",
    description: "Healthy Wraps",
    items: [
      {
        id: "wrap-thon",
        name: "Wrap thon",
        description: "Thon, roquette, oignon cru, tomate séché, sauce tartare maison, crème cheese. Proteins: 38g | Glucides: 46g | Lipides: 14g",
        priceMad: 49,
        calories: 462,
      },
      {
        id: "wrap-poulet-crispy",
        name: "Wrap poulet crispy",
        description:
          "Poulet crispy au four, coleslaw maison, laitue, sauce Proteinbar, guacamole maison. Proteins: 35g | Glucides: 60g | Lipides: 32g",
        priceMad: 55,
        calories: 668,
      },
    ],
  },
  {
    id: "compose-ton-plat",
    name: "Compose Ton Plat",
    description: "COMPOSEZ VOTRE PLAT",
    items: [
      {
        id: "proteines-100-150-200",
        name: "01- PROTEINES",
        description:
          "Poulet Mariné (20/30/40 DH), Viande Hachée (25/35/45 DH), Faux Filet (30/45/55 DH), Saumon Frais (45/65/80 DH), Thon Conserve (20/30/40 DH)",
        priceMad: 0,
        calories: 0,
      },
      {
        id: "glucides-100-150-200",
        name: "02- Glucides",
        description:
          "Riz basmati, pomme de terre au four, patate douce au four, pates completes, ebly (10/15/20 DH) et quinoa (15/20/25 DH)",
        priceMad: 0,
        calories: 0,
      },
      {
        id: "accompagnements",
        name: "03- Accompagnements (70g)",
        description:
          "Haricot vert, carotte, courgette, concombre, pomme, tomate, tomate cerise, oignon, poivrons, aubergines, brocolis, avocat, mangue, ananas, noix de cajou, amande (+10/+15 DH)",
        priceMad: 0,
        calories: 0,
      },
      {
        id: "sauces",
        name: "04- Sauces",
        description:
          "Sauce blanche, sauce barbecue, sauce vinaigrette maison, sauce tomate maison, huile d'olive, sauce miel moutarde maison, sauce guacamole maison, sauce tzatziki maison",
        priceMad: 0,
        calories: 0,
      },
    ],
  },
  {
    id: "hot-bowls",
    name: "HOT BOWLS",
    description: "Hot Bowls",
    items: [
      {
        id: "winter-bowl",
        name: "Winter Bowl",
        description:
          "150 gr poulet, 150 gr riz basmati, brocolis, avocat (sauce au choix). Proteins: 38g | Glucides: 48g | Lipides: 24g",
        priceMad: 65,
        calories: 560,
      },
      {
        id: "summer-bowl",
        name: "Summer Bowl",
        description:
          "100 gr thon, 150 gr pâtes complètes froide, oignon cru, pêche ou pomme fraiche, parmesan, noix de cajou (sauce au choix). Proteins: 40g | Glucides: 45g | Lipides: 08g",
        priceMad: 65,
        calories: 412,
      },
      {
        id: "off-season-bowl",
        name: "Off Season Bowl",
        description:
          "200 gr viande hachée, 200 gr pates, oignon cuit, mozzarella 0% gratiné, sauce tomate maison. Proteins: 58g | Glucides: 77g | Lipides: 55g",
        priceMad: 75,
        calories: 1035,
      },
      {
        id: "bulking-bowl",
        name: "Bulking Bowl",
        description:
          "200 gr viande hachée, 200 gr riz basmati, oignon cuit, aubergine au four, brocolis, avocat (sauce au choix). Proteins: 44g | Glucides: 73g | Lipides: 58g",
        priceMad: 95,
        calories: 990,
      },
      {
        id: "shredding-bowl",
        name: "Shredding Bowl",
        description:
          "100 gr saumon cuit, 100 gr quinoa, poivrons cru, ananas, brocolis (sauce au choix). Proteins: 30g | Glucides: 38g | Lipides: 18g",
        priceMad: 105,
        calories: 434,
      },
    ],
  },
  {
    id: "healthy-burgers",
    name: "HEALTHY BURGERS",
    description: "Healthy Burgers",
    items: [
      {
        id: "pancake-chicken-burger",
        name: "Pancake Chicken Burger",
        description:
          "Healthy pancakes salés, steak haché de poulet maison, coleslaw maison, mozzarella 0%, sauce secrète maison. Proteins: 40g | Glucides: 62g | Lipides: 14g",
        priceMad: 55,
        calories: 558,
      },
      {
        id: "pancake-beef-burger",
        name: "Pancake Beef Burger",
        description:
          "Healthy pancakes salés, steak haché, laitue, tomate, oignon cru, mozzarella 0%, sauce fumée maison. Proteins: 47g | Glucides: 54g | Lipides: 36g",
        priceMad: 65,
        calories: 728,
      },
      {
        id: "keto-avocado-burger",
        name: "Keto Avocado Burger",
        description: "Demi avocat, saumon fumé, roquette, fromage blanc, mesclun de salade. Proteins: 13g | Glucides: 04g | Lipides: 18g",
        priceMad: 75,
        calories: 231,
      },
      {
        id: "aquaman",
        name: "Aquaman",
        description:
          "Bun aux pépites d’avoine, poisson blanc frais haché aux épices, sauce tartare maison, roquette, concombres, oignon cru, mozzarella 0%. Proteins: 34g | Glucides: 48g | Lipides: 19g",
        priceMad: 75,
        calories: 499,
      },
      {
        id: "mr-olympia",
        name: "Mr Olympia",
        description:
          "Bun XXL, 3 steaks hachés, cheddar, oignons caramélisés, champignons frais sautés, cornichon américain, salade Rosa, sauce fumée maison. Proteins: 72g | Glucides: 97g | Lipides: 93g",
        priceMad: 109,
        calories: 1513,
      },
    ],
  },
  {
    id: "healthy-pizzas",
    name: "HEALTHY PIZZAS",
    description: "Healthy Pizzas",
    items: [
      {
        id: "healthy-bbq-chicken-pizza",
        name: "Healthy BBQ Chicken Pizza",
        description:
          "Mini pâte à pizza healthy, sauce barbecue, poulet mariné, oignon, poivrons, mozzarella 0%, mesclun salade. Proteins: 28g | Glucides: 49g | Lipides: 14g",
        priceMad: 39,
        calories: 434,
      },
      {
        id: "healthy-beef-pizza",
        name: "Healthy Beef Pizza",
        description:
          "Mini pâte à pizza healthy, sauce tomate maison, steak hachée, épinards, oignons, tomates cerises, mozzarella 0%, mesclun salade. Proteins: 25g | Glucides: 44g | Lipides: 21g",
        priceMad: 49,
        calories: 465,
      },
      {
        id: "healthy-saumon-avocat-pizza",
        name: "Healthy Saumon Avocat Pizza",
        description:
          "Mini pâte à pizza à l’épinard, saumon fumé, parmesan, avocat, aneth, mozzarella 0%, mesclun salade. Proteins: 19g | Glucides: 35g | Lipides: 23g",
        priceMad: 59,
        calories: 423,
      },
      {
        id: "healthy-pizza-thon",
        name: "Healthy Pizza Thon",
        description:
          "Mini pâte à pizza à l’épinard, sauce tomate maison, sauce secrète maison, thon, roquette, mozzarella 0%, mesclun salade. Proteins: 17g | Glucides: 31g | Lipides: 08g",
        priceMad: 45,
        calories: 264,
      },
    ],
  },
  {
    id: "poke-bowls",
    name: "POKE BOWLS",
    description: "POKÉ BOWL",
    items: [
      {
        id: "poke-poulet",
        name: "POKÉ POULET",
        description: "Poulet, riz vinaigré, ananas, avocat, carotte, chou rouge, sauce tzatziki maison",
        priceMad: 45,
        calories: 0,
      },
      {
        id: "poke-saumon",
        name: "POKÉ SAUMON",
        description: "Saumon cru, riz vinaigré, mangue, mélange poivrons, chou rouge, mesclun salade, sauce sucrée épicée",
        priceMad: 65,
        calories: 0,
      },
    ],
  },
  {
    id: "shakers-a-la-carte",
    name: "SHAKERS A LA CARTE",
    description: "Shakers à la carte",
    items: [
      {
        id: "beast-mode-on",
        name: "Beast mode ON",
        description: "(Lait, whey vanille, café) Proteins: 31g | Glucides: 13g | Lipides: 07g",
        priceMad: 40,
        calories: 239,
      },
      {
        id: "aesthetic",
        name: "Aesthetic",
        description: "(Lait, whey vanille, myrtille, banane) Proteins: 29g | Glucides: 32g | Lipides: 08g",
        priceMad: 40,
        calories: 311,
      },
      {
        id: "inshape-shaker",
        name: "Inshape",
        description: "(Orange, whey vanille, banane) Proteins: 30g | Glucides: 33g | Lipides: 02g",
        priceMad: 45,
        calories: 247,
      },
      {
        id: "hulk-shaker",
        name: "Hulk",
        description: "(Lait, whey vanille, avocat, beurre de cacahuète) Proteins: 35g | Glucides: 15g | Lipides: 19g",
        priceMad: 45,
        calories: 371,
      },
      {
        id: "summer-body-shaker",
        name: "Summer body",
        description: "(Lait de coco, whey vanille, ananas, banane) Proteins: 25g | Glucides: 25g | Lipides: 03g",
        priceMad: 50,
        calories: 225,
      },
      {
        id: "arnold-shaker",
        name: "Arnold",
        description:
          "(Lait, gainer chocolat, banane, avocat, avoine, beurre de cacahuète, dattes) Proteins: 27g | Glucides: 69g | Lipides: 27g",
        priceMad: 55,
        calories: 627,
      },
    ],
  },
  {
    id: "detox-soft-drinks",
    name: "DETOX & SOFT DRINKS",
    description: "DETOX Mixés Minute / Soft Drinks",
    items: [
      {
        id: "organic-detox",
        name: "Organic detox",
        description: "Pomme, concombre, citron vert, menthe fraiche",
        priceMad: 25,
        calories: 0,
      },
      {
        id: "d-stress",
        name: "D-stress",
        description: "Betterave, carotte, pomme, citron",
        priceMad: 25,
        calories: 0,
      },
      {
        id: "booster",
        name: "Booster",
        description: "Orange, carotte, gingembre",
        priceMad: 30,
        calories: 0,
      },
      {
        id: "minceur",
        name: "Minceur",
        description: "Ananas, citron vert",
        priceMad: 30,
        calories: 0,
      },
      {
        id: "vitamix",
        name: "Vitamix",
        description: "Ananas, pomme, fraise",
        priceMad: 30,
        calories: 0,
      },
      {
        id: "shaker-bcaa",
        name: "Shaker BCAA (250ml)",
        description: "Arôme selon arrivage",
        priceMad: 25,
        calories: 0,
      },
      {
        id: "soda-33cl",
        name: "Soda (33cl)",
        description: "Coca Zero, Coca, Fanta orange, Hawaï, Sprite, Pom's, Orangina",
        priceMad: 15,
        calories: 0,
      },
      {
        id: "raze-energy-drink",
        name: "Raze Energy Drink (Sugar Free)",
        description: "",
        priceMad: 28,
        calories: 0,
      },
      {
        id: "eau-gazeuse",
        name: "Eau gazeuse",
        description: "",
        priceMad: 15,
        calories: 0,
      },
      {
        id: "eau-minerale-50cl",
        name: "Eau minérale (50cl)",
        description: "",
        priceMad: 10,
        calories: 0,
      },
      {
        id: "eau-minerale-150cl",
        name: "Eau minérale (150cl)",
        description: "",
        priceMad: 15,
        calories: 0,
      },
    ],
  },
  {
    id: "hot-drinks",
    name: "HOT DRINKS",
    description: "Hot Drinks",
    items: [
      {
        id: "nespresso",
        name: "Nespresso",
        description: "",
        priceMad: 18,
        calories: 0,
      },
      {
        id: "double-nespresso",
        name: "Double Nespresso",
        description: "",
        priceMad: 30,
        calories: 0,
      },
      {
        id: "cafe-nespresso-allonge",
        name: "Café Nespresso Allongé",
        description: "",
        priceMad: 22,
        calories: 0,
      },
      {
        id: "chocolat-chaud-proteine",
        name: "Chocolat Chaud Protéiné",
        description: "",
        priceMad: 20,
        calories: 0,
      },
      {
        id: "infusion",
        name: "Infusion (arôme au choix)",
        description: "",
        priceMad: 25,
        calories: 0,
      },
    ],
  },
  {
    id: "ice-tea",
    name: "ICE TEA",
    description: "Ice Tea",
    items: [
      {
        id: "ice-tea-chamali",
        name: "Ice tea chamali",
        description: "Sans sucre",
        priceMad: 25,
        calories: 0,
      },
      {
        id: "ice-tea-vanille",
        name: "Ice tea vanille",
        description: "Sans sucre",
        priceMad: 25,
        calories: 0,
      },
      {
        id: "ice-tea-fruits-rouges",
        name: "Ice tea fruits rouges",
        description: "Sans sucre",
        priceMad: 30,
        calories: 0,
      },
    ],
  },
  {
    id: "healthy-desserts",
    name: "HEALTHY DESSERTS",
    description: "Healthy Desserts",
    items: [
      {
        id: "mousse-au-chocolat-proteinee",
        name: "Mousse au chocolat protéinée",
        description: "Proteins: 21g | Glucides: 16g | Lipides: 09g",
        priceMad: 30,
        calories: 229,
      },
      {
        id: "healthy-cheesecake",
        name: "Healthy cheesecake",
        description: "Proteins: 12g | Glucides: 27g | Lipides: 24g",
        priceMad: 40,
        calories: 372,
      },
      {
        id: "healthy-carrot-cake",
        name: "Healthy carrot cake",
        description: "Proteins: 14g | Glucides: 25g | Lipides: 19g",
        priceMad: 40,
        calories: 327,
      },
      {
        id: "healthy-tiramisu-pancakes",
        name: "Healthy Tiramisu pancakes",
        description: "Proteins: 25g | Glucides: 34g | Lipides: 22g",
        priceMad: 45,
        calories: 434,
      },
      {
        id: "overnight-chia-pudding",
        name: "Overnight chia pudding",
        description: "Proteins: 08g | Glucides: 11g | Lipides: 10g",
        priceMad: 35,
        calories: 166,
      },
      {
        id: "brownie-proteine",
        name: "Brownie protéiné",
        description: "Proteins: 18g | Glucides: 28g | Lipides: 13g",
        priceMad: 30,
        calories: 301,
      },
      {
        id: "cookie-proteine",
        name: "Cookie protéiné",
        description: "Proteins: 12g | Glucides: 15g | Lipides: 02g",
        priceMad: 15,
        calories: 126,
      },
      {
        id: "combo-5-energy-balls",
        name: "Combo 5 Energy balls",
        description:
          "Combinaison de nos 5 saveurs d'energy balls: café, nutella, pistache, fruits rouges et beurre de cacahuètes. Proteins: 15g | Glucides: 53g | Lipides: 26g",
        priceMad: 40,
        calories: 506,
      },
      {
        id: "energy-balls-nutella",
        name: "5 Energy balls Nutella",
        description: "Proteins: 14g | Glucides: 58g | Lipides: 33g",
        priceMad: 40,
        calories: 585,
      },
      {
        id: "energy-balls-peanut-butter",
        name: "5 Energy balls peanut butter",
        description: "Proteins: 25g | Glucides: 44g | Lipides: 36g",
        priceMad: 40,
        calories: 600,
      },
      {
        id: "energy-balls-fruit-rouge",
        name: "5 Energy balls fruit rouge",
        description: "Proteins: 12g | Glucides: 58g | Lipides: 16g",
        priceMad: 40,
        calories: 424,
      },
      {
        id: "energy-balls-cafe",
        name: "5 Energy balls café",
        description: "Proteins: 12g | Glucides: 49g | Lipides: 21g",
        priceMad: 40,
        calories: 433,
      },
      {
        id: "energy-balls-pistache",
        name: "5 Energy balls pistache",
        description: "Proteins: 17g | Glucides: 40g | Lipides: 31g",
        priceMad: 45,
        calories: 507,
      },
    ],
  },
];
