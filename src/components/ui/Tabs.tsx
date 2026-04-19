import React, { useState } from 'react';

export interface TabItem {
  label: string;
  value: string;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: 'line' | 'boxed';
}

const Tabs = ({ 
  items, 
  defaultValue, 
  onValueChange, 
  variant = 'line' 
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue || items[0].value);

  const handleTabClick = (value: string) => {
    setActiveTab(value);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  const lineVariantClasses = {
    tabs: 'flex border-b border-surface',
    tab: 'px-4 py-2 font-medium text-green-dim hover:text-green-darker transition-colors duration-200',
    activeTab: 'border-b-2 border-orange text-orange',
  };

  const boxedVariantClasses = {
    tabs: 'flex border border-surface rounded-lg overflow-hidden',
    tab: 'px-4 py-2 font-medium text-green-dim hover:text-green-darker transition-colors duration-200',
    activeTab: 'bg-orange text-white',
  };

  const classes = variant === 'boxed' ? boxedVariantClasses : lineVariantClasses;

  return (
    <div className="w-full">
      <div className={classes.tabs} role="tablist">
        {items.map((item) => (
          <button
            key={item.value}
            role="tab"
            aria-selected={activeTab === item.value}
            aria-controls={`tabpanel-${item.value}`}
            id={`tab-${item.value}`}
            className={`${classes.tab} ${activeTab === item.value ? classes.activeTab : ''}`}
            onClick={() => handleTabClick(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        id={`tabpanel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="mt-4"
      >
        {items.find((item) => item.value === activeTab)?.content}
      </div>
    </div>
  );
};

export default Tabs;