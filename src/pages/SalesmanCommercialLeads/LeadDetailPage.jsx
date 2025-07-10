import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/SalesmanLeads/LoadingSpinner';
import LeadImages from '../../components/SalesmanLeads/LeadImages';
import LeadDetailsSection from '../../components/SalesmanLeads/LeadDetailsSection';
import MapSection from '../../components/SalesmanLeads/MapSection';
import DeleteModal from '../../components/SalesmanLeads/DeleteModal';
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '../../components/SalesmanLeads/Icons';

import { deleteLead } from '../../services/leadService';
import { fetchLeadById } from '../../services/leadService';

const LeadDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const loadLead = async () => {
            setLoading(true);
            try {
                const response = await fetchLeadById(id);
                setLead(response.data);
            } catch (err) {
                console.error('Error loading lead:', err);
                setError('Failed to load lead details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadLead();
    }, [id]);

    const handleEditClick = (id) => {
        // Navigate to edit page with state containing lead data
        navigate(`/edit-lead/${id}`);
    };

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteLead(id);
            navigate('/');
            // Show success message
        } catch (err) {
            console.error('Error deleting lead:', err);
            // Show error message
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="max-w-7xl mx-auto px-4 py-8 text-red-600">{error}</div>;
    if (!lead) return <div className="max-w-7xl mx-auto px-4 py-8">Lead not found</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center text-blue-100 hover:text-white transition-colors mb-2"
                            >
                                <ArrowLeftIcon className="w-5 h-5 mr-1" />
                                Back to Leads
                            </button>
                            <h1 className="text-2xl md:text-3xl font-bold">{lead.propertyName || 'Property Details'}</h1>
                        </div>
                        <div className="mt-4 md:mt-0 flex space-x-3">
                            <button
                                onClick={() => handleEditClick(id)}
                                className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium shadow-md hover:bg-blue-50 transition-colors flex items-center"
                            >
                                <PencilIcon className="w-5 h-5 mr-2" />
                                Edit Lead
                            </button>
                            <button
                                onClick={handleDeleteClick}
                                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center"
                            >
                                <TrashIcon className="w-5 h-5 mr-2" />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Image Gallery */}
                    <LeadImages images={lead.images} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                        {/* Property Details */}
                        <div className="lg:col-span-2">
                            <LeadDetailsSection lead={lead} />
                        </div>

                        {/* Map Section */}
                        <div className="lg:col-span-1">
                            <MapSection location={lead.location} />
                        </div>
                    </div>
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                isDeleting={isDeleting}
                lead={lead}
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
            />
        </div>
    );
};

export default LeadDetailPage;