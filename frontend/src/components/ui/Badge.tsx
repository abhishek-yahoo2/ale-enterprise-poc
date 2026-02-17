//Generate code for status badges with color variants (e.g., success, warning, error) using Tailwind CSS. The Badge component should have props for text and variant, where variant determines the color of the badge.
import React from 'react';
import classNames from 'classnames';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    text: string;
    variant: 'success' | 'warning' | 'error';
}
const Badge: React.FC<BadgeProps> = ({ text, variant, className, ...props }) => {
    const badgeClasses = classNames(
        'inline-block px-2 py-1 text-sm font-semibold rounded',
        {
            'bg-green-100 text-green-800': variant === 'success',
            'bg-yellow-100 text-yellow-800': variant === 'warning',
            'bg-red-100 text-red-800': variant === 'error',
        },
        className   
    );
    return (
        <span className={badgeClasses} {...props}>
            {text}
        </span>
    );
}
export default Badge;