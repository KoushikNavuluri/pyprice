/**
 * Zepto Product Search, Details and Category Service
 * Provides filtering, pagination, sorting, store-specific pricing, and autocomplete.
 */

import { SEED_PRODUCTS } from '../../data/products.js';
import { ZEPTO_CATEGORIES } from '../../data/categories.js';

export class CatalogService {
  constructor() {
    this.products = [...SEED_PRODUCTS];
    this.categories = [...ZEPTO_CATEGORIES];
  }

  /**
   * Search products with query, pagination, filters, sorting and store context
   */
  searchProducts({
    query = "",
    storeId = null,
    category = null,
    subCategory = null,
    minPrice = null,
    maxPrice = null,
    inStockOnly = false,
    sortBy = "relevance", // relevance | price_asc | price_desc | rating | discount
    page = 1,
    limit = 10
  }) {
    const q = String(query).toLowerCase().trim();
    let matches = this.products.filter(item => {
      // Keyword matching across title, brand, description and category
      if (q) {
        const textToSearch = `${item.name} ${item.brand} ${item.category} ${item.subCategory} ${item.description}`.toLowerCase();
        const tokens = q.split(/\s+/).filter(Boolean);
        const matchesAll = tokens.every(token => textToSearch.includes(token));
        if (!matchesAll) return false;
      }

      // Category filter
      if (category && item.category !== category) return false;
      if (subCategory && item.subCategory !== subCategory) return false;

      // Price filter
      const effectivePrice = this.getStorePrice(item, storeId);
      if (minPrice !== null && effectivePrice < minPrice) return false;
      if (maxPrice !== null && effectivePrice > maxPrice) return false;

      // Stock filter
      if (inStockOnly) {
        const stockStatus = this.getStoreStock(item, storeId);
        if (!stockStatus.inStock) return false;
      }

      return true;
    });

    // Formatting products with store-specific adjustments
    let formatted = matches.map(item => this.formatProduct(item, storeId));

    // Sorting
    switch (sortBy) {
      case "price_asc":
        formatted.sort((a, b) => a.pricing.discountedPrice - b.pricing.discountedPrice);
        break;
      case "price_desc":
        formatted.sort((a, b) => b.pricing.discountedPrice - a.pricing.discountedPrice);
        break;
      case "rating":
        formatted.sort((a, b) => b.rating.average - a.rating.average);
        break;
      case "discount":
        formatted.sort((a, b) => b.pricing.discountPercentage - a.pricing.discountPercentage);
        break;
      case "relevance":
      default:
        // Default ranking: exact name prefix matches first, then rating
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
      storeId,
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
   * Search Autocomplete / Suggestions
   */
  getAutocomplete(query, limit = 5) {
    const q = String(query).toLowerCase().trim();
    if (!q) return [];

    const suggestions = new Set();
    const items = [];

    for (const item of this.products) {
      if (item.name.toLowerCase().includes(q)) {
        if (!suggestions.has(item.name)) {
          suggestions.add(item.name);
          items.push({
            type: "product",
            title: item.name,
            brand: item.brand,
            category: item.category,
            productId: item.id
          });
        }
      }
      if (item.brand.toLowerCase().startsWith(q) && !suggestions.has(item.brand)) {
        suggestions.add(item.brand);
        items.push({
          type: "brand",
          title: item.brand,
          brand: item.brand
        });
      }
      if (items.length >= limit) break;
    }

    return items.slice(0, limit);
  }

  /**
   * Retrieve full product details by Product ID or Variant ID
   */
  getProductDetail(idOrVariantId, storeId = null) {
    const item = this.products.find(p => p.id === idOrVariantId || p.variantId === idOrVariantId);
    if (!item) return null;
    return this.formatProduct(item, storeId, true);
  }

  /**
   * Categories Tree Discovery
   */
  getCategories() {
    return this.categories.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      iconUrl: c.iconUrl,
      subcategoryCount: c.subcategories.length
    }));
  }

  /**
   * Category details with subcategories and micro-categories
   */
  getCategoryDetail(categoryId) {
    const cat = this.categories.find(c => c.id === categoryId || c.slug === categoryId);
    if (!cat) return null;

    // Count products in this category
    const productCount = this.products.filter(p => p.category === cat.id).length;

    return {
      ...cat,
      totalProductsInCatalog: productCount
    };
  }

  /**
   * Get products by category
   */
  getProductsByCategory(categoryId, subcategoryId = null, storeId = null, page = 1, limit = 10) {
    return this.searchProducts({
      category: categoryId,
      subCategory: subcategoryId,
      storeId,
      page,
      limit
    });
  }

  /**
   * Helpers
   */
  getStorePrice(item, storeId) {
    if (storeId && item.storeSpecificPricing?.[storeId]) {
      return item.storeSpecificPricing[storeId].price;
    }
    return item.price;
  }

  getStoreStock(item, storeId) {
    if (storeId && item.storeSpecificPricing?.[storeId]) {
      return {
        inStock: item.storeSpecificPricing[storeId].inStock,
        availableQuantity: item.storeSpecificPricing[storeId].availableQuantity
      };
    }
    return {
      inStock: item.inStock,
      availableQuantity: item.availableQuantity
    };
  }

  formatProduct(item, storeId = null, includeFullDescription = false) {
    const stock = this.getStoreStock(item, storeId);
    const price = this.getStorePrice(item, storeId);
    const pricePaise = Math.round(price * 100);

    const formatted = {
      id: item.id,
      variantId: item.variantId,
      name: item.name,
      brand: item.brand,
      category: item.category,
      subCategory: item.subCategory,
      packsize: item.packsize,
      unit: item.unit,
      quantity: item.quantity,
      pricing: {
        currency: "INR",
        symbol: "₹",
        mrp: item.mrp,
        mrpPaise: item.mrpPaise,
        discountedPrice: price,
        discountedPricePaise: pricePaise,
        discountPercentage: item.discountPercentage
      },
      stock: {
        inStock: stock.inStock,
        availableQuantity: stock.availableQuantity
      },
      rating: {
        average: item.rating,
        totalReviews: item.ratingCount
      },
      images: item.images,
      storeId: storeId || "default"
    };

    if (includeFullDescription) {
      formatted.description = item.description;
    }

    return formatted;
  }
}
