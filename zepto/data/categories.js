/**
 * Zepto Official Catalog & Taxonomy Specification
 * Models L1 (Departments), L2 (Subcategories), and L3 (Micro-categories).
 */

export const ZEPTO_CATEGORIES = [
  {
    id: "fruits-vegetables",
    name: "Fruits & Vegetables",
    slug: "fruits-and-vegetables",
    iconUrl: "https://cdn.zeptonow.com/production/cms/category/fruits_vegetables.png",
    subcategories: [
      {
        id: "fresh-fruits",
        name: "Fresh Fruits",
        slug: "fresh-fruits",
        microCategories: ["Apples & Pears", "Bananas & Melons", "Citrus & Seasonal", "Exotics"]
      },
      {
        id: "fresh-vegetables",
        name: "Fresh Vegetables",
        slug: "fresh-vegetables",
        microCategories: ["Daily Veggies", "Onions, Potatoes & Tomatoes", "Root Vegetables", "Exotic Vegetables"]
      },
      {
        id: "leafy-herbs",
        name: "Leafy Greens & Herbs",
        slug: "leafy-greens-and-herbs",
        microCategories: ["Coriander & Mint", "Spinach & Greens", "Microgreens"]
      },
      {
        id: "organic-hydroponic",
        name: "Organic & Hydroponic",
        slug: "organic-and-hydroponic",
        microCategories: ["Certified Organic", "Hydroponic Salad Greens"]
      }
    ]
  },
  {
    id: "dairy-bread-eggs",
    name: "Dairy, Bread & Eggs",
    slug: "dairy-bread-and-eggs",
    iconUrl: "https://cdn.zeptonow.com/production/cms/category/dairy_bread_eggs.png",
    subcategories: [
      {
        id: "milk-cream",
        name: "Milk & Cream",
        slug: "milk-and-cream",
        microCategories: ["Toned Milk", "Full Cream Milk", "Cow Milk", "Fresh Cream", "Soy & Oat Milk"]
      },
      {
        id: "bread-buns",
        name: "Bread & Pav",
        slug: "bread-and-pav",
        microCategories: ["White Bread", "Brown & Whole Wheat", "Multigrain & Sourdough", "Pav & Buns"]
      },
      {
        id: "butter-cheese",
        name: "Butter & Cheese",
        slug: "butter-and-cheese",
        microCategories: ["Table Butter", "Cheese Slices & Cubes", "Mozzarella & Pizza Cheese", "Paneer"]
      },
      {
        id: "eggs",
        name: "Eggs",
        slug: "eggs",
        microCategories: ["White Eggs", "Brown Eggs", "Free Range & Organic"]
      },
      {
        id: "curd-yogurt",
        name: "Curd & Yogurt",
        slug: "curd-and-yogurt",
        microCategories: ["Plain Curd / Dahi", "Greek Yogurt", "Flavored Yogurt"]
      }
    ]
  },
  {
    id: "munchies-snacks",
    name: "Snacks & Munchies",
    slug: "snacks-and-munchies",
    iconUrl: "https://cdn.zeptonow.com/production/cms/category/snacks_munchies.png",
    subcategories: [
      {
        id: "chips-crisps",
        name: "Chips & Crisps",
        slug: "chips-and-crisps",
        microCategories: ["Potato Chips", "Nachos & Dips", "Banana & Veggie Chips"]
      },
      {
        id: "biscuits-cookies",
        name: "Biscuits & Cookies",
        slug: "biscuits-and-cookies",
        microCategories: ["Cookies", "Cream Biscuits", "Digestive & Health", "Rusks & Wafers"]
      },
      {
        id: "namkeen-savouries",
        name: "Namkeen & Savouries",
        slug: "namkeen-and-savouries",
        microCategories: ["Bhujia & Sev", "Mixtures", "Makhana & Peanuts"]
      }
    ]
  },
  {
    id: "beverages",
    name: "Cold Drinks & Juices",
    slug: "cold-drinks-and-juices",
    iconUrl: "https://cdn.zeptonow.com/production/cms/category/beverages.png",
    subcategories: [
      {
        id: "soft-drinks",
        name: "Soft Drinks & Aerated Waters",
        slug: "soft-drinks",
        microCategories: ["Cola & Lemon Drinks", "Tonic & Club Soda", "Energy Drinks"]
      },
      {
        id: "juices-fruit-drinks",
        name: "Juices & Concentrates",
        slug: "juices-and-concentrates",
        microCategories: ["100% Raw Juices", "Packaged Fruit Juices", "Coconut Water"]
      },
      {
        id: "tea-coffee",
        name: "Tea, Coffee & Health Drinks",
        slug: "tea-coffee-and-health-drinks",
        microCategories: ["Instant Coffee", "Ground Coffee", "Green Tea", "Black Tea"]
      }
    ]
  },
  {
    id: "instant-frozen",
    name: "Instant & Frozen Food",
    slug: "instant-and-frozen-food",
    iconUrl: "https://cdn.zeptonow.com/production/cms/category/instant_frozen.png",
    subcategories: [
      {
        id: "noodles-pasta",
        name: "Noodles, Pasta & Vermicelli",
        slug: "noodles-pasta-and-vermicelli",
        microCategories: ["Instant Noodles", "Italian Pasta", "Cup Noodles"]
      },
      {
        id: "frozen-snacks",
        name: "Frozen Veg & Non-Veg Snacks",
        slug: "frozen-snacks",
        microCategories: ["French Fries & Nuggets", "Frozen Peas & Corn", "Parathas & Samosas"]
      }
    ]
  },
  {
    id: "personal-care",
    name: "Personal Care",
    slug: "personal-care",
    iconUrl: "https://cdn.zeptonow.com/production/cms/category/personal_care.png",
    subcategories: [
      {
        id: "bath-body",
        name: "Bath & Body",
        slug: "bath-and-body",
        microCategories: ["Body Washes", "Soaps", "Handwashes & Sanitizers"]
      },
      {
        id: "hair-care",
        name: "Hair Care",
        slug: "hair-care",
        microCategories: ["Shampoos", "Conditioners", "Hair Oils & Serums"]
      },
      {
        id: "oral-care",
        name: "Oral Care",
        slug: "oral-care",
        microCategories: ["Toothpastes", "Toothbrushes", "Mouthwashes"]
      }
    ]
  },
  {
    id: "cleaning-household",
    name: "Cleaning & Household",
    slug: "cleaning-and-household",
    iconUrl: "https://cdn.zeptonow.com/production/cms/category/cleaning_household.png",
    subcategories: [
      {
        id: "detergents-laundry",
        name: "Detergents & Laundry",
        slug: "detergents-and-laundry",
        microCategories: ["Liquid Detergents", "Detergent Powders", "Fabric Conditioners"]
      },
      {
        id: "dishwashing",
        name: "Dishwashing",
        slug: "dishwashing",
        microCategories: ["Dishwash Gels", "Dishwash Bars", "Scrubbers & Sponges"]
      },
      {
        id: "surface-cleaners",
        name: "Surface & Floor Cleaners",
        slug: "surface-and-floor-cleaners",
        microCategories: ["Floor Cleaners", "Toilet Cleaners", "Kitchen Cleaners"]
      }
    ]
  }
];
