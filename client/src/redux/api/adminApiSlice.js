import { apiSlice } from './apiSlice';

export const adminApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAdminStats: builder.query({
            query: () => ({
                url: '/api/admin/stats',
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Order', 'User', 'Product'],
        }),
        getAllUsers: builder.query({
            query: () => ({
                url: '/api/admin/users',
            }),
            keepUnusedDataFor: 5,
            providesTags: ['User'],
        }),
        getAllOrders: builder.query({
            query: () => ({
                url: '/api/admin/orders',
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Order'],
        }),
    }),
});

export const {
    useGetAdminStatsQuery,
    useGetAllUsersQuery,
    useGetAllOrdersQuery,
} = adminApiSlice;
