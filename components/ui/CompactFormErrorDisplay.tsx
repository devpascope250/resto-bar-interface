// components/CompactFormErrorDisplay.tsx
import React from 'react';
import { FormikErrors, FormikTouched } from 'formik';

interface CompactFormErrorDisplayProps {
  errors: FormikErrors<any>;
  touched: FormikTouched<any>;
  className?: string;
  children?: (errors: string[]) => React.ReactNode;
}

const CompactFormErrorDisplay: React.FC<CompactFormErrorDisplayProps> = ({
  errors,
  touched,
  className = '',
  children
}) => {
  const errorFields = Object.keys(errors).filter(
    key => errors[key] && touched[key]
  );

  if (errorFields.length === 0) {
    return null;
  }

  // Get the actual error messages
  const errorMessages = errorFields.map(fieldName => errors[fieldName] as string);

  // If children function is provided, use it to render custom content
  if (children) {
    return (
      <div className={className}>
        {children(errorMessages)}
      </div>
    );
  }

  // Default rendering
  return (
    <div className={`bg-red-50 border border-red-200 rounded-md p-3 ${className}`}>
      <div className="flex items-center text-red-800">
        <svg className="h-4 w-4 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-medium">
          {errorFields.length} error{errorFields.length > 1 ? 's' : ''} need{errorFields.length === 1 ? 's' : ''} attention
        </span>
      </div>
      
      {/* Display all error messages */}
      <div className="mt-2 pl-6">
        <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
          {errorMessages.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export { CompactFormErrorDisplay };