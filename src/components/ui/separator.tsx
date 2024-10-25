import React from 'react';

const Separator: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={`border-b border-gray-300 ${className}`} />;
};

export default Separator;
