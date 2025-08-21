import React from 'react';

export const Button = ({ 
  variant = 'default', 
  size = 'default',
  className = '', 
  children, 
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantClasses = {
    default: 'bg-primary-600 hover:bg-primary-700 text-white',
    outline: 'bg-transparent border border-gray-500 text-gray-300 hover:bg-gray-700/50',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    destructive: 'bg-red-600 hover:bg-red-700 text-white'
  };
  
  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 px-3',
    lg: 'h-11 px-8',
    icon: 'h-10 w-10'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};


