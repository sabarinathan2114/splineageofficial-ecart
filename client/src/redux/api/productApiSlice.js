import { apiSlice } from './apiSlice';

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (keyword) => ({
                url: '/api/products',
                params: { keyword },
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Product'],
        }),
        getProductDetails: builder.query({
            query: (productId) => ({
                url: `/api/products/${productId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        createProduct: builder.mutation({
            query: () => ({
                url: '/api/products',
                method: 'POST',
            }),
            invalidatesTags: ['Product'],
        }),
        updateProduct: builder.mutation({
            query: (data) => ({
                url: `/api/products/${data.productId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Product'],
        }),
        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `/api/products/${productId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Product'],
        }),
        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: '/api/upload',
                method: 'POST',
                body: data,
            }),
        }),
        getCategories: builder.query({
            query: () => ({
                url: '/api/categories',
            }),
            keepUnusedDataFor: 5,
        }),
        getRelatedProducts: builder.query({
            query: (productId) => ({
                url: `/api/products/${productId}/related`,
            }),
            keepUnusedDataFor: 5,
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductDetailsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useUploadProductImageMutation,
    useGetCategoriesQuery,
    useGetRelatedProductsQuery,
} = productApiSlice;
