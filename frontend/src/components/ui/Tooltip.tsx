//generate code to tooltip for hover information
import React from 'react';
import classNames from 'classnames';

interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
    text: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
}
const Tooltip: React.FC<TooltipProps> = ({ text, position = 'top', className, children, ...props }) => {
    const tooltipClasses = classNames(
        'absolute bg-gray-700 text-white text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
        {
            'bottom-full mb-2 left-1/2 transform -translate-x-1/2': position === 'top',
            'top-full mt-2 left-1/2 transform -translate-x-1/2': position === 'bottom',
            'right-full mr-2 top-1/2 transform -translate-y-1/2': position === 'left',
            'left-full ml-2 top-1/2 transform -translate-y-1/2': position === 'right',
        },
        className
    );
    return (
        <div className="group relative inline-block" {...props}>
            {children}
            <div className={tooltipClasses}>{text}</div>
        </div>
    );
}
export default Tooltip;