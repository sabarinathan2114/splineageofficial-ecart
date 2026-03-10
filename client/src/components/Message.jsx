import React from 'react';

const Message = ({ variant, children }) => {
    const getVariantClasses = () => {
        switch (variant) {
            case 'danger':
                return 'bg-red-50 text-red-700 border-red-100';
            case 'success':
                return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'warning':
                return 'bg-amber-50 text-amber-700 border-amber-100';
            default:
                return 'bg-blue-50 text-blue-700 border-blue-100';
        }
    };

    return (
        <div className={`p-4 rounded-2xl border font-medium text-sm my-4 ${getVariantClasses()}`}>
            {children}
        </div>
    );
};

Message.defaultProps = {
    variant: 'info',
};

export default Message;
