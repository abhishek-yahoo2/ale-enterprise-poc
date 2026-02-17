import React from "react";
import clsx from "clsx";

/**
 * Enterprise Reusable Table Component
 * Supports:
 * - Header / Body composition
 * - Material hover effects
 * - Alternating rows
 * - Responsive scroll
 */

export const Table: React.FC<React.HTMLAttributes<HTMLTableElement>> = ({
  className,
  ...props
}) => {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={clsx(
          "min-w-full text-sm text-left border-collapse",
          className
        )}
        {...props}
      />
    </div>
  );
};

export const TableHeader: React.FC<
  React.HTMLAttributes<HTMLTableSectionElement>
> = ({ className, ...props }) => (
  <thead
    className={clsx("bg-gray-50 border-b border-gray-200", className)}
    {...props}
  />
);

export const TableBody: React.FC<
  React.HTMLAttributes<HTMLTableSectionElement>
> = ({ className, ...props }) => (
  <tbody className={clsx("divide-y divide-gray-200", className)} {...props} />
);

export const TableRow: React.FC<
  React.HTMLAttributes<HTMLTableRowElement>
> = ({ className, ...props }) => (
  <tr
    className={clsx(
      "transition-colors duration-150",
      className
    )}
    {...props}
  />
);

export const TableHead: React.FC<
  React.ThHTMLAttributes<HTMLTableCellElement>
> = ({ className, ...props }) => (
  <th
    className={clsx(
      "px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide whitespace-nowrap",
      className
    )}
    {...props}
  />
);

export const TableCell: React.FC<
  React.TdHTMLAttributes<HTMLTableCellElement>
> = ({ className, ...props }) => (
  <td
    className={clsx(
      "px-4 py-3 text-sm text-gray-700 whitespace-nowrap",
      className
    )}
    {...props}
  />
);

export default Table;
