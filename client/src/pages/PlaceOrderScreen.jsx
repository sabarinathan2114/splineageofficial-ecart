import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MapPin, CreditCard, ShoppingBag, Package, ArrowRight, Loader2, CheckCircle, Wallet, Info } from 'lucide-react';
import CheckoutSteps from '../components/CheckoutSteps';
import {
    useCreateOrderMutation,
    useCreateRazorpayOrderMutation,
    useVerifyRazorpayPaymentMutation
} from '../redux/api/ordersApiSlice';
import { clearCartItems, clearBuyNowItem } from '../redux/slices/cartSlice';

const PlaceOrderScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);

    const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
    const [createRazorpayOrder, { isLoading: isCreatingRazorpayOrder }] = useCreateRazorpayOrderMutation();
    const [verifyRazorpayPayment, { isLoading: isVerifyingPayment }] = useVerifyRazorpayPaymentMutation();

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate('/shipping');
        } else if (!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

    const displayItems = cart.buyNowItem ? [cart.buyNowItem] : cart.cartItems;

    const handleRazorpayPayment = async (orderId) => {
        try {
            const razorpayOrder = await createRazorpayOrder(orderId).unwrap();
            const options = {
                key: razorpayOrder.key_id || 'rzp_test_placeholder',
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: 'eShop Premium',
                description: `Payment for Order #${orderId}`,
                order_id: razorpayOrder.id,
                handler: async function (response) {
                    try {
                        await verifyRazorpayPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: orderId
                        }).unwrap();

                        finalizeOrder(orderId);
                    } catch (err) {
                        alert('Payment Verification Failed: ' + (err?.data?.message || err.message));
                        navigate(`/order/${orderId}`);
                    }
                },
                modal: {
                    ondismiss: function () {
                        alert('Payment cancelled. You can complete it from the order details page.');
                        navigate(`/order/${orderId}`);
                    }
                },
                prefill: {
                    name: cart.shippingAddress.name || '',
                    email: '', // Add user email if available in state
                },
                theme: { color: '#2563eb' },
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            alert('Failed to initiate Razorpay: ' + (err?.data?.message || err.message));
            navigate(`/order/${orderId}`);
        }
    };

    const finalizeOrder = (orderId) => {
        if (cart.buyNowItem) {
            dispatch(clearBuyNowItem());
        } else {
            dispatch(clearCartItems());
        }
        navigate(`/order/${orderId}`);
    };

    const placeOrderHandler = async () => {
        try {
            const res = await createOrder({
                orderItems: displayItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            }).unwrap();

            if (res && res._id) {
                if (cart.paymentMethod === 'Razorpay') {
                    await handleRazorpayPayment(res._id);
                } else {
                    finalizeOrder(res._id);
                }
            }
        } catch (err) {
            alert(err?.data?.message || err.error || 'Failed to place order');
        }
    };

    const isLoading = isCreatingOrder || isCreatingRazorpayOrder || isVerifyingPayment;

    return (
        <div className="max-w-7xl mx-auto py-12 px-4">
            <CheckoutSteps step2 step3 step4 />

            <div className="flex flex-col lg:flex-row gap-12">
                <div className="flex-grow space-y-10">
                    {/* Visual Highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="premium-card p-6 sm:p-8 bg-white border-none shadow-xl shadow-blue-500/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-500"></div>
                            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center relative z-10">
                                <MapPin className="h-6 w-6 mr-3 text-blue-600" />
                                Delivery
                            </h2>
                            <div className="space-y-4 relative z-10">
                                <div className="flex items-start gap-3 sm:gap-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:2xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                                        <Info className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-slate-400 text-[10px] uppercase tracking-widest font-black mb-1">Shipping To</p>
                                        <p className="text-slate-700 font-bold leading-relaxed shadow-sm bg-slate-50/50 p-2 sm:p-3 rounded-xl border border-slate-100/50 text-sm sm:text-base break-words">
                                            {cart.shippingAddress.address}<br />
                                            <span className="text-slate-500 font-medium">
                                                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="premium-card p-6 sm:p-8 bg-white border-none shadow-xl shadow-blue-500/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-500"></div>
                            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center relative z-10">
                                <CreditCard className="h-6 w-6 mr-3 text-emerald-600" />
                                Payment
                            </h2>
                            <div className="space-y-4 relative z-10">
                                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className={`p-2 sm:p-3 rounded-xl ${cart.paymentMethod === 'Razorpay' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                                        {cart.paymentMethod === 'Razorpay' ? <Wallet className="h-5 w-5 sm:h-6 sm:w-6" /> : <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-slate-900 font-black text-base sm:text-lg truncate">{cart.paymentMethod === 'Razorpay' ? 'Razorpay' : 'COD'}</p>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Verified</p>
                                    </div>
                                    {cart.paymentMethod === 'Razorpay' && <CheckCircle className="ml-auto h-5 w-5 sm:h-6 sm:w-6 text-emerald-500 fill-emerald-50" />}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items List */}
                    <div className="premium-card bg-white border-none shadow-xl shadow-blue-500/5 overflow-hidden">
                        <div className="p-6 sm:p-8 border-b border-slate-50 flex justify-between items-center">
                            <h2 className="text-xl font-black text-slate-900 flex items-center">
                                <Package className="h-6 w-6 mr-3 text-blue-600" />
                                Overview
                            </h2>
                            <span className="bg-slate-100 text-slate-600 px-3 sm:px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                {displayItems.length} {displayItems.length === 1 ? 'Item' : 'Items'}
                            </span>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {displayItems.length === 0 ? (
                                <div className="p-12 text-center">
                                    <ShoppingBag className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-500 font-bold text-lg">Your cart is empty</p>
                                </div>
                            ) : (
                                displayItems.map((item, index) => (
                                    <div key={index} className="px-6 sm:px-8 py-6 group hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-center gap-4 sm:gap-6">
                                            <div className="relative flex-shrink-0">
                                                <img src={item.image} alt={item.name} className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl object-cover shadow-md transition-transform group-hover:scale-105" />
                                                <div className="absolute -top-2 -right-2 bg-blue-600 text-white w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-[10px] sm:text-xs font-black shadow-lg">
                                                    {item.qty}
                                                </div>
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <h4 className="font-black text-slate-900 text-sm sm:text-lg group-hover:text-blue-600 transition-colors mb-0.5 sm:mb-1 truncate">{item.name}</h4>
                                                <p className="text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Premium</p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="font-black text-slate-900 text-base sm:text-xl">${(item.qty * item.price).toFixed(2)}</p>
                                                <p className="text-slate-400 text-[10px] font-bold">${item.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Summary Column */}
                <div className="lg:w-[400px] flex-shrink-0">
                    <div className="sticky top-28 space-y-6">
                        <div className="premium-card bg-white p-6 sm:p-8 border border-slate-100 shadow-2xl shadow-blue-500/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>

                            <h3 className="text-xl font-black mb-8 flex items-center relative z-10 text-slate-900">
                                <ShoppingBag className="h-6 w-6 mr-3 text-blue-600" />
                                Final Total
                            </h3>

                            <div className="space-y-6 relative z-10">
                                <div className="flex justify-between items-center">
                                    <span className="font-black uppercase tracking-widest text-[10px] text-slate-500">Base Items</span>
                                    <span className="text-slate-900 font-black text-xl">${cart.itemsPrice}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-500">
                                    <span className="font-black uppercase tracking-widest text-[10px]">Shipping</span>
                                    <span className={`font-black text-xl ${cart.shippingPrice === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                                        {cart.shippingPrice === 0 ? 'FREE' : `$${cart.shippingPrice}`}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-slate-500">
                                    <span className="font-black uppercase tracking-widest text-[10px]">Taxes</span>
                                    <span className="text-slate-900 font-black text-xl">${cart.taxPrice}</span>
                                </div>

                                <div className="pt-8 border-t border-slate-100">
                                    <div className="flex justify-between items-end flex-wrap gap-4">
                                        <div>
                                            <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-1">Amount Due</p>
                                            <p className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">${cart.totalPrice}</p>
                                        </div>
                                        <div className="bg-blue-50 px-3 py-1.5 rounded-lg text-[10px] font-black text-blue-600 uppercase tracking-widest border border-blue-100/50">
                                            {cart.paymentMethod === 'Razorpay' ? 'Secure digital' : 'Pay on arrival'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={placeOrderHandler}
                                disabled={displayItems.length === 0 || isLoading}
                                className="w-full mt-10 bg-blue-600 hover:bg-blue-500 text-white py-4 sm:py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-600/30 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center group"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-7 w-7 animate-spin" />
                                ) : (
                                    <>
                                        {cart.paymentMethod === 'Razorpay' ? 'Securely Pay Now' : 'Confirm Order'}
                                        <ArrowRight className="ml-3 h-6 w-6 transform group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="p-5 sm:p-6 bg-blue-50 border border-blue-100 flex gap-4 rounded-3xl">
                            <Info className="h-6 w-6 text-blue-500 shrink-0" />
                            <div>
                                <p className="text-blue-900 font-bold text-sm mb-1">Secure Checkout</p>
                                <p className="text-blue-700/70 text-xs leading-relaxed">Your transaction is encrypted and secured by modern banking standards.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrderScreen;
