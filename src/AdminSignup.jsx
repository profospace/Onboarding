// import React, { useState } from 'react';

// const AdminSignup = () => {
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         phone: '',
//         role: 'admin',
//         assignedAreas: []
//     });

//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(null);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prevData => ({
//             ...prevData,
//             [name]: value
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);
//         setError(null);

//         try {
//             const response = await fetch('/api/salesman/create', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(formData),
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || 'Failed to create account');
//             }

//             setSuccess({
//                 message: 'Account created successfully',
//                 credentials: data.data.credentials
//             });
//             setFormData({
//                 name: '',
//                 email: '',
//                 phone: '',
//                 role: 'admin',
//                 assignedAreas: []
//             });
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
//             <div className="w-full max-w-md">
//                 <div className="text-center mb-10">
//                     <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Account</h1>
//                     <p className="text-gray-600">Register a new salesman or admin user</p>
//                 </div>

//                 {error && (
//                     <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//                         {error}
//                     </div>
//                 )}

//                 {success && (
//                     <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
//                         <p className="font-bold">{success.message}</p>
//                         <p>Username: {success.credentials.username}</p>
//                         <p>Temporary Password: {success.credentials.temporaryPassword}</p>
//                     </div>
//                 )}

//                 <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
//                     <div className="mb-4">
//                         <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
//                             Full Name
//                         </label>
//                         <input
//                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                             id="name"
//                             name="name"
//                             type="text"
//                             placeholder="John Doe"
//                             value={formData.name}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
//                             Email Address
//                         </label>
//                         <input
//                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                             id="email"
//                             name="email"
//                             type="email"
//                             placeholder="john.doe@example.com"
//                             value={formData.email}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
//                             Phone Number
//                         </label>
//                         <input
//                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                             id="phone"
//                             name="phone"
//                             type="tel"
//                             placeholder="+1 (555) 123-4567"
//                             value={formData.phone}
//                             onChange={handleChange}
//                         />
//                     </div>

//                     <div className="mb-6">
//                         <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
//                             Role
//                         </label>
//                         <select
//                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                             id="role"
//                             name="role"
//                             value={formData.role}
//                             onChange={handleChange}
//                         >
//                             <option value="admin">Admin</option>
//                             <option value="salesman">Salesman</option>
//                             <option value="manager">Manager</option>
//                         </select>
//                     </div>

//                     <div className="flex items-center justify-between">
//                         <button
//                             className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                             type="submit"
//                             disabled={isLoading}
//                         >
//                             {isLoading ? 'Creating Account...' : 'Create Account'}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AdminSignup;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminSignup = ({ user }) => {
    const navigate = useNavigate();

    // Redirect if not admin or already logged in
    // useEffect(() => {
    //     if (!user) {
    //         navigate('/login');
    //     } else if (user.userType !== 'salesman' || user.role !== 'admin') {
    //         navigate('/dashboard');
    //     }
    // }, [user, navigate]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'admin',
        assignedAreas: []
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5053/api/adminSales/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create account');
            }

            setSuccess({
                message: 'Account created successfully',
                credentials: data.data.credentials
            });
            setFormData({
                name: '',
                email: '',
                phone: '',
                role: 'admin',
                assignedAreas: []
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Account</h1>
                    <p className="text-gray-600">Register a new salesman or admin user</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                        <p className="font-bold">{success.message}</p>
                        <p>Username: {success.credentials.username}</p>
                        <p>Temporary Password: {success.credentials.temporaryPassword}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Full Name
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            name="email"
                            type="email"
                            placeholder="john.doe@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                            Phone Number
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                            Role
                        </label>
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="admin">Admin</option>
                            <option value="salesman">Salesman</option>
                            <option value="manager">Manager</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminSignup;