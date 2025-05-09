import React from 'react';
import LeadCard from './LeadCard';

const LeadsList = ({ leads, onDeleteClick }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
            {leads.map(lead => (
                <LeadCard key={lead._id} lead={lead} onDeleteClick={onDeleteClick} />
            ))}
        </div>
    );
};

export default LeadsList;