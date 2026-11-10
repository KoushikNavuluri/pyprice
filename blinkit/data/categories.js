/**
 * Blinkit Category Taxonomy & Layout Navigation
 */

export const BLINKIT_CATEGORIES = [
  {
    id: "dairy-breakfast",
    name: "Dairy, Bread & Eggs",
    slug: "dairy-breakfast",
    iconUrl: "https://cdn.grofers.com/app/images/category/cms_images/icon/icon_cat_14_storefront.png",
    layoutId: 104,
    subcategories: [
      {
        id: "milk",
        name: "Milk",
        slug: "milk",
        microCategories: ["Toned Milk", "Full Cream Milk", "Cow Milk", "Flavoured Milk"]
      },
      {
        id: "bread-pav",
        name: "Bread & Pav",
        slug: "bread-pav",
        microCategories: ["White Bread", "Brown Bread", "Multigrain Bread", "Pav & Buns"]
      },
      {
        id: "paneer-tofu",
        name: "Paneer & Tofu",
        slug: "paneer-tofu",
        microCategories: ["Fresh Paneer", "Malai Paneer", "Tofu"]
      },
      {
        id: "butter-cheese",
        name: "Butter & Cheese",
        slug: "butter-cheese",
        microCategories: ["Table Butter", "Cheese Slices", "Cheese Cubes", "Cheese Spread"]
      },
      {
        id: "curd-yogurt",
        name: "Curd & Yogurt",
        slug: "curd-yogurt",
        microCategories: ["Dahi", "Greek Yogurt", "Flavoured Yogurt", "Lassi & Chaach"]
      },
      {
        id: "eggs",
        name: "Eggs",
        slug: "eggs",
        microCategories: ["Regular Eggs", "Brown Eggs", "Free Range Eggs"]
      }
    ]
  },
  {
    id: "munchies",
    name: "Snacks & Munchies",
    slug: "munchies",
    iconUrl: "https://cdn.grofers.com/app/images/category/cms_images/icon/icon_cat_1237_storefront.png",
    layoutId: 108,
    subcategories: [
      {
        id: "chips-crisps",
        name: "Chips & Crisps",
        slug: "chips-crisps",
        microCategories: ["Potato Chips", "Nachos", "Namkeen & Bhujia"]
      },
      {
        id: "biscuits-cookies",
        name: "Biscuits & Cookies",
        slug: "biscuits-cookies",
        microCategories: ["Cream Biscuits", "Cookies", "Digestive & Marie"]
      },
      {
        id: "rusk-wafers",
        name: "Rusk & Wafers",
        slug: "rusk-wafers",
        microCategories: ["Crispy Rusk", "Chocolate Wafers"]
      }
    ]
  },
  {
    id: "cold-drinks-juices",
    name: "Cold Drinks & Juices",
    slug: "cold-drinks-juices",
    iconUrl: "https://cdn.grofers.com/app/images/category/cms_images/icon/icon_cat_332_storefront.png",
    layoutId: 110,
    subcategories: [
      {
        id: "soft-drinks",
        name: "Soft Drinks",
        slug: "soft-drinks",
        microCategories: ["Cola", "Lemon & Orange Drinks", "Soda & Tonic"]
      },
      {
        id: "juices",
        name: "Fruit Juices",
        slug: "juices",
        microCategories: ["100% Real Juice", "Mango Drinks", "Coconut Water"]
      },
      {
        id: "energy-drinks",
        name: "Energy & Sports Drinks",
        slug: "energy-drinks",
        microCategories: ["Energy Drinks", "Electrolyte Drinks"]
      }
    ]
  },
  {
    id: "fruits-vegetables",
    name: "Vegetables & Fruits",
    slug: "fruits-vegetables",
    iconUrl: "https://cdn.grofers.com/app/images/category/cms_images/icon/icon_cat_1487_storefront.png",
    layoutId: 112,
    subcategories: [
      {
        id: "fresh-vegetables",
        name: "Fresh Vegetables",
        slug: "fresh-vegetables",
        microCategories: ["Potato, Onion & Tomato", "Daily Veggies", "Leafy Vegetables"]
      },
      {
        id: "fresh-fruits",
        name: "Fresh Fruits",
        slug: "fresh-fruits",
        microCategories: ["Apples & Pears", "Bananas", "Seasonal Fruits"]
      }
    ]
  },
  {
    id: "instant-frozen",
    name: "Instant & Frozen Food",
    slug: "instant-frozen",
    iconUrl: "https://cdn.grofers.com/app/images/category/cms_images/icon/icon_cat_15_storefront.png",
    layoutId: 115,
    subcategories: [
      {
        id: "noodles-pasta",
        name: "Noodles & Pasta",
        slug: "noodles-pasta",
        microCategories: ["Instant Noodles", "Pasta", "Vermicelli"]
      },
      {
        id: "frozen-snacks",
        name: "Frozen Veg & Non-Veg",
        slug: "frozen-snacks",
        microCategories: ["Fries & Nuggets", "Frozen Momos", "Frozen Paratha"]
      }
    ]
  },
  {
    id: "tea-coffee",
    name: "Tea, Coffee & Health Drinks",
    slug: "tea-coffee",
    iconUrl: "https://cdn.grofers.com/app/images/category/cms_images/icon/icon_cat_12_storefront.png",
    layoutId: 118,
    subcategories: [
      {
        id: "tea",
        name: "Tea",
        slug: "tea",
        microCategories: ["Black Tea", "Green Tea", "Herbal Tea"]
      },
      {
        id: "coffee",
        name: "Coffee",
        slug: "coffee",
        microCategories: ["Instant Coffee", "Filter Coffee", "Coffee Beans"]
      }
    ]
  },
  {
    id: "personal-care",
    name: "Personal Care",
    slug: "personal-care",
    iconUrl: "https://cdn.grofers.com/app/images/category/cms_images/icon/icon_cat_163_storefront.png",
    layoutId: 125,
    subcategories: [
      {
        id: "bath-body",
        name: "Bath & Body",
        slug: "bath-body",
        microCategories: ["Soaps", "Body Wash", "Handwash"]
      },
      {
        id: "hair-care",
        name: "Hair Care",
        slug: "hair-care",
        microCategories: ["Shampoo", "Conditioner", "Hair Oil"]
      }
    ]
  }
];
