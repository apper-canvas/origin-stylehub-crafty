import { createSlice } from "@reduxjs/toolkit"

const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem("stylehub-cart")
    return savedCart ? JSON.parse(savedCart) : []
  } catch (error) {
    console.error("Error loading cart from localStorage:", error)
    return []
  }
}

const saveCartToStorage = (cartItems) => {
  try {
    localStorage.setItem("stylehub-cart", JSON.stringify(cartItems))
  } catch (error) {
    console.error("Error saving cart to localStorage:", error)
  }
}

const initialState = {
  items: loadCartFromStorage(),
  isCartOpen: false,
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { productId, name, price, size, color, image } = action.payload
      const existingItem = state.items.find(
        item => item.productId === productId && item.size === size && item.color === color
      )

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({
          productId,
          name,
          price,
          quantity: 1,
          size,
          color,
          image,
        })
      }

      saveCartToStorage(state.items)
    },
    removeFromCart: (state, action) => {
      const { productId, size, color } = action.payload
      state.items = state.items.filter(
        item => !(item.productId === productId && item.size === size && item.color === color)
      )
      saveCartToStorage(state.items)
    },
    updateQuantity: (state, action) => {
      const { productId, size, color, quantity } = action.payload
      const item = state.items.find(
        item => item.productId === productId && item.size === size && item.color === color
      )
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            item => !(item.productId === productId && item.size === size && item.color === color)
          )
        } else {
          item.quantity = quantity
        }
      }
      
      saveCartToStorage(state.items)
    },
    clearCart: (state) => {
      state.items = []
      saveCartToStorage(state.items)
    },
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen
    },
    closeCart: (state) => {
      state.isCartOpen = false
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, closeCart } = cartSlice.actions

export const selectCartItems = (state) => state.cart.items
export const selectCartTotal = (state) => 
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0)
export const selectCartItemsCount = (state) => 
  state.cart.items.reduce((count, item) => count + item.quantity, 0)
export const selectIsCartOpen = (state) => state.cart.isCartOpen

export default cartSlice.reducer