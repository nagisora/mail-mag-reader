import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={`border rounded p-2 w-full bg-white text-black ${className}`}
    {...props}
  />
));

Input.displayName = 'Input';

export { Input };
