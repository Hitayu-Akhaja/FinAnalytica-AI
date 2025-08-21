import React from 'react';

export const Badge = ({ 
  variant = 'default', 
  className = '', 
  children, 
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const variantClasses = {
    default: 'bg-primary-500/20 text-primary-400 border border-primary-500/30',
    secondary: 'bg-gray-500/20 text-gray-300 border border-gray-500/30',
    outline: 'bg-transparent text-gray-300 border border-gray-500/50',
    destructive: 'bg-red-500/20 text-red-400 border border-red-500/30'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;
  
  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};


