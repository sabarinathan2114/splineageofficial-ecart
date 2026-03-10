import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPopup from './components/LoginPopup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { pathname } = useLocation();
  const isSellerRoute = pathname.startsWith('/seller');
  const isSpecialRoute = isSellerRoute;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      {!isSpecialRoute && <Header />}
      {!isSpecialRoute && <LoginPopup />}

      {isSpecialRoute ? (
        <Outlet />
      ) : (
        <main className="flex-grow container mx-auto px-4 py-8">
          <Outlet />
        </main>
      )}

      {!isSpecialRoute && <Footer />}
    </div>
  );
}

export default App;
