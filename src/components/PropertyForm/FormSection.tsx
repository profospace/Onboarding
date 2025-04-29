import React, { ReactNode } from 'react';

interface FormSectionProps {
    title: string;
    description?: string;
    children: ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({
    title,
    description,
    children
}) => {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden transition-all">
            <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">{title}</h2>
                {description && (
                    <p className="mt-1 text-sm text-gray-500">
                        {description}
                    </p>
                )}
            </div>

            <div className="px-6 py-4 space-y-6">
                {children}
            </div>
        </div>
    );
};

export default FormSection;