import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin, Globe, Home, Hash, ArrowRight, Plus, Check } from 'lucide-react';
import { saveShippingAddress } from '../redux/slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import { useGetAddressesQuery } from '../redux/api/userApiSlice';
import { useGetMyOrdersQuery } from '../redux/api/ordersApiSlice';

const ShippingScreen = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const [addressChoice, setAddressChoice] = useState(null); // 'same' or 'different'

    const { data: addresses, isLoading, error } = useGetAddressesQuery(undefined, {
        skip: !userInfo,
    });

    const { data: orders, isLoading: loadingOrders } = useGetMyOrdersQuery(undefined, {
        skip: !userInfo,
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo) {
            navigate('/login?redirect=/shipping');
        }
    }, [userInfo, navigate]);

    useEffect(() => {
        if (addresses && addresses.length > 0 && !shippingAddress.address) {
            const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
            setAddress(defaultAddr.address);
            setCity(defaultAddr.city);
            setPostalCode(defaultAddr.postalCode);
            setCountry(defaultAddr.country);
        }
    }, [addresses, shippingAddress.address]);

    const submitHandler = (e) => {
        if (e) e.preventDefault();
        dispatch(saveShippingAddress({ address, city, postalCode, country }));
        navigate('/payment');
    };

    const handleSameAddress = () => {
        if (orders && orders.length > 0) {
            const lastOrder = orders[orders.length - 1];
            const lastAddress = lastOrder.shippingAddress;
            setAddress(lastAddress.address);
            setCity(lastAddress.city);
            setPostalCode(lastAddress.postalCode);
            setCountry(lastAddress.country);

            // Dispatch and navigate immediately
            dispatch(saveShippingAddress({
                address: lastAddress.address,
                city: lastAddress.city,
                postalCode: lastAddress.postalCode,
                country: lastAddress.country
            }));
            navigate('/payment');
        }
    };

    const selectAddressHandler = (addr) => {
        setAddress(addr.address);
        setCity(addr.city);
        setPostalCode(addr.postalCode);
        setCountry(addr.country);
        setShowNewAddressForm(false);
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <CheckoutSteps step1 step2 />

            <div className="premium-card p-6 md:p-10 bg-white">
                <h1 className="text-3xl font-black text-slate-900 mb-2 flex items-center">
                    <MapPin className="h-8 w-8 mr-3 text-blue-600" />
                    Shipping
                </h1>
                <p className="text-slate-500 mb-8 font-medium">Where should we deliver your premium items?</p>

                {/* Repeat Customer Choice */}
                {userInfo && orders && orders.length > 0 && !addressChoice && (
                    <div className="mb-10 space-y-6 animate-in fade-in zoom-in-95 duration-500">
                        <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100/50">
                            <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center">
                                <Check className="h-6 w-6 mr-2 text-blue-600" />
                                Welcome Back, {userInfo.name}!
                            </h3>
                            <p className="text-slate-600 font-medium mb-6">
                                We found your previous shipping details. Would you like to use the same address or a different one?
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={handleSameAddress}
                                    className="p-6 bg-white border-2 border-slate-100 hover:border-blue-600 rounded-3xl transition-all group text-left shadow-sm hover:shadow-blue-100"
                                >
                                    <span className="block text-blue-600 font-black uppercase tracking-widest text-[10px] mb-2">Fast Track</span>
                                    <span className="block text-lg font-bold text-slate-900 mb-1">Same Address</span>
                                    <span className="block text-slate-500 text-sm line-clamp-1">
                                        {orders[orders.length - 1].shippingAddress.address}
                                    </span>
                                </button>
                                <button
                                    onClick={() => setAddressChoice('different')}
                                    className="p-6 bg-slate-900 border-2 border-slate-900 hover:bg-slate-800 rounded-3xl transition-all group text-left shadow-lg active:scale-95"
                                >
                                    <span className="block text-slate-400 font-black uppercase tracking-widest text-[10px] mb-2">New Delivery</span>
                                    <span className="block text-lg font-bold text-white mb-1">Different Address</span>
                                    <span className="block text-slate-400 text-sm">Choose or add another</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-px bg-slate-100 flex-grow"></div>
                            <span className="text-slate-300 font-black uppercase text-[10px] tracking-[0.3em]">OR MANUALLY PROCEED</span>
                            <div className="h-px bg-slate-100 flex-grow"></div>
                        </div>
                    </div>
                )}

                {(addressChoice === 'different' || !orders || orders.length === 0) && (
                    <>
                        {addresses && addresses.length > 0 && !showNewAddressForm && (
                            <div className="mb-10">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Saved Addresses</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {addresses.map((addr) => (
                                        <div
                                            key={addr._id}
                                            onClick={() => selectAddressHandler(addr)}
                                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${address === addr.address
                                                ? 'border-blue-600 bg-blue-50'
                                                : 'border-slate-100 hover:border-slate-200 bg-slate-50'
                                                }`}
                                        >
                                            <p className="font-bold text-slate-900">{addr.address}</p>
                                            <p className="text-slate-600 text-sm">
                                                {addr.city}, {addr.postalCode}, {addr.country}
                                            </p>
                                            {address === addr.address && (
                                                <div className="absolute top-2 right-2 bg-blue-600 text-white p-1 rounded-full text-xs">
                                                    <Check className="h-3 w-3" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => {
                                            setShowNewAddressForm(true);
                                            setAddress('');
                                            setCity('');
                                            setPostalCode('');
                                            setCountry('');
                                        }}
                                        className="p-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all flex flex-col items-center justify-center text-slate-500 hover:text-blue-600"
                                    >
                                        <Plus className="h-6 w-6 mb-1" />
                                        <span className="font-bold">Add New Address</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {(showNewAddressForm || !addresses || addresses.length === 0) && (
                            <form onSubmit={submitHandler} className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Street Address</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="123 Main St"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                            required
                                        />
                                        <Home className="absolute left-4 top-4.5 h-5 w-5 text-slate-400" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">City</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="New York"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                                required
                                            />
                                            <Hash className="absolute left-4 top-4.5 h-5 w-5 text-slate-400" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Postal Code</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="10001"
                                                value={postalCode}
                                                onChange={(e) => setPostalCode(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                                required
                                            />
                                            <Hash className="absolute left-4 top-4.5 h-5 w-5 text-slate-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Country</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="United States"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                            required
                                        />
                                        <Globe className="absolute left-4 top-4.5 h-5 w-5 text-slate-400" />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg active:scale-95 group"
                                >
                                    Continue to Payment
                                    <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                        )}

                        {!showNewAddressForm && addresses && addresses.length > 0 && (
                            <button
                                onClick={submitHandler}
                                disabled={!address}
                                className="mt-8 w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg active:scale-95 group disabled:opacity-50"
                            >
                                Use Selected Address
                                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ShippingScreen;
