import React from 'react';
import {
    useGetProductsQuery,
    useDeleteProductMutation,
    useCreateProductMutation
} from '../../redux/api/productApiSlice';
import {
    Trash2,
    Edit,
    Plus,
    Image as ImageIcon,
    Tag,
    Package,
    ArrowLeft
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const ProductListScreen = () => {
    const navigate = useNavigate();
    const { data: products, refetch, isLoading, error } = useGetProductsQuery();

    const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();
    const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                refetch();
            } catch (err) {
                alert(err?.data?.message || err.error);
            }
        }
    };

    const createProductHandler = async () => {
        if (window.confirm('Create a new sample product?')) {
            try {
                const res = await createProduct().unwrap();
                navigate(`/seller/product/${res._id}/edit`);
            } catch (err) {
                console.error(err);
                alert(err?.data?.message || err.error || 'Failed to create product');
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 mb-2">Product Management</h1>
                    <p className="text-slate-500 font-medium italic">Add, update, or remove products from your store.</p>
                </div>
                <button
                    onClick={createProductHandler}
                    className="flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-lg active:scale-95 leading-none"
                >
                    <Plus className="h-5 w-5 mr-2" /> Create Product
                </button>
            </div>

            {loadingDelete && <Loader />}
            {loadingCreate && <Loader />}

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error?.data?.message || error.error}</Message>
            ) : (
                <div className="premium-card bg-white overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900 text-white">
                                <tr>
                                    <th className="py-4 px-6 text-xs font-black uppercase tracking-widest">Product</th>
                                    <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-center">Category</th>
                                    <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-center">Seller</th>
                                    <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-center">Price</th>
                                    <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-center">Stock</th>
                                    <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {products.map((product) => (
                                    <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-12 h-12 rounded-xl object-cover mr-4 ring-2 ring-slate-100 bg-slate-100"
                                                />
                                                <div>
                                                    <span className="block font-black text-slate-900 leading-tight">{product.name}</span>
                                                    <span className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">{product._id.substring(0, 10)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                                                <Tag className="h-3 w-3 mr-1" /> {product.category?.name || product.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                                                {product.user?.name || 'Admin'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center font-black text-slate-900">
                                            ${product.price.toFixed(2)}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className={`px-3 py-1 rounded-full text-xs font-black ${product.countInStock > 5
                                                    ? 'bg-emerald-100 text-emerald-600'
                                                    : 'bg-rose-100 text-rose-600'
                                                    }`}>
                                                    {product.countInStock} Units
                                                </span>
                                                {product.countInStock < 5 && (
                                                    <a
                                                        href={`mailto:${product.user?.email || ''}?subject=Low Stock Alert: ${product.name}&body=Please restock this item.`}
                                                        className="text-[10px] text-rose-600 font-bold hover:underline"
                                                    >
                                                        Notify Seller
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/seller/product/${product._id}/edit`)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteHandler(product._id)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductListScreen;
