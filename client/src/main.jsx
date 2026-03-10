import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './App.jsx';
import HomeScreen from './pages/HomeScreen.jsx';
import ProductScreen from './pages/ProductScreen.jsx';
import CartScreen from './pages/CartScreen.jsx';
import LoginScreen from './pages/LoginScreen.jsx';
import RegisterScreen from './pages/RegisterScreen.jsx';
import ShippingScreen from './pages/ShippingScreen.jsx';
import PaymentScreen from './pages/PaymentScreen.jsx';
import PlaceOrderScreen from './pages/PlaceOrderScreen.jsx';
import OrderScreen from './pages/OrderScreen.jsx';
import ProfileScreen from './pages/ProfileScreen.jsx';
import AdminDashboardScreen from './pages/admin/AdminDashboardScreen.jsx';
import UserListScreen from './pages/admin/UserListScreen.jsx';
import UserEditScreen from './pages/admin/UserEditScreen.jsx';
import ProductListScreen from './pages/admin/ProductListScreen.jsx';
import ProductEditScreen from './pages/admin/ProductEditScreen.jsx';
import OrderListScreen from './pages/admin/OrderListScreen.jsx';
import SellerListScreen from './pages/admin/SellerListScreen.jsx';
import SellerScreen from './pages/seller/SellerScreen.jsx';
import SellerDashboard from './pages/seller/SellerDashboard.jsx';
import SellerOrdersScreen from './pages/seller/SellerOrdersScreen.jsx';
import SellerLayout from './components/SellerLayout.jsx';
import PaymentsFinanceScreen from './pages/admin/PaymentsFinanceScreen.jsx';
import ReportsScreen from './pages/admin/ReportsScreen.jsx';
import CollectionsScreen from './pages/CollectionsScreen.jsx';
import DeliveryScreen from './pages/seller/DeliveryScreen.jsx';
import RefundsScreen from './pages/seller/RefundsScreen.jsx';
import ExchangesScreen from './pages/seller/ExchangesScreen.jsx';
import './index.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/search/:keyword" element={<HomeScreen />} />
      <Route path="/collections" element={<CollectionsScreen />} />
      <Route path="/product/:id" element={<ProductScreen />} />
      <Route path="/cart" element={<CartScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/shipping" element={<ShippingScreen />} />
      <Route path="/payment" element={<PaymentScreen />} />
      <Route path="/placeorder" element={<PlaceOrderScreen />} />
      <Route path="/order/:id" element={<OrderScreen />} />
      <Route path="/profile" element={<ProfileScreen />} />

      {/* Admin Routes */}
      <Route path="/admin">
        <Route path="dashboard" element={<AdminDashboardScreen />} />
        <Route path="userlist" element={<UserListScreen />} />
        <Route path="user/:id/edit" element={<UserEditScreen />} />
        <Route path="sellerlist" element={<SellerListScreen />} />
        <Route path="productlist" element={<ProductListScreen />} />
        <Route path="orderlist" element={<OrderListScreen />} />
      </Route>

      <Route path="/seller" element={<SellerLayout />}>
        <Route path="dashboard" element={<SellerDashboard />} />
        <Route path="products" element={<SellerScreen />} />
        <Route path="product/:id/edit" element={<ProductEditScreen />} />
        <Route path="orders" element={<SellerOrdersScreen />} />
        <Route path="payments" element={<PaymentsFinanceScreen />} />
        <Route path="reports" element={<ReportsScreen />} />
        <Route path="profile" element={<ProfileScreen />} />
        <Route path="delivery-outstation" element={<DeliveryScreen />} />
        <Route path="refunds" element={<RefundsScreen />} />
        <Route path="exchanges" element={<ExchangesScreen />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
