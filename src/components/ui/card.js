import React from 'react';

export const Card = ({ className = '', children, ...props }) => {
  return (
    <div className={`bg-dark-700/50 border border-white/20 rounded-xl ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ className = '', children, ...props }) => {
  return (
    <div className={`p-6 pb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ className = '', children, ...props }) => {
  return (
    <h3 className={`text-xl font-semibold text-white ${className}`} {...props}>
      {children}
    </h3>
  );
};

export const CardContent = ({ className = '', children, ...props }) => {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
};


