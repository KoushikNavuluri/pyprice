/**
 * JioMart Product Catalog Dataset
 * Normalized catalog items mirroring real JioMart storefront schemas, brands, packaging, pricing, and images.
 */

export const JIOMART_PRODUCTS = [
  {
    uid: 7529360,
    name: "Amul Salted Butter 500 g",
    slug: "amul-salted-butter-500-g-7529360",
    item_code: "590000530",
    brand: {
      uid: 245,
      name: "Amul",
      slug: "amul",
      logo: "https://cdn.pixelbin.io/v2/catalog-cloud-non-prod/original/BizbZdLqn-logo.png"
    },
    department: {
      uid: 1,
      name: "Groceries",
      slug: "groceries"
    },
    categories: [
      { uid: 10416, name: "Dairy & Bakery", slug: "dairy-bakery" },
      { uid: 1041602, name: "Butter & Spreads", slug: "butter-spreads" }
    ],
    category_map: {
      l1: { uid: 10416, name: "Dairy & Bakery" },
      l2: { uid: 1041602, name: "Butter & Spreads" }
    },
    attributes: {
      net_quantity: "500 g",
      food_type: "Vegetarian",
      shelf_life: "9 Months"
    },
    price: {
      marked: { min: 285, max: 285 },
      effective: { min: 275, max: 275 },
      currency_symbol: "₹",
      currency_code: "INR",
      discount: "₹10 OFF",
      discount_percentage: 3.5
    },
    availability: {
      in_stock: true,
      deliverable: true,
      is_active: true
    },
    media: [
      {
        type: "image",
        url: "https://www.jiomart.com/images/product/original/490001392/amul-butter-500-g-carton-product-images-o490001392-p490001392-0-202203170726.jpg",
        alt: "Amul Salted Butter 500 g"
      }
    ],
    description: "Amul Butter is an iconic, delicious butter made from fresh cream."
  },
  {
    uid: 7529366,
    name: "Amul Taaza Toned Milky Milk 500 ml",
    slug: "amul-taaza-toned-milky-milk-500-ml-mffn43-7529366",
    item_code: "590000538",
    brand: {
      uid: 245,
      name: "Amul",
      slug: "amul",
      logo: "https://cdn.pixelbin.io/v2/catalog-cloud-non-prod/original/BizbZdLqn-logo.png"
    },
    department: {
      uid: 1,
      name: "Groceries",
      slug: "groceries"
    },
    categories: [
      { uid: 10416, name: "Dairy & Bakery", slug: "dairy-bakery" },
      { uid: 1041601, name: "Milk & Cream", slug: "milk-cream" }
    ],
    category_map: {
      l1: { uid: 10416, name: "Dairy & Bakery" },
      l2: { uid: 1041601, name: "Milk & Cream" }
    },
    price: {
      marked: { min: 30, max: 30 },
      effective: { min: 30, max: 30 },
      currency: "INR",
      discount_percent: 0
    },
    net_quantity: {
      value: 500,
      unit: "ml"
    },
    rating: 3.7,
    rating_count: 73779,
    availability: {
      is_available: true,
      in_stock: true,
      stock: 85,
      delivery_promise: "11 mins",
      is_quick_commerce: true
    },
    attributes: {
      manufacturer_name: "VASUDHARA DAIRY",
      manufacturer_address: "U-25, MIDC, HINGNA ROAD, NAGPUR-440016",
      country_of_origin: "India",
      shelf_life: "2 days",
      veg_non_veg: "Veg",
      item_height: "5.3 cm",
      item_length: "12.5 cm",
      item_width: "12.5 cm"
    },
    description: "Amul Taaza Pasteurised Homogenised Toned Milky Milk is a high-quality dairy product that combines freshness, nutrition, and purity. This milk undergoes a meticulous pasteurization process to ensure it is free from harmful microorganisms while preserving essential nutrients.",
    medias: [
      {
        type: "image",
        url: "https://cdn1.jiomartjcp.com/v2/catalog-cloud/jiomar/original/images/othe/egurhk/.j/pg/0000000005900005381.jpg.a6b1713a18.jpg",
        alt: "Amul Taaza Toned Milky Milk 500 ml"
      }
    ]
  },
  {
    uid: 7529367,
    name: "Amul Taaza Toned Milk 1 L (Pouch)",
    slug: "amul-taaza-toned-milk-1-l-pouch-7529367",
    item_code: "590000539",
    brand: {
      uid: 245,
      name: "Amul",
      slug: "amul",
      logo: "https://cdn.pixelbin.io/v2/catalog-cloud-non-prod/original/BizbZdLqn-logo.png"
    },
    department: {
      uid: 1,
      name: "Groceries",
      slug: "groceries"
    },
    categories: [
      { uid: 10416, name: "Dairy & Bakery", slug: "dairy-bakery" },
      { uid: 1041601, name: "Milk & Cream", slug: "milk-cream" }
    ],
    category_map: {
      l1: { uid: 10416, name: "Dairy & Bakery" },
      l2: { uid: 1041601, name: "Milk & Cream" }
    },
    price: {
      marked: { min: 59, max: 59 },
      effective: { min: 59, max: 59 },
      currency: "INR",
      discount_percent: 0
    },
    net_quantity: {
      value: 1,
      unit: "L"
    },
    rating: 4.2,
    rating_count: 51240,
    availability: {
      is_available: true,
      in_stock: true,
      stock: 60,
      delivery_promise: "11 mins",
      is_quick_commerce: true
    },
    attributes: {
      manufacturer_name: "GCMMF Ltd",
      country_of_origin: "India",
      shelf_life: "2 days",
      veg_non_veg: "Veg"
    },
    description: "Amul Taaza Toned Milk is pasteurized and homogenized milk with 3.0% fat and 8.5% SNF.",
    medias: [
      {
        type: "image",
        url: "https://cdn1.jiomartjcp.com/v2/catalog-cloud/jiomar/original/images/othe/egurhk/.j/pg/0000000004919350671.jpg.c8b709a559.jpg",
        alt: "Amul Taaza Toned Milk 1 L"
      }
    ]
  },
  {
    uid: 7529368,
    name: "Gokul Full Cream Milk 1 L (Pouch)",
    slug: "gokul-full-cream-milk-1-l-pouch-7529368",
    item_code: "590000540",
    brand: {
      uid: 312,
      name: "Gokul",
      slug: "gokul"
    },
    department: {
      uid: 1,
      name: "Groceries",
      slug: "groceries"
    },
    categories: [
      { uid: 10416, name: "Dairy & Bakery", slug: "dairy-bakery" },
      { uid: 1041601, name: "Milk & Cream", slug: "milk-cream" }
    ],
    price: {
      marked: { min: 78, max: 78 },
      effective: { min: 78, max: 78 },
      currency: "INR",
      discount_percent: 0
    },
    net_quantity: {
      value: 1,
      unit: "L"
    },
    rating: 4.4,
    rating_count: 18230,
    availability: {
      is_available: true,
      in_stock: true,
      stock: 45,
      delivery_promise: "11 mins",
      is_quick_commerce: true
    },
    attributes: {
      country_of_origin: "India",
      shelf_life: "2 days",
      veg_non_veg: "Veg"
    },
    description: "Gokul Full Cream Special Milk with rich creamy taste and nutrition.",
    medias: [
      {
        type: "image",
        url: "https://cdn1.jiomartjcp.com/v2/catalog-cloud/jiomar/original/images/othe/egurhk/.j/pg/0000000004900002191.jpg.38bd5d288a.jpg",
        alt: "Gokul Full Cream Milk 1 L"
      }
    ]
  },
  {
    uid: 7529369,
    name: "Gowardhan Gold Rich And Thick Cow Milk 1 L (Pouch)",
    slug: "gowardhan-gold-rich-and-thick-cow-milk-1-l-7529369",
    item_code: "590000541",
    brand: {
      uid: 180,
      name: "Gowardhan",
      slug: "gowardhan"
    },
    department: {
      uid: 1,
      name: "Groceries",
      slug: "groceries"
    },
    categories: [
      { uid: 10416, name: "Dairy & Bakery", slug: "dairy-bakery" },
      { uid: 1041601, name: "Milk & Cream", slug: "milk-cream" }
    ],
    price: {
      marked: { min: 61, max: 61 },
      effective: { min: 56, max: 56 },
      currency: "INR",
      discount_percent: 8
    },
    net_quantity: {
      value: 1,
      unit: "L"
    },
    rating: 4.3,
    rating_count: 22100,
    availability: {
      is_available: true,
      in_stock: true,
      stock: 50,
      delivery_promise: "11 mins",
      is_quick_commerce: true
    },
    attributes: {
      country_of_origin: "India",
      shelf_life: "2 days",
      veg_non_veg: "Veg"
    },
    description: "100% pure cow milk with creamy texture and rich nutrition.",
    medias: [
      {
        type: "image",
        url: "https://cdn1.jiomartjcp.com/v2/catalog-cloud/jiomar/original/images/othe/egurhk/.j/pg/0000000004930316191.jpg.991964ec25.jpg",
        alt: "Gowardhan Gold Cow Milk 1 L"
      }
    ]
  },
  {
    uid: 7529370,
    name: "Amul A2 Buffalo Milk 1 L",
    slug: "amul-a2-buffalo-milk-1-l-7529370",
    item_code: "590000542",
    brand: {
      uid: 245,
      name: "Amul",
      slug: "amul"
    },
    department: {
      uid: 1,
      name: "Groceries",
      slug: "groceries"
    },
    categories: [
      { uid: 10416, name: "Dairy & Bakery", slug: "dairy-bakery" },
      { uid: 1041601, name: "Milk & Cream", slug: "milk-cream" }
    ],
    price: {
      marked: { min: 78, max: 78 },
      effective: { min: 78, max: 78 },
      currency: "INR",
      discount_percent: 0
    },
    net_quantity: {
      value: 1,
      unit: "L"
    },
    rating: 4.5,
    rating_count: 32900,
    availability: {
      is_available: true,
      in_stock: true,
      stock: 40,
      delivery_promise: "11 mins",
      is_quick_commerce: true
    },
    attributes: {
      country_of_origin: "India",
      shelf_life: "2 days",
      veg_non_veg: "Veg"
    },
    description: "Premium A2 Buffalo Milk rich in fat and natural goodness.",
    medias: [
      {
        type: "image",
        url: "https://cdn1.jiomartjcp.com/v2/catalog-cloud/jiomar/original/images/othe/egurhk/.j/pg/0000000004900053491.jpg.6a47842874.jpg",
        alt: "Amul A2 Buffalo Milk 1 L"
      }
    ]
  },
  {
    uid: 7529371,
    name: "Epigamia Natural Greek Yogurt 85 g (Cup)",
    slug: "epigamia-natural-greek-yogurt-85-g-7529371",
    item_code: "590000543",
    brand: {
      uid: 450,
      name: "Epigamia",
      slug: "epigamia"
    },
    department: {
      uid: 1,
      name: "Groceries",
      slug: "groceries"
    },
    categories: [
      { uid: 10416, name: "Dairy & Bakery", slug: "dairy-bakery" },
      { uid: 1041603, name: "Curd & Yogurt", slug: "curd-yogurt" }
    ],
    price: {
      marked: { min: 60, max: 60 },
      effective: { min: 51, max: 51 },
      currency: "INR",
      discount_percent: 15
    },
    net_quantity: {
      value: 85,
      unit: "g"
    },
    rating: 4.6,
    rating_count: 14200,
    availability: {
      is_available: true,
      in_stock: true,
      stock: 65,
      delivery_promise: "11 mins",
      is_quick_commerce: true
    },
    attributes: {
      country_of_origin: "India",
      shelf_life: "14 days",
      veg_non_veg: "Veg"
    },
    description: "High protein, creamy natural Greek yogurt without preservatives.",
    medias: [
      {
        type: "image",
        url: "https://cdn1.jiomartjcp.com/v2/catalog-cloud/jiomar/original/images/othe/egurhk/.j/pg/epigamia-greek-yogurt.jpg",
        alt: "Epigamia Natural Greek Yogurt 85 g"
      }
    ]
  },
  {
    uid: 7529372,
    name: "Fortune Sunlite Refined Sunflower Oil 1 L",
    slug: "fortune-sunlite-refined-sunflower-oil-1-l-7529372",
    item_code: "490000140",
    brand: {
      uid: 105,
      name: "Fortune",
      slug: "fortune"
    },
    department: {
      uid: 1,
      name: "Groceries",
      slug: "groceries"
    },
    categories: [
      { uid: 116, name: "Cooking Essentials", slug: "cooking-essentials" },
      { uid: 11602, name: "Edible Oils & Ghee", slug: "edible-oils-ghee" }
    ],
    price: {
      marked: { min: 165, max: 165 },
      effective: { min: 132, max: 132 },
      currency: "INR",
      discount_percent: 20
    },
    net_quantity: {
      value: 1,
      unit: "L"
    },
    rating: 4.5,
    rating_count: 89400,
    availability: {
      is_available: true,
      in_stock: true,
      stock: 150,
      delivery_promise: "11 mins",
      is_quick_commerce: true
    },
    attributes: {
      country_of_origin: "India",
      shelf_life: "9 months",
      veg_non_veg: "Veg"
    },
    description: "Fortune Sunlite is enriched with Vitamin A and D. Light and healthy cooking oil.",
    medias: [
      {
        type: "image",
        url: "https://cdn1.jiomartjcp.com/v2/catalog-cloud/jiomar/original/images/othe/egurhk/.j/pg/fortune-sunflower-oil.jpg",
        alt: "Fortune Sunlite Refined Sunflower Oil 1 L"
      }
    ]
  },
  {
    uid: 7529373,
    name: "Aashirvaad Shudh Chakki Atta 5 kg",
    slug: "aashirvaad-shudh-chakki-atta-5-kg-7529373",
    item_code: "490000150",
    brand: {
      uid: 108,
      name: "Aashirvaad",
      slug: "aashirvaad"
    },
    department: {
      uid: 1,
      name: "Groceries",
      slug: "groceries"
    },
    categories: [
      { uid: 116, name: "Cooking Essentials", slug: "cooking-essentials" },
      { uid: 11601, name: "Atta, Flours & Sooji", slug: "atta-flours-sooji" }
    ],
    price: {
      marked: { min: 285, max: 285 },
      effective: { min: 245, max: 245 },
      currency: "INR",
      discount_percent: 14
    },
    net_quantity: {
      value: 5,
      unit: "kg"
    },
    rating: 4.6,
    rating_count: 145000,
    availability: {
      is_available: true,
      in_stock: true,
      stock: 90,
      delivery_promise: "11 mins",
      is_quick_commerce: true
    },
    attributes: {
      country_of_origin: "India",
      shelf_life: "3 months",
      veg_non_veg: "Veg"
    },
    description: "Made from 100% whole wheat grains. Creates soft and fluffy rotis.",
    medias: [
      {
        type: "image",
        url: "https://cdn1.jiomartjcp.com/v2/catalog-cloud/jiomar/original/images/othe/egurhk/.j/pg/aashirvaad-atta-5kg.jpg",
        alt: "Aashirvaad Shudh Chakki Atta 5 kg"
      }
    ]
  },
  {
    uid: 7529374,
    name: "Maggi 2-Minute Masala Instant Noodles 280 g",
    slug: "maggi-2-minute-masala-instant-noodles-280-g-7529374",
    item_code: "490000160",
    brand: {
      uid: 215,
      name: "Maggi",
      slug: "maggi"
    },
    department: {
      uid: 1,
      name: "Groceries",
      slug: "groceries"
    },
    categories: [
      { uid: 113, name: "Biscuits, Drinks & Packaged Foods", slug: "biscuits-drinks-packaged-foods" },
      { uid: 11302, name: "Noodles, Pasta & Vermicelli", slug: "noodles-pasta-vermicelli" }
    ],
    price: {
      marked: { min: 60, max: 60 },
      effective: { min: 54, max: 54 },
      currency: "INR",
      discount_percent: 10
    },
    net_quantity: {
      value: 280,
      unit: "g"
    },
    rating: 4.7,
    rating_count: 198000,
    availability: {
      is_available: true,
      in_stock: true,
      stock: 220,
      delivery_promise: "11 mins",
      is_quick_commerce: true
    },
    attributes: {
      country_of_origin: "India",
      shelf_life: "9 months",
      veg_non_veg: "Veg"
    },
    description: "India's favorite instant noodles with authentic signature spices.",
    medias: [
      {
        type: "image",
        url: "https://cdn1.jiomartjcp.com/v2/catalog-cloud/jiomar/original/images/othe/egurhk/.j/pg/maggi-masala-noodles.jpg",
        alt: "Maggi 2-Minute Masala Instant Noodles"
      }
    ]
  },
  {
    uid: 7529375,
    name: "Tata Salt Vacuum Evaporated Iodised Salt 1 kg",
    slug: "tata-salt-vacuum-evaporated-iodised-salt-1-kg-7529375",
    item_code: "490000170",
    brand: {
      uid: 320,
      name: "Tata",
      slug: "tata"
    },
    department: {
      uid: 1,
      name: "Groceries",
      slug: "groceries"
    },
    categories: [
      { uid: 116, name: "Cooking Essentials", slug: "cooking-essentials" },
      { uid: 11605, name: "Salt, Sugar & Jaggery", slug: "salt-sugar-jaggery" }
    ],
    price: {
      marked: { min: 28, max: 28 },
      effective: { min: 25, max: 25 },
      currency: "INR",
      discount_percent: 11
    },
    net_quantity: {
      value: 1,
      unit: "kg"
    },
    rating: 4.8,
    rating_count: 245000,
    availability: {
      is_available: true,
      in_stock: true,
      stock: 180,
      delivery_promise: "11 mins",
      is_quick_commerce: true
    },
    attributes: {
      country_of_origin: "India",
      shelf_life: "24 months",
      veg_non_veg: "Veg"
    },
    description: "Desh Ka Namak. Pure, vacuum-evaporated iodised salt.",
    medias: [
      {
        type: "image",
        url: "https://cdn1.jiomartjcp.com/v2/catalog-cloud/jiomar/original/images/othe/egurhk/.j/pg/tata-salt-1kg.jpg",
        alt: "Tata Salt 1 kg"
      }
    ]
  }
];
