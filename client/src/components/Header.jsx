import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Search, Zap, Package, Users, Store, ShoppingBag, Clock } from 'lucide-react';
import { useLogoutMutation } from '../redux/api/userApiSlice';
import { logout } from '../redux/slices/authSlice';
import SearchBox from './SearchBox';

const Header = () => {
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const dropdownRef = React.useRef(null);
    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);
    const timeoutRef = React.useRef(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutApiCall] = useLogoutMutation();

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle mouse events for hover (Desktop only)
    const handleMouseEnter = () => {
        if (window.innerWidth >= 768) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setDropdownOpen(true);
        }
    };

    const handleMouseLeave = () => {
        if (window.innerWidth >= 768) {
            timeoutRef.current = setTimeout(() => {
                setDropdownOpen(false);
            }, 300); // 300ms buffer to cross gaps
        }
    };

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
        } catch (err) {
            console.error('Logout API Error:', err);
        } finally {
            dispatch(logout());
            setDropdownOpen(false);
            navigate('/login');
        }
    };

    return (
        <header className="bg-slate-900 text-white shadow-lg sticky-top z-50">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="text-xl sm:text-2xl font-black tracking-tighter text-white hover:text-blue-400 transition-colors uppercase leading-none">
                    e<span className="text-blue-500">Shop</span>
                </Link>

                <div className="hidden md:flex flex-1 mx-8 max-w-md">
                    <SearchBox />
                </div>

                <nav className="flex items-center space-x-3 sm:space-x-6">
                    <Link to="/cart" className="relative flex items-center hover:text-blue-400 transition-colors">
                        <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                        {cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-slate-900 leading-none">
                                {cartItems.reduce((a, c) => a + c.qty, 0)}
                            </span>
                        )}
                        <span className="hidden lg:inline ml-2 text-sm font-black uppercase tracking-widest">Cart</span>
                    </Link>


                    {userInfo ? (
                        <div
                            className="relative"
                            ref={dropdownRef}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center hover:text-blue-400 transition-colors focus:outline-none bg-slate-800/50 sm:bg-transparent p-1.5 sm:p-0 rounded-xl"
                            >
                                <User className="h-5 w-5 sm:h-6 sm:w-6" />
                                <span className="hidden sm:inline ml-2 text-[10px] sm:text-sm font-black uppercase tracking-widest leading-none">
                                    {userInfo.isAdmin ? 'Admin' : userInfo.isSeller ? 'Seller' : userInfo.name.split(' ')[0]}
                                </span>
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-3 w-44 sm:w-56 bg-slate-950 rounded-2xl shadow-2xl py-1.5 border border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200 ring-4 ring-black/10 overflow-hidden">
                                    {(userInfo.isAdmin || userInfo.role === 'admin') ? (
                                        <>
                                            <div className="px-6 sm:px-8 py-2 text-[9px] uppercase font-black text-blue-400 tracking-[0.2em]">Admin Hub</div>
                                            <Link onClick={() => setDropdownOpen(false)} to="/admin/dashboard" className="flex items-center px-6 sm:px-8 py-3 text-xs font-black hover:bg-slate-900 transition-colors uppercase tracking-widest text-white group">
                                                <Zap className="h-4 w-4 mr-3 text-blue-400 group-hover:animate-pulse" />
                                                Dashboard
                                            </Link>
                                            <Link onClick={() => setDropdownOpen(false)} to="/admin/productlist" className="flex items-center px-6 sm:px-8 py-3 text-xs font-black hover:bg-slate-900 transition-colors uppercase tracking-widest text-slate-300 group">
                                                <Package className="h-4 w-4 mr-3 text-slate-500 group-hover:text-blue-400" />
                                                Product List
                                            </Link>
                                            <Link onClick={() => setDropdownOpen(false)} to="/admin/userlist" className="flex items-center px-6 sm:px-8 py-3 text-xs font-black hover:bg-slate-900 transition-colors uppercase tracking-widest text-slate-300 group">
                                                <Users className="h-4 w-4 mr-3 text-slate-500 group-hover:text-blue-400" />
                                                User List
                                            </Link>
                                            <Link onClick={() => setDropdownOpen(false)} to="/admin/sellerlist" className="flex items-center px-6 sm:px-8 py-3 text-xs font-black hover:bg-slate-900 transition-colors uppercase tracking-widest text-slate-300 group">
                                                <Store className="h-4 w-4 mr-3 text-slate-500 group-hover:text-blue-400" />
                                                Seller List
                                            </Link>
                                            <Link onClick={() => setDropdownOpen(false)} to="/admin/orderlist" className="flex items-center px-6 sm:px-8 py-3 text-xs font-black hover:bg-slate-900 transition-colors uppercase tracking-widest text-slate-300 group">
                                                <ShoppingBag className="h-4 w-4 mr-3 text-slate-500 group-hover:text-blue-400" />
                                                Order List
                                            </Link>
                                            <div className="mx-4 sm:mx-6 my-2 h-[1px] bg-slate-800" />
                                            <Link onClick={() => setDropdownOpen(false)} to="/profile" className="flex items-center px-6 sm:px-8 py-3 text-xs font-black hover:bg-slate-900 transition-colors uppercase tracking-widest text-slate-300 group">
                                                <User className="h-4 w-4 mr-3 text-slate-500 group-hover:text-blue-400" />
                                                My Profile
                                            </Link>
                                        </>
                                    ) : (userInfo.isSeller || userInfo.role === 'seller') ? (
                                        <>
                                            <div className="px-5 py-2 text-[9px] uppercase font-black text-emerald-400 tracking-[0.2em]">Seller Hub</div>
                                            <Link onClick={() => setDropdownOpen(false)} to="/seller/dashboard" className="flex items-center px-5 py-2.5 text-[10px] font-black hover:bg-slate-900 transition-colors uppercase tracking-widest text-white group">
                                                <Zap className="h-3.5 w-3.5 mr-2.5 text-emerald-400 group-hover:animate-pulse" />
                                                Dashboard
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link onClick={() => setDropdownOpen(false)} to="/" className="flex items-center px-4 sm:px-6 py-3 text-[10px] sm:text-xs font-black hover:bg-slate-900 transition-colors uppercase tracking-widest text-white group">
                                                <Zap className="h-3.5 w-3.5 mr-2.5 text-blue-400 group-hover:animate-pulse" />
                                                Home
                                            </Link>
                                            <Link onClick={() => setDropdownOpen(false)} to="/profile" className="flex items-center px-4 sm:px-6 py-3 text-[10px] sm:text-xs font-black hover:bg-slate-900 transition-colors uppercase tracking-widest text-slate-300 group">
                                                <User className="h-3.5 w-3.5 mr-2.5 text-slate-500 group-hover:text-blue-400" />
                                                My Account
                                            </Link>
                                        </>
                                    )}

                                    <div className="mx-3 sm:mx-4 my-1 h-[1px] bg-slate-800" />
                                    <button
                                        onClick={logoutHandler}
                                        className="w-full text-left px-4 sm:px-6 py-3 text-[10px] sm:text-xs flex items-center hover:bg-rose-500/10 transition-colors text-rose-400 font-black uppercase tracking-widest"
                                    >
                                        <LogOut className="h-3.5 w-3.5 mr-2.5" /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="flex items-center hover:text-blue-400 transition-colors">
                            <User className="h-5 w-5 sm:h-6 sm:w-6" />
                            <span className="hidden sm:inline ml-2 text-sm font-black uppercase tracking-widest">Login</span>
                        </Link>
                    )}
                </nav>
            </div>
            {/* Mobile Search Bar - Visible only on small screens below navigation */}
            <div className="md:hidden px-4 pb-3">
                <SearchBox />
            </div>
        </header>
    );
};

export default Header;
