/**
 * BigBasket Product Catalog, Search & Taxonomy Service
 */

import { BIGBASKET_PRODUCTS } from '../../data/products.js';
import { BIGBASKET_CATEGORIES } from '../../data/categories.js';

export class CatalogService {
  constructor() {
    this.products = [...BIGBASKET_PRODUCTS];
    this.categories = [...BIGBASKET_CATEGORIES];
  }

  /**
   * Search products with filtering, sorting, pagination, and dark store hub context
   */
  searchProducts({
    query = "",
    hubId = null,
    category = null,
    subCategory = null,
    brand = null,
    minPrice = null,
    maxPrice = null,
    inStockOnly = false,
    sortBy = "relevance", // relevance | price_asc | price_desc | rating | discount
    page = 1,
    limit = 10
  }) {
    const q = String(query).toLowerCase().trim();
    let matches = this.products.filter(item => {
      // Keyword matching
      if (q) {
        const textToSearch = `${item.desc} ${item.brand} ${item.category} ${item.subCategory} ${item.description}`.toLowerCase();
        if (!textToSearch.includes(q)) return false;
      }

      // Category filter
      if (category && item.category !== category) return false;
      if (subCategory && item.subCategory !== subCategory) return false;

      // Brand filter
      if (brand && item.brand.toLowerCase() !== brand.toLowerCase()) return false;

      // Price filter
      if (minPrice !== null && item.pricing.sp < minPrice) return false;
      if (maxPrice !== null && item.pricing.sp > maxPrice) return false;

      // Stock filter
      if (inStockOnly && (!item.availability.is_available || item.availability.stock <= 0)) return false;

      return true;
    });

    let formatted = matches.map(item => this.formatProduct(item, hubId));

    // Sorting
    switch (sortBy) {
      case "price_asc":
        formatted.sort((a, b) => a.pricing.price - b.pricing.price);
        break;
      case "price_desc":
        formatted.sort((a, b) => b.pricing.price - a.pricing.price);
        break;
      case "rating":
        formatted.sort((a, b) => b.rating.average - a.rating.average);
        break;
      case "discount":
        formatted.sort((a, b) => b.pricing.discountPercentage - a.pricing.discountPercentage);
        break;
      case "relevance":
      default:
        if (q) {
          formatted.sort((a, b) => {
            const aStartsWith = a.name.toLowerCase().startsWith(q) ? 1 : 0;
            const bStartsWith = b.name.toLowerCase().startsWith(q) ? 1 : 0;
            if (aStartsWith !== bStartsWith) return bStartsWith - aStartsWith;
            return b.rating.average - a.rating.average;
          });
        }
        break;
    }

    // Pagination
    const total = formatted.length;
    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const totalPages = Math.ceil(total / pageSize) || 1;
    const offset = (pageNum - 1) * pageSize;
    const paginatedItems = formatted.slice(offset, offset + pageSize);

    return {
      query: q || null,
      hubId: hubId || "7427",
      serviceType: "bbnow",
      pagination: {
        page: pageNum,
        limit: pageSize,
        totalItems: total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      },
      results: paginatedItems
    };
  }

  /**
   * Search Autocomplete / Term Completion
   */
  getAutocomplete(query, limit = 5) {
    const q = String(query).toLowerCase().trim();
    if (!q) return [];

    const suggestions = new Set();

    // 1. Check product titles
    for (const prod of this.products) {
      const title = prod.desc.toLowerCase();
      if (title.includes(q)) {
        suggestions.add(prod.desc);
      }
      if (prod.brand.toLowerCase().includes(q)) {
        suggestions.add(prod.brand);
      }
    }

    // 2. Check categories & subcategories
    for (const cat of this.categories) {
      if (cat.name.toLowerCase().includes(q)) {
        suggestions.add(cat.name);
      }
      for (const sub of cat.subCategories) {
        if (sub.name.toLowerCase().includes(q)) {
          suggestions.add(sub.name);
        }
      }
    }

    return Array.from(suggestions).slice(0, limit).map((term, idx) => ({
      term,
      score: 1.0 - (idx * 0.05),
      highlight: term.toLowerCase().indexOf(q)
    }));
  }

  /**
   * Product Details by ID
   */
  getProductDetail(productId, hubId = null) {
    const item = this.products.find(p => p.id === String(productId));
    if (!item) return null;
    return this.formatProduct(item, hubId);
  }

  /**
   * List Categories
   */
  getCategories() {
    return this.categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      iconUrl: cat.iconUrl,
      subCategoryCount: cat.subCategories.length
    }));
  }

  /**
   * Get Category Details
   */
  getCategoryDetail(categoryId) {
    const cat = this.categories.find(c => c.id === categoryId || c.slug === categoryId);
    if (!cat) return null;
    return cat;
  }

  /**
   * Get Products by Category
   */
  getProductsByCategory(categoryId, subCategory = null, hubId = null, page = 1, limit = 10) {
    let filtered = this.products.filter(p => {
      if (p.category !== categoryId && p.category !== this.resolveCategoryId(categoryId)) return false;
      if (subCategory && p.subCategory !== subCategory) return false;
      return true;
    });

    const formatted = filtered.map(item => this.formatProduct(item, hubId));
    const total = formatted.length;
    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const totalPages = Math.ceil(total / pageSize) || 1;
    const offset = (pageNum - 1) * pageSize;
    const paginatedItems = formatted.slice(offset, offset + pageSize);

    return {
      categoryId,
      subCategory: subCategory || null,
      hubId: hubId || "7427",
      pagination: {
        page: pageNum,
        limit: pageSize,
        totalItems: total,
        totalPages,
        hasNextPage: pageNum < totalPages
      },
      results: paginatedItems
    };
  }

  resolveCategoryId(slugOrId) {
    const found = this.categories.find(c => c.slug === slugOrId || c.id === slugOrId);
    return found ? found.id : slugOrId;
  }

  /**
   * Format product into standard schema
   */
  formatProduct(item, hubId = null) {
    return {
      productId: item.id,
      name: item.desc,
      brand: item.brand,
      category: item.category,
      subCategory: item.subCategory,
      unit: item.w,
      quantity: item.quantity,
      quantityUnit: item.quantityUnit,
      pricing: {
        price: item.pricing.sp,
        mrp: item.pricing.mrp,
        discountPercentage: item.pricing.discount.value,
        currency: "INR"
      },
      inventory: item.availability.stock,
      isSoldOut: !item.availability.is_available || item.availability.stock <= 0,
      etaMinutes: 10,
      rating: {
        average: item.rating_info.avg_rating,
        ratingCount: item.rating_info.rating_count
      },
      description: item.description,
      images: item.images,
      variants: item.variants || [],
      bbnow: {
        hubId: hubId || "7427",
        serviceType: "bbnow",
        shortEta: item.availability.short_eta
      }
    };
  }
}
