import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { addToCart, removeFromCart, clearBuyNowItem } from '../redux/slices/cartSlice';

const CartScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(clearBuyNowItem());
    }, [dispatch]);

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    const addToCartHandler = (product, qty) => {
        dispatch(addToCart({ ...product, qty }));
    };

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    const { userInfo } = useSelector((state) => state.auth);

    const checkoutHandler = () => {
        if (!userInfo) {
            navigate('/login?redirect=/shipping');
        } else {
            navigate('/shipping');
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 mb-6 sm:mb-8 flex items-center tracking-tight">
                <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 text-blue-600" />
                Shopping Cart
            </h1>

            {cartItems.length === 0 ? (
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center border border-slate-100 shadow-sm">
                    <div className="bg-blue-50 w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <ShoppingBag className="h-6 w-6 sm:h-10 sm:w-10 text-blue-500" />
                    </div>
                    <h2 className="text-lg sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">Your cart is empty</h2>
                    <p className="text-slate-500 text-xs sm:text-base mb-6 sm:mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <Link
                        to="/"
                        className="bg-blue-600 text-white font-bold py-3.5 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl hover:bg-blue-700 transition-all shadow-lg active:scale-95 inline-block text-xs sm:text-base"
                    >
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-3 sm:space-y-6">
                        {cartItems.map((item) => (
                            <div key={item._id} className="premium-card p-2 sm:p-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-6 bg-white overflow-hidden">
                                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 bg-slate-50">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-grow text-center sm:text-left min-w-0">
                                    <Link to={`/product/${item._id}`} className="text-sm sm:text-lg font-black text-slate-900 hover:text-blue-600 transition-colors line-clamp-1 block">
                                        {item.name}
                                    </Link>
                                    <p className="text-slate-400 text-[10px] sm:text-sm font-bold uppercase tracking-widest mt-0.5">{item.category?.name || item.category}</p>
                                </div>
                                <div className="flex items-center justify-between w-full sm:w-auto gap-2 sm:gap-4">
                                    <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl p-1 shrink-0">
                                        <button
                                            onClick={() => addToCartHandler(item, Math.max(1, item.qty - 1))}
                                            className="p-1 sm:p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                                        >
                                            <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                                        </button>
                                        <span className="w-7 sm:w-10 text-center font-black text-xs sm:text-base text-slate-900">{item.qty}</span>
                                        <button
                                            onClick={() => addToCartHandler(item, Math.min(item.countInStock, item.qty + 1))}
                                            className="p-1 sm:p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                                        >
                                            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                                        </button>
                                    </div>
                                    <div className="text-base sm:text-xl font-black text-slate-900 min-w-[50px] sm:min-w-[80px] text-right">
                                        ${item.price}
                                    </div>
                                    <button
                                        onClick={() => removeFromCartHandler(item._id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    >
                                        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="premium-card p-4 sm:p-8 bg-white sticky top-28 border-none shadow-xl shadow-blue-500/5">
                            <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-4 sm:mb-8 pb-3 sm:pb-4 border-b border-slate-50 flex items-center">
                                Order Summary
                            </h3>

                            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-10">
                                <div className="flex justify-between items-center text-xs sm:text-base">
                                    <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Items Volume</span>
                                    <span className="text-slate-900 font-bold">${cart.itemsPrice}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs sm:text-base">
                                    <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Logistics</span>
                                    <span className={`font-bold ${cart.shippingPrice === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                                        {cart.shippingPrice === 0 ? 'FREE' : `$${cart.shippingPrice}`}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs sm:text-base">
                                    <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Govt Tax (15%)</span>
                                    <span className="text-slate-900 font-bold">${cart.taxPrice}</span>
                                </div>
                                <div className="pt-4 sm:pt-6 border-t border-slate-50 flex justify-between items-end">
                                    <div>
                                        <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-1">Final Total</p>
                                        <span className="text-2xl sm:text-3xl font-black text-slate-900">${cart.totalPrice}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={checkoutHandler}
                                className="w-full bg-slate-900 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black flex items-center justify-center hover:bg-slate-800 transition-all shadow-xl active:scale-[0.98] group text-sm sm:text-base"
                            >
                                Checkout Safely
                                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transform group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartScreen;
