import React, { createContext, useContext, useState } from "react";
import clsx from "clsx";

interface TabsContextType {
  value: string;
  setValue: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value,
  onValueChange,
  children,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || "");

  const isControlled = value !== undefined;
  const activeValue = isControlled ? value : internalValue;

  const setValue = (val: string) => {
    if (!isControlled) setInternalValue(val);
    onValueChange?.(val);
  };

  return (
    <TabsContext.Provider value={{ value: activeValue, setValue }}>
      <div className="w-full">{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ className, ...props }) => (
  <div
    className={clsx(
      "flex border-b border-gray-200 bg-white",
      className
    )}
    {...props}
  />
);

interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  className,
  children,
  ...props
}) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabsTrigger must be used within Tabs");
  }

  const isActive = context.value === value;

  return (
    <button
      onClick={() => context.setValue(value)}
      className={clsx(
        "px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
        isActive
          ? "border-b-2 border-teal-600 text-teal-600"
          : "text-gray-500 hover:text-gray-700",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
}) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabsContent must be used within Tabs");
  }

  if (context.value !== value) return null;

  return <div className="mt-4">{children}</div>;
};
