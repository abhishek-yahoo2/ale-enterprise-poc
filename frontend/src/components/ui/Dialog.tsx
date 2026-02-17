//Generate code for Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter components using Tailwind CSS. The Dialog component should be a modal that can be opened and closed. The DialogContent component should contain the main content of the dialog, while the DialogHeader should contain the title of the dialog. The DialogFooter should contain any additional information or actions related to the dialog.
import React from 'react';
import classNames from 'classnames';

interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
    isOpen: boolean;
    onClose: () => void;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, children, className }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={classNames('bg-white rounded shadow-lg', className)}>
                {children}
            </div>
        </div>
    );
}

interface DialogHeaderProps {
    title: string;
}

//implement updated DialogHeader component 
const DialogHeader: React.FC<React.PropsWithChildren<DialogHeaderProps>> = ({ title, children }) => {
    return (
        <div className="px-4 py-2 border-b">
            <h2 className="text-xl font-bold">{title}</h2>
            {children}
        </div>
    );
}

interface DialogTitleProps {
    className?: string;
}
const DialogTitle: React.FC<React.PropsWithChildren<DialogTitleProps>> = ({ children, className }) => {
    return <h2 className={classNames('text-xl font-bold', className)}>{children}</h2>;
}

const DialogDescription: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <p className="text-gray-600 mt-2">{children}</p>;
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}
// DialogFooter component with classnames for styling and spacing
const DialogContent: React.FC<React.PropsWithChildren<DialogContentProps>> = ({children, className }) => {
    return <div className={classNames('p-4', className)}>{children}</div>;
}

const DialogFooter: React.FC<React.PropsWithChildren<DialogTitleProps>> = ({ children, className }) => {
    return <div className={classNames('px-4 py-2 border-t', className)}>{children}</div>;
}

export { Dialog, DialogHeader, DialogContent, DialogFooter, DialogTitle, DialogDescription  };
    
