import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Lock, CheckCircle, Package, Loader2, Phone, Upload, Bell, LogOut, MapPin, Building, Map, Hash, Eye, EyeOff, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import { useProfileMutation, useLogoutMutation } from '../redux/api/userApiSlice';
import { useUploadProductImageMutation } from '../redux/api/productApiSlice';
import { useGetMyOrdersQuery } from '../redux/api/ordersApiSlice';
import { setCredentials, logout } from '../redux/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';

const ProfileScreen = () => {
    // Shared State
    const [activeTab, setActiveTab] = useState('profile');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');

    // New fields for Admin/Seller
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [stateField, setStateField] = useState(''); // avoid naming collision with redux state
    const [pincode, setPincode] = useState('');
    const [image, setImage] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const { userInfo } = useSelector((state) => state.auth);
    const isAdminOrSeller = userInfo?.isAdmin || userInfo?.isSeller;

    const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
    const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();
    const [logoutApiCall] = useLogoutMutation();

    // Only fetch orders if it's a regular user to save network requests
    const { data: orders, isLoading: loadingOrders, error: errorOrders } = useGetMyOrdersQuery(undefined, {
        skip: isAdminOrSeller,
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name || '');
            setEmail(userInfo.email || '');
            setPhoneNumber(userInfo.phoneNumber || '');
            setAddress(userInfo.address || '');
            setCity(userInfo.city || '');
            setStateField(userInfo.state || '');
            setPincode(userInfo.pincode || '');
            setImage(userInfo.image || '');
        }
    }, [userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (isAdminOrSeller && !isEditing) {
            setIsEditing(true);
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
        } else {
            try {
                const res = await updateProfile({
                    _id: userInfo._id,
                    name,
                    email,
                    password,
                    phoneNumber,
                    address,
                    city,
                    state: stateField,
                    pincode,
                    image
                }).unwrap();
                dispatch(setCredentials({ ...res }));
                toast.success('Profile updated successfully');
                setPassword('');
                setConfirmPassword('');
                setIsEditing(false);
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            // The upload route returns the image path in res.image
            setImage(res.image);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

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

    // --- RENDER FOR ADMIN & SELLER (System Settings Layout) ---
    if (isAdminOrSeller) {
        return (
            <div className="max-w-6xl mx-auto py-8 bg-slate-50 min-h-screen px-4 md:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-[28px] font-semibold text-slate-800 mb-1">System Settings</h1>
                        <p className="text-slate-500 text-[15px]">Manage application branding, integrations, and security protocols.</p>
                    </div>
                    <button
                        onClick={logoutHandler}
                        className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-5 py-2.5 rounded shadow-sm text-[14px] font-medium flex items-center gap-2 transition-all"
                    >
                        <LogOut className="w-[18px] h-[18px]" />
                        Logout
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-slate-200 mb-8">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex items-center gap-2 font-semibold pb-3 px-1 text-[15px] transition-colors ${activeTab === 'profile'
                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <User className="w-[18px] h-[18px]" />
                        Edit Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('notification')}
                        className={`flex items-center gap-2 font-semibold pb-3 px-1 text-[15px] transition-colors ${activeTab === 'notification'
                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <Bell className="w-[18px] h-[18px]" />
                        Notification
                    </button>
                </div>

                {activeTab === 'notification' ? (
                    <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 p-8">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-16">
                            <div className="flex items-start gap-3">
                                <div className="mt-1">
                                    <Bell className="w-5 h-5 text-amber-500" />
                                </div>
                                <div>
                                    <h2 className="text-[17px] font-bold text-slate-900">Notifications</h2>
                                    <p className="text-[14px] text-slate-500 mt-1">Stay updated with latest activity</p>
                                </div>
                            </div>
                            <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded shadow-sm text-[13px] font-semibold flex items-center justify-center transition-all gap-2 duration-200 active:scale-95">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                                Refresh
                            </button>
                        </div>

                        <div className="flex flex-col items-center justify-center py-12 text-center text-slate-300">
                            <Bell className="w-10 h-10 mb-3" />
                            <p className="font-medium text-[15px]">No recent activity</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 p-8">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                            <div className="flex items-start gap-3">
                                <div className="mt-1">
                                    <User className="w-5 h-5 text-[#5c49e2]" />
                                </div>
                                <div>
                                    <h2 className="text-[17px] font-bold text-slate-900">Profile Information</h2>
                                    <p className="text-[14px] text-slate-500 mt-1">Update your personal information and profile picture</p>
                                </div>
                            </div>
                            <button
                                onClick={submitHandler}
                                disabled={loadingUpdateProfile || loadingUpload}
                                className={`${isEditing ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-[#5c49e2] hover:bg-[#4d3cc8]'} text-white px-5 py-2.5 rounded shadow-sm text-[14px] font-medium flex items-center justify-center transition-all disabled:opacity-70 gap-2 shrink-0 h-[42px]`}
                            >
                                {loadingUpdateProfile ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <User className="w-[18px] h-[18px]" />}
                                {isEditing ? 'Update Profile' : 'Edit Profile'}
                            </button>
                        </div>

                        {/* Profile Picture Section */}
                        <div className="mb-10">
                            <h3 className="text-[14px] font-bold text-slate-800 mb-4">Profile Picture</h3>
                            <div className="flex items-center gap-6">
                                {/* Placeholder Avatar based on screenshot */}
                                <div className="w-[90px] h-[90px] rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center p-1 text-center font-bold overflow-hidden shadow-sm">
                                    <img
                                        src={image || `https://ui-avatars.com/api/?name=${userInfo?.name}&background=random&color=fff&size=150`}
                                        alt="Avatar"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                </div>
                                <div>
                                    <label className={`bg-white border text-slate-700 ${isEditing ? 'border-slate-200 hover:bg-slate-50 cursor-pointer' : 'border-slate-100 opacity-60 cursor-not-allowed bg-slate-50'} px-4 py-[6px] rounded font-medium flex items-center gap-2 mb-2 text-[14px] transition-colors shadow-sm inline-flex`}>
                                        {loadingUpload ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                        Upload Photo
                                        <input type="file" onChange={uploadFileHandler} disabled={!isEditing} className="hidden" accept="image/*" />
                                    </label>
                                    <p className="text-[13px] text-slate-400">JPG, GIF or PNG. Max size of 800K</p>
                                </div>
                            </div>
                        </div>

                        {/* Form Fields Grid */}
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 max-w-[900px]">
                            <div className="space-y-[6px]">
                                <label className="text-[13px] font-bold text-slate-800">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    disabled={!isEditing}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full bg-transparent border border-gray-300 rounded-[4px] py-[8px] px-3 ${!isEditing && 'opacity-60 bg-slate-50 cursor-not-allowed'} text-slate-900 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-[14px] transition-all`}
                                />
                            </div>

                            <div className="space-y-[6px]">
                                <label className="text-[13px] font-bold text-slate-800">Phone Number</label>
                                <input
                                    type="text"
                                    value={phoneNumber}
                                    disabled={!isEditing}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className={`w-full bg-transparent border border-gray-300 rounded-[4px] py-[8px] px-3 ${!isEditing && 'opacity-60 bg-slate-50 cursor-not-allowed'} text-slate-900 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-[14px] transition-all`}
                                />
                            </div>

                            <div className="space-y-[6px]">
                                <label className="text-[13px] font-bold text-slate-800">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    disabled={!isEditing}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`w-full bg-transparent border border-gray-300 rounded-[4px] py-[8px] px-3 ${!isEditing && 'opacity-60 bg-slate-50 cursor-not-allowed'} text-slate-900 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-[14px] transition-all`}
                                />
                            </div>

                            <div className="space-y-[6px]">
                                <label className="text-[13px] font-bold text-slate-800">Address</label>
                                <input
                                    type="text"
                                    value={address}
                                    disabled={!isEditing}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className={`w-full bg-transparent border border-gray-300 rounded-[4px] py-[8px] px-3 ${!isEditing && 'opacity-60 bg-slate-50 cursor-not-allowed'} text-slate-900 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-[14px] transition-all`}
                                />
                            </div>

                            <div className="space-y-[6px]">
                                <label className="text-[13px] font-bold text-slate-800">City</label>
                                <input
                                    type="text"
                                    value={city}
                                    disabled={!isEditing}
                                    onChange={(e) => setCity(e.target.value)}
                                    className={`w-full bg-transparent border border-gray-300 rounded-[4px] py-[8px] px-3 ${!isEditing && 'opacity-60 bg-slate-50 cursor-not-allowed'} text-slate-900 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-[14px] transition-all`}
                                />
                            </div>

                            <div className="space-y-[6px]">
                                <label className="text-[13px] font-bold text-slate-800">State</label>
                                <input
                                    type="text"
                                    value={stateField}
                                    disabled={!isEditing}
                                    onChange={(e) => setStateField(e.target.value)}
                                    className={`w-full bg-transparent border border-gray-300 rounded-[4px] py-[8px] px-3 ${!isEditing && 'opacity-60 bg-slate-50 cursor-not-allowed'} text-slate-900 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-[14px] transition-all`}
                                />
                            </div>

                            <div className="space-y-[6px]">
                                <label className="text-[13px] font-bold text-slate-800">Pincode</label>
                                <input
                                    type="text"
                                    value={pincode}
                                    disabled={!isEditing}
                                    onChange={(e) => setPincode(e.target.value)}
                                    className={`w-full bg-transparent border border-gray-300 rounded-[4px] py-[8px] px-3 ${!isEditing && 'opacity-60 bg-slate-50 cursor-not-allowed'} text-slate-900 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-[14px] transition-all`}
                                />
                            </div>

                            <div className="space-y-[6px]">
                                <label className="text-[13px] font-bold text-slate-800">Role</label>
                                <input
                                    type="text"
                                    value={userInfo?.role}
                                    disabled
                                    className="w-full bg-[#f8fafc] border border-gray-300 rounded-[4px] py-[8px] px-3 text-slate-500 cursor-not-allowed outline-none text-[14px]"
                                />
                            </div>

                            <div className="space-y-[6px]">
                                <label className="text-[13px] font-bold text-slate-800">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Leave blank to keep same"
                                        value={password}
                                        disabled={!isEditing}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`w-full bg-transparent border border-gray-300 rounded-[4px] py-[8px] pl-3 pr-10 ${!isEditing && 'opacity-60 bg-slate-50 cursor-not-allowed'} text-slate-900 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-[14px] transition-all`}
                                    />
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-[6px]">
                                <label className="text-[13px] font-bold text-slate-800">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        disabled={!isEditing}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`w-full bg-transparent border border-gray-300 rounded-[4px] py-[8px] pl-3 pr-10 ${!isEditing && 'opacity-60 bg-slate-50 cursor-not-allowed'} text-slate-900 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-[14px] transition-all`}
                                    />
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                )
                }
            </div >
        );
    }

    // --- RENDER FOR REGULAR BUYER (Classic Layout) ---
    return (
        <div className="max-w-6xl mx-auto py-6 sm:py-12 px-3 sm:px-8 bg-[#f8fafc] min-h-screen">
            {/* Profile Overview Card */}
            <div className="bg-white p-5 sm:p-8 rounded-[30px] sm:rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100 mb-6 sm:mb-10 flex flex-col md:flex-row items-center gap-6 sm:gap-10 animate-in fade-in slide-in-from-top-6 duration-700 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>

                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 rounded-full scale-75 group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="relative w-32 h-32 rounded-full border-[6px] border-slate-50 p-1 bg-white shadow-2xl overflow-hidden group-hover:border-indigo-100 transition-colors">
                        <img
                            src={image || `https://ui-avatars.com/api/?name=${userInfo?.name}&background=6366f1&color=fff&size=200`}
                            alt="Avatar"
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                    {isEditing && (
                        <label className="absolute bottom-1 right-1 p-2.5 bg-indigo-600 text-white rounded-xl shadow-xl border-4 border-white cursor-pointer hover:bg-indigo-500 hover:scale-110 transition-all active:scale-95">
                            <Upload className="w-3.5 h-3.5" />
                            <input type="file" onChange={uploadFileHandler} className="hidden" />
                        </label>
                    )}
                </div>

                <div className="flex-1 text-center md:text-left space-y-4">
                    <div className="space-y-1">
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 bg-indigo-50 px-2 sm:px-3 py-1 rounded-full border border-indigo-100">Verified Member</span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{userInfo?.name}</h2>
                    </div>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-4">
                        <div className="flex items-center gap-2 text-slate-500 text-[11px] sm:text-sm font-bold bg-slate-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm break-all">
                            <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500 shrink-0" />
                            {userInfo?.email}
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-[11px] sm:text-sm font-bold bg-slate-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-slate-200">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500 shrink-0" />
                            Joined: {userInfo?.createdAt ? new Date(userInfo.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={logoutHandler}
                        className="group flex items-center gap-3 px-8 py-4 bg-white border-2 border-slate-100 text-slate-900 rounded-[24px] text-xs font-black uppercase tracking-widest hover:border-rose-500 hover:text-rose-600 transition-all duration-300 shadow-xl shadow-slate-200/50 active:scale-95"
                    >
                        <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="flex items-center gap-6 sm:gap-10 border-b border-slate-200 mb-6 sm:mb-10 overflow-x-auto no-scrollbar whitespace-nowrap">
                {[
                    { id: 'profile', label: 'My Profile', icon: User },
                    { id: 'orders', label: 'Order History', icon: Package }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-3 pb-5 px-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative group shrink-0 ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <tab.icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-300'}`} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-indigo-600 rounded-full animate-in fade-in slide-in-from-left-4 duration-500"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Dynamic Content */}
            {activeTab === 'profile' ? (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="bg-white rounded-[30px] sm:rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/40 p-5 sm:p-14 relative overflow-hidden group">
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-[60px] -ml-24 -mb-24"></div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8 mb-10 sm:mb-16">
                            <div className="flex items-center gap-4 sm:gap-6">
                                <div className="p-3 sm:p-4 bg-indigo-600 text-white rounded-2xl sm:rounded-[24px] shadow-xl shadow-indigo-600/30 border-2 border-white rotate-3 group-hover:rotate-0 transition-transform">
                                    <User className="w-6 h-6 sm:w-7 sm:h-7" />
                                </div>
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">My Profile</h3>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Manage your information</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`w-full sm:w-auto px-6 sm:px-10 py-3.5 sm:py-4 rounded-[20px] sm:rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${isEditing ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-indigo-600/30'}`}
                            >
                                {isEditing ? <CheckCircle className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                            </button>
                        </div>

                        <form onSubmit={submitHandler} className="max-w-5xl space-y-12">

                            {/* Profile Photo Upload */}
                            <div className="flex flex-col sm:flex-row items-center gap-8 pb-10 border-b border-slate-100">
                                <div className="relative group/avatar shrink-0">
                                    <div className="w-24 h-24 rounded-[28px] overflow-hidden border-4 border-white shadow-2xl shadow-slate-200/60 bg-slate-100">
                                        <img
                                            src={image || `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo?.name || 'U')}&background=6366f1&color=fff&size=150&bold=true`}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {isEditing && (
                                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-[28px] cursor-pointer opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                            {loadingUpload
                                                ? <Loader2 className="w-6 h-6 text-white animate-spin" />
                                                : <Upload className="w-6 h-6 text-white" />}
                                            <input type="file" accept="image/*" onChange={uploadFileHandler} className="hidden" />
                                        </label>
                                    )}
                                </div>
                                <div className="text-center sm:text-left space-y-3">
                                    <div>
                                        <p className="text-[17px] font-black text-slate-900 tracking-tight">{name || userInfo?.name}</p>
                                        <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mt-1">{userInfo?.role || 'Member'}</p>
                                    </div>
                                    {isEditing && (
                                        <label className={`inline-flex items-center gap-2 px-6 py-3 rounded-[18px] text-[11px] font-black uppercase tracking-widest cursor-pointer transition-all shadow-md ${loadingUpload ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-indigo-600/30'}`}>
                                            {loadingUpload ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                            {loadingUpload ? 'Uploading...' : 'Upload Photo'}
                                            <input type="file" accept="image/*" onChange={uploadFileHandler} className="hidden" />
                                        </label>
                                    )}
                                    <p className="text-[11px] text-slate-400 font-bold">JPG, PNG or GIF · Max 800KB</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                {[
                                    { label: 'Name', value: name, setter: setName, icon: User, key: 'name' },
                                    { label: 'Email', value: email, setter: setEmail, icon: Mail, key: 'email' },
                                    { label: 'Phone', value: phoneNumber, setter: setPhoneNumber, icon: Phone, key: 'phone' },
                                    { label: 'Address', value: address, setter: setAddress, icon: MapPin, key: 'address' },
                                    { label: 'City', value: city, setter: setCity, icon: Building, key: 'city' },
                                    { label: 'State', value: stateField, setter: setStateField, icon: Map, key: 'state' },
                                    { label: 'Postal Code', value: pincode, setter: setPincode, icon: Hash, key: 'pincode' },
                                ].map((field) => (
                                    <div key={field.key} className="space-y-2 group/field">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 group-focus-within/field:text-indigo-600 transition-colors">
                                            <field.icon className="w-3 h-3" />
                                            {field.label}
                                        </label>
                                        {isEditing ? (
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={field.value}
                                                    onChange={(e) => field.setter(e.target.value)}
                                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[24px] py-2 px-4 text-[15px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 transition-all outline-none shadow-inner text-wrap"
                                                />
                                            </div>
                                        ) : (
                                            <div className="bg-slate-50 border-2 border-transparent p-3 rounded-[16px] hover:bg-white hover:border-slate-100 transition-all group-hover/field:shadow-md">
                                                <p className="text-[13px] md:text-[17px] font-black text-slate-900 tracking-tight">{field.value || <span className="text-slate-300 italic">Not set</span>}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {isEditing && (
                                    <>
                                        <div className="md:col-span-2 pt-10">
                                            <div className="p-8 bg-amber-50 rounded-[32px] border border-amber-100 flex gap-6 items-center">
                                                <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-lg shadow-amber-500/20">
                                                    <Lock className="w-6 h-6" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-amber-900 font-black uppercase text-sm tracking-widest">Update Password</h4>
                                                    <p className="text-amber-700 text-xs font-bold leading-relaxed max-w-2xl">Enter your new password below. Make sure it's secure.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3 group/field">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">New Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Keep current if blank"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[24px] py-5 px-8 text-[15px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 transition-all outline-none shadow-inner"
                                                />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-3 group/field">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Confirm Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    placeholder="Retry entry"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[24px] py-5 px-8 text-[15px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 transition-all outline-none shadow-inner"
                                                />
                                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {isEditing && (
                                <div className="pt-10 border-t border-slate-50 flex items-center justify-between">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider italic">Ready to save</p>
                                    <button
                                        type="submit"
                                        disabled={loadingUpdateProfile}
                                        className="px-14 py-5 bg-indigo-600 text-white rounded-[28px] font-black uppercase tracking-[0.2em] text-xs hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/30 active:scale-95 flex items-center gap-3 disabled:opacity-50"
                                    >
                                        {loadingUpdateProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                                        Update Profile
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/40 p-10 sm:p-14 min-h-[600px] flex flex-col relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-16">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-[24px] border border-indigo-100 rotate-3 group-hover:rotate-0 transition-transform">
                                    <Package className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">My Orders</h3>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">View your order history</p>
                                </div>
                            </div>
                            <Link to="/" className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10">
                                Continue Shopping
                                <Package className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {loadingOrders ? (
                            <div className="flex-1 flex flex-col justify-center items-center py-20">
                                <div className="relative">
                                    <div className="w-16 h-16 border-4 border-indigo-50 border-t-indigo-500 rounded-full animate-spin"></div>
                                    <Package className="absolute inset-0 m-auto w-6 h-6 text-indigo-200" />
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-6 animate-pulse">Loading orders...</p>
                            </div>
                        ) : errorOrders ? (
                            <div className="bg-rose-50 border border-rose-100 p-8 rounded-[32px] text-rose-600 font-bold text-center">
                                Order Error: {errorOrders?.data?.message || errorOrders.error}
                            </div>
                        ) : orders?.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                                <div className="w-32 h-32 bg-slate-50 rounded-[48px] flex items-center justify-center mb-10 group-hover:rotate-12 transition-transform duration-700">
                                    <Package className="w-12 h-12 text-slate-200" />
                                </div>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">No Orders</p>
                                <p className="text-slate-600 font-bold max-w-sm leading-relaxed">You haven't placed any orders yet.</p>
                                <Link to="/" className="mt-12 px-12 py-5 bg-indigo-600 text-white rounded-[24px] font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/30">Start Shopping</Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto no-scrollbar">
                                <table className="w-full text-left border-separate border-spacing-y-4">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <th className="px-6 py-2">Order ID</th>
                                            <th className="px-6 py-2">Date</th>
                                            <th className="px-6 py-2">Total</th>
                                            <th className="px-6 py-2">Payment</th>
                                            <th className="px-6 py-2">Delivery</th>
                                            <th className="px-6 py-2 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="space-y-4">
                                        {orders?.map((order) => (
                                            <tr key={order._id} className="group/row">
                                                <td className="bg-slate-50 px-6 py-6 rounded-l-[28px] text-[13px] font-black text-slate-900 border-y border-l border-slate-100 group-hover/row:bg-white group-hover/row:shadow-lg transition-all">{order._id.substring(0, 10)}...</td>
                                                <td className="bg-slate-50 px-6 py-6 text-sm font-bold text-slate-500 border-y border-slate-100 group-hover/row:bg-white group-hover/row:shadow-lg transition-all">
                                                    {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </td>
                                                <td className="bg-slate-50 px-6 py-6 text-[15px] font-black text-slate-900 border-y border-slate-100 group-hover/row:bg-white group-hover/row:shadow-lg transition-all">₹{order.totalPrice.toLocaleString()}</td>
                                                <td className="bg-slate-50 px-6 py-6 border-y border-slate-100 group-hover/row:bg-white group-hover/row:shadow-lg transition-all">
                                                    {order.isPaid ? (
                                                        <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">Paid</span>
                                                    ) : (
                                                        <span className="bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">Pending</span>
                                                    )}
                                                </td>
                                                <td className="bg-slate-50 px-6 py-6 border-y border-slate-100 group-hover/row:bg-white group-hover/row:shadow-lg transition-all">
                                                    {order.isDelivered ? (
                                                        <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">Delivered</span>
                                                    ) : (
                                                        <span className="bg-slate-100 text-slate-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">Processing</span>
                                                    )}
                                                </td>
                                                <td className="bg-slate-50 px-6 py-6 rounded-r-[28px] text-right border-y border-r border-slate-100 group-hover/row:bg-white group-hover/row:shadow-lg transition-all">
                                                    <Link
                                                        to={`/order/${order._id}`}
                                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
                                                    >
                                                        Details
                                                        <ArrowRight className="w-3 h-3" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileScreen;
