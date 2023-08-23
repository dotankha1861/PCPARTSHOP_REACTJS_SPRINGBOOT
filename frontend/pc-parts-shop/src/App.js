import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import LoginAdmin from "./pages/Admin/LoginAdmin";
import DashBoard from "./pages/Admin/DashBoard";
import LayoutAdmin  from "./layouts/LayoutAdmin";
import Profile from "./pages/Admin/Profile";
import User from "./pages/Admin/User";
import Category from "./pages/Admin/Category";
import Product from "./pages/Admin/Product";
import Attribute from "./pages/Admin/Attribute";
import Order from "./pages/Admin/Order";
import Inventory from "./pages/Admin/Inventory";
import InventorySheet from "./pages/Admin/InventorySheet";
import Statistic from "./pages/Admin/Statistic";
import Promotion from "./pages/Admin/Promotion";
import LayoutCustomer from "./layouts/LayoutCustomer";
import Employee from "./pages/Admin/Employee";
import Customer from "./pages/Admin/Customer";
import CusOrder from "./pages/Customer/Order";
import Home from "./pages/Customer/Home";
import CusProduct from "./pages/Customer/Product";
import ResetPassword from "./pages/ResetPassword";
import CusProfile from "./pages/Customer/Profile";
import ProductDetail from "./pages/Customer/ProductDetail";
import HistoryOrder from "./pages/Customer/HistoryOrder";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<LayoutAdmin/>}>
          <Route element={<DashBoard/>}/>
          <Route index path="/admin/login" element={<LoginAdmin/>}/>
          <Route path="/admin/profile" element={<Profile/>}/>
          <Route path="/admin/employees" element={<Employee/>}/>
          <Route path="/admin/customers" element={<Customer/>}/>
          <Route path="/admin/categories" element={<Category/>}/>
          <Route path="/admin/products" element={<Product/>}/>
          <Route path="/admin/attributes" element={<Attribute/>}/>
          <Route path="/admin/orders" element={<Order/>}/>
          <Route path="/admin/promotions" element={<Promotion/>}/>
          <Route path="/admin/inventory-sheets" element={<InventorySheet/>}/>
          <Route path="/admin/inventories" element={<Inventory/>}/>
          <Route path="/admin/statistics" element={<Statistic/>}/>
        </Route>
        <Route path="/" element={<LayoutCustomer/>}>
          <Route index path="/" element={<Home/>}/>
          <Route path="/:category" element={<CusProduct/>}/>
          <Route path="/order" element={<CusOrder/>}/>
          <Route path="/profile" element={<CusProfile/>}></Route>
          <Route path="/:category/:product" element={<ProductDetail/>}/>
          <Route path="/history-order" element={<HistoryOrder/>}/>
        </Route>
        <Route path="/reset-password/:token" element={<ResetPassword/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
