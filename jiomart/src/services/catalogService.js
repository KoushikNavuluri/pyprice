/**
 * JioMart Catalog & Search Service
 * Product full-text search, autocomplete, product specifications, and category discovery.
 */

import { JIOMART_PRODUCTS } from '../../data/products.js';
import { JIOMART_CATEGORIES } from '../../data/categories.js';

export class JioMartCatalogService {
  /**
   * Product keyword search with filtering, sorting, and pagination
   */
  searchProducts({
    query = '',
    brand = null,
    category = null,
    minPrice = null,
    maxPrice = null,
    inStockOnly = false,
    sortBy = 'relevance',
    page = 1,
    limit = 20
  } = {}) {
    let items = [...JIOMART_PRODUCTS];

    if (query && query.trim().length > 0) {
      const q = query.toLowerCase().trim();
      items = items.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.name.toLowerCase().includes(q) ||
        p.categories.some(c => c.name.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (brand) {
      const b = brand.toLowerCase().trim();
      items = items.filter(p => p.brand.name.toLowerCase() === b);
    }

    if (category) {
      const c = category.toLowerCase().trim();
      items = items.filter(p =>
        p.categories.some(cat => cat.slug.toLowerCase() === c || cat.name.toLowerCase() === c)
      );
    }

    if (minPrice !== null && !isNaN(Number(minPrice))) {
      items = items.filter(p => p.price.effective.min >= Number(minPrice));
    }

    if (maxPrice !== null && !isNaN(Number(maxPrice))) {
      items = items.filter(p => p.price.effective.max <= Number(maxPrice));
    }

    if (inStockOnly) {
      items = items.filter(p => p.availability.in_stock);
    }

    // Sorting
    switch (sortBy) {
      case 'price_asc':
        items.sort((a, b) => a.price.effective.min - b.price.effective.min);
        break;
      case 'price_desc':
        items.sort((a, b) => b.price.effective.min - a.price.effective.min);
        break;
      case 'rating':
        items.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        items.sort((a, b) => (b.price.discount_percent || 0) - (a.price.discount_percent || 0));
        break;
      case 'relevance':
      default:
        // natural catalog sort
        break;
    }

    const total = items.length;
    const startIndex = (page - 1) * limit;
    const paginated = items.slice(startIndex, startIndex + limit);

    return {
      query,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit) || 1,
      results: paginated
    };
  }

  /**
   * Search term autocomplete suggestions
   */
  autocomplete(query) {
    if (!query || query.trim().length === 0) return [];
    const q = query.toLowerCase().trim();

    const suggestions = new Set();

    // Check products
    for (const p of JIOMART_PRODUCTS) {
      if (p.name.toLowerCase().includes(q)) {
        suggestions.add(p.name);
      }
      if (p.brand.name.toLowerCase().includes(q)) {
        suggestions.add(p.brand.name);
      }
    }

    // Check categories
    for (const dept of JIOMART_CATEGORIES) {
      for (const cat of dept.categories) {
        if (cat.display.toLowerCase().includes(q)) {
          suggestions.add(cat.display);
        }
        if (cat.sub_categories) {
          for (const sub of cat.sub_categories) {
            if (sub.display.toLowerCase().includes(q)) {
              suggestions.add(sub.display);
            }
          }
        }
      }
    }

    return Array.from(suggestions).slice(0, 10).map(term => ({
      text: term,
      type: term.length > 25 ? 'product' : 'keyword'
    }));
  }

  /**
   * Retrieves single product by UID or Slug
   */
  getProductByIdOrSlug(identifier) {
    const id = String(identifier).trim();
    const product = JIOMART_PRODUCTS.find(p => String(p.uid) === id || p.slug === id);
    return product || null;
  }

  /**
   * Returns category taxonomy
   */
  getCategories() {
    return JIOMART_CATEGORIES;
  }

  /**
   * Returns single category by ID or slug
   */
  getCategoryById(idOrSlug) {
    const target = String(idOrSlug).toLowerCase().trim();

    for (const dept of JIOMART_CATEGORIES) {
      if (String(dept.department.uid) === target || dept.department.slug === target) {
        return dept;
      }
      for (const cat of dept.categories) {
        if (String(cat.uid) === target || cat.value === target) {
          return cat;
        }
        if (cat.sub_categories) {
          for (const sub of cat.sub_categories) {
            if (String(sub.uid) === target || sub.value === target) {
              return sub;
            }
          }
        }
      }
    }
    return null;
  }

  /**
   * Returns products in a category
   */
  getProductsByCategory(categoryIdOrSlug, { page = 1, limit = 20 } = {}) {
    return this.searchProducts({ category: categoryIdOrSlug, page, limit });
  }
}

export const catalogService = new JioMartCatalogService();
