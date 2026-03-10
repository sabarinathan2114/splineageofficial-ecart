import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = () => {
    return (
        <div className="flex justify-center items-center py-10 w-full">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        </div>
    );
};

export default Loader;
