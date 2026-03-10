import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2, Mail, Lock, User as UserIcon, LogIn, ArrowRight, Zap, Phone, MapPin, Building, Map, Hash, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { useRegisterMutation } from '../redux/api/userApiSlice';
import { setCredentials } from '../redux/slices/authSlice';

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';
    const queryRole = sp.get('role');

    const [role, setRole] = useState(queryRole === 'seller' ? 'seller' : 'buyer');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register, { isLoading }] = useRegisterMutation();

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
        } else {
            try {
                const res = await register({ name, email, password, phoneNumber, role, address, city, state, pincode }).unwrap();
                dispatch(setCredentials({ ...res }));
                if (role === 'seller') {
                    navigate('/seller/dashboard');
                } else {
                    navigate(redirect);
                }
                toast.success('Account created successfully!');
            } catch (err) {
                toast.error(err?.data?.message || err.error || 'Registration failed');
            }
        }
    };

    const isSeller = role === 'seller';

    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <div className="premium-card p-8 sm:p-10 bg-white">

                {/* Tab Switcher */}
                <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
                    <button
                        onClick={() => setRole('buyer')}
                        className={`flex-1 flex items-center justify-center py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${role === 'buyer' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <UserIcon className="h-4 w-4 mr-2" />
                        User
                    </button>
                    <button
                        onClick={() => setRole('seller')}
                        className={`flex-1 flex items-center justify-center py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${role === 'seller' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Zap className="h-4 w-4 mr-2" />
                        Seller
                    </button>
                </div>

                <h1 className="text-3xl font-black text-slate-900 mb-1">
                    {isSeller ? 'Become a Seller' : 'Join eShop'}
                </h1>
                <p className="text-slate-500 mb-8 font-medium">
                    {isSeller ? 'Set up your seller account and start earning.' : 'Create your account to start shopping.'}
                </p>

                <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 transition-all outline-none ${isSeller ? 'border-emerald-100 focus:ring-emerald-400' : 'border-slate-100 focus:ring-blue-500'}`}
                                required
                            />
                            <UserIcon className="absolute left-4 top-4.5 h-5 w-5 text-slate-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Phone Number (Optional)</label>
                        <div className="relative">
                            <input
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className={`w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 transition-all outline-none ${isSeller ? 'border-emerald-100 focus:ring-emerald-400' : 'border-slate-100 focus:ring-blue-500'}`}
                            />
                            <Phone className="absolute left-4 top-4.5 h-5 w-5 text-slate-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Address</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="123 Main St"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className={`w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 transition-all outline-none ${isSeller ? 'border-emerald-100 focus:ring-emerald-400' : 'border-slate-100 focus:ring-blue-500'}`}
                                required
                            />
                            <MapPin className="absolute left-4 top-4.5 h-5 w-5 text-slate-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">City</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className={`w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 transition-all outline-none ${isSeller ? 'border-emerald-100 focus:ring-emerald-400' : 'border-slate-100 focus:ring-blue-500'}`}
                                required
                            />
                            <Building className="absolute left-4 top-4.5 h-5 w-5 text-slate-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">State</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="State"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                className={`w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 transition-all outline-none ${isSeller ? 'border-emerald-100 focus:ring-emerald-400' : 'border-slate-100 focus:ring-blue-500'}`}
                                required
                            />
                            <Map className="absolute left-4 top-4.5 h-5 w-5 text-slate-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Pincode</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="123456"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                className={`w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 transition-all outline-none ${isSeller ? 'border-emerald-100 focus:ring-emerald-400' : 'border-slate-100 focus:ring-blue-500'}`}
                                required
                            />
                            <Hash className="absolute left-4 top-4.5 h-5 w-5 text-slate-400" />
                        </div>
                    </div>

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

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-12 text-slate-900 focus:ring-2 transition-all outline-none ${isSeller ? 'border-emerald-100 focus:ring-emerald-400' : 'border-slate-100 focus:ring-blue-500'}`}
                                required
                            />
                            <Lock className="absolute left-4 top-4.5 h-5 w-5 text-slate-400" />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-4.5 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        disabled={isLoading}
                        className={`md:col-span-2 w-full text-white py-4 rounded-2xl font-bold flex items-center justify-center transition-all shadow-lg active:scale-95 group disabled:opacity-50 ${isSeller ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isLoading ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                            <>
                                {isSeller ? 'Create Seller Account' : 'Create Account'}
                                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                    <p className="text-slate-500 font-medium">
                        Already have an account?{' '}
                        <Link to={redirect !== '/' ? `/login?redirect=${redirect}` : '/login'} className="text-blue-600 font-bold hover:text-blue-700 transition-colors inline-flex items-center">
                            Sign In <LogIn className="ml-1 h-4 w-4" />
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterScreen;
