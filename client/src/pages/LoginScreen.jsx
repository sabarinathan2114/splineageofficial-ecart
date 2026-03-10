import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2, Mail, Lock, UserPlus, ArrowRight, User as UserIcon, Zap, Eye, EyeOff } from 'lucide-react';
import { useLoginMutation } from '../redux/api/userApiSlice';
import { setCredentials } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';

const LoginScreen = () => {
    const [tab, setTab] = useState('user'); // 'user' | 'seller'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();

    const { userInfo } = useSelector((state) => state.auth);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ email, password }).unwrap();
            // Validate the tab matches the actual role
            const isSeller = res.role === 'seller' || res.isSeller;
            const isAdmin = res.role === 'admin' || res.isAdmin;
            if (tab === 'seller' && !isSeller && !isAdmin) {
                toast.error('This account is not a seller account. Please use User Login.');
                return;
            }
            if (tab === 'user' && (isSeller || isAdmin)) {
                toast.info(`Logged in as ${isAdmin ? 'Admin' : 'Seller'}. Redirecting to your hub.`);
            }
            dispatch(setCredentials({ ...res }));
            // Redirect sellers to dashboard
            if (isSeller && !isAdmin) {
                navigate('/seller/dashboard');
            } else if (isAdmin) {
                navigate('/admin/dashboard');
            } else {
                navigate(redirect);
            }
            toast.success('Successfully logged in');
        } catch (err) {
            toast.error(err?.data?.message || err.error || 'Login failed');
        }
    };

    const isSeller = tab === 'seller';

    return (
        <div className="max-w-md mx-auto py-12 px-4">
            <div className="premium-card p-8 sm:p-10 bg-white">

                {/* Tab Switcher */}
                <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
                    <button
                        onClick={() => setTab('user')}
                        className={`flex-1 flex items-center justify-center py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${tab === 'user' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <UserIcon className="h-4 w-4 mr-2" />
                        User Login
                    </button>
                    <button
                        onClick={() => setTab('seller')}
                        className={`flex-1 flex items-center justify-center py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${tab === 'seller' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Zap className="h-4 w-4 mr-2" />
                        Seller Login
                    </button>
                </div>

                {/* Heading */}
                <h1 className="text-3xl font-black text-slate-900 mb-1">
                    {isSeller ? 'Seller Sign In' : 'Welcome Back'}
                </h1>
                <p className="text-slate-500 mb-8 font-medium">
                    {isSeller
                        ? 'Access your seller hub and manage your store.'
                        : 'Please enter your details to sign in.'}
                </p>

                {isSeller && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 mb-6 flex items-start gap-2">
                        <Zap className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-emerald-700 font-medium">
                            Don't have a seller account?{' '}
                            <Link to="/register?role=seller" className="font-black text-emerald-600 hover:underline">
                                Register as Seller
                            </Link>
                        </p>
                    </div>
                )}

                <form onSubmit={submitHandler} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 transition-all outline-none ${isSeller ? 'border-emerald-100 focus:ring-emerald-400' : 'border-slate-100 focus:ring-blue-500'}`}
                                required
                            />
                            <Mail className="absolute left-4 top-4.5 h-5 w-5 text-slate-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-12 text-slate-900 focus:ring-2 transition-all outline-none ${isSeller ? 'border-emerald-100 focus:ring-emerald-400' : 'border-slate-100 focus:ring-blue-500'}`}
                                required
                            />
                            <Lock className="absolute left-4 top-4.5 h-5 w-5 text-slate-400" />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-4.5 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        disabled={isLoading}
                        className={`w-full text-white py-4 rounded-2xl font-bold flex items-center justify-center transition-all shadow-lg active:scale-95 group disabled:opacity-50 ${isSeller ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isLoading ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                            <>
                                {isSeller ? 'Sign In to Seller Hub' : 'Sign In'}
                                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-slate-500 font-medium">
                        New {isSeller ? 'seller' : 'customer'}?{' '}
                        <Link
                            to={`/register${isSeller ? '?role=seller' : (redirect !== '/' ? `?redirect=${redirect}` : '')}`}
                            className={`font-bold transition-colors inline-flex items-center ${isSeller ? 'text-emerald-600 hover:text-emerald-700' : 'text-blue-600 hover:text-blue-700'}`}
                        >
                            Create an account <UserPlus className="ml-1 h-4 w-4" />
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
