import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
    useUpdateProductMutation,
    useGetProductDetailsQuery,
    useUploadProductImageMutation,
    useGetCategoriesQuery
} from '../../redux/api/productApiSlice';
import {
    ArrowLeft,
    Save,
    Tag,
    DollarSign,
    Package,
    Image as ImageIcon,
    Type,
    FileText,
    CheckCircle2,
    Upload,
    Loader2,
    ChevronDown
} from 'lucide-react';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const ProductEditScreen = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [dragActive, setDragActive] = useState(false);

    const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);
    const { data: categories, isLoading: loadingCategories } = useGetCategoriesQuery();

    const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
    const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category?._id || product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
    }, [product]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await updateProduct({
                productId,
                name,
                price,
                image,
                brand,
                category,
                countInStock,
                description,
            }).unwrap();
            toast.success('Product Updated Successfully');
            if (userInfo.isAdmin) {
                navigate('/admin/productlist');
            } else {
                navigate('/seller/products');
            }
        } catch (err) {
            console.error(err);
            toast.error(err?.data?.message || err.error || 'Failed to update product');
        }
    };

    const handleFileUpload = async (file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image);
        } catch (err) {
            console.error('Upload Error:', err);
            toast.error(err?.data?.message || err.error || 'Image upload failed. Check server connection.');
        }
    };

    const uploadFileHandler = (e) => {
        handleFileUpload(e.target.files[0]);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <Link to={userInfo?.isAdmin ? "/admin/productlist" : "/seller/products"} className="inline-flex items-center text-slate-500 hover:text-blue-600 font-bold mb-8 transition-all group">
                <ArrowLeft className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                Back to {userInfo?.isAdmin ? "Product List" : "Seller Hub"}
            </Link>

            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 mb-3 tracking-tight">Edit Product</h1>
                    <p className="text-slate-500 font-medium flex items-center bg-slate-100 w-fit px-4 py-1.5 rounded-full text-sm">
                        <Tag className="h-3.5 w-3.5 mr-2 text-blue-600" />
                        SKU ID: <span className="text-slate-900 font-bold ml-1 uppercase">{productId}</span>
                    </p>
                </div>
            </div>

            {loadingUpdate && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <Loader />
                </div>
            )}

            {isLoading ? (
                <div className="py-20 flex justify-center"><Loader /></div>
            ) : error ? (
                <Message variant="danger">
                    {error?.data?.message || error.error || 'Failed to fetch product details'}
                </Message>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Form Section */}
                    <div className="lg:col-span-2">
                        <div className="premium-card bg-white p-8 md:p-10 shadow-xl shadow-slate-200/50">
                            <form onSubmit={submitHandler} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                    {/* Product Name */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                                            <Type className="h-3.5 w-3.5 mr-2 text-blue-600" /> Product Name
                                        </label>
                                        <input
                                            type="text"
                                            className="premium-input w-full bg-slate-50 border-slate-100 focus:bg-white text-lg font-bold"
                                            placeholder="Enter name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Price */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                                            <DollarSign className="h-3.5 w-3.5 mr-2 text-emerald-600" /> Price (USD)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                            <input
                                                type="number"
                                                className="premium-input w-full pl-8 bg-slate-50 border-slate-100 focus:bg-white text-lg font-bold"
                                                placeholder="0.00"
                                                value={price}
                                                step="0.01"
                                                onChange={(e) => setPrice(Number(e.target.value))}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Brand */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                                            <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-indigo-600" /> Brand
                                        </label>
                                        <input
                                            type="text"
                                            className="premium-input w-full bg-slate-50 border-slate-100 focus:bg-white font-bold"
                                            placeholder="Enter brand"
                                            value={brand}
                                            onChange={(e) => setBrand(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Category */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                                            <Tag className="h-3.5 w-3.5 mr-2 text-amber-600" /> Category
                                        </label>
                                        <div className="relative group">
                                            <select
                                                className="premium-input w-full bg-slate-50 border-slate-100 focus:bg-white font-bold appearance-none cursor-pointer pr-12 transition-all hover:bg-slate-100/50"
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                required
                                            >
                                                <option value="">Select Category</option>
                                                {categories?.map((c) => (
                                                    <option key={c._id} value={c._id}>
                                                        {c.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-600 transition-colors">
                                                <ChevronDown className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stock */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                                            <Package className="h-3.5 w-3.5 mr-2 text-rose-600" /> Stock Level
                                        </label>
                                        <input
                                            type="number"
                                            className="premium-input w-full bg-slate-50 border-slate-100 focus:bg-white font-bold"
                                            placeholder="0"
                                            value={countInStock}
                                            onChange={(e) => setCountInStock(Number(e.target.value))}
                                            required
                                        />
                                    </div>

                                    {/* Image URL (Hidden but still present for manual edit if needed) */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                                            <ImageIcon className="h-3.5 w-3.5 mr-2 text-slate-600" /> Image Path
                                        </label>
                                        <input
                                            type="text"
                                            className="premium-input w-full bg-slate-50 border-slate-100 focus:bg-white font-medium text-slate-500"
                                            value={image}
                                            onChange={(e) => setImage(e.target.value)}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                                        <FileText className="h-3.5 w-3.5 mr-2 text-slate-600" /> Product Description
                                    </label>
                                    <textarea
                                        rows="6"
                                        className="premium-input w-full bg-slate-50 border-slate-100 focus:bg-white font-medium resize-none leading-relaxed"
                                        placeholder="Enter a detailed description..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loadingUpdate}
                                    className="w-full relative group overflow-hidden bg-blue-600 text-white font-black py-5 px-8 rounded-3xl transition-all shadow-xl shadow-blue-200 active:scale-95 leading-none uppercase tracking-widest text-sm"
                                >
                                    <div className="relative z-10 flex items-center justify-center">
                                        <Save className="h-5 w-5 mr-3" /> Update Product
                                    </div>
                                    <div className="absolute inset-0 bg-blue-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar / Image Upload Section */}
                    <div className="space-y-8">
                        <div className="premium-card bg-white p-8 shadow-xl shadow-slate-200/50">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center">
                                <Upload className="h-4 w-4 mr-2 text-blue-600" /> Product Image
                            </h3>

                            <div className="aspect-square w-full rounded-3xl bg-slate-100 mb-6 overflow-hidden border-2 border-dashed border-slate-200 flex items-center justify-center relative group">
                                {image ? (
                                    <>
                                        <img src={image} alt="Preview" className="w-full h-full object-cover p-2 rounded-[2rem]" />
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                            <Upload className="text-white h-10 w-10 animate-bounce" />
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-6">
                                        <ImageIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-400 text-sm font-bold">No image selected</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <legend className="sr-only">Image Upload</legend>
                                <label
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-3xl cursor-pointer transition-all relative group overflow-hidden
                                        ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-blue-300'}
                                    `}
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                                        {loadingUpload ? (
                                            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                                        ) : (
                                            <>
                                                <Upload className={`w-8 h-8 mb-3 transition-colors ${dragActive ? 'text-blue-600 animate-bounce' : 'text-slate-400 group-hover:text-blue-600'}`} />
                                                <p className="mb-2 text-sm text-slate-500 font-bold">
                                                    {dragActive ? 'Drop image here' : 'Drop your photo or Click to Browse'}
                                                </p>
                                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">PNG, JPG or JPEG</p>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={uploadFileHandler}
                                        disabled={loadingUpload}
                                        accept="image/*"
                                    />
                                    {dragActive && (
                                        <div className="absolute inset-0 bg-blue-500/10 pointer-events-none border-2 border-blue-500 rounded-3xl animate-pulse"></div>
                                    )}
                                </label>
                                <p className="text-[11px] text-slate-400 text-center font-medium italic">
                                    Square images (1000x1000px) work best.
                                </p>
                            </div>
                        </div>

                        {/* Tips Card */}
                        <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-3xl">
                            <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest mb-3">Selling Tip</h4>
                            <p className="text-xs text-blue-700 leading-relaxed font-medium">
                                Professional photos with clean backgrounds can increase conversion rates by up to 40%.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductEditScreen;
