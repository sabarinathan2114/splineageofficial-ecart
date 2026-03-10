import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900">
                    <div className="mb-4 md:mb-0">
                        <h2 className="text-xl font-bold text-white mb-2">eShop</h2>
                        <p className="text-sm">Quality products delivered to your door.</p>
                    </div>
                    <div className="flex space-x-6 text-sm">
                        <a href="#" className="hover:text-blue-400 transition-colors">Shop</a>
                        <a href="#" className="hover:text-blue-400 transition-colors">About</a>
                        <a href="#" className="hover:text-blue-400 transition-colors">Support</a>
                        <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
                    </div>
                </div>
                <div className="mt-8 text-center text-xs border-t border-slate-800 pt-8">
                    <p>&copy; {currentYear} eShop. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
