import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Lock, CheckCircle, Package, Loader2, Phone, Upload, Bell, LogOut, MapPin, Building, Map, Hash, Eye, EyeOff } from 'lucide-react';
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
                                    <h2 className="text-[17px] font-bold text-slate-900">Recent Activity</h2>
                                    <p className="text-[14px] text-slate-500 mt-1">Latest orders, refunds, and exchanges</p>
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
        <div className="max-w-6xl mx-auto py-8 px-4">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-2">My Profile</h1>
                <p className="text-slate-500 font-medium">Manage your personal information and orders.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* User Form */}
                <div className="lg:col-span-1">
                    <div className="premium-card p-8 bg-white shadow-sm border border-slate-100">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                            <User className="h-5 w-5 mr-3 text-blue-600" />
                            Account Settings
                        </h2>

                        <form onSubmit={submitHandler} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm font-medium"
                                    />
                                    <User className="absolute left-4 top-4.5 h-5 w-5 text-slate-400" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm font-medium"
                                    />
                                    <Mail className="absolute left-4 top-4.5 h-5 w-5 text-slate-400" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Enter phone number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm font-medium"
                                    />
                                    <Phone className="absolute left-4 top-4.5 h-5 w-5 text-slate-400" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Address</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm font-medium"
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
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm font-medium"
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
                                        value={stateField}
                                        onChange={(e) => setStateField(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm font-medium"
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
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm font-medium"
                                    />
                                    <Hash className="absolute left-4 top-4.5 h-5 w-5 text-slate-400" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Leave blank to keep same"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm font-medium"
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
                                <label className="text-sm font-bold text-slate-700 ml-1">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm font-medium"
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
                                type="submit"
                                disabled={loadingUpdateProfile}
                                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg active:scale-95 group disabled:opacity-50"
                            >
                                {loadingUpdateProfile ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Update Profile'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* User Orders */}
                <div className="lg:col-span-2">
                    <div className="premium-card p-8 bg-white min-h-[500px]">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center text-center">
                            <Package className="h-5 w-5 mr-3 text-blue-600" />
                            Your Order History
                        </h2>

                        {loadingOrders ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                            </div>
                        ) : errorOrders ? (
                            <div className="bg-red-50 text-red-600 p-4 rounded-2xl font-medium">
                                {errorOrders?.data?.message || errorOrders.error}
                            </div>
                        ) : orders?.length === 0 ? (
                            <div className="text-center py-20">
                                <Package className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-500 font-medium">No orders yet.</p>
                                <Link to="/" className="text-blue-600 font-bold mt-2 inline-block">Start Shopping</Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            <th className="py-4 font-bold text-slate-400 text-xs uppercase tracking-widest">Order ID</th>
                                            <th className="py-4 font-bold text-slate-400 text-xs uppercase tracking-widest">Date</th>
                                            <th className="py-4 font-bold text-slate-400 text-xs uppercase tracking-widest">Total</th>
                                            <th className="py-4 font-bold text-slate-400 text-xs uppercase tracking-widest">Paid</th>
                                            <th className="py-4 font-bold text-slate-400 text-xs uppercase tracking-widest">Status</th>
                                            <th className="py-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders?.map((order) => (
                                            <tr key={order._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                                                <td className="py-5 text-sm font-bold text-slate-900">{order._id.substring(0, 10)}...</td>
                                                <td className="py-5 text-sm font-normal text-slate-600">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="py-5 text-sm font-black text-slate-900">${order.totalPrice.toFixed(2)}</td>
                                                <td className="py-5 text-sm font-medium">
                                                    {order.isPaid ? (
                                                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 inline-flex items-center">
                                                            <CheckCircle className="h-3 w-3 mr-1" /> Paid
                                                        </span>
                                                    ) : (
                                                        <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-100">
                                                            Pending
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-5 text-sm font-medium">
                                                    {order.isDelivered ? (
                                                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                                                            Delivered
                                                        </span>
                                                    ) : (
                                                        <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">
                                                            In Transit
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-5 text-right">
                                                    <Link
                                                        to={`/order/${order._id}`}
                                                        className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
                                                    >
                                                        Details
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
            </div>
        </div>
    );
};

export default ProfileScreen;
