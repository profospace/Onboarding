import React from 'react';
import LeadsManagement from '../../components/LeadsManagement';

const LeadsManagementPage = () => {
    return (
        <div>
            {/* <h1 className="text-2xl font-bold mb-6">Leads Management</h1> */}
            <div className="bg-white shadow-md rounded-lg ">
                <LeadsManagement />
            </div>
        </div>
    );
};

export default LeadsManagementPage;