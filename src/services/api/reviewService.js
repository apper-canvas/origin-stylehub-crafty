import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const reviewService = {
  // Get all reviews for a product
  async getByProductId(productId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const params = {
        fields: [
          {"field": {"Name": "user_email_c"}},
          {"field": {"Name": "user_name_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "comment_c"}},
          {"field": {"Name": "verified_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "product_id_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ],
        where: [{
          FieldName: "product_id_c",
          Operator: "ExactMatch",
          Values: [parseInt(productId)],
          Include: true
        }],
        orderBy: [{
          fieldName: "CreatedOn",
          sorttype: "DESC"
        }]
      };

      const response = await apperClient.fetchRecords("reviews_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(review => ({
        Id: review.Id,
        productId: review.product_id_c?.Id || parseInt(productId),
        userEmail: review.user_email_c,
        userName: review.user_name_c,
        rating: parseInt(review.rating_c || 0),
        comment: review.comment_c || "",
        verified: review.verified_c === true,
        createdAt: review.CreatedOn,
        updatedAt: review.ModifiedOn
      }));

    } catch (error) {
      console.error("Error fetching reviews for product:", error?.response?.data?.message || error);
      return [];
    }
  },

  // Get reviews by user
  async getByUser(userEmail) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const params = {
        fields: [
          {"field": {"Name": "user_email_c"}},
          {"field": {"Name": "user_name_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "comment_c"}},
          {"field": {"Name": "verified_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "product_id_c"}, "referenceField": {"field": {"Name": "name_c"}}}
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

      const response = await apperClient.fetchRecords("reviews_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(review => ({
        Id: review.Id,
        productId: review.product_id_c?.Id,
        userEmail: review.user_email_c,
        userName: review.user_name_c,
        rating: parseInt(review.rating_c || 0),
        comment: review.comment_c || "",
        verified: review.verified_c === true,
        createdAt: review.CreatedOn,
        updatedAt: review.ModifiedOn
      }));

    } catch (error) {
      console.error("Error fetching user reviews:", error?.response?.data?.message || error);
      return [];
    }
  },

  // Create new review
  async create(reviewData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      // Validate required fields
      if (!reviewData.productId || !reviewData.rating || !reviewData.userEmail) {
        throw new Error("Missing required fields");
      }

      if (reviewData.rating < 1 || reviewData.rating > 5) {
        throw new Error("Rating must be between 1 and 5");
      }

      // Check if user already reviewed this product
      const existingReviews = await this.getByProductId(reviewData.productId);
      const existingReview = existingReviews.find(r => r.userEmail === reviewData.userEmail);
      
      if (existingReview) {
        throw new Error("You have already reviewed this product");
      }

      const params = {
        records: [{
          product_id_c: parseInt(reviewData.productId),
          user_email_c: reviewData.userEmail,
          user_name_c: reviewData.userName || "Anonymous",
          rating_c: parseInt(reviewData.rating),
          comment_c: reviewData.comment?.trim() || "",
          verified_c: true
        }]
      };

      const response = await apperClient.createRecord("reviews_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} reviews:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create review");
        }

        const newReview = successful[0].data;
        return {
          Id: newReview.Id,
          productId: newReview.product_id_c,
          userEmail: newReview.user_email_c,
          userName: newReview.user_name_c,
          rating: parseInt(newReview.rating_c || 0),
          comment: newReview.comment_c || "",
          verified: newReview.verified_c === true,
          createdAt: newReview.CreatedOn
        };
      }

    } catch (error) {
      console.error("Error creating review:", error?.response?.data?.message || error);
      throw error;
    }
  },

  // Update existing review
  async update(id, updateData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
        throw new Error("Rating must be between 1 and 5");
      }

      const updateFields = {};
      if (updateData.rating) updateFields.rating_c = parseInt(updateData.rating);
      if (updateData.comment !== undefined) updateFields.comment_c = updateData.comment?.trim() || "";
      if (updateData.userName) updateFields.user_name_c = updateData.userName;

      const params = {
        records: [{
          Id: parseInt(id),
          ...updateFields
        }]
      };

      const response = await apperClient.updateRecord("reviews_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} reviews:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update review");
        }

        const updatedReview = successful[0].data;
        return {
          Id: updatedReview.Id,
          productId: updatedReview.product_id_c,
          userEmail: updatedReview.user_email_c,
          userName: updatedReview.user_name_c,
          rating: parseInt(updatedReview.rating_c || 0),
          comment: updatedReview.comment_c || "",
          verified: updatedReview.verified_c === true,
          createdAt: updatedReview.CreatedOn,
          updatedAt: updatedReview.ModifiedOn
        };
      }

    } catch (error) {
      console.error("Error updating review:", error?.response?.data?.message || error);
      throw error;
    }
  },

  // Delete review
  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("reviews_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} reviews:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to delete review");
        }

        return successful.length > 0;
      }

    } catch (error) {
      console.error("Error deleting review:", error?.response?.data?.message || error);
      throw error;
    }
  },

  // Get review statistics for a product
  async getProductStats(productId) {
    try {
      const productReviews = await this.getByProductId(productId);

      if (productReviews.length === 0) {
        return {
          averageRating: 0,
          totalReviews: 0,
          ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        };
      }

      const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / productReviews.length;

      const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      productReviews.forEach(review => {
        ratingBreakdown[review.rating]++;
      });

      return {
        averageRating: Number(averageRating.toFixed(1)),
        totalReviews: productReviews.length,
        ratingBreakdown
      };

    } catch (error) {
      console.error("Error getting product stats:", error?.response?.data?.message || error);
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }
  }
};