import React, { createContext, useContext, useState } from 'react';

const TabsContext = createContext();

export const Tabs = ({ defaultValue, className = '', children, ...props }) => {
  const [value, setValue] = useState(defaultValue);
  
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ className = '', children, ...props }) => {
  return (
    <div className={`inline-flex h-10 items-center justify-center rounded-md bg-dark-600 p-1 text-gray-400 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const TabsTrigger = ({ value, className = '', children, ...props }) => {
  const { value: selectedValue, setValue } = useContext(TabsContext);
  const isSelected = selectedValue === value;
  
  const classes = `inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
    isSelected 
      ? 'bg-white text-dark-900 shadow-sm' 
      : 'hover:bg-white/20 hover:text-white'
  } ${className}`;
  
  return (
    <button 
      className={classes} 
      onClick={() => setValue(value)}
      {...props}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, className = '', children, ...props }) => {
  const { value: selectedValue } = useContext(TabsContext);
  
  if (selectedValue !== value) {
    return null;
  }
  
  return (
    <div className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`} {...props}>
      {children}
    </div>
  );
};


