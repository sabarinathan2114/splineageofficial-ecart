import React from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    ShoppingBag,
    DollarSign,
    BarChart3,
    Truck,
    MapPin,
    RotateCcw,
    LogOut,
    Search,
    Bell,
    ChevronDown
} from 'lucide-react';
import { useLogoutMutation } from '../redux/api/userApiSlice';
import { logout } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';

const AdminLayout = () => {
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
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Users', path: '/admin/userlist', icon: Users },
        { name: 'B2B Management', path: '/admin/b2b', icon: Briefcase },
        { name: 'Orders', path: '/admin/orderlist', icon: ShoppingBag },
        { name: 'Delivery (Outstation)', path: '/admin/delivery-outstation', icon: Truck },
        { name: 'Local Delivery (Chennai)', path: '/admin/delivery-local', icon: MapPin },
        { name: 'Refunds', path: '/admin/refunds', icon: RotateCcw },
        { name: 'Exchanges', path: '/admin/exchanges', icon: RotateCcw },
    ];

    return (
        <div className="flex h-screen bg-[#F4F7FE] overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-[#000000] text-white flex flex-col hidden md:flex shrink-0">
                {/* Logo Area */}
                <div className="h-20 flex items-center px-6 mb-2">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-red-600 text-white font-black text-2xl w-10 h-10 flex items-center justify-center rounded-lg shadow-lg shadow-red-600/20">7</div>
                        <span className="text-2xl font-black tracking-tighter text-white uppercase italic">Seven</span>
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto py-2 flex flex-col gap-1 px-3 custom-scrollbar">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${isActive
                                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`
                            }
                        >
                            <item.icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110`} />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                {/* Profile / Logout Area */}
                <div className="p-4 bg-[#111111]">
                    <div className="bg-[#1A1A1A] rounded-2xl p-3 flex items-center justify-between border border-white/5">
                        <Link to="/profile" className="flex items-center gap-3 overflow-hidden flex-1 group">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-white/10 overflow-hidden">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${userInfo?.name}&background=random&color=fff`}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs font-bold text-white truncate">{userInfo?.name}</p>
                                <p className="text-[10px] text-gray-500 truncate">{userInfo?.email}</p>
                            </div>
                        </Link>
                        <button
                            onClick={logoutHandler}
                            className="text-gray-500 hover:text-red-500 transition-colors p-2 shrink-0 bg-white/5 rounded-xl"
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
                    <div className="flex items-center gap-4 md:hidden">
                        <Link to="/" className="bg-red-600 text-white font-black text-xl w-8 h-8 flex items-center justify-center rounded">7</Link>
                        <span className="text-xl font-black text-slate-900 uppercase italic">Seven</span>
                    </div>

                    <div className="flex-1 max-w-xl mx-8 hidden lg:block">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-red-600/20 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2.5 bg-slate-50 text-slate-500 rounded-2xl hover:bg-slate-100 transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="h-10 w-[1px] bg-slate-100 mx-2 hidden sm:block"></div>

                        <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden group-hover:border-red-600/30 transition-colors">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${userInfo?.name}&background=3b82f6&color=fff`}
                                    alt="Admin Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-bold text-slate-900 flex items-center gap-1 group-hover:text-red-600 transition-colors">
                                    {userInfo?.name}
                                    <ChevronDown className="w-3.5 h-3.5" />
                                </p>
                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
