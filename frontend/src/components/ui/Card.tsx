// Generate a card component that can be used to display content in a visually appealing way. CardHeader, CardTitle, CardContent, CardFooter, The card should have a header, body, and footer section. The header should contain a title and an optional subtitle. The body should contain the main content of the card, and the footer should contain any additional information or actions related to the card.
import React from 'react';
import classNames from 'classnames';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    header?: React.ReactNode;
    title: string;
    subtitle?: string;
    content?: React.ReactNode;
    footer?: React.ReactNode;
}
//generate code for Card and CardContent components
const Card: React.FC<CardProps> = ({ header, title, subtitle, content, footer, className, children, ...props }) => {
    return (
        <div className={classNames('bg-white shadow rounded-lg overflow-hidden', className)} {...props}>
            {(header || title || subtitle) && (
                <div className="px-6 py-4 border-b">
                    {header}
                    <div>
                        <h3 className="text-lg font-semibold">{title}</h3>
                        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                    </div>
                </div>
            )}
            <div className="p-6">
                {children || content}
            </div>
            {footer && (
                <div className="px-6 py-4 border-t">
                    {footer}
                </div>
            )}
        </div>
    );
}

const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
    return (
        <div className={classNames('text-gray-700', className)} {...props}>
            {children}
        </div>
    );
}

export { Card, CardContent };