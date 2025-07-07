import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { base_url } from '../../utils/base_url';
// import { getAuthConfig } from '../../utils/authConfig';

const   LeadsManagement = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch(`${base_url}/property-lead/api/leads` , );
      if (!response.ok) throw new Error('Failed to fetch leads');
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Property Leads</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead._id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {lead.propertyType.subType} for {lead.propertyType.intent}
                  </div>
                  <div className="text-sm text-gray-500">
                    {lead.propertyDetails.propertySize} {lead.propertyDetails.unit} | {lead.propertyDetails.location}
                  </div>
                  <div className="text-sm text-gray-500">
                    ₹{lead.propertyDetails.expectedPrice.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{lead.contactDetails.name}</div>
                  <div className="text-sm text-gray-500">{lead.contactDetails.phone}</div>
                  <div className="text-sm text-gray-500">{lead.contactDetails.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    lead.status === 'new' ? 'bg-green-100 text-green-800' :
                    lead.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                    lead.status === 'qualified' ? 'bg-yellow-100 text-yellow-800' :
                    lead.status === 'negotiating' ? 'bg-purple-100 text-purple-800' :
                    lead.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {format(new Date(lead.createdAt), 'PP')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsManagement;