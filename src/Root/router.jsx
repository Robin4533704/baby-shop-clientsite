import { createBrowserRouter } from "react-router-dom";
import Home from "../page/Home";
import Register from "../page/Register";
import Login from "../page/Login";
import MainLayout from "./MainLayout";
import Products from "../Nav-Section/Products";
import ProductDetails from "../page/ProductDetails";

// ✅ Admin Components"
import UserManagement from "../admin/UserManagement";
import CartPage from "../page/CartPage";
import CheckoutPage from "../page/CheckoutPage";
import OrderNowPage from "../page/OrderPage";
import AboutPage from "../page/AboutPage";
import Dashboard from "../admin/Dashboard";
import AddProduct from "../admin/AddProducts";
import MyOrder from "../page/MyOrder";
import Contact from "../Nav-Section/Contact";
import Overview from "../admin/OverView";
import ManageProducts from "../admin/ManageProducts";
import RevenueDashboard from "../admin/RevenueDashboard";
import Settings from "../admin/Setting";
import { elements } from "chart.js";
import NotificationTab from "../admin/NotificationTabe";
import MyOrders from "../orderpage/MyOrderPage";
import MyAddresses from "../orderpage/AddressesPage";
import CategoriesShowcase from "../page/CategoriesShowcase";
import ButtonCheckoutPage from "../orderpage/ButtonCheckoutPage";
import Categories from "../page/Categories";
import PrivetRoute from "../hooks/privetRout";
import Blog from "../page/Blog";
import Analytics from "../page/Analytics";





const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
      { path: "/products", element: <PrivetRoute><Products /></PrivetRoute>},
      { path: "/products/:id", element: <PrivetRoute><ProductDetails /></PrivetRoute>},
      {path: "/cardpage", element:<CartPage/>},
      {path: "/checkout/:productId", element:<CheckoutPage/>},
      {path:"/about", element:<AboutPage/>},
      {path:"/blog", element:<Blog/>},
      {path:"/contact", element:<Contact/>},
      {path:"/notifications", elements:<PrivetRoute><NotificationTab/></PrivetRoute>},
      {path:"/category", element:<CategoriesShowcase/>},
      {path:"/buttonchack", element:<ButtonCheckoutPage/>},
      {path:"/categories", element:<PrivetRoute><Categories/></PrivetRoute>},
    
      
      
    ],
  },

  // 👑 Admin Routes
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      { path: "add-product", element: <AddProduct/> },
      { path: "users", element: <UserManagement/> },
      {path:"myorder", element:<MyOrder/>},
       {path:"orders", element:<OrderNowPage/>},
       {path:"overview", element: <Overview/>},
       {path:"Products-manaz", element:<ManageProducts/>},
       {path:"revenue", element:<RevenueDashboard/>},
       {path:"settings", element:<Settings/>},
        {path:"myorders", element:<MyOrders/>},
        {path:"myaddresses", element:<MyAddresses/>},
          {path:"analytics", element:<Analytics/>}
    ],
  },
]);

export default router;
