import React from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LayoutDashboard, Package, ShoppingBag, LogOut, User, DollarSign, BarChart3, Truck, RefreshCw, RotateCcw } from 'lucide-react';
import { useLogoutMutation } from '../redux/api/userApiSlice';
import { logout } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';

const SellerLayout = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/login');
            toast.success('Logged out successfully');
        } catch (err) {
            console.error(err);
        }
    };

    const navItems = [
        { name: 'Dashboard', path: '/seller/dashboard', icon: LayoutDashboard },
        { name: 'Products', path: '/seller/products', icon: Package },
        { name: 'Orders', path: '/seller/orders', icon: ShoppingBag },
        { name: 'Delivery', path: '/seller/delivery-outstation', icon: Truck },
        { name: 'Payments & Finance', path: '/seller/payments', icon: DollarSign },
        { name: 'Reports', path: '/seller/reports', icon: BarChart3 },
        { name: 'Refunds', path: '/seller/refunds', icon: RotateCcw },
        { name: 'Exchanges', path: '/seller/exchanges', icon: RefreshCw },
    ];

    return (
        <div className="flex h-screen bg-[#F4F7FE] overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0B1120] text-white flex flex-col hidden md:flex">
                {/* Logo Area */}
                <div className="h-20 flex items-center px-6 border-b border-gray-800">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-white text-[#0B1120] font-black text-xl p-1 rounded">eS</div>
                        <span className="text-xl font-black tracking-tight text-white italic">e<span className="text-blue-500">SHOP</span> <span className="text-slate-400 font-medium text-xs not-italic uppercase tracking-widest ml-1">Seller</span></span>
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-3 scrollbar-hide [&::-webkit-scrollbar]:hidden">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all relative ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                {/* Profile / Logout Area */}
                <div className="p-4 border-t border-gray-800">
                    <div className="bg-gray-800/50 rounded-lg p-3 flex items-center justify-between">
                        <Link to="/seller/profile" className="flex items-center gap-3 overflow-hidden flex-1 group">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors">{userInfo?.name}</p>
                                <p className="text-[10px] text-gray-400 truncate">{userInfo?.email}</p>
                            </div>
                        </Link>
                        <button
                            onClick={logoutHandler}
                            className="text-slate-400 hover:text-blue-500 transition-colors p-1 ml-2 shrink-0"
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top Header (Mobile mainly) */}
                <header className="h-auto py-5 bg-white border-b border-gray-100 flex flex-col px-6 shrink-0 md:hidden gap-y-5">
                    <div className="flex items-center justify-between w-full">
                        <Link to="/" className="flex items-center gap-2 shrink-0">
                            <div className="bg-[#0B1120] text-white font-black text-lg px-2 py-0.5 rounded shadow-lg shadow-blue-500/10">eS</div>
                            <span className="text-lg font-black tracking-tight text-[#0B1120] italic">e<span className="text-blue-600">SHOP</span> <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase ml-1 not-italic">Hub</span></span>
                        </Link>
                        <Link to="/seller/profile" className="p-2.5 rounded-xl text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-[#0B1120] shrink-0 transition-all">
                            <User className="w-5 h-5" />
                        </Link>
                    </div>

                    <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2 -mx-6 px-6 items-center border-t border-slate-50 font-sans">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex flex-col items-center min-w-[65px] pt-4 pb-2 relative transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-40 hover:opacity-100'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <item.icon className={`w-4 h-4 mb-1 transition-all ${isActive ? 'text-blue-600 scale-110 drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]' : 'text-slate-500'}`} />
                                        <span className={`text-[8px] font-black uppercase tracking-wider transition-colors ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
                                            {item.name.split(' ')[0]}
                                        </span>
                                        {isActive && (
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-blue-600 rounded-b-full shadow-[0_2px_10px_rgba(37,99,235,0.8)] animate-in slide-in-from-top-1" />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default SellerLayout;
