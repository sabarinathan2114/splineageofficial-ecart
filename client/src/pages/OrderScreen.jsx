import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, CreditCard, ShoppingBag, Package, CheckCircle, Clock, AlertCircle, Loader2, Zap, ArrowRight, Wallet, User as UserIcon, Calendar, Info } from 'lucide-react';
import {
    useGetOrderDetailsQuery,
    useCreateRazorpayOrderMutation,
    useVerifyRazorpayPaymentMutation
} from '../redux/api/ordersApiSlice';

const OrderScreen = () => {
    const { id: orderId } = useParams();
    const { data: order, isLoading, error, refetch } = useGetOrderDetailsQuery(orderId);

    const [createRazorpayOrder, { isLoading: isCreatingRazorpayOrder }] = useCreateRazorpayOrderMutation();
    const [verifyRazorpayPayment, { isLoading: isVerifyingPayment }] = useVerifyRazorpayPaymentMutation();

    const handlePayment = async () => {
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
                        alert('Payment Successful!');
                        refetch();
                    } catch (err) {
                        alert(err?.data?.message || 'Payment Verification Failed');
                    }
                },
                prefill: {
                    name: order.user.name,
                    email: order.user.email,
                },
                theme: { color: '#2563eb' },
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error('Payment Initiation Error:', err);
            const errorMsg = err?.data?.message || err?.message || 'Failed to initiate payment';
            alert(`Error: ${errorMsg}`);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[70vh] space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent shadow-xl"></div>
                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Loading Order</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto mt-20 p-12 bg-white rounded-[40px] shadow-2xl shadow-red-500/5 text-center border border-red-50">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
                    <AlertCircle className="h-10 w-10" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">System Refusal</h2>
                <p className="text-slate-500 font-medium leading-relaxed">{error?.data?.message || error.error || 'The requested order data is unavailable.'}</p>
                <Link to="/" className="mt-10 inline-flex items-center bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-slate-800 transition-all active:scale-95 group">
                    Return to Shop
                    <ArrowRight className="ml-3 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        );
    }

    const isCOD = order.paymentMethod === 'COD';

    return (
        <div className="max-w-7xl mx-auto py-4 sm:py-12 px-2 sm:px-4 mb-10 sm:mb-20 shrink-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sm:gap-6 mb-6 sm:mb-12">
                <div className="min-w-0 w-full">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <span className="bg-blue-600 text-white px-2 sm:px-4 py-1 sm:py-1.5 rounded-full text-[7px] sm:text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">Official Invoice</span>
                        <span className="text-slate-300 font-black">/</span>
                        <span className="text-slate-400 text-[8px] sm:text-xs font-bold uppercase tracking-widest bg-slate-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full whitespace-nowrap">#{order?._id.slice(-8)}</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-1.5 sm:mb-2 break-words">Order Confirmed.</h1>
                    <p className="text-slate-500 font-medium text-sm sm:text-lg">Thank you for choosing <span className="text-blue-600 font-black underline decoration-blue-200 underline-offset-4">eShop</span>.</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 p-2.5 sm:p-4 bg-white rounded-xl sm:rounded-3xl border border-slate-100 shadow-sm w-full md:w-auto">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-50 text-blue-600 rounded-lg sm:rounded-2xl flex items-center justify-center shrink-0">
                        <Calendar className="h-4 w-4 sm:h-6 sm:w-6" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-slate-400 text-[7px] sm:text-[10px] uppercase font-black tracking-widest">Order Date</p>
                        <p className="text-slate-900 font-black text-xs sm:text-base truncate">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
                <div className="lg:col-span-2 space-y-6 sm:space-y-10">

                    {/* Status Modules */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Delivery Module */}
                        <div className={`premium-card p-4 sm:p-8 bg-white border-2 transition-all ${order.isDelivered ? 'border-emerald-100 bg-emerald-50/20' : 'border-slate-50 hover:border-blue-100'}`}>
                            <div className="flex justify-between items-start mb-4 sm:mb-8">
                                <div className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl ${order.isDelivered ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[7px] sm:text-[10px] font-black uppercase tracking-widest ${order.isDelivered ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white'}`}>
                                    {order.isDelivered ? 'Delivered' : 'Pending'}
                                </div>
                            </div>
                            <h3 className="text-slate-900 font-black text-base sm:text-xl mb-3 sm:mb-6">Dispatch Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-slate-900 font-black bg-slate-100 p-2 sm:p-3 rounded-xl border border-slate-200 text-xs sm:text-sm truncate">
                                    <UserIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500 flex-shrink-0" />
                                    {order.user.name}
                                </div>
                                <p className="text-slate-600 text-xs sm:text-sm font-bold leading-relaxed px-1 break-words">
                                    {order.shippingAddress.address}, {order.shippingAddress.city}
                                </p>
                            </div>
                        </div>

                        {/* Payment Module */}
                        <div className={`premium-card p-4 sm:p-8 bg-white border-2 transition-all ${order.isPaid ? 'border-emerald-100 bg-emerald-50/20' : 'border-slate-50 hover:border-blue-100'}`}>
                            <div className="flex justify-between items-start mb-4 sm:mb-8">
                                <div className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl ${order.isPaid ? 'bg-emerald-100 text-emerald-600' : isCOD ? 'bg-amber-100 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                                    <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[7px] sm:text-[10px] font-black uppercase tracking-widest ${order.isPaid ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                                    {order.isPaid ? 'Paid' : isCOD ? 'COD' : 'Awaiting'}
                                </div>
                            </div>
                            <h3 className="text-slate-900 font-black text-base sm:text-xl mb-3 sm:mb-6">Payment Info</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-slate-900 font-black bg-slate-100 p-2 sm:p-3 rounded-xl border border-slate-200 text-xs sm:text-sm">
                                    <Wallet className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500 flex-shrink-0" />
                                    {isCOD ? 'Cash on Delivery' : 'Digital'}
                                </div>
                                {order.isPaid ? (
                                    <div className="flex items-center text-emerald-600 bg-emerald-100/50 px-3 py-2 rounded-xl text-[9px] sm:text-xs font-black uppercase tracking-widest gap-2">
                                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                                        Success
                                    </div>
                                ) : (
                                    <div className="flex items-center text-amber-600 bg-amber-100/50 px-3 py-2 rounded-xl text-[9px] sm:text-xs font-black uppercase tracking-widest gap-2">
                                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                        {isCOD ? 'Pay On Arrival' : 'Pending'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order Items Table-style */}
                    <div className="premium-card bg-white border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                        <div className="p-4 sm:p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center">
                                <Package className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-blue-600" />
                                Package Manifest
                            </h2>
                            <span className="text-slate-400 text-[8px] sm:text-[10px] font-black uppercase tracking-widest">{order.orderItems.length} DISTINCT PRODUCTS</span>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {order.orderItems.map((item, index) => (
                                <div key={index} className="px-4 sm:px-8 py-4 sm:py-8 group hover:bg-slate-50/30 transition-all">
                                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                                        <div className="relative shrink-0">
                                            <div className="absolute inset-0 bg-blue-600/5 blur-xl group-hover:bg-blue-600/10 transition-colors"></div>
                                            <img src={item.image} alt={item.name} className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-[32px] object-cover relative z-10 shadow-lg shadow-blue-500/5 border-2 border-white" />
                                            <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-slate-900 text-white w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl flex items-center justify-center text-[10px] sm:text-xs font-black z-20 shadow-xl border-2 border-white">
                                                x{item.qty}
                                            </div>
                                        </div>
                                        <div className="flex-grow text-center sm:text-left">
                                            <Link to={`/product/${item?.product}`} className="text-lg sm:text-2xl font-black text-slate-900 hover:text-blue-600 transition-colors tracking-tight block mb-1.5 sm:mb-2">
                                                {item?.name}
                                            </Link>
                                            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-slate-100 px-2 sm:px-3 py-1 rounded-full">
                                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500"></div>
                                                <span className="text-slate-500 text-[8px] sm:text-[10px] font-black uppercase tracking-widest">Premium Quality</span>
                                            </div>
                                        </div>
                                        <div className="text-center sm:text-right shrink-0">
                                            <p className="text-slate-400 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-0.5 sm:mb-1">Unit Weight Price</p>
                                            <p className="text-xl sm:text-3xl font-black text-slate-900 tracking-tighter">${(item.qty * item.price).toFixed(2)}</p>
                                            <p className="text-blue-600 font-bold text-xs sm:text-sm tracking-wide mt-0.5 sm:mt-1">${item.price} <span className="text-slate-300">/ unit</span></p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-28 space-y-8">
                        {/* Receipt Panel */}
                        <div className="premium-card bg-white text-slate-900 border border-slate-100 shadow-xl shadow-blue-500/5 relative overflow-hidden flex flex-col pt-6 sm:pt-8">
                            <div className="absolute top-0 inset-x-0 h-4 flex gap-1 justify-center px-4 -mt-2">
                                {[...Array(15)].map((_, i) => (
                                    <div key={i} className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-slate-50 shrink-0 border border-slate-100/50"></div>
                                ))}
                            </div>

                            <div className="px-3 sm:px-6 pb-4 sm:pb-8">
                                <h3 className="text-base sm:text-xl font-black mb-4 sm:mb-8 flex items-center tracking-tight text-slate-900">
                                    <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-7 mr-2 sm:mr-4 text-blue-600" />
                                    Cost Matrix
                                </h3>

                                <div className="space-y-3 sm:space-y-4 relative z-10">
                                    <div className="flex justify-between items-center">
                                        <span className="font-black uppercase tracking-widest text-[7px] sm:text-[10px] text-slate-400">Net Items</span>
                                        <span className="text-slate-900 font-black text-base sm:text-xl">${order?.itemsPrice?.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-black uppercase tracking-widest text-[7px] sm:text-[10px] text-slate-400">Logistics</span>
                                        <span className={`font-black text-base sm:text-xl ${order?.shippingPrice === 0 ? 'text-emerald-500' : 'text-slate-900'}`}>
                                            {order?.shippingPrice === 0 ? 'SECURED FREE' : `$${order?.shippingPrice?.toFixed(2)}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-black uppercase tracking-widest text-[7px] sm:text-[10px] text-slate-400">Fiscal Govt Tax</span>
                                        <span className="text-slate-900 font-black text-base sm:text-xl">${order?.taxPrice?.toFixed(2)}</span>
                                    </div>

                                    <div className="pt-4 sm:pt-6 border-t border-slate-100 mt-4 sm:mt-6">
                                        <div className="flex flex-col gap-0.5 sm:gap-1">
                                            <p className="text-blue-600 text-[7px] sm:text-[10px] font-black uppercase tracking-[0.3em]">Total Assessment</p>
                                            <div className="flex justify-between items-end flex-wrap gap-2">
                                                <p className="text-2xl sm:text-5xl font-black tracking-tight leading-none text-slate-900">${order?.totalPrice?.toFixed(2)}</p>
                                                <div className="bg-emerald-500 text-white px-2 sm:px-3 py-1 rounded-lg text-[7px] sm:text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                                                    USD
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {!order.isPaid && !isCOD && (
                                    <button
                                        onClick={handlePayment}
                                        disabled={isCreatingRazorpayOrder || isVerifyingPayment}
                                        className="w-full mt-6 sm:mt-8 bg-blue-600 hover:bg-blue-500 text-white py-3.5 sm:py-5 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 sm:gap-3 group"
                                    >
                                        {isCreatingRazorpayOrder || isVerifyingPayment ? (
                                            <Loader2 className="h-5 w-5 sm:h-7 sm:w-7 animate-spin" />
                                        ) : (
                                            <>
                                                <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-yellow-400" />
                                                Pay Now
                                                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1.5 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                )}

                                {isCOD && !order.isPaid && (
                                    <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </div>
                                        <p className="text-amber-700 font-black text-[10px] sm:text-xs uppercase tracking-widest mb-1">Arrival Payment</p>
                                        <p className="text-amber-600/70 text-[9px] sm:text-[11px] font-bold leading-relaxed">Keep cash ready at delivery point.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Customer Support Helper */}
                        <div className="p-6 sm:p-8 bg-blue-50 border border-blue-100 rounded-[32px] sm:rounded-[40px] flex flex-col items-center text-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-2xl sm:rounded-3xl shadow-lg flex items-center justify-center mb-4 sm:mb-6">
                                <Info className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                            </div>
                            <h4 className="text-blue-900 font-black text-base sm:text-lg mb-2">Assistance?</h4>
                            <p className="text-blue-700/60 text-xs font-medium leading-relaxed mb-4 sm:mb-6">Our team is available for any questions regarding your package manifest.</p>
                            <button className="text-blue-600 font-black text-[10px] sm:text-xs uppercase tracking-widest hover:underline">Contact Concierge</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderScreen;
