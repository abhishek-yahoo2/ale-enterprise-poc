import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

interface PopoverContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLDivElement>;
}

const PopoverContext = createContext<PopoverContextType | undefined>(
  undefined
);

interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const Popover: React.FC<PopoverProps> = ({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const triggerRef = useRef<HTMLDivElement>(null);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const setOpen = (value: boolean) => {
    if (!isControlled) setInternalOpen(value);
    onOpenChange?.(value);
  };

  return (
    <PopoverContext.Provider value={{ open: isOpen, setOpen, triggerRef }}>
      {children}
    </PopoverContext.Provider>
  );
};

interface PopoverTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const PopoverTrigger: React.FC<PopoverTriggerProps> = ({
  children,
  asChild = false,
}) => {
  const context = useContext(PopoverContext);
  if (!context) throw new Error("PopoverTrigger must be used within Popover");

  return (
    <div
      ref={context.triggerRef}
      onClick={() => context.setOpen(!context.open)}
      className="inline-block"
    >
      {children}
    </div>
  );
};

interface PopoverContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
}

export const PopoverContent: React.FC<PopoverContentProps> = ({
  className,
  children,
  align = "start",
  ...props
}) => {
  const context = useContext(PopoverContext);
  const contentRef = useRef<HTMLDivElement>(null);

  if (!context) throw new Error("PopoverContent must be used within Popover");
  if (!context.open) return null;

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  // Calculate position
  useEffect(() => {
    const trigger = context.triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    let left = rect.left + scrollX;

    if (align === "center") {
      left = rect.left + scrollX + rect.width / 2;
    } else if (align === "end") {
      left = rect.right + scrollX;
    }

    setPosition({
      top: rect.bottom + scrollY + 8,
      left,
    });
  }, [context.open]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        !context.triggerRef.current?.contains(event.target as Node)
      ) {
        context.setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        context.setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return createPortal(
    <div
      ref={contentRef}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        transform:
          align === "center"
            ? "translateX(-50%)"
            : align === "end"
            ? "translateX(-100%)"
            : undefined,
      }}
      className={clsx(
        "z-50 min-w-[200px] rounded-md border bg-white shadow-lg",
        "p-3 animate-in fade-in zoom-in-95",
        className
      )}
      {...props}
    >
      {children}
    </div>,
    document.body
  );
};
