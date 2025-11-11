import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

export const orderService = {
  // Get orders for a specific user
  async getUserOrders(userEmail) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const params = {
        fields: [
          {"field": {"Name": "user_email_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "items_c"}},
          {"field": {"Name": "subtotal_c"}},
          {"field": {"Name": "shipping_c"}},
          {"field": {"Name": "tax_c"}},
          {"field": {"Name": "total_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "payment_method_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          FieldName: "user_email_c",
          Operator: "ExactMatch",
          Values: [userEmail],
          Include: true
        }],
        orderBy: [{
          fieldName: "CreatedOn",
          sorttype: "DESC"
        }]
      };

      const response = await apperClient.fetchRecords("orders_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(order => ({
        Id: order.Id,
        userEmail: order.user_email_c,
        status: order.status_c || "confirmed",
        items: order.items_c ? JSON.parse(order.items_c) : [],
        subtotal: parseFloat(order.subtotal_c || 0),
        shipping: parseFloat(order.shipping_c || 0),
        tax: parseFloat(order.tax_c || 0),
        total: parseFloat(order.total_c || 0),
        shippingAddress: order.shipping_address_c ? JSON.parse(order.shipping_address_c) : {},
        paymentMethod: order.payment_method_c || "Credit Card",
        createdAt: order.CreatedOn
      }));

    } catch (error) {
      console.error("Error fetching user orders:", error?.response?.data?.message || error);
      return [];
    }
  },

  // Get all orders (for general order history when no user specified)
  async getAllOrders() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const params = {
        fields: [
          {"field": {"Name": "user_email_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "items_c"}},
          {"field": {"Name": "subtotal_c"}},
          {"field": {"Name": "shipping_c"}},
          {"field": {"Name": "tax_c"}},
          {"field": {"Name": "total_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "payment_method_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{
          fieldName: "CreatedOn",
          sorttype: "DESC"
        }]
      };

      const response = await apperClient.fetchRecords("orders_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(order => ({
        Id: order.Id,
        userEmail: order.user_email_c,
        status: order.status_c || "confirmed",
        items: order.items_c ? JSON.parse(order.items_c) : [],
        subtotal: parseFloat(order.subtotal_c || 0),
        shipping: parseFloat(order.shipping_c || 0),
        tax: parseFloat(order.tax_c || 0),
        total: parseFloat(order.total_c || 0),
        shippingAddress: order.shipping_address_c ? JSON.parse(order.shipping_address_c) : {},
        paymentMethod: order.payment_method_c || "Credit Card",
        createdAt: order.CreatedOn
      }));

    } catch (error) {
      console.error("Error fetching all orders:", error?.response?.data?.message || error);
      return [];
    }
  },

  // Get order by ID
  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const params = {
        fields: [
          {"field": {"Name": "user_email_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "items_c"}},
          {"field": {"Name": "subtotal_c"}},
          {"field": {"Name": "shipping_c"}},
          {"field": {"Name": "tax_c"}},
          {"field": {"Name": "total_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "payment_method_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      };

      const response = await apperClient.getRecordById("orders_c", parseInt(id), params);
      
      if (!response.success || !response.data) {
        throw new Error("Order not found");
      }

      const order = response.data;
      return {
        Id: order.Id,
        userEmail: order.user_email_c,
        status: order.status_c || "confirmed",
        items: order.items_c ? JSON.parse(order.items_c) : [],
        subtotal: parseFloat(order.subtotal_c || 0),
        shipping: parseFloat(order.shipping_c || 0),
        tax: parseFloat(order.tax_c || 0),
        total: parseFloat(order.total_c || 0),
        shippingAddress: order.shipping_address_c ? JSON.parse(order.shipping_address_c) : {},
        paymentMethod: order.payment_method_c || "Credit Card",
        createdAt: order.CreatedOn
      };

    } catch (error) {
      console.error("Error fetching order:", error?.response?.data?.message || error);
      throw new Error("Order not found");
    }
  },

  // Check if user has purchased a product
  async hasPurchased(userEmail, productId) {
    try {
      const userOrders = await this.getUserOrders(userEmail);
      
      return userOrders.some(order => 
        order.items.some(item => item.productId === parseInt(productId))
      );

    } catch (error) {
      console.error("Error checking purchase history:", error?.response?.data?.message || error);
      return false;
    }
  },

  // Create a new order
  async create(orderData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      // Transform cart items for storage
      const items = orderData.items.map(item => ({
        productId: item.productId || item.Id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: item.image
      }));

      const params = {
        records: [{
          user_email_c: orderData.shippingAddress.email,
          status_c: "confirmed",
          items_c: JSON.stringify(items),
          subtotal_c: orderData.subtotal,
          shipping_c: orderData.shipping,
          tax_c: orderData.tax,
          total_c: orderData.total,
          shipping_address_c: JSON.stringify(orderData.shippingAddress),
          payment_method_c: orderData.paymentMethod
        }]
      };

      const response = await apperClient.createRecord("orders_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} orders:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create order");
        }

        const newOrder = successful[0].data;
        return {
          Id: newOrder.Id,
          userEmail: newOrder.user_email_c,
          status: newOrder.status_c || "confirmed",
          items: JSON.parse(newOrder.items_c || "[]"),
          subtotal: parseFloat(newOrder.subtotal_c || 0),
          shipping: parseFloat(newOrder.shipping_c || 0),
          tax: parseFloat(newOrder.tax_c || 0),
          total: parseFloat(newOrder.total_c || 0),
          shippingAddress: JSON.parse(newOrder.shipping_address_c || "{}"),
          paymentMethod: newOrder.payment_method_c || "Credit Card",
          createdAt: newOrder.CreatedOn
        };
      }

    } catch (error) {
      console.error("Error creating order:", error?.response?.data?.message || error);
      throw error;
}
  }
};