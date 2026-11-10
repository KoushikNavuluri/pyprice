/**
 * JioMart Category Taxonomy Tree
 * Mirrored from JioMart live storefront taxonomy (/api/service/application/content/v1.0/navigations)
 */

export const JIOMART_CATEGORIES = [
  {
    department: {
      uid: 1,
      name: "Groceries",
      slug: "groceries",
      logo: "https://cdn1.jiomartjcp.com/v2/jiomart-fynd/jio-pd/original/department/pictures/square-logo/original/B14hzYYH_-department.png"
    },
    categories: [
      {
        uid: 10416,
        display: "Dairy & Bakery",
        value: "dairy-bakery",
        priority: 1,
        logo: "https://cdn1.jiomartjcp.com/v2/jiomart-fynd/jio-pd/original/products/pictures/item/free/original/JRJsIlfKj2-dairy-bakery-20240620.png",
        sub_categories: [
          { uid: 1041601, display: "Milk & Cream", value: "milk-cream", count: 182 },
          { uid: 1041602, display: "Paneer & Tofu", value: "paneer-tofu", count: 94 },
          { uid: 1041603, display: "Curd & Yogurt", value: "curd-yogurt", count: 110 },
          { uid: 1041604, display: "Butter & Cheese", value: "butter-cheese", count: 165 },
          { uid: 1041605, display: "Bread & Buns", value: "bread-buns", count: 140 }
        ]
      },
      {
        uid: 116,
        display: "Cooking Essentials",
        value: "cooking-essentials",
        priority: 2,
        logo: "https://cdn1.jiomartjcp.com/v2/jiomart-fynd/jio-pd/original/products/pictures/item/free/original/6TpL6wC4Ed-cooking-essentials-20240711.png",
        sub_categories: [
          { uid: 11601, display: "Atta, Flours & Sooji", value: "atta-flours-sooji", count: 420 },
          { uid: 11602, display: "Edible Oils & Ghee", value: "edible-oils-ghee", count: 380 },
          { uid: 11603, display: "Dals & Pulses", value: "dals-pulses", count: 510 },
          { uid: 11604, display: "Rice & Rice Products", value: "rice-rice-products", count: 390 },
          { uid: 11605, display: "Salt, Sugar & Jaggery", value: "salt-sugar-jaggery", count: 185 },
          { uid: 11606, display: "Spices & Masalas", value: "spices-masalas", count: 640 }
        ]
      },
      {
        uid: 113,
        display: "Biscuits, Drinks & Packaged Foods",
        value: "biscuits-drinks-packaged-foods",
        priority: 3,
        logo: "https://cdn1.jiomartjcp.com/v2/jiomart-fynd/jio-pd/original/products/pictures/item/free/original/JRJsIlfKj2-biscuits-drinks-packaged-foods-20240620.png",
        sub_categories: [
          { uid: 11301, display: "Biscuits & Cookies", value: "biscuits-cookies", count: 850 },
          { uid: 11302, display: "Noodles, Pasta & Vermicelli", value: "noodles-pasta-vermicelli", count: 410 },
          { uid: 11303, display: "Snacks & Namkeen", value: "snacks-namkeen", count: 920 },
          { uid: 11304, display: "Chocolates & Candies", value: "chocolates-candies", count: 560 },
          { uid: 11305, display: "Breakfast Cereals", value: "breakfast-cereals", count: 210 }
        ]
      },
      {
        uid: 111,
        display: "Beverages",
        value: "beverages",
        priority: 4,
        logo: "https://cdn1.jiomartjcp.com/v2/jiomart-fynd/jio-pd/original/products/pictures/item/free/original/dea9STnhK6A-beverages-20240531.png",
        sub_categories: [
          { uid: 11101, display: "Tea & Coffee", value: "tea-coffee", count: 480 },
          { uid: 11102, display: "Fruit Juices & Drinks", value: "fruit-juices-drinks", count: 320 },
          { uid: 11103, display: "Soft Drinks & Soda", value: "soft-drinks-soda", count: 260 },
          { uid: 11104, display: "Health & Energy Drinks", value: "health-energy-drinks", count: 190 }
        ]
      },
      {
        uid: 133,
        display: "Personal Care",
        value: "personal-care",
        priority: 5,
        logo: "https://cdn1.jiomartjcp.com/v2/jiomart-fynd/jio-pd/original/products/pictures/item/free/original/zzOUJEM_wL-personal-care-20240620.png",
        sub_categories: [
          { uid: 13301, display: "Soaps & Body Wash", value: "soaps-body-wash", count: 680 },
          { uid: 13302, display: "Hair Care & Shampoos", value: "hair-care-shampoos", count: 540 },
          { uid: 13303, display: "Oral Care", value: "oral-care", count: 390 },
          { uid: 13304, display: "Skin Care", value: "skin-care", count: 720 }
        ]
      },
      {
        uid: 128,
        display: "Home Care",
        value: "home-care",
        priority: 6,
        logo: "https://cdn1.jiomartjcp.com/v2/jiomart-fynd/jio-pd/original/products/pictures/item/free/original/_89489R9rg9-home-care-20240611.png",
        sub_categories: [
          { uid: 12801, display: "Detergents & Fabric Care", value: "detergents-fabric-care", count: 490 },
          { uid: 12802, display: "Dishwashers & Cleaners", value: "dishwashers-cleaners", count: 340 },
          { uid: 12803, display: "Repellents & Fresheners", value: "repellents-fresheners", count: 210 }
        ]
      }
    ]
  },
  {
    department: {
      uid: 2,
      name: "Electronics",
      slug: "electronics",
      logo: "https://cdn1.jiomartjcp.com/v2/jiomart-fynd/jio-pd/original/department/pictures/square-logo/original/electronics-logo.png"
    },
    categories: [
      {
        uid: 201,
        display: "Mobiles & Accessories",
        value: "mobiles-accessories",
        priority: 1,
        sub_categories: [
          { uid: 20101, display: "Smartphones", value: "smartphones", count: 120 },
          { uid: 20102, display: "Cables & Chargers", value: "cables-chargers", count: 310 },
          { uid: 20103, display: "Power Banks", value: "power-banks", count: 95 }
        ]
      },
      {
        uid: 202,
        display: "Audio & Headphones",
        value: "audio-headphones",
        priority: 2,
        sub_categories: [
          { uid: 20201, display: "Wireless Earbuds (TWS)", value: "wireless-earbuds", count: 180 },
          { uid: 20202, display: "Bluetooth Speakers", value: "bluetooth-speakers", count: 140 }
        ]
      }
    ]
  }
];
