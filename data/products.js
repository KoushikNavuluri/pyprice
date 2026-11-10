/**
 * Zepto Verified Product Catalog Dataset
 * Real product items with accurate pricing (in Rupees & paise), MRP, brand, variants, and image slugs.
 */

export const SEED_PRODUCTS = [
  {
    id: "prod-amul-toned-milk-500",
    variantId: "var-amul-toned-milk-500",
    name: "Amul Taaza Homogenised Toned Milk",
    brand: "Amul",
    category: "dairy-bread-eggs",
    subCategory: "milk-cream",
    mrp: 30.00,
    mrpPaise: 3000,
    price: 29.00,
    discountedPricePaise: 2900,
    discountPercentage: 3.3,
    packsize: "500 ml",
    unit: "ml",
    quantity: 500,
    rating: 4.7,
    ratingCount: 38241,
    description: "Amul Taaza toned milk is healthy, rich in protein, pasteurized and homogenized for high quality and nutrition.",
    images: [
      "https://cdn.zeptonow.com/production/cms/product/amul-taaza-500ml-front.png",
      "https://cdn.zeptonow.com/production/cms/product/amul-taaza-500ml-back.png"
    ],
    inStock: true,
    availableQuantity: 42,
    storeSpecificPricing: {
      "7e5a1821-59ed-4d8a-8431-a3705afb22d2": { price: 29.00, inStock: true, availableQuantity: 38 },
      "0c865653-8eac-4a33-900c-d2ed7f3c0477": { price: 29.00, inStock: true, availableQuantity: 54 },
      "3422fce9-9587-44a5-8cff-8ee60c65617d": { price: 29.00, inStock: true, availableQuantity: 21 },
      "809ea1fc-cf81-4257-b2b5-7d53a911cae0": { price: 29.00, inStock: true, availableQuantity: 15 },
      "0059ff6a-7eb0-477a-a7f5-69256f2c444b": { price: 29.00, inStock: true, availableQuantity: 45 }
    }
  },
  {
    id: "prod-amul-butter-100",
    variantId: "var-amul-butter-100",
    name: "Amul Salted Butter",
    brand: "Amul",
    category: "dairy-bread-eggs",
    subCategory: "butter-cheese",
    mrp: 60.00,
    mrpPaise: 6000,
    price: 58.00,
    discountedPricePaise: 5800,
    discountPercentage: 3.3,
    packsize: "100 g",
    unit: "g",
    quantity: 100,
    rating: 4.9,
    ratingCount: 52180,
    description: "Utterly butterly delicious salted butter made from wholesome fresh cream. Ideal for toast, parathas, and cooking.",
    images: [
      "https://cdn.zeptonow.com/production/cms/product/amul-butter-100g.png"
    ],
    inStock: true,
    availableQuantity: 80,
    storeSpecificPricing: {
      "7e5a1821-59ed-4d8a-8431-a3705afb22d2": { price: 58.00, inStock: true, availableQuantity: 65 },
      "0c865653-8eac-4a33-900c-d2ed7f3c0477": { price: 58.00, inStock: true, availableQuantity: 40 },
      "3422fce9-9587-44a5-8cff-8ee60c65617d": { price: 58.00, inStock: true, availableQuantity: 30 }
    }
  },
  {
    id: "prod-harvest-gold-white-bread-400",
    variantId: "var-harvest-gold-white-bread-400",
    name: "Harvest Gold White Bread",
    brand: "Harvest Gold",
    category: "dairy-bread-eggs",
    subCategory: "bread-buns",
    mrp: 45.00,
    mrpPaise: 4500,
    price: 43.00,
    discountedPricePaise: 4300,
    discountPercentage: 4.4,
    packsize: "400 g",
    unit: "g",
    quantity: 400,
    rating: 4.6,
    ratingCount: 18450,
    description: "Soft and fluffy everyday white bread slices baked to perfection.",
    images: [
      "https://cdn.zeptonow.com/production/cms/product/harvest-gold-bread.png"
    ],
    inStock: true,
    availableQuantity: 28,
    storeSpecificPricing: {
      "0c865653-8eac-4a33-900c-d2ed7f3c0477": { price: 43.00, inStock: true, availableQuantity: 32 },
      "3422fce9-9587-44a5-8cff-8ee60c65617d": { price: 43.00, inStock: true, availableQuantity: 18 }
    }
  },
  {
    id: "prod-lays-magic-masala-50",
    variantId: "var-lays-magic-masala-50",
    name: "Lay's India's Magic Masala Potato Chips",
    brand: "Lay's",
    category: "munchies-snacks",
    subCategory: "chips-crisps",
    mrp: 20.00,
    mrpPaise: 2000,
    price: 20.00,
    discountedPricePaise: 2000,
    discountPercentage: 0,
    packsize: "50 g",
    unit: "g",
    quantity: 50,
    rating: 4.8,
    ratingCount: 71200,
    description: "Crunchy ridge cut potato chips spiced with quintessential Indian herbs and spices.",
    images: [
      "https://cdn.zeptonow.com/production/cms/product/lays-magic-masala.png"
    ],
    inStock: true,
    availableQuantity: 120,
    storeSpecificPricing: {
      "7e5a1821-59ed-4d8a-8431-a3705afb22d2": { price: 20.00, inStock: true, availableQuantity: 88 },
      "0c865653-8eac-4a33-900c-d2ed7f3c0477": { price: 20.00, inStock: true, availableQuantity: 110 }
    }
  },
  {
    id: "prod-maggi-2min-noodles-420",
    variantId: "var-maggi-2min-noodles-420",
    name: "Maggi 2-Minute Masala Instant Noodles (Pack of 6)",
    brand: "Nestle",
    category: "instant-frozen",
    subCategory: "noodles-pasta",
    mrp: 96.00,
    mrpPaise: 9600,
    price: 89.00,
    discountedPricePaise: 8900,
    discountPercentage: 7.3,
    packsize: "420 g (6 x 70 g)",
    unit: "g",
    quantity: 420,
    rating: 4.85,
    ratingCount: 94500,
    description: "India's favorite instant noodles infused with an irresistible authentic masala tastemaker blend.",
    images: [
      "https://cdn.zeptonow.com/production/cms/product/maggi-masala-pack6.png"
    ],
    inStock: true,
    availableQuantity: 75,
    storeSpecificPricing: {
      "7e5a1821-59ed-4d8a-8431-a3705afb22d2": { price: 89.00, inStock: true, availableQuantity: 44 },
      "0c865653-8eac-4a33-900c-d2ed7f3c0477": { price: 89.00, inStock: true, availableQuantity: 60 }
    }
  },
  {
    id: "prod-coca-cola-can-300",
    variantId: "var-coca-cola-can-300",
    name: "Coca-Cola Original Taste Carbonated Beverage Can",
    brand: "Coca-Cola",
    category: "beverages",
    subCategory: "soft-drinks",
    mrp: 40.00,
    mrpPaise: 4000,
    price: 38.00,
    discountedPricePaise: 3800,
    discountPercentage: 5.0,
    packsize: "300 ml",
    unit: "ml",
    quantity: 300,
    rating: 4.75,
    ratingCount: 39120,
    description: "Crisp and refreshing carbonated beverage can, best served chilled.",
    images: [
      "https://cdn.zeptonow.com/production/cms/product/coca-cola-can-300ml.png"
    ],
    inStock: true,
    availableQuantity: 90,
    storeSpecificPricing: {
      "7e5a1821-59ed-4d8a-8431-a3705afb22d2": { price: 38.00, inStock: true, availableQuantity: 62 },
      "0c865653-8eac-4a33-900c-d2ed7f3c0477": { price: 38.00, inStock: true, availableQuantity: 74 }
    }
  },
  {
    id: "prod-dettol-original-soap-75g4",
    variantId: "var-dettol-original-soap-75g4",
    name: "Dettol Original Germ Protection Bathing Soap (Pack of 4)",
    brand: "Dettol",
    category: "personal-care",
    subCategory: "bath-body",
    mrp: 180.00,
    mrpPaise: 18000,
    price: 155.00,
    discountedPricePaise: 15500,
    discountPercentage: 13.8,
    packsize: "4 x 75 g",
    unit: "g",
    quantity: 300,
    rating: 4.7,
    ratingCount: 16200,
    description: "Antibacterial soap bar providing proven protection against 99.9% of germs.",
    images: [
      "https://cdn.zeptonow.com/production/cms/product/dettol-soap-pack4.png"
    ],
    inStock: true,
    availableQuantity: 35,
    storeSpecificPricing: {
      "7e5a1821-59ed-4d8a-8431-a3705afb22d2": { price: 155.00, inStock: true, availableQuantity: 28 }
    }
  },
  {
    id: "prod-vim-dishwash-gel-lemon-750",
    variantId: "var-vim-dishwash-gel-lemon-750",
    name: "Vim Lemon Dishwash Gel Bottle",
    brand: "Vim",
    category: "cleaning-household",
    subCategory: "dishwashing",
    mrp: 175.00,
    mrpPaise: 17500,
    price: 149.00,
    discountedPricePaise: 14900,
    discountPercentage: 14.8,
    packsize: "750 ml",
    unit: "ml",
    quantity: 750,
    rating: 4.8,
    ratingCount: 22100,
    description: "Concentrated lemon dishwash gel cuts through tough grease effortlessly on stainless steel and non-stick cookware.",
    images: [
      "https://cdn.zeptonow.com/production/cms/product/vim-gel-750ml.png"
    ],
    inStock: true,
    availableQuantity: 40,
    storeSpecificPricing: {
      "7e5a1821-59ed-4d8a-8431-a3705afb22d2": { price: 149.00, inStock: true, availableQuantity: 33 }
    }
  },
  {
    id: "prod-fresh-onion-1kg",
    variantId: "var-fresh-onion-1kg",
    name: "Fresh Onion / Pyaz",
    brand: "Fresh Produce",
    category: "fruits-vegetables",
    subCategory: "fresh-vegetables",
    mrp: 48.00,
    mrpPaise: 4800,
    price: 39.00,
    discountedPricePaise: 3900,
    discountPercentage: 18.7,
    packsize: "1 kg",
    unit: "kg",
    quantity: 1,
    rating: 4.5,
    ratingCount: 68400,
    description: "Freshly harvested, handpicked onions essential for Indian curries and salads.",
    images: [
      "https://cdn.zeptonow.com/production/cms/product/onion-fresh-1kg.png"
    ],
    inStock: true,
    availableQuantity: 150,
    storeSpecificPricing: {
      "7e5a1821-59ed-4d8a-8431-a3705afb22d2": { price: 39.00, inStock: true, availableQuantity: 120 },
      "0c865653-8eac-4a33-900c-d2ed7f3c0477": { price: 37.00, inStock: true, availableQuantity: 160 }
    }
  },
  {
    id: "prod-fresh-potato-1kg",
    variantId: "var-fresh-potato-1kg",
    name: "Fresh Potato / Aloo",
    brand: "Fresh Produce",
    category: "fruits-vegetables",
    subCategory: "fresh-vegetables",
    mrp: 35.00,
    mrpPaise: 3500,
    price: 28.00,
    discountedPricePaise: 2800,
    discountPercentage: 20.0,
    packsize: "1 kg",
    unit: "kg",
    quantity: 1,
    rating: 4.6,
    ratingCount: 74200,
    description: "Daily staple high quality fresh potatoes, firm and versatile for frying, boiling, or baking.",
    images: [
      "https://cdn.zeptonow.com/production/cms/product/potato-fresh-1kg.png"
    ],
    inStock: true,
    availableQuantity: 180,
    storeSpecificPricing: {
      "7e5a1821-59ed-4d8a-8431-a3705afb22d2": { price: 28.00, inStock: true, availableQuantity: 140 },
      "0c865653-8eac-4a33-900c-d2ed7f3c0477": { price: 28.00, inStock: true, availableQuantity: 190 }
    }
  }
];
