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
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center">
                <ShoppingBag className="h-8 w-8 mr-3 text-blue-600" />
                Shopping Cart
            </h1>

            {cartItems.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                    <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="h-10 w-10 text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
                    <p className="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <Link
                        to="/"
                        className="bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl hover:bg-blue-700 transition-all shadow-lg active:scale-95 inline-block"
                    >
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.map((item) => (
                            <div key={item._id} className="premium-card p-4 flex flex-col sm:flex-row items-center gap-6 bg-white">
                                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-grow text-center sm:text-left">
                                    <Link to={`/product/${item._id}`} className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors">
                                        {item.name}
                                    </Link>
                                    <p className="text-slate-500 text-sm mt-1">{item.category?.name || item.category}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center bg-slate-100 rounded-lg p-1">
                                        <button
                                            onClick={() => addToCartHandler(item, Math.max(1, item.qty - 1))}
                                            className="p-1 hover:bg-white rounded-md transition-colors"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="w-10 text-center font-bold">{item.qty}</span>
                                        <button
                                            onClick={() => addToCartHandler(item, Math.min(item.countInStock, item.qty + 1))}
                                            className="p-1 hover:bg-white rounded-md transition-colors"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="text-xl font-bold text-slate-900 w-24 text-right">
                                        ${item.price}
                                    </div>
                                    <button
                                        onClick={() => removeFromCartHandler(item._id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="premium-card p-6 bg-white sticky top-28">
                            <h3 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">
                                Order Summary
                            </h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600 font-medium">Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</span>
                                    <span className="text-slate-900 font-bold">${cart.itemsPrice}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600 font-medium">Shipping</span>
                                    <span className="text-slate-900 font-bold">${cart.shippingPrice}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600 font-medium">Tax (15%)</span>
                                    <span className="text-slate-900 font-bold">${cart.taxPrice}</span>
                                </div>
                                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                    <span className="text-lg font-bold text-slate-900">Total</span>
                                    <span className="text-2xl font-black text-blue-600">${cart.totalPrice}</span>
                                </div>
                            </div>

                            <button
                                onClick={checkoutHandler}
                                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg active:scale-95 group"
                            >
                                Proceed to Checkout
                                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartScreen;
