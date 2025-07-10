import React, { useState, useEffect } from 'react';
import LeadsList from '../../components/SalesmanCommercialLeads/LeadsList';
import SearchBar from '../../components/SalesmanCommercialLeads/SearchBar';
import FilterBar from '../../components/SalesmanCommercialLeads/FilterBar';
import Pagination from '../../components/SalesmanCommercialLeads/Pagination';
import DeleteModal from '../../components/SalesmanCommercialLeads/DeleteModal';
import LoadingSpinner from '../../components/SalesmanCommercialLeads/LoadingSpinner';
import NoResultsFound from '../../components/SalesmanCommercialLeads/NoResultsFound';
import { MapPinIcon } from '../../components/SalesmanCommercialLeads/Icons';
import { fetchLeads, deleteLead } from '../../services/commercialLeadService';

const CommercialLeadsPage = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        propertyType: '',
        city: '',
        minPrice: '',
        maxPrice: '',
    });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [leadToDelete, setLeadToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Function to load leads
    const loadLeads = async () => {
        setLoading(true);
        try {
            const response = await fetchLeads(currentPage, search, filters);
            setLeads(response.data.leads);
            setTotalPages(response.data.pagination.pages);
        } catch (err) {
            console.error('Error loading leads:', err);
            setError('Failed to load leads. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Function to update lead status in local state
    const updateLeadStatus = (leadId, updatedFields) => {
        setLeads(prevLeads =>
            prevLeads.map(lead =>
                lead._id === leadId
                    ? { ...lead, ...updatedFields }
                    : lead
            )
        );
    };

    console.log("leads", leads);

    // Load leads on initial render and when dependencies change
    useEffect(() => {
        loadLeads();
    }, [currentPage, search, filters]);

    // Handle search input change
    const handleSearchChange = (value) => {
        setSearch(value);
        setCurrentPage(1); // Reset to first page when search changes
    };

    // Handle filter changes
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page when filters change
    };

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Open delete confirmation modal
    const handleDeleteClick = (lead) => {
        setLeadToDelete(lead);
        setIsDeleteModalOpen(true);
    };

    // Confirm delete action
    const handleConfirmDelete = async () => {
        if (!leadToDelete) return;

        setIsDeleting(true);
        try {
            await deleteLead(leadToDelete._id);
            setLeads(leads.filter(lead => lead._id !== leadToDelete._id));
            setIsDeleteModalOpen(false);
            // Show success message
        } catch (err) {
            console.error('Error deleting lead:', err);
            // Show error message
        } finally {
            setIsDeleting(false);
            setLeadToDelete(null);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-gradient-to-r from-[crimson] to-indigo-700 ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center text-white">
                            <MapPinIcon className="w-8 h-8 mr-3" />
                            <h1 className="text-2xl md:text-3xl font-bold">Commercial Leads</h1>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <button
                                onClick={() => window.location.href = '/sales-commercial-leads'}
                                className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium shadow-md hover:bg-blue-50 transition-colors flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                </svg>
                                Add New Lead
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Search and Filters */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <SearchBar value={search} onChange={handleSearchChange} />
                        <FilterBar filters={filters} onChange={handleFilterChange} />
                    </div>
                </div>

                {/* Lead List */}
                {loading ? (
                    <LoadingSpinner />
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                        {error}
                    </div>
                ) : leads.length === 0 ? (
                    <NoResultsFound search={search} hasFilters={Object.values(filters).some(f => f !== '')} />
                ) : (
                    <>
                        <LeadsList
                            leads={leads}
                            onDeleteClick={handleDeleteClick}
                            onUpdateLead={updateLeadStatus}
                        />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </main>

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                isDeleting={isDeleting}
                lead={leadToDelete}
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
            />
        </div>
    );
};

export default CommercialLeadsPage;