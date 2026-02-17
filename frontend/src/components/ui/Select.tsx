import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

interface SelectContextType {
  value: string;
  setValue: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextType | undefined>(undefined);

interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  value,
  defaultValue = "",
  onValueChange,
  children,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;

  const setValue = (val: string) => {
    if (!isControlled) setInternalValue(val);
    onValueChange?.(val);
    setOpen(false);
  };

  return (
    <SelectContext.Provider
      value={{ value: selectedValue, setValue, open, setOpen }}
    >
      <div className="relative w-full">{children}</div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger: React.FC<
  React.HTMLAttributes<HTMLButtonElement>
> = ({ className, children, ...props }) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectTrigger must be used within Select");

  return (
    <button
      type="button"
      onClick={() => context.setOpen(!context.open)}
      className={clsx(
        "w-full flex items-center justify-between px-3 py-2 border rounded-md bg-white",
        "border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500",
        "text-sm",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 ml-2 text-gray-500" />
    </button>
  );
};

interface SelectValueProps {
  placeholder?: string;
}

export const SelectValue: React.FC<SelectValueProps> = ({
  placeholder,
}) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectValue must be used within Select");

  return (
    <span className="truncate">
      {context.value || (
        <span className="text-gray-400">{placeholder}</span>
      )}
    </span>
  );
};

export const SelectContent: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ className, children, ...props }) => {
  const context = useContext(SelectContext);
  const ref = useRef<HTMLDivElement>(null);

  if (!context) throw new Error("SelectContent must be used within Select");

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        context.setOpen(false);
      }
    };

    if (context.open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [context.open]);

  if (!context.open) return null;

  return (
    <div
      ref={ref}
      className={clsx(
        "absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg",
        "max-h-60 overflow-auto",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface SelectItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const SelectItem: React.FC<SelectItemProps> = ({
  value,
  className,
  children,
  ...props
}) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectItem must be used within Select");

  const isSelected = context.value === value;

  return (
    <div
      onClick={() => context.setValue(value)}
      className={clsx(
        "px-3 py-2 text-sm cursor-pointer",
        "hover:bg-teal-50",
        isSelected && "bg-teal-100 text-teal-700 font-medium",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
