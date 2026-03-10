import { apiSlice } from './apiSlice';

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: '/api/users/login',
                method: 'POST',
                body: data,
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: '/api/users',
                method: 'POST',
                body: data,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/api/users/logout',
                method: 'POST',
            }),
        }),
        profile: builder.mutation({
            query: (data) => ({
                url: '/api/users/profile',
                method: 'PUT',
                body: data,
            }),
        }),
        getUsers: builder.query({
            query: () => ({
                url: '/api/users',
            }),
            providesTags: ['User'],
            keepUnusedDataFor: 5,
        }),
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `/api/users/${userId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),
        getUserDetails: builder.query({
            query: (id) => ({
                url: `/api/users/${id}`,
            }),
            keepUnusedDataFor: 5,
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: `/api/users/${data.userId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        getAddresses: builder.query({
            query: () => ({
                url: '/api/users/addresses',
            }),
            providesTags: ['Address'],
        }),
        addAddress: builder.mutation({
            query: (data) => ({
                url: '/api/users/addresses',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Address'],
        }),
        updateAddress: builder.mutation({
            query: (data) => ({
                url: `/api/users/addresses/${data._id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Address'],
        }),
        deleteAddress: builder.mutation({
            query: (id) => ({
                url: `/api/users/addresses/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Address'],
        }),
        getSellerStats: builder.query({
            query: (id) => ({
                url: `/api/users/${id}/stats`,
            }),
            keepUnusedDataFor: 5,
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useProfileMutation,
    useGetUsersQuery,
    useDeleteUserMutation,
    useGetUserDetailsQuery,
    useUpdateUserMutation,
    useGetAddressesQuery,
    useAddAddressMutation,
    useUpdateAddressMutation,
    useDeleteAddressMutation,
    useGetSellerStatsQuery,
} = userApiSlice;
