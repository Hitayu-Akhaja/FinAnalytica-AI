import React from 'react';

export const Alert = ({ variant = 'default', className = '', children, ...props }) => {
  const variantClasses = {
    default: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
    destructive: 'bg-red-500/20 border-red-500/30 text-red-400',
    warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
  };
  
  const classes = `relative w-full rounded-lg border p-4 ${variantClasses[variant]} ${className}`;
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export const AlertDescription = ({ className = '', children, ...props }) => {
  return (
    <div className={`text-sm ${className}`} {...props}>
      {children}
    </div>
  );
};


