import { createSlice } from '@reduxjs/toolkit'

// Load from localStorage
const loadWishlistFromStorage = () => {
  try {
    const wishlist = localStorage.getItem('wishlist')
    return wishlist ? JSON.parse(wishlist) : []
  } catch (error) {
    console.error('Error loading wishlist from storage:', error)
    return []
  }
}

// Save to localStorage
const saveWishlistToStorage = (wishlistItems) => {
  try {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems))
  } catch (error) {
    console.error('Error saving wishlist to storage:', error)
  }
}

const initialState = {
  items: loadWishlistFromStorage(),
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload
      const existingItem = state.items.find(item => item.Id === product.Id)
      
      if (!existingItem) {
        state.items.push(product)
        saveWishlistToStorage(state.items)
      }
    },
    removeFromWishlist: (state, action) => {
      const productId = action.payload
      state.items = state.items.filter(item => item.Id !== productId)
      saveWishlistToStorage(state.items)
    },
    clearWishlist: (state) => {
      state.items = []
      saveWishlistToStorage(state.items)
    }
  }
})

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items
export const selectWishlistItemsCount = (state) => state.wishlist.items.length
export const selectIsInWishlist = (productId) => (state) => 
  state.wishlist.items.some(item => item.Id === productId)

export default wishlistSlice.reducer