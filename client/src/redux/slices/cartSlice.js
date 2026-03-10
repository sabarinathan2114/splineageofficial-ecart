import { createSlice } from '@reduxjs/toolkit';

const getCartFromStorage = () => {
    const storage = localStorage.getItem('cart');
    if (storage) {
        try {
            const parsed = JSON.parse(storage);
            return {
                cartItems: parsed.cartItems || [],
                buyNowItem: parsed.buyNowItem || null,
                shippingAddress: parsed.shippingAddress || {},
                paymentMethod: parsed.paymentMethod || 'Stripe',
                itemsPrice: parsed.itemsPrice || '0.00',
                shippingPrice: parsed.shippingPrice || '0.00',
                taxPrice: parsed.taxPrice || '0.00',
                totalPrice: parsed.totalPrice || '0.00',
            };
        } catch (e) {
            return { cartItems: [], buyNowItem: null, shippingAddress: {}, paymentMethod: 'Stripe' };
        }
    }
    return { cartItems: [], buyNowItem: null, shippingAddress: {}, paymentMethod: 'Stripe' };
};

const initialState = getCartFromStorage();

const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x._id === item._id);

            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x._id === existItem._id ? item : x
                );
            } else {
                state.cartItems = [...state.cartItems, item];
            }

            // Calculate items price
            state.itemsPrice = addDecimals(
                state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
            );

            // Calculate shipping price (If order is over $100 then free, else $10)
            state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

            // Calculate tax price (15% tax)
            state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));

            // Calculate total price
            state.totalPrice = (
                Number(state.itemsPrice) +
                Number(state.shippingPrice) +
                Number(state.taxPrice)
            ).toFixed(2);

            localStorage.setItem('cart', JSON.stringify(state));
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);

            state.itemsPrice = addDecimals(
                state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
            );
            state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);
            state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));
            state.totalPrice = (
                Number(state.itemsPrice) +
                Number(state.shippingPrice) +
                Number(state.taxPrice)
            ).toFixed(2);

            localStorage.setItem('cart', JSON.stringify(state));
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            localStorage.setItem('cart', JSON.stringify(state));
        },
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
            localStorage.setItem('cart', JSON.stringify(state));
        },
        setBuyNowItem: (state, action) => {
            state.buyNowItem = action.payload;
            const item = state.buyNowItem;

            // Recalculate prices for ONLY the buyNowItem
            state.itemsPrice = addDecimals(item.price * item.qty);
            state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);
            state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));
            state.totalPrice = (
                Number(state.itemsPrice) +
                Number(state.shippingPrice) +
                Number(state.taxPrice)
            ).toFixed(2);

            localStorage.setItem('cart', JSON.stringify(state));
        },
        clearBuyNowItem: (state) => {
            state.buyNowItem = null;

            // Restore prices from cartItems
            state.itemsPrice = addDecimals(
                state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
            );
            state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);
            state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));
            state.totalPrice = (
                Number(state.itemsPrice) +
                Number(state.shippingPrice) +
                Number(state.taxPrice)
            ).toFixed(2);

            localStorage.setItem('cart', JSON.stringify(state));
        },
        clearCartItems: (state) => {
            state.cartItems = [];
            state.buyNowItem = null;
            localStorage.setItem('cart', JSON.stringify(state));
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    setBuyNowItem,
    clearBuyNowItem,
    saveShippingAddress,
    savePaymentMethod,
    clearCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;
