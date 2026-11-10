/**
 * Blinkit Product Catalog, Search & SDUI Service
 */

import { BLINKIT_PRODUCTS } from '../../data/products.js';
import { BLINKIT_CATEGORIES } from '../../data/categories.js';

export class CatalogService {
  constructor() {
    this.products = [...BLINKIT_PRODUCTS];
    this.categories = [...BLINKIT_CATEGORIES];
  }

  /**
   * Search products with filtering, sorting, pagination, and dark store context
   */
  searchProducts({
    query = "",
    storeId = null,
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
        const textToSearch = `${item.name} ${item.brand} ${item.category} ${item.subCategory} ${item.description}`.toLowerCase();
        if (!textToSearch.includes(q)) return false;
      }

      // Category filter
      if (category && item.category !== category) return false;
      if (subCategory && item.subCategory !== subCategory) return false;

      // Brand filter
      if (brand && item.brand.toLowerCase() !== brand.toLowerCase()) return false;

      // Price filter
      if (minPrice !== null && item.price < minPrice) return false;
      if (maxPrice !== null && item.price > maxPrice) return false;

      // Stock filter
      if (inStockOnly && (item.isSoldOut || item.inventory <= 0)) return false;

      return true;
    });

    let formatted = matches.map(item => this.formatProduct(item, storeId));

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
      storeId: storeId || "14829",
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
            productId: item.productId
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
   * Product Details with SDUI snippet representations
   */
  getProductDetail(productId, storeId = null) {
    const item = this.products.find(p => p.productId === String(productId));
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
      layoutId: c.layoutId,
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

  formatProduct(item, storeId = null, includeFullDetails = false) {
    const formatted = {
      productId: item.productId,
      name: item.name,
      brand: item.brand,
      category: item.category,
      subCategory: item.subCategory,
      unit: item.unit,
      quantity: item.quantity,
      quantityUnit: item.quantityUnit,
      pricing: {
        currency: "INR",
        symbol: "₹",
        mrp: item.mrp,
        price: item.price,
        discountPercentage: item.discountPercentage,
        discountAmount: item.mrp - item.price
      },
      stock: {
        inventory: item.inventory,
        isSoldOut: item.isSoldOut,
        productState: item.productState,
        inStock: !item.isSoldOut && item.inventory > 0
      },
      rating: {
        average: item.rating.average,
        totalReviews: item.rating.ratingCount
      },
      images: item.images,
      variants: item.variants,
      storeId: storeId || "14829"
    };

    if (includeFullDetails) {
      formatted.description = item.description;
      // Blinkit Server-Driven UI (SDUI) Snippet representation
      formatted.sduiSnippet = {
        data: {
          identity: { id: item.productId },
          inventory: item.inventory,
          is_sold_out: item.isSoldOut,
          product_state: item.productState,
          normal_price: { text: `₹${item.price}` },
          variant: { text: item.unit },
          stepper_data: { state: { title: { text: item.inventory > 0 ? "enabled" : "disabled" } } },
          rfc_actions_v2: {
            default: [
              {
                remove_from_cart: {
                  cart_item: {
                    product_id: item.productId,
                    product_name: item.name,
                    brand: item.brand,
                    image_url: item.images[0],
                    mrp: item.mrp,
                    price: item.price,
                    unit: item.unit
                  }
                }
              }
            ]
          }
        }
      };
    }

    return formatted;
  }
}
