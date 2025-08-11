import React, { ReactNode, memo } from "react";

// Props for Table
interface TableProps {
  children: ReactNode; // Table content (thead, tbody, etc.)
  className?: string; // Optional className for styling
}

// Props for TableHeader
interface TableHeaderProps {
  children: ReactNode; // Header row(s)
  className?: string; // Optional className for styling
}

// Props for TableBody
interface TableBodyProps {
  children: ReactNode; // Body row(s)
  className?: string; // Optional className for styling
}

// Props for TableRow
interface TableRowProps {
  children: ReactNode; // Cells (th or td)
  className?: string; // Optional className for styling
}

// Props for TableCell
interface TableCellProps {
  children: ReactNode; // Cell content
  isHeader?: boolean; // If true, renders as <th>, otherwise <td>
  className?: string; // Optional className for styling
}

// Optimized Table Components with memo for better performance
const Table = memo<TableProps>(({ children, className = '' }) => {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full ${className}`} style={{ contain: 'layout style paint' }}>
        {children}
      </table>
    </div>
  );
});

const TableHeader = memo<TableHeaderProps>(({ children, className = '' }) => {
  return <thead className={className}>{children}</thead>;
});

const TableBody = memo<TableBodyProps>(({ children, className = '' }) => {
  return <tbody className={className}>{children}</tbody>;
});

const TableRow = memo<TableRowProps>(({ children, className = '' }) => {
  return <tr className={className}>{children}</tr>;
});

const TableCell = memo<TableCellProps>(({
  children,
  isHeader = false,
  className = '',
}) => {
  const CellTag = isHeader ? "th" : "td";
  return <CellTag className={className}>{children}</CellTag>;
});

// Set display names for better debugging
Table.displayName = 'Table';
TableHeader.displayName = 'TableHeader';
TableBody.displayName = 'TableBody';
TableRow.displayName = 'TableRow';
TableCell.displayName = 'TableCell';

export { Table, TableHeader, TableBody, TableRow, TableCell };
