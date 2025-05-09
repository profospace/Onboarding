import React from 'react';
import { formatDate } from '../../../utils/formatters';

const LeadDetailsSection = ({ lead }) => {
    const {
        propertyName,
        ownerName,
        ownerContact,
        location,
        createdAt,
        updatedAt,
        salesman
    } = lead;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                    Property Details
                </h2>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Property Name</h3>
                        <p className="mt-1 text-base text-gray-900">{propertyName || 'Not specified'}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Owner Name</h3>
                        <p className="mt-1 text-base text-gray-900">{ownerName || 'Not specified'}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Owner Contact</h3>
                        <p className="mt-1 text-base text-gray-900">{ownerContact || 'Not specified'}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Coordinates</h3>
                        <p className="mt-1 text-base text-gray-900">
                            {location ?
                                `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}` :
                                'Not specified'}
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                    Administrative Information
                </h2>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Created</h3>
                        <p className="mt-1 text-base text-gray-900">{formatDate(createdAt)}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                        <p className="mt-1 text-base text-gray-900">{formatDate(updatedAt)}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Lead Age</h3>
                        <p className="mt-1 text-base text-gray-900">
                            {Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24))} days
                        </p>
                    </div>

                    {salesman && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Created By</h3>
                            <p className="mt-1 text-base text-gray-900">
                                {salesman.name || salesman.username || 'Unknown'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeadDetailsSection;