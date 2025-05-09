// Format date to a readable string
export const formatDate = (dateString) => {
    if (!dateString) return 'Not available';

    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) return 'Invalid date';

    // Format as: "Mar 15, 2023, 2:30 PM"
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };

    return date.toLocaleDateString('en-US', options);
};

// Format currency 
export const formatCurrency = (amount, currency = 'USD') => {
    if (!amount && amount !== 0) return 'Not available';

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

// Format phone number
export const formatPhone = (phone) => {
    if (!phone) return '';

    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');

    // Format based on length
    if (digitsOnly.length === 10) {
        return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
    }

    // If not 10 digits, return as is
    return phone;
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;

    return text.slice(0, maxLength) + '...';
};