import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@/icons";

interface SelectContextType {
  value: string;
  onValueChange: (value: string) => void;
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

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

const Select: React.FC<SelectProps> = ({ 
  value, 
  defaultValue = "", 
  onValueChange, 
  children 
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const currentValue = value !== undefined ? value : internalValue;

  const handleValueChange = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
    setOpen(false);
  };

  return (
    <SelectContext.Provider value={{ 
      value: currentValue, 
      onValueChange: handleValueChange, 
      open, 
      setOpen 
    }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const SelectTrigger: React.FC<SelectTriggerProps> = ({ children, className = "" }) => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("SelectTrigger must be used within Select");
  }

  const { open, setOpen } = context;

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={`
        flex h-10 w-full items-center justify-between rounded-md border border-gray-300 
        bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
        disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 
        dark:bg-gray-700 dark:text-white dark:ring-offset-gray-950 
        dark:placeholder:text-gray-400 dark:focus:ring-gray-300
        ${className}
      `}
    >
      {children}
      <ChevronDownIcon className={`h-4 w-4 opacity-50 transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
  );
};

const SelectContent: React.FC<SelectContentProps> = ({ children, className = "" }) => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("SelectContent must be used within Select");
  }

  const { open, setOpen } = context;
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      className={`
        absolute top-full z-50 mt-1 w-full rounded-md border border-gray-200 
        bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800
        ${className}
      `}
    >
      {children}
    </div>
  );
};

const SelectItem: React.FC<SelectItemProps> = ({ value, children, className = "" }) => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("SelectItem must be used within Select");
  }

  const { value: selectedValue, onValueChange } = context;
  const isSelected = selectedValue === value;

  return (
    <button
      type="button"
      onClick={() => onValueChange(value)}
      className={`
        relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 
        text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-700 
        dark:focus:bg-gray-700
        ${isSelected ? 'bg-gray-100 dark:bg-gray-700' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

const SelectValue: React.FC<SelectValueProps> = ({ placeholder = "Select...", className = "" }) => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("SelectValue must be used within Select");
  }

  const { value } = context;

  return (
    <span className={`${!value ? 'text-gray-500 dark:text-gray-400' : ''} ${className}`}>
      {value || placeholder}
    </span>
  );
};

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };