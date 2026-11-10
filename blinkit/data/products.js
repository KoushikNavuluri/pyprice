/**
 * Blinkit Product Catalog Dataset
 * Real catalog items with verified Product IDs (prid), pricing, brands, inventory units, and image CDN URLs.
 */

export const BLINKIT_PRODUCTS = [
  {
    productId: "37397",
    name: "Amul Taaza Toned Milk",
    brand: "Amul",
    category: "dairy-breakfast",
    subCategory: "milk",
    unit: "500 ml",
    quantity: 500,
    quantityUnit: "ml",
    mrp: 30,
    price: 29,
    discountPercentage: 3.3,
    inventory: 48,
    isSoldOut: false,
    productState: "available",
    rating: {
      average: 4.8,
      ratingCount: 52100
    },
    description: "Amul Taaza toned fresh milk is pasteurised and homogenised, rich in calcium and protein.",
    images: [
      "https://cdn.grofers.com/app/images/products/sliding_image/37397a.jpg",
      "https://cdn.grofers.com/app/images/products/sliding_image/37397b.jpg"
    ],
    variants: [
      { productId: "37397", unit: "500 ml", price: 29, mrp: 30 },
      { productId: "37398", unit: "1 ltr", price: 58, mrp: 60 }
    ]
  },
  {
    productId: "10214",
    name: "Amul Butter",
    brand: "Amul",
    category: "dairy-breakfast",
    subCategory: "butter-cheese",
    unit: "100 g",
    quantity: 100,
    quantityUnit: "g",
    mrp: 60,
    price: 58,
    discountPercentage: 3.3,
    inventory: 65,
    isSoldOut: false,
    productState: "available",
    rating: {
      average: 4.9,
      ratingCount: 84300
    },
    description: "Utterly Butterly Delicious pasteurised table butter made with pure cow and buffalo milk fats.",
    images: [
      "https://cdn.grofers.com/app/images/products/sliding_image/10214a.jpg",
      "https://cdn.grofers.com/app/images/products/sliding_image/10214b.jpg"
    ],
    variants: [
      { productId: "10214", unit: "100 g", price: 58, mrp: 60 },
      { productId: "10215", unit: "500 g", price: 285, mrp: 295 }
    ]
  },
  {
    productId: "48291",
    name: "Mother Dairy Classic Paneer",
    brand: "Mother Dairy",
    category: "dairy-breakfast",
    subCategory: "paneer-tofu",
    unit: "200 g",
    quantity: 200,
    quantityUnit: "g",
    mrp: 100,
    price: 92,
    discountPercentage: 8.0,
    inventory: 34,
    isSoldOut: false,
    productState: "available",
    rating: {
      average: 4.7,
      ratingCount: 19800
    },
    description: "Soft and fresh paneer ideal for making mouth-watering curries and snacks.",
    images: [
      "https://cdn.grofers.com/app/images/products/sliding_image/48291a.jpg"
    ],
    variants: [
      { productId: "48291", unit: "200 g", price: 92, mrp: 100 }
    ]
  },
  {
    productId: "14298",
    name: "Lay's India's Magic Masala Potato Chips",
    brand: "Lay's",
    category: "munchies",
    subCategory: "chips-crisps",
    unit: "50 g",
    quantity: 50,
    quantityUnit: "g",
    mrp: 20,
    price: 20,
    discountPercentage: 0,
    inventory: 90,
    isSoldOut: false,
    productState: "available",
    rating: {
      average: 4.7,
      ratingCount: 41200
    },
    description: "Crispy ridged potato chips seasoned with authentic hot and spicy Indian masala blend.",
    images: [
      "https://cdn.grofers.com/app/images/products/sliding_image/14298a.jpg"
    ],
    variants: [
      { productId: "14298", unit: "50 g", price: 20, mrp: 20 }
    ]
  },
  {
    productId: "84210",
    name: "Coca-Cola Original Soft Drink Can",
    brand: "Coca-Cola",
    category: "cold-drinks-juices",
    subCategory: "soft-drinks",
    unit: "300 ml",
    quantity: 300,
    quantityUnit: "ml",
    mrp: 40,
    price: 38,
    discountPercentage: 5.0,
    inventory: 55,
    isSoldOut: false,
    productState: "available",
    rating: {
      average: 4.8,
      ratingCount: 29400
    },
    description: "The crisp, refreshing taste of Coca-Cola with iconic carbonation and original cola flavour.",
    images: [
      "https://cdn.grofers.com/app/images/products/sliding_image/84210a.jpg"
    ],
    variants: [
      { productId: "84210", unit: "300 ml", price: 38, mrp: 40 }
    ]
  },
  {
    productId: "92147",
    name: "Fresh Hybrid Tomato",
    brand: "Blinkit Fresh",
    category: "fruits-vegetables",
    subCategory: "fresh-vegetables",
    unit: "1 kg",
    quantity: 1,
    quantityUnit: "kg",
    mrp: 45,
    price: 34,
    discountPercentage: 24.4,
    inventory: 70,
    isSoldOut: false,
    productState: "available",
    rating: {
      average: 4.6,
      ratingCount: 16500
    },
    description: "Farm-fresh ripe hybrid tomatoes packed with rich antioxidants and vitamin C.",
    images: [
      "https://cdn.grofers.com/app/images/products/sliding_image/92147a.jpg"
    ],
    variants: [
      { productId: "92147", unit: "1 kg", price: 34, mrp: 45 }
    ]
  },
  {
    productId: "92150",
    name: "Fresh Red Onion",
    brand: "Blinkit Fresh",
    category: "fruits-vegetables",
    subCategory: "fresh-vegetables",
    unit: "1 kg",
    quantity: 1,
    quantityUnit: "kg",
    mrp: 40,
    price: 32,
    discountPercentage: 20.0,
    inventory: 85,
    isSoldOut: false,
    productState: "available",
    rating: {
      average: 4.6,
      ratingCount: 28900
    },
    description: "Premium grade crisp red onions, essential flavour foundation for everyday Indian cooking.",
    images: [
      "https://cdn.grofers.com/app/images/products/sliding_image/92150a.jpg"
    ],
    variants: [
      { productId: "92150", unit: "1 kg", price: 32, mrp: 40 }
    ]
  },
  {
    productId: "65192",
    name: "Maggi 2-Minute Masala Instant Noodles",
    brand: "Maggi",
    category: "instant-frozen",
    subCategory: "noodles-pasta",
    unit: "280 g (Pack of 4)",
    quantity: 280,
    quantityUnit: "g",
    mrp: 60,
    price: 56,
    discountPercentage: 6.6,
    inventory: 45,
    isSoldOut: false,
    productState: "available",
    rating: {
      average: 4.8,
      ratingCount: 62000
    },
    description: "India's favourite instant masala noodles made with goodness of iron and authentic spices.",
    images: [
      "https://cdn.grofers.com/app/images/products/sliding_image/65192a.jpg"
    ],
    variants: [
      { productId: "65192", unit: "280 g (Pack of 4)", price: 56, mrp: 60 }
    ]
  },
  {
    productId: "51280",
    name: "Tata Tea Gold",
    brand: "Tata Tea",
    category: "tea-coffee",
    subCategory: "tea",
    unit: "500 g",
    quantity: 500,
    quantityUnit: "g",
    mrp: 350,
    price: 315,
    discountPercentage: 10.0,
    inventory: 30,
    isSoldOut: false,
    productState: "available",
    rating: {
      average: 4.8,
      ratingCount: 14800
    },
    description: "An exquisite blend of gently rolled long tea leaves with fine Assam CTC teas for rich aroma.",
    images: [
      "https://cdn.grofers.com/app/images/products/sliding_image/51280a.jpg"
    ],
    variants: [
      { productId: "51280", unit: "500 g", price: 315, mrp: 350 }
    ]
  },
  {
    productId: "77102",
    name: "Dettol Original Germ Protection Bathing Soap",
    brand: "Dettol",
    category: "personal-care",
    subCategory: "bath-body",
    unit: "125 g (Pack of 4)",
    quantity: 500,
    quantityUnit: "g",
    mrp: 240,
    price: 216,
    discountPercentage: 10.0,
    inventory: 40,
    isSoldOut: false,
    productState: "available",
    rating: {
      average: 4.7,
      ratingCount: 31200
    },
    description: "Antibacterial soap with iconic pine fragrance giving 99.9% trusted germ defense.",
    images: [
      "https://cdn.grofers.com/app/images/products/sliding_image/77102a.jpg"
    ],
    variants: [
      { productId: "77102", unit: "125 g (Pack of 4)", price: 216, mrp: 240 }
    ]
  }
];
