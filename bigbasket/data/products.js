/**
 * BigBasket (bbnow) Product Catalog Dataset
 * Normalized catalog items mirroring real BigBasket Product schema, brands, units, pricing, and images.
 */

export const BIGBASKET_PRODUCTS = [
  {
    id: "10000148",
    desc: "Fresho Onion",
    brand: "Fresho",
    category: "fruits-vegetables",
    subCategory: "fresh-vegetables",
    w: "1 kg",
    quantity: 1,
    quantityUnit: "kg",
    pricing: {
      mrp: 45,
      sp: 34,
      discount: { type: "P", value: 24 }
    },
    availability: {
      is_available: true,
      short_eta: "10 mins",
      stock: 120
    },
    rating_info: {
      avg_rating: 4.4,
      rating_count: 85210
    },
    description: "Fresh, pungent onions sourced directly from farmers. Essential for curries, salads, and gravies.",
    images: [
      "https://www.bigbasket.com/media/uploads/p/l/10000148_30-fresho-onion.jpg"
    ],
    variants: [
      { id: "10000148", w: "1 kg", sp: 34, mrp: 45 },
      { id: "10000149", w: "2 kg", sp: 65, mrp: 90 },
      { id: "10000150", w: "5 kg", sp: 155, mrp: 220 }
    ]
  },
  {
    id: "10000067",
    desc: "Fresho Tomato - Hybrid",
    brand: "Fresho",
    category: "fruits-vegetables",
    subCategory: "fresh-vegetables",
    w: "500 g",
    quantity: 500,
    quantityUnit: "g",
    pricing: {
      mrp: 24,
      sp: 18,
      discount: { type: "P", value: 25 }
    },
    availability: {
      is_available: true,
      short_eta: "10 mins",
      stock: 95
    },
    rating_info: {
      avg_rating: 4.3,
      rating_count: 63100
    },
    description: "Juicy, firm hybrid tomatoes ideal for everyday Indian cooking, soups, and curries.",
    images: [
      "https://www.bigbasket.com/media/uploads/p/l/10000067_23-fresho-tomato-hybrid.jpg"
    ],
    variants: [
      { id: "10000067", w: "500 g", sp: 18, mrp: 24 },
      { id: "10000068", w: "1 kg", sp: 34, mrp: 48 }
    ]
  },
  {
    id: "10000159",
    desc: "Fresho Potato",
    brand: "Fresho",
    category: "fruits-vegetables",
    subCategory: "fresh-vegetables",
    w: "1 kg",
    quantity: 1,
    quantityUnit: "kg",
    pricing: {
      mrp: 40,
      sp: 32,
      discount: { type: "P", value: 20 }
    },
    availability: {
      is_available: true,
      short_eta: "10 mins",
      stock: 140
    },
    rating_info: {
      avg_rating: 4.5,
      rating_count: 72000
    },
    description: "Farm fresh potatoes loaded with potassium and dietary fibre. Perfect for boiling, roasting, or frying.",
    images: [
      "https://www.bigbasket.com/media/uploads/p/l/10000159_26-fresho-potato.jpg"
    ],
    variants: [
      { id: "10000159", w: "1 kg", sp: 32, mrp: 40 },
      { id: "10000160", w: "2 kg", sp: 60, mrp: 80 }
    ]
  },
  {
    id: "10000031",
    desc: "Fresho Banana - Robusta",
    brand: "Fresho",
    category: "fruits-vegetables",
    subCategory: "fresh-fruits",
    w: "1 kg (Approx 4 - 6 pcs)",
    quantity: 1,
    quantityUnit: "kg",
    pricing: {
      mrp: 52,
      sp: 42,
      discount: { type: "P", value: 19 }
    },
    availability: {
      is_available: true,
      short_eta: "10 mins",
      stock: 80
    },
    rating_info: {
      avg_rating: 4.5,
      rating_count: 48200
    },
    description: "Sweet, potassium-rich Robusta bananas ripened naturally without carbide.",
    images: [
      "https://www.bigbasket.com/media/uploads/p/l/10000031_21-fresho-banana-robusta.jpg"
    ],
    variants: [
      { id: "10000031", w: "1 kg", sp: 42, mrp: 52 }
    ]
  },
  {
    id: "40044731",
    desc: "Amul Taaza Homogenised Toned Milk",
    brand: "Amul",
    category: "dairy-bakery",
    subCategory: "milk",
    w: "1 L (Tetra Pak)",
    quantity: 1,
    quantityUnit: "L",
    pricing: {
      mrp: 75,
      sp: 74,
      discount: { type: "P", value: 1 }
    },
    availability: {
      is_available: true,
      short_eta: "10 mins",
      stock: 65
    },
    rating_info: {
      avg_rating: 4.8,
      rating_count: 51200
    },
    description: "Amul Taaza homogenised toned milk in UHT packaging. No boiling required, zero preservatives.",
    images: [
      "https://www.bigbasket.com/media/uploads/p/l/40044731_14-amul-taaza-homogenised-toned-milk.jpg"
    ],
    variants: [
      { id: "40044731", w: "1 L", sp: 74, mrp: 75 }
    ]
  },
  {
    id: "1214412",
    desc: "Nandini Pasteurised Toned Milk",
    brand: "Nandini",
    category: "dairy-bakery",
    subCategory: "milk",
    w: "500 ml (Pouch)",
    quantity: 500,
    quantityUnit: "ml",
    pricing: {
      mrp: 24,
      sp: 24,
      discount: { type: "P", value: 0 }
    },
    availability: {
      is_available: true,
      short_eta: "10 mins",
      stock: 110
    },
    rating_info: {
      avg_rating: 4.8,
      rating_count: 98400
    },
    description: "Fresh daily Nandini toned milk containing 3.0% milk fat and 8.5% milk SNF.",
    images: [
      "https://www.bigbasket.com/media/uploads/p/l/1214412_2-nandini-pasteurised-toned-milk.jpg"
    ],
    variants: [
      { id: "1214412", w: "500 ml", sp: 24, mrp: 24 }
    ]
  },
  {
    id: "10000001",
    desc: "Amul Butter - Pasteurised",
    brand: "Amul",
    category: "dairy-bakery",
    subCategory: "butter-cheese",
    w: "100 g",
    quantity: 100,
    quantityUnit: "g",
    pricing: {
      mrp: 60,
      sp: 58,
      discount: { type: "P", value: 3 }
    },
    availability: {
      is_available: true,
      short_eta: "10 mins",
      stock: 85
    },
    rating_info: {
      avg_rating: 4.9,
      rating_count: 95400
    },
    description: "Utterly Butterly Delicious table butter made with pure cow and buffalo milk fats.",
    images: [
      "https://www.bigbasket.com/media/uploads/p/l/10000001_18-amul-butter-pasteurised.jpg"
    ],
    variants: [
      { id: "10000001", w: "100 g", sp: 58, mrp: 60 },
      { id: "10000002", w: "500 g", sp: 285, mrp: 290 }
    ]
  },
  {
    id: "40005391",
    desc: "Epigamia Natural Greek Yogurt",
    brand: "Epigamia",
    category: "dairy-bakery",
    subCategory: "curd-yogurt",
    w: "85 g",
    quantity: 85,
    quantityUnit: "g",
    pricing: {
      mrp: 50,
      sp: 45,
      discount: { type: "P", value: 10 }
    },
    availability: {
      is_available: true,
      short_eta: "10 mins",
      stock: 40
    },
    rating_info: {
      avg_rating: 4.6,
      rating_count: 14200
    },
    description: "High-protein strained Greek yogurt with zero preservatives and no added sugar.",
    images: [
      "https://www.bigbasket.com/media/uploads/p/l/40005391_8-epigamia-natural-greek-yogurt.jpg"
    ],
    variants: [
      { id: "40005391", w: "85 g", sp: 45, mrp: 50 }
    ]
  },
  {
    id: "126906",
    desc: "Aashirvaad Superior MP Sharbati Atta",
    brand: "Aashirvaad",
    category: "staples",
    subCategory: "atta-flours",
    w: "5 kg",
    quantity: 5,
    quantityUnit: "kg",
    pricing: {
      mrp: 320,
      sp: 289,
      discount: { type: "P", value: 10 }
    },
    availability: {
      is_available: true,
      short_eta: "10 mins",
      stock: 55
    },
    rating_info: {
      avg_rating: 4.7,
      rating_count: 82400
    },
    description: "100% pure whole wheat flour processed with 40-step quality checks for softer rotis.",
    images: [
      "https://www.bigbasket.com/media/uploads/p/l/126906_8-aashirvaad-superior-mp-sharbati-atta.jpg"
    ],
    variants: [
      { id: "126906", w: "5 kg", sp: 289, mrp: 320 },
      { id: "126907", w: "10 kg", sp: 540, mrp: 610 }
    ]
  },
  {
    id: "274145",
    desc: "Fortune Sunlite Refined Sunflower Oil",
    brand: "Fortune",
    category: "staples",
    subCategory: "edible-oils-ghee",
    w: "1 L (Pouch)",
    quantity: 1,
    quantityUnit: "L",
    pricing: {
      mrp: 155,
      sp: 135,
      discount: { type: "P", value: 13 }
    },
    availability: {
      is_available: true,
      short_eta: "10 mins",
      stock: 70
    },
    rating_info: {
      avg_rating: 4.6,
      rating_count: 42100
    },
    description: "Light and healthy refined sunflower oil enriched with Vitamin A & D for cooking.",
    images: [
      "https://www.bigbasket.com/media/uploads/p/l/274145_14-fortune-sunlite-refined-sunflower-oil.jpg"
    ],
    variants: [
      { id: "274145", w: "1 L", sp: 135, mrp: 155 },
      { id: "274146", w: "5 L", sp: 670, mrp: 760 }
    ]
  },
  {
    id: "241600",
    desc: "Tata Salt - Vacuum Evaporated Iodised Salt",
    brand: "Tata",
    category: "staples",
    subCategory: "salt-sugar-jaggery",
    w: "1 kg",
    quantity: 1,
    quantityUnit: "kg",
    pricing: {
      mrp: 28,
      sp: 27,
      discount: { type: "P", value: 4 }
    },
    availability: {
      is_available: true,
      short_eta: "10 mins",
      stock: 150
    },
    rating_info: {
      avg_rating: 4.8,
      rating_count: 110200
    },
    description: "Desh Ka Namak - India's favourite vacuum-evaporated iodised salt.",
    images: [
      "https://www.bigbasket.com/media/uploads/p/l/241600_5-tata-salt-iodised.jpg"
    ],
    variants: [
      { id: "241600", w: "1 kg", sp: 27, mrp: 28 }
    ]
  },
  {
    id: "266109",
    desc: "Maggi 2-Minute Masala Instant Noodles",
    brand: "Maggi",
    category: "snacks-branded-foods",
    subCategory: "noodles-pasta",
    w: "280 g (Pack of 4)",
    quantity: 280,
    quantityUnit: "g",
    pricing: {
      mrp: 56,
      sp: 52,
      discount: { type: "P", value: 7 }
    },
    availability: {
      is_available: true,
      short_eta: "10 mins",
      stock: 90
    },
    rating_info: {
      avg_rating: 4.7,
      rating_count: 94000
    },
    description: "Iconic masala instant noodles made with roast spices and enriched with iron.",
    images: [
      "https://www.bigbasket.com/media/uploads/p/l/266109_15-maggi-2-minute-masala-instant-noodles.jpg"
    ],
    variants: [
      { id: "266109", w: "280 g", sp: 52, mrp: 56 },
      { id: "266110", w: "560 g", sp: 102, mrp: 112 }
    ]
  },
  {
    id: "102873",
    desc: "Britannia Good Day Butter Cookies",
    brand: "Britannia",
    category: "snacks-branded-foods",
    subCategory: "biscuits-cookies",
    w: "200 g",
    quantity: 200,
    quantityUnit: "g",
    pricing: {
      mrp: 45,
      sp: 40,
      discount: { type: "P", value: 11 }
    },
    availability: {
      is_available: true,
      short_eta: "10 mins",
      stock: 75
    },
    rating_info: {
      avg_rating: 4.6,
      rating_count: 53000
    },
    description: "Rich butter cookies with delightful crunchy smile design.",
    images: [
      "https://www.bigbasket.com/media/uploads/p/l/102873_12-britannia-good-day-butter-cookies.jpg"
    ],
    variants: [
      { id: "102873", w: "200 g", sp: 40, mrp: 45 }
    ]
  },
  {
    id: "263889",
    desc: "Tata Tea Gold",
    brand: "Tata Tea",
    category: "beverages",
    subCategory: "tea",
    w: "500 g",
    quantity: 500,
    quantityUnit: "g",
    pricing: {
      mrp: 340,
      sp: 305,
      discount: { type: "P", value: 10 }
    },
    availability: {
      is_available: true,
      short_eta: "10 mins",
      stock: 60
    },
    rating_info: {
      avg_rating: 4.7,
      rating_count: 41200
    },
    description: "Exquisite tea blend of strong CTC tea and gently rolled long tea leaves.",
    images: [
      "https://www.bigbasket.com/media/uploads/p/l/263889_11-tata-tea-gold.jpg"
    ],
    variants: [
      { id: "263889", w: "500 g", sp: 305, mrp: 340 }
    ]
  },
  {
    id: "100412",
    desc: "Thums Up Soft Drink",
    brand: "Thums Up",
    category: "beverages",
    subCategory: "soft-drinks",
    w: "750 ml",
    quantity: 750,
    quantityUnit: "ml",
    pricing: {
      mrp: 40,
      sp: 38,
      discount: { type: "P", value: 5 }
    },
    availability: {
      is_available: true,
      short_eta: "10 mins",
      stock: 85
    },
    rating_info: {
      avg_rating: 4.7,
      rating_count: 67100
    },
    description: "Toofani strong carbonated cola beverage with strong fizz and punch.",
    images: [
      "https://www.bigbasket.com/media/uploads/p/l/100412_10-thums-up-soft-drink.jpg"
    ],
    variants: [
      { id: "100412", w: "750 ml", sp: 38, mrp: 40 }
    ]
  }
];
