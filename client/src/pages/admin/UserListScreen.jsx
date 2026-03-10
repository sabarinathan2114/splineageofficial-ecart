import React from 'react';
import { Link } from 'react-router-dom';
import { useGetUsersQuery, useDeleteUserMutation } from '../../redux/api/userApiSlice';
import { Trash2, Edit, Check, X, Store, User as UserIcon } from 'lucide-react';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const UserListScreen = () => {
    const { data: users, refetch, isLoading, error } = useGetUsersQuery();
    const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(id);
                refetch();
            } catch (err) {
                console.error(err);
                alert(err?.data?.message || err.error || 'Failed to delete user');
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
                <h1 className="text-4xl font-black text-slate-900 mb-2">User Management</h1>
                <p className="text-slate-500 font-medium italic">Manage admins, sellers, and customer accounts.</p>
            </div>

            {loadingDelete && <Loader />}
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">
                    {error?.data?.message || error.error || 'User access denied. Check if you are logged in as Admin.'}
                </Message>
            ) : (
                <div className="premium-card bg-white overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900 text-white">
                                <tr>
                                    <th className="py-4 px-3 sm:px-6 text-[10px] font-black uppercase tracking-widest">ID</th>
                                    <th className="py-4 px-3 sm:px-6 text-[10px] font-black uppercase tracking-widest">Name</th>
                                    <th className="py-4 px-3 sm:px-6 text-[10px] font-black uppercase tracking-widest hidden md:table-cell">Email</th>
                                    <th className="py-4 px-3 sm:px-6 text-[10px] font-black uppercase tracking-widest text-center">Admin</th>
                                    <th className="py-4 px-3 sm:px-6 text-[10px] font-black uppercase tracking-widest text-center">Seller</th>
                                    <th className="py-4 px-3 sm:px-6 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-3 sm:px-6 text-[10px] font-mono text-slate-400">{user._id.substring(user._id.length - 4).toUpperCase()}</td>
                                        <td className="py-4 px-3 sm:px-6">
                                            <div className="flex items-center">
                                                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-slate-200 flex items-center justify-center mr-2 sm:mr-3 shrink-0">
                                                    <UserIcon className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500" />
                                                </div>
                                                <span className="font-bold text-slate-900 text-[11px] sm:text-sm line-clamp-1">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-3 sm:px-6 text-[11px] text-slate-600 hidden md:table-cell">{user.email}</td>
                                        <td className="py-4 px-3 sm:px-6 text-center">
                                            {user.role === 'admin' ? (
                                                <span className="inline-flex items-center justify-center bg-emerald-100 p-1 rounded-full">
                                                    <Check className="h-4 w-4 text-emerald-600" />
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center justify-center bg-rose-100 p-1 rounded-full">
                                                    <X className="h-4 w-4 text-rose-600" />
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-3 sm:px-6 text-center">
                                            {user.role === 'seller' ? (
                                                <Store className="h-4 w-4 text-blue-600 mx-auto" />
                                            ) : (
                                                <X className="h-4 w-4 text-slate-300 mx-auto" />
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link to={`/admin/user/${user._id}/edit`}>
                                                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => deleteHandler(user._id)}
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

export default UserListScreen;
