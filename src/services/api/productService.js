import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

export const productService = {
  async getAll(filters = {}) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      // Build where conditions for filtering
      const whereConditions = [];
      const whereGroups = [];

      // Category filter
      if (filters.categories && filters.categories.length > 0) {
        whereConditions.push({
          FieldName: "category_c",
          Operator: "ExactMatch",
          Values: filters.categories,
          Include: true
        });
      }

      // Search filter
      if (filters.search) {
        whereGroups.push({
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {
                  fieldName: "name_c",
                  operator: "Contains",
                  values: [filters.search]
                },
                {
                  fieldName: "description_c", 
                  operator: "Contains",
                  values: [filters.search]
                },
                {
                  fieldName: "category_c",
                  operator: "Contains", 
                  values: [filters.search]
                }
              ],
              operator: "OR"
            }
          ]
        });
      }

      // Price range filter
      if (filters.minPrice !== undefined) {
        whereConditions.push({
          FieldName: "price_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.minPrice.toString()],
          Include: true
        });
      }
      if (filters.maxPrice !== undefined) {
        whereConditions.push({
          FieldName: "price_c", 
          Operator: "LessThanOrEqualTo",
          Values: [filters.maxPrice.toString()],
          Include: true
        });
      }

      // Size filter
      if (filters.sizes && filters.sizes.length > 0) {
        whereConditions.push({
          FieldName: "sizes_c",
          Operator: "Contains", 
          Values: filters.sizes,
          Include: true
        });
      }

      // Color filter
      if (filters.colors && filters.colors.length > 0) {
        whereConditions.push({
          FieldName: "colors_c",
          Operator: "Contains",
          Values: filters.colors,
          Include: true
        });
      }

      // Sale filter
      if (filters.sale) {
        whereGroups.push({
          operator: "AND",
          subGroups: [
            {
              conditions: [
                {
                  fieldName: "original_price_c",
                  operator: "HasValue",
                  values: [""]
                },
                {
                  fieldName: "price_c",
                  operator: "LessThan",
                  values: ["original_price_c"]
                }
              ],
              operator: "AND"
            }
          ]
        });
      }

      // Build sorting
      let orderBy = [];
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case "price-low":
            orderBy = [{ fieldName: "price_c", sorttype: "ASC" }];
            break;
          case "price-high":
            orderBy = [{ fieldName: "price_c", sorttype: "DESC" }];
            break;
          case "name":
            orderBy = [{ fieldName: "name_c", sorttype: "ASC" }];
            break;
          case "rating":
            orderBy = [{ fieldName: "rating_c", sorttype: "DESC" }];
            break;
          case "newest":
            orderBy = [{ fieldName: "CreatedOn", sorttype: "DESC" }];
            break;
        }
      }

      const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}}, 
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "stock_c"}},
          {"field": {"Name": "sizes_c"}},
          {"field": {"Name": "colors_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: whereConditions,
        whereGroups: whereGroups.length > 0 ? whereGroups : undefined,
        orderBy: orderBy.length > 0 ? orderBy : undefined,
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords("products_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database records to match UI expectations
      return (response.data || []).map(product => ({
        Id: product.Id,
        name: product.name_c,
        description: product.description_c, 
        price: parseFloat(product.price_c || 0),
        originalPrice: product.original_price_c ? parseFloat(product.original_price_c) : null,
        category: product.category_c,
        images: product.images_c ? product.images_c.split(',').map(img => img.trim()) : [],
        rating: parseFloat(product.rating_c || 0),
        stock: parseInt(product.stock_c || 0),
        sizes: product.sizes_c ? product.sizes_c.split(',').map(size => size.trim()) : [],
        colors: product.colors_c ? product.colors_c.split(',').map(color => ({ name: color.trim(), hex: getColorHex(color.trim()) })) : [],
        featured: product.featured_c === true,
        tags: product.Tags ? product.Tags.split(',').map(tag => tag.trim()) : []
      }));

    } catch (error) {
      console.error("Error fetching products:", error?.response?.data?.message || error);
      toast.error("Failed to load products");
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "stock_c"}},
          {"field": {"Name": "sizes_c"}},
          {"field": {"Name": "colors_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };

      const response = await apperClient.getRecordById("products_c", parseInt(id), params);
      
      if (!response.success || !response.data) {
        throw new Error("Product not found");
      }

      const product = response.data;
      return {
        Id: product.Id,
        name: product.name_c,
        description: product.description_c,
        price: parseFloat(product.price_c || 0),
        originalPrice: product.original_price_c ? parseFloat(product.original_price_c) : null,
        category: product.category_c,
        images: product.images_c ? product.images_c.split(',').map(img => img.trim()) : [],
        rating: parseFloat(product.rating_c || 0),
        stock: parseInt(product.stock_c || 0),
        sizes: product.sizes_c ? product.sizes_c.split(',').map(size => size.trim()) : [],
        colors: product.colors_c ? product.colors_c.split(',').map(color => ({ name: color.trim(), hex: getColorHex(color.trim()) })) : [],
        featured: product.featured_c === true,
        tags: product.Tags ? product.Tags.split(',').map(tag => tag.trim()) : []
      };

    } catch (error) {
      console.error("Error fetching product:", error?.response?.data?.message || error);
      throw new Error("Product not found");
    }
  },

  async getFeatured() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "stock_c"}},
          {"field": {"Name": "sizes_c"}},
          {"field": {"Name": "colors_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [{
          FieldName: "featured_c",
          Operator: "ExactMatch",
          Values: [true],
          Include: true
        }],
        pagingInfo: {
          limit: 8,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords("products_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(product => ({
        Id: product.Id,
        name: product.name_c,
        description: product.description_c,
        price: parseFloat(product.price_c || 0),
        originalPrice: product.original_price_c ? parseFloat(product.original_price_c) : null,
        category: product.category_c,
        images: product.images_c ? product.images_c.split(',').map(img => img.trim()) : [],
        rating: parseFloat(product.rating_c || 0),
        stock: parseInt(product.stock_c || 0),
        sizes: product.sizes_c ? product.sizes_c.split(',').map(size => size.trim()) : [],
        colors: product.colors_c ? product.colors_c.split(',').map(color => ({ name: color.trim(), hex: getColorHex(color.trim()) })) : [],
        featured: product.featured_c === true,
        tags: product.Tags ? product.Tags.split(',').map(tag => tag.trim()) : []
      }));

    } catch (error) {
      console.error("Error fetching featured products:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByCategory(category) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "stock_c"}},
          {"field": {"Name": "sizes_c"}},
          {"field": {"Name": "colors_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [{
          FieldName: "category_c",
          Operator: "ExactMatch",
          Values: [category],
          Include: true
        }]
      };

      const response = await apperClient.fetchRecords("products_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(product => ({
        Id: product.Id,
        name: product.name_c,
        description: product.description_c,
        price: parseFloat(product.price_c || 0),
        originalPrice: product.original_price_c ? parseFloat(product.original_price_c) : null,
        category: product.category_c,
        images: product.images_c ? product.images_c.split(',').map(img => img.trim()) : [],
        rating: parseFloat(product.rating_c || 0),
        stock: parseInt(product.stock_c || 0),
        sizes: product.sizes_c ? product.sizes_c.split(',').map(size => size.trim()) : [],
        colors: product.colors_c ? product.colors_c.split(',').map(color => ({ name: color.trim(), hex: getColorHex(color.trim()) })) : [],
        featured: product.featured_c === true,
        tags: product.Tags ? product.Tags.split(',').map(tag => tag.trim()) : []
      }));

    } catch (error) {
      console.error("Error fetching products by category:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getRelated(productId, limit = 4) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      // First get the current product to determine its category
      const currentProduct = await this.getById(productId);
      if (!currentProduct) return [];

      const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "stock_c"}},
          {"field": {"Name": "sizes_c"}},
          {"field": {"Name": "colors_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [
          {
            FieldName: "category_c",
            Operator: "ExactMatch",
            Values: [currentProduct.category],
            Include: true
          },
          {
            FieldName: "Id",
            Operator: "NotEqualTo", 
            Values: [productId.toString()],
            Include: true
          }
        ],
        pagingInfo: {
          limit: limit,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords("products_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(product => ({
        Id: product.Id,
        name: product.name_c,
        description: product.description_c,
        price: parseFloat(product.price_c || 0),
        originalPrice: product.original_price_c ? parseFloat(product.original_price_c) : null,
        category: product.category_c,
        images: product.images_c ? product.images_c.split(',').map(img => img.trim()) : [],
        rating: parseFloat(product.rating_c || 0),
        stock: parseInt(product.stock_c || 0),
        sizes: product.sizes_c ? product.sizes_c.split(',').map(size => size.trim()) : [],
        colors: product.colors_c ? product.colors_c.split(',').map(color => ({ name: color.trim(), hex: getColorHex(color.trim()) })) : [],
        featured: product.featured_c === true,
        tags: product.Tags ? product.Tags.split(',').map(tag => tag.trim()) : []
      }));

    } catch (error) {
      console.error("Error fetching related products:", error?.response?.data?.message || error);
      return [];
    }
  }
};

// Helper function to get color hex values
function getColorHex(colorName) {
  const colorMap = {
    'Black': '#000000',
    'White': '#FFFFFF', 
    'Gray': '#8B8B8B',
    'Navy': '#1F2937',
    'Brown': '#8B4513',
    'Beige': '#F5F5DC',
    'Red': '#EF4444',
    'Blue': '#3B82F6'
};
  return colorMap[colorName] || '#CCCCCC';
}