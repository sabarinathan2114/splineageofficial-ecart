import { apiSlice } from './apiSlice';

export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: '/api/orders',
                method: 'POST',
                body: { ...order },
            }),
        }),
        getOrderDetails: builder.query({
            query: (orderId) => ({
                url: `/api/orders/${orderId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        payOrder: builder.mutation({
            query: ({ orderId, details }) => ({
                url: `/api/orders/${orderId}/pay`,
                method: 'PUT',
                body: details,
            }),
        }),
        createRazorpayOrder: builder.mutation({
            query: (orderId) => ({
                url: '/api/payment/razorpay/order',
                method: 'POST',
                body: { orderId },
            }),
        }),
        verifyRazorpayPayment: builder.mutation({
            query: (paymentData) => ({
                url: '/api/payment/razorpay/verify',
                method: 'POST',
                body: { ...paymentData },
            }),
        }),
        getMyOrders: builder.query({
            query: () => ({
                url: '/api/orders/mine',
            }),
            keepUnusedDataFor: 5,
        }),
        getOrders: builder.query({
            query: () => ({
                url: '/api/orders',
            }),
            keepUnusedDataFor: 5,
        }),
        getSellerOrders: builder.query({
            query: () => ({
                url: '/api/orders/seller',
            }),
            keepUnusedDataFor: 5,
        }),
        getSellerDashboardStats: builder.query({
            query: () => ({
                url: '/api/orders/seller/dashboard',
            }),
            keepUnusedDataFor: 30,
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useCreateRazorpayOrderMutation,
    useVerifyRazorpayPaymentMutation,
    useGetMyOrdersQuery,
    useGetOrdersQuery,
    useGetSellerOrdersQuery,
    useGetSellerDashboardStatsQuery,
} = ordersApiSlice;
