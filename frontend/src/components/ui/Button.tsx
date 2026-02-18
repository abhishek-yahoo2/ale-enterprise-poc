//generate code for button component using tailwind css with variants (primary, secondary, danger, outline, success) and sizes (small, medium, large)
import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'success';
    size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'medium',
    className,
    ...props
}) => {
    const baseClasses =
        'inline-flex items-center justify-center font-medium rounded focus:outline-none transition-colors duration-200';    
    const variantClasses = {
        primary: 'bg-primary text-white hover:bg-primary-dark',
        secondary: 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50',
        danger: 'bg-red-500 text-white hover:bg-red-600',
        outline: 'border border-neutral-300 text-neutral-700 hover:bg-neutral-50',
        success: 'bg-green-500 text-white hover:bg-green-600',
    };
    const sizeClasses = {
        small: 'px-2 py-1 text-sm',
        medium: 'px-4 py-2',
        large: 'px-6 py-3 text-lg',
    };
    
    const classes = clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
    );
    
    return <button className={classes} {...props} />;
};

export default Button;