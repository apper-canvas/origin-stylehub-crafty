import { Outlet } from "react-router-dom"
import Header from "@/components/organisms/Header"
import Footer from "@/components/organisms/Footer"
import CartSidebar from "@/components/organisms/CartSidebar"

const Layout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartSidebar />
    </div>
  )
}

export default Layout