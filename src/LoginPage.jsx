// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// // import { authAPI, mockAPI } from './api-interfaces';

// // Use mock API for development
// // const api = import.meta.env.REACT_APP_USE_MOCK_API === 'true' ? mockAPI : authAPI;

// const LoginPage = ({ onLoginSuccess }) => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');

//         if (!email || !password) {
//             setError('Please enter both email and password.');
//             return;
//         }

//         try {
//             setLoading(true);

//             // Call API for login
//             const userData = await api.login(email, password);

//             // Store user data in localStorage
//             localStorage.setItem('user', JSON.stringify(userData));

//             // Notify parent component
//             onLoginSuccess(userData);

//         } catch (err) {
//             console.error('Login error:', err);
//             setError(err.message || 'Failed to login. Please check your credentials.');
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-md w-full space-y-8">
//                 <div>
//                     <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//                         Sign in to your account
//                     </h2>
//                     <p className="mt-2 text-center text-sm text-gray-600">
//                         Access your real estate property dashboard
//                     </p>
//                 </div>

//                 {error && (
//                     <div className="bg-red-50 border-l-4 border-red-500 p-4">
//                         <div className="flex">
//                             <div className="flex-shrink-0">
//                                 <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                                 </svg>
//                             </div>
//                             <div className="ml-3">
//                                 <p className="text-sm text-red-700">
//                                     {error}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//                     <div className="rounded-md shadow-sm -space-y-px">
//                         <div>
//                             <label htmlFor="email-address" className="sr-only">Email address</label>
//                             <input
//                                 id="email-address"
//                                 name="email"
//                                 type="email"
//                                 autoComplete="email"
//                                 required
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                                 placeholder="Email address"
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor="password" className="sr-only">Password</label>
//                             <input
//                                 id="password"
//                                 name="password"
//                                 type="password"
//                                 autoComplete="current-password"
//                                 required
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                                 placeholder="Password"
//                             />
//                         </div>
//                     </div>

//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center">
//                             <input
//                                 id="remember-me"
//                                 name="remember-me"
//                                 type="checkbox"
//                                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                             />
//                             <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
//                                 Remember me
//                             </label>
//                         </div>

//                         <div className="text-sm">
//                             <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
//                                 Forgot your password?
//                             </a>
//                         </div>
//                     </div>

//                     <div>
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''
//                                 }`}
//                         >
//                             {loading ? (
//                                 <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                 </svg>
//                             ) : (
//                                 <span className="absolute left-0 inset-y-0 flex items-center pl-3">
//                                     <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                                         <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
//                                     </svg>
//                                 </span>
//                             )}
//                             {loading ? 'Signing in...' : 'Sign in'}
//                         </button>
//                     </div>
//                 </form>

//                 <div className="mt-6">
//                     <div className="relative">
//                         <div className="absolute inset-0 flex items-center">
//                             <div className="w-full border-t border-gray-300"></div>
//                         </div>
//                         <div className="relative flex justify-center text-sm">
//                             <span className="px-2 bg-gray-50 text-gray-500">
//                                 Or
//                             </span>
//                         </div>
//                     </div>

//                     <div className="mt-6 grid grid-cols-1 gap-3">
//                         <button
//                             type="button"
//                             className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                         >
//                             <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
//                                 <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.022A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.291 2.747-1.022 2.747-1.022.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933-.359.124-.62.39-.62.747 0 .54.004 1.069.004 1.179 0 .27.18.583.688.483C17.139 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
//                             </svg>
//                             Continue with GitHub
//                         </button>

//                         <button
//                             type="button"
//                             className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                         >
//                             <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
//                                 <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
//                                 <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
//                                 <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
//                                 <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
//                             </svg>
//                             Continue with Google
//                         </button>

//                         <button
//                             type="button"
//                             className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                         >
//                             <svg className="h-5 w-5 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//                                 <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
//                             </svg>
//                             Continue with Facebook
//                         </button>
//                     </div>

//                     <div className="mt-6 text-center">
//                         <p className="text-sm text-gray-600">
//                             Don't have an account?{' '}
//                             <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
//                                 Sign up
//                             </a>
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LoginPage;

// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5053/api/salesmen';

// const LoginPage = ({ onLoginSuccess }) => {
//     const [formData, setFormData] = useState({
//         username: '',
//         password: '',
//         loginAs: 'salesman' // Default to salesman login
//     });

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');

//         const { username, password, loginAs } = formData;

//         if (!username || !password) {
//             setError('Please enter both username and password.');
//             return;
//         }

//         try {
//             setLoading(true);

//             // Determine which API endpoint to use based on login type
//             const endpoint = loginAs === 'salesman'
//                 ? `${API_BASE_URL}/login`
//                 : `${API_BASE_URL}/login`;

//             // Call API for login
//             const response = await axios.post(endpoint, {
//                 username, // For salesman login
//                 email: username, // For user login
//                 password
//             });

//             // Extract data based on login type
//             const userData = loginAs === 'salesman'
//                 ? {
//                     ...response.data.data.salesman,
//                     token: response.data.data.token,
//                     userType: 'salesman'
//                 }
//                 : {
//                     ...response.data.REAL_ESTATE_APP,
//                     token: response.data.REAL_ESTATE_APP.token,
//                     userType: 'user'
//                 };

//             // Store user data in localStorage
//             localStorage.setItem('user', JSON.stringify(userData));
//             localStorage.setItem('token', userData.token);

//             // Notify parent component
//             onLoginSuccess(userData);

//         } catch (err) {
//             console.error('Login error:', err);
//             setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-md w-full space-y-8">
//                 <div>
//                     <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//                         Sign in to your account
//                     </h2>
//                     <p className="mt-2 text-center text-sm text-gray-600">
//                         Access your real estate property dashboard
//                     </p>
//                 </div>

//                 {error && (
//                     <div className="bg-red-50 border-l-4 border-red-500 p-4">
//                         <div className="flex">
//                             <div className="flex-shrink-0">
//                                 <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                                 </svg>
//                             </div>
//                             <div className="ml-3">
//                                 <p className="text-sm text-red-700">
//                                     {error}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//                     <div className="rounded-md shadow-sm -space-y-px">
//                         <div>
//                             <label htmlFor="username" className="sr-only">Username or Email</label>
//                             <input
//                                 id="username"
//                                 name="username"
//                                 type="text"
//                                 autoComplete="username"
//                                 required
//                                 value={formData.username}
//                                 onChange={handleChange}
//                                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                                 placeholder={formData.loginAs === 'salesman' ? 'Username' : 'Email address'}
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor="password" className="sr-only">Password</label>
//                             <input
//                                 id="password"
//                                 name="password"
//                                 type="password"
//                                 autoComplete="current-password"
//                                 required
//                                 value={formData.password}
//                                 onChange={handleChange}
//                                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                                 placeholder="Password"
//                             />
//                         </div>
//                     </div>

//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center">
//                             <input
//                                 id="remember-me"
//                                 name="remember-me"
//                                 type="checkbox"
//                                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                             />
//                             <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
//                                 Remember me
//                             </label>
//                         </div>

//                         <div className="text-sm">
//                             <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
//                                 Forgot your password?
//                             </a>
//                         </div>
//                     </div>

//                     <div className="flex flex-col space-y-4">
//                         <div className="flex space-x-4 justify-center">
//                             <div className="flex items-center">
//                                 <input
//                                     id="loginAsSalesman"
//                                     name="loginAs"
//                                     type="radio"
//                                     checked={formData.loginAs === 'salesman'}
//                                     value="salesman"
//                                     onChange={handleChange}
//                                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                                 />
//                                 <label htmlFor="loginAsSalesman" className="ml-2 block text-sm text-gray-900">
//                                     Login as Salesman
//                                 </label>
//                             </div>
//                             <div className="flex items-center">
//                                 <input
//                                     id="loginAsUser"
//                                     name="loginAs"
//                                     type="radio"
//                                     checked={formData.loginAs === 'user'}
//                                     value="user"
//                                     onChange={handleChange}
//                                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                                 />
//                                 <label htmlFor="loginAsUser" className="ml-2 block text-sm text-gray-900">
//                                     Login as User
//                                 </label>
//                             </div>
//                         </div>

//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''
//                                 }`}
//                         >
//                             {loading ? (
//                                 <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                 </svg>
//                             ) : (
//                                 <span className="absolute left-0 inset-y-0 flex items-center pl-3">
//                                     <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                                         <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
//                                     </svg>
//                                 </span>
//                             )}
//                             {loading ? 'Signing in...' : 'Sign in'}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default LoginPage;

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, reset } from '../redux/features/auth/authSlice' ; 
const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        loginAs: 'salesman' // Default to salesman login
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            setError(message);
        }

        // Redirect when logged in
        if (isSuccess || user) {
            // Redirect based on user type
            if (user.userType === 'admin' || user.role === 'admin') {
                navigate('/salesman-management');
            } else {
                navigate('/dashboard');
            }
        }

        // Reset state on unmount
        return () => {
            dispatch(reset());
        };
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const { username, password, loginAs } = formData;

        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }

        // Determine if admin login
        const isAdmin = loginAs === 'admin';

        // Dispatch login action with user data
        const userData = {
            username,
            password,
            isAdmin
        };

        dispatch(login(userData));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Access your real estate property dashboard
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">
                                    {error}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Username"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <div className="flex space-x-4 justify-center">
                            <div className="flex items-center">
                                <input
                                    id="loginAsSalesman"
                                    name="loginAs"
                                    type="radio"
                                    checked={formData.loginAs === 'salesman'}
                                    value="salesman"
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <label htmlFor="loginAsSalesman" className="ml-2 block text-sm text-gray-900">
                                    Login as Salesman
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="loginAsAdmin"
                                    name="loginAs"
                                    type="radio"
                                    checked={formData.loginAs === 'admin'}
                                    value="admin"
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <label htmlFor="loginAsAdmin" className="ml-2 block text-sm text-gray-900">
                                    Login as Admin
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            )}
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;