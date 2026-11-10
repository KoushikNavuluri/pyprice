/**
 * Swiggy Instamart Product Search, Catalog, and Category Service
 */

import { INSTAMART_PRODUCTS } from '../../data/products.js';
import { INSTAMART_CATEGORIES } from '../../data/categories.js';

export class CatalogService {
  constructor() {
    this.products = [...INSTAMART_PRODUCTS];
    this.categories = [...INSTAMART_CATEGORIES];
  }

  /**
   * Search products with filtering, sorting, pagination, and pod context
   */
  searchProducts({
    query = "",
    podId = null,
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
      // Keyword matching across title, brand, description, and subcategory
      if (q) {
        const textToSearch = `${item.displayName} ${item.brand} ${item.category} ${item.subCategory} ${item.description}`.toLowerCase();
        if (!textToSearch.includes(q)) return false;
      }

      // Category filter
      if (category && item.category !== category) return false;
      if (subCategory && item.subCategory !== subCategory) return false;

      // Brand filter
      if (brand && item.brand.toLowerCase() !== brand.toLowerCase()) return false;

      // Price filter
      const price = item.price.offerPrice;
      if (minPrice !== null && price < minPrice) return false;
      if (maxPrice !== null && price > maxPrice) return false;

      // Stock filter
      if (inStockOnly && !item.inStock) return false;

      return true;
    });

    // Formatting products with pod context
    let formatted = matches.map(item => this.formatProduct(item, podId));

    // Sorting
    switch (sortBy) {
      case "price_asc":
        formatted.sort((a, b) => a.price.offerPrice - b.price.offerPrice);
        break;
      case "price_desc":
        formatted.sort((a, b) => b.price.offerPrice - a.price.offerPrice);
        break;
      case "rating":
        formatted.sort((a, b) => b.rating.average - a.rating.average);
        break;
      case "discount":
        formatted.sort((a, b) => b.price.discountPercentage - a.price.discountPercentage);
        break;
      case "relevance":
      default:
        if (q) {
          formatted.sort((a, b) => {
            const aStartsWith = a.displayName.toLowerCase().startsWith(q) ? 1 : 0;
            const bStartsWith = b.displayName.toLowerCase().startsWith(q) ? 1 : 0;
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
      podId: podId || "1392421",
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
      if (item.displayName.toLowerCase().includes(q)) {
        if (!suggestions.has(item.displayName)) {
          suggestions.add(item.displayName);
          items.push({
            type: "product",
            title: item.displayName,
            brand: item.brand,
            category: item.category,
            itemId: item.itemId,
            skuId: item.skuId
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
   * Retrieve full product details by Item ID, SKU ID, or Spin ID
   */
  getProductDetail(idOrSku, podId = null) {
    const item = this.products.find(p =>
      p.itemId === idOrSku ||
      p.skuId === idOrSku ||
      p.spinId === idOrSku
    );
    if (!item) return null;
    return this.formatProduct(item, podId, true);
  }

  /**
   * Categories Tree Discovery
   */
  getCategories() {
    return this.categories.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      layoutId: c.layoutId,
      imageId: c.imageId,
      subcategoryCount: c.subcategories.length
    }));
  }

  /**
   * Category details with subcategories and micro-categories
   */
  getCategoryDetail(categoryId) {
    const cat = this.categories.find(c => c.id === categoryId || c.slug === categoryId);
    if (!cat) return null;

    const productCount = this.products.filter(p => p.category === cat.id).length;

    return {
      ...cat,
      totalProductsInCatalog: productCount
    };
  }

  /**
   * Get products by category
   */
  getProductsByCategory(categoryId, subcategoryId = null, podId = null, page = 1, limit = 10) {
    return this.searchProducts({
      category: categoryId,
      subCategory: subcategoryId,
      podId,
      page,
      limit
    });
  }

  formatProduct(item, podId = null, includeFullDescription = false) {
    const formatted = {
      itemId: item.itemId,
      skuId: item.skuId,
      spinId: item.spinId,
      displayName: item.displayName,
      brand: item.brand,
      category: item.category,
      subCategory: item.subCategory,
      quantityDescription: item.quantityDescription,
      unit: item.unit,
      quantity: item.quantity,
      inStock: item.inStock,
      isAvail: item.isAvail,
      price: {
        currency: "INR",
        symbol: "₹",
        mrp: item.price.mrp,
        offerPrice: item.price.offerPrice,
        discountPercentage: item.price.discountPercentage,
        discountValue: item.price.discountValue
      },
      rating: {
        average: item.rating.average,
        totalReviews: item.rating.ratingCount
      },
      images: item.images,
      variations: item.variations,
      podId: podId || "1392421"
    };

    if (includeFullDescription) {
      formatted.description = item.description;
    }

    return formatted;
  }
}
