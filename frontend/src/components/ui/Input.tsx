//Generate code for Reusable form input with validation states (error, success) using Tailwind CSS. The Input component should have props for label, placeholder, value, onChange, error, and success. The error and success props should be used to display validation messages and change the border color of the input accordingly.
import React from 'react';
import classNames from 'classnames';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    success?: string;
}
const Input: React.FC<InputProps> = ({
    label,
    error,
    success,
    className,
    ...props
}) => {    const inputClasses = classNames(
        'w-full px-3 py-2 border rounded focus:outline-none transition-colors duration-200',
        {
            'border-red-500': error,
            'border-green-500': success,
            'border-gray-300': !error && !success,
        },
        className
    );
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input className={inputClasses} {...props} />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            {success && <p className="text-green-500 text-sm mt-1">{success}</p>}
        </div>
    );
}
export default Input;