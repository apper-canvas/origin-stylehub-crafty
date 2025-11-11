import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Shop from "@/components/pages/Shop";
import Reviews from "@/components/pages/Reviews";
import Login from "@/components/pages/Login";
import Home from "@/components/pages/Home";
import MobileMenu from "@/components/molecules/MobileMenu";
import SearchBar from "@/components/molecules/SearchBar";
import { useAuth } from "@/layouts/Root";
import { selectWishlistItemsCount } from "@/store/slices/wishlistSlice";
import { selectCartItemsCount, toggleCart } from "@/store/slices/cartSlice";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { logout } = useAuth()
  const { user, isAuthenticated } = useSelector(state => state.user)
  
  const cartItemsCount = useSelector(selectCartItemsCount)
  const wishlistItemsCount = useSelector(selectWishlistItemsCount)

  const categories = [
    { name: "Women", path: "/shop?category=women" },
    { name: "Men", path: "/shop?category=men" },
    { name: "Accessories", path: "/shop?category=accessories" },
    { name: "Shoes", path: "/shop?category=shoes" },
  ]

  const handleSearchSubmit = (query) => {
    navigate(`/shop?search=${encodeURIComponent(query)}`)
  }

  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    await logout()
    setIsDropdownOpen(false)
  }
  return (
    <>
      <header className="bg-surface shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-2xl font-display font-bold text-primary">
                Style<span className="text-accent">Hub</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-primary hover:text-accent transition-colors font-medium">
                Home
              </Link>
              
              <div className="relative group">
                <Link to="/shop" className="text-primary hover:text-accent transition-colors font-medium">
                  Shop
                </Link>
                
                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 w-48 bg-surface shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="py-2">
                    <Link
                      to="/shop"
                      className="block px-4 py-2 text-sm text-primary hover:bg-secondary hover:text-accent transition-colors"
                    >
                      All Products
                    </Link>
                    <div className="border-t border-secondary my-1"></div>
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        to={category.path}
                        className="block px-4 py-2 text-sm text-primary hover:bg-secondary hover:text-accent transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link to="/shop?collection=featured" className="text-primary hover:text-accent transition-colors font-medium">
                Collections
              </Link>
              <Link to="/shop?sale=true" className="text-primary hover:text-accent transition-colors font-medium">
                Sale
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden lg:block">
              <SearchBar onSearch={handleSearchSubmit} />
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              {/* Mobile Search Toggle */}
              <button className="lg:hidden p-2 text-primary hover:text-accent transition-colors">
                <ApperIcon name="Search" size={20} />
              </button>

              {/* User Account / Auth */}
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 p-2 text-primary hover:text-accent transition-colors"
                  >
                    <ApperIcon name="User" size={20} />
                    <span className="hidden sm:block text-sm font-medium">
                      {user?.firstName || user?.name || 'Account'}
                    </span>
                    <ApperIcon name="ChevronDown" size={16} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 top-full w-48 bg-surface shadow-lg rounded-md py-2 z-10">
                      <div className="px-4 py-2 border-b border-secondary">
                        <p className="text-sm font-medium text-primary">
                          {user?.firstName || user?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user?.emailAddress || user?.email}
                        </p>
                      </div>
                      <Link
                        to="/orders"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-primary hover:bg-secondary hover:text-accent transition-colors"
                      >
                        Order History
                      </Link>
                      <Link
                        to="/reviews"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-primary hover:bg-secondary hover:text-accent transition-colors"
                      >
                        My Reviews
                      </Link>
                      <div className="border-t border-secondary my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-primary hover:bg-secondary hover:text-accent transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-1 p-2 text-primary hover:text-accent transition-colors"
                >
                  <ApperIcon name="User" size={20} />
                  <span className="hidden sm:block text-sm font-medium">Login</span>
                </Link>
              )}

              {/* Wishlist */}
              <Link to="/wishlist" className="relative p-2 text-primary hover:text-accent transition-colors">
                <ApperIcon name="Heart" size={20} />
                {wishlistItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-surface text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {wishlistItemsCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={() => dispatch(toggleCart())}
                className="relative p-2 text-primary hover:text-accent transition-colors"
              >
                <ApperIcon name="ShoppingBag" size={20} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-surface text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-primary hover:text-accent transition-colors"
              >
                <ApperIcon name="Menu" size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden border-t border-secondary px-4 py-3">
          <SearchBar onSearch={handleSearchSubmit} autoFocus={false} />
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} categories={categories} />
    </>
}

export default Header