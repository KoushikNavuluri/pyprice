/**
 * BigBasket Category Taxonomy Tree
 * Extracted from BigBasket UI taxonomy service (/ui-svc/v1/category-tree)
 */

export const BIGBASKET_CATEGORIES = [
  {
    id: "fruits-vegetables",
    name: "Fruits & Vegetables",
    slug: "fruits-vegetables",
    iconUrl: "https://www.bigbasket.com/media/uploads/category/fruits-vegetables.png",
    subCategories: [
      { id: "fresh-vegetables", name: "Fresh Vegetables", slug: "fresh-vegetables" },
      { id: "fresh-fruits", name: "Fresh Fruits", slug: "fresh-fruits" },
      { id: "organic-produce", name: "Organic Fruits & Vegetables", slug: "organic-fruits-vegetables" },
      { id: "herbs-seasonings", name: "Herbs & Seasonings", slug: "herbs-seasonings" },
      { id: "exotic-fruits-veggies", name: "Exotics", slug: "exotic-fruits-veggies" }
    ]
  },
  {
    id: "dairy-bakery",
    name: "Dairy & Bakery",
    slug: "dairy-bakery",
    iconUrl: "https://www.bigbasket.com/media/uploads/category/dairy-bakery.png",
    subCategories: [
      { id: "milk", name: "Milk", slug: "milk" },
      { id: "curd-yogurt", name: "Curd & Yogurt", slug: "curd-yogurt" },
      { id: "paneer-tofu", name: "Paneer & Tofu", slug: "paneer-tofu" },
      { id: "butter-cheese", name: "Butter & Cheese", slug: "butter-cheese" },
      { id: "bread-buns", name: "Bread & Buns", slug: "bread-buns" },
      { id: "dairy-sweets", name: "Dairy Sweets", slug: "dairy-sweets" }
    ]
  },
  {
    id: "staples",
    name: "Foodgrains, Oil & Masala",
    slug: "foodgrains-oil-masala",
    iconUrl: "https://www.bigbasket.com/media/uploads/category/foodgrains-oil-masala.png",
    subCategories: [
      { id: "atta-flours", name: "Atta, Flours & Sooji", slug: "atta-flours-sooji" },
      { id: "rice-products", name: "Rice & Rice Products", slug: "rice-rice-products" },
      { id: "dals-pulses", name: "Dals & Pulses", slug: "dals-pulses" },
      { id: "edible-oils-ghee", name: "Edible Oils & Ghee", slug: "edible-oils-ghee" },
      { id: "salt-sugar-jaggery", name: "Salt, Sugar & Jaggery", slug: "salt-sugar-jaggery" },
      { id: "spices-masalas", name: "Masalas & Spices", slug: "masalas-spices" }
    ]
  },
  {
    id: "snacks-branded-foods",
    name: "Snacks & Branded Foods",
    slug: "snacks-branded-foods",
    iconUrl: "https://www.bigbasket.com/media/uploads/category/snacks-branded-foods.png",
    subCategories: [
      { id: "biscuits-cookies", name: "Biscuits & Cookies", slug: "biscuits-cookies" },
      { id: "noodles-pasta", name: "Noodle, Pasta, Vermicelli", slug: "noodle-pasta-vermicelli" },
      { id: "chips-namkeen", name: "Chips & Namkeen", slug: "chips-namkeen" },
      { id: "chocolates-candies", name: "Chocolates & Candies", slug: "chocolates-candies" },
      { id: "breakfast-cereals", name: "Breakfast Cereals", slug: "breakfast-cereals" }
    ]
  },
  {
    id: "beverages",
    name: "Beverages",
    slug: "beverages",
    iconUrl: "https://www.bigbasket.com/media/uploads/category/beverages.png",
    subCategories: [
      { id: "tea", name: "Tea", slug: "tea" },
      { id: "coffee", name: "Coffee", slug: "coffee" },
      { id: "fruit-juices", name: "Fruit Juices & Drinks", slug: "fruit-juices-drinks" },
      { id: "soft-drinks", name: "Soft Drinks & Aerated Waters", slug: "soft-drinks" },
      { id: "energy-drinks", name: "Energy & Sports Drinks", slug: "energy-sports-drinks" }
    ]
  },
  {
    id: "cleaning-household",
    name: "Cleaning & Household",
    slug: "cleaning-household",
    iconUrl: "https://www.bigbasket.com/media/uploads/category/cleaning-household.png",
    subCategories: [
      { id: "detergents-dishwash", name: "Detergent & Dishwash", slug: "detergent-dishwash" },
      { id: "all-purpose-cleaners", name: "All Purpose Cleaners", slug: "all-purpose-cleaners" },
      { id: "disposables-garbage-bags", name: "Disposables & Garbage Bags", slug: "disposables-garbage-bags" }
    ]
  },
  {
    id: "beauty-hygiene",
    name: "Beauty & Hygiene",
    slug: "beauty-hygiene",
    iconUrl: "https://www.bigbasket.com/media/uploads/category/beauty-hygiene.png",
    subCategories: [
      { id: "bath-handwash", name: "Bath & Hand Wash", slug: "bath-handwash" },
      { id: "hair-care", name: "Hair Care", slug: "hair-care" },
      { id: "oral-care", name: "Oral Care", slug: "oral-care" },
      { id: "skin-care", name: "Skin Care", slug: "skin-care" }
    ]
  }
];
