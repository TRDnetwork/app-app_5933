import React, { useState, useRef, useEffect } from 'react';

export interface DropdownItem {
  label: string;
  value: string;
  disabled?: boolean;
  onClick?: () => void;
}

export interface DropdownProps {
  items: DropdownItem[];
  trigger: React.ReactNode;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  onSelect?: (item: DropdownItem) => void;
}

const Dropdown = ({ 
  items, 
  trigger, 
  placement = 'bottom-start', 
  onSelect 
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const placementClasses = {
    'bottom-start': 'origin-top-left left-0 top-full mt-2',
    'bottom-end': 'origin-top-right right-0 top-full mt-2',
    'top-start': 'origin-bottom-left left-0 bottom-full mb-2',
    'top-end': 'origin-bottom-right right-0 bottom-full mb-2',
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled) {
      setIsOpen(false);
      if (onSelect) {
        onSelect(item);
      }
      if (item.onClick) {
        item.onClick();
      }
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute z-50 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none ${placementClasses[placement]}`}
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1" role="none">
            {items.map((item) => (
              <button
                key={item.value}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  item.disabled
                    ? 'text-green-dim/50 cursor-not-allowed'
                    : 'text-green-darker hover:bg-surface hover:text-green-darker'
                }`}
                role="menuitem"
                disabled={item.disabled}
                onClick={() => handleItemClick(item)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;