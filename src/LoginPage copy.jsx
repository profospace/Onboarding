// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { login, reset } from '../redux/features/auth/authSlice' ; 
// const LoginPage = () => {
//     const [formData, setFormData] = useState({
//         username: '',
//         password: '',
//         loginAs: 'salesman' // Default to salesman login
//     });

//     const [error, setError] = useState('');
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     const { user, isLoading, isError, isSuccess, message } = useSelector(
//         (state) => state.auth
//     );

//     useEffect(() => {
//         if (isError) {
//             setError(message);
//         }

//         // Redirect when logged in
//         if (isSuccess || user) {
//             // Redirect based on user type
//             if (user.userType === 'admin' || user.role === 'admin') {
//                 navigate('/salesman-management');
//             } else {
//                 navigate('/dashboard');
//             }
//         }

//         // Reset state on unmount
//         return () => {
//             dispatch(reset());
//         };
//     }, [user, isError, isSuccess, message, navigate, dispatch]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         setError('');

//         const { username, password, loginAs } = formData;

//         if (!username || !password) {
//             setError('Please enter both username and password.');
//             return;
//         }

//         // Determine if admin login
//         const isAdmin = loginAs === 'admin';

//         // Dispatch login action with user data
//         const userData = {
//             username,
//             password,
//             isAdmin
//         };

//         dispatch(login(userData));
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
//                             <label htmlFor="username" className="sr-only">Username</label>
//                             <input
//                                 id="username"
//                                 name="username"
//                                 type="text"
//                                 autoComplete="username"
//                                 required
//                                 value={formData.username}
//                                 onChange={handleChange}
//                                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                                 placeholder="Username"
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
//                                     id="loginAsAdmin"
//                                     name="loginAs"
//                                     type="radio"
//                                     checked={formData.loginAs === 'admin'}
//                                     value="admin"
//                                     onChange={handleChange}
//                                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                                 />
//                                 <label htmlFor="loginAsAdmin" className="ml-2 block text-sm text-gray-900">
//                                     Login as Admin
//                                 </label>
//                             </div>
//                         </div>

//                         <button
//                             type="submit"
//                             disabled={isLoading}
//                             className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
//                         >
//                             {isLoading ? (
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
//                             {isLoading ? 'Signing in...' : 'Sign in'}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default LoginPage;



// import React, { useState, useEffect } from 'react';

// // Network Status Component
// const NetworkStatus = () => {
//     const [isOnline, setIsOnline] = useState(navigator.onLine);
//     const [showStatus, setShowStatus] = useState(false);

//     useEffect(() => {
//         const handleOnline = () => {
//             setIsOnline(true);
//             setShowStatus(true);
//             // Hide success message after 3 seconds
//             setTimeout(() => setShowStatus(false), 3000);
//         };

//         const handleOffline = () => {
//             setIsOnline(false);
//             setShowStatus(true);
//         };

//         window.addEventListener('online', handleOnline);
//         window.addEventListener('offline', handleOffline);

//         // Show initial status for 2 seconds
//         setShowStatus(true);
//         setTimeout(() => {
//             if (isOnline) setShowStatus(false);
//         }, 2000);

//         return () => {
//             window.removeEventListener('online', handleOnline);
//             window.removeEventListener('offline', handleOffline);
//         };
//     }, [isOnline]);

//     if (!showStatus && isOnline) return null;

//     return (
//         <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 transform ${showStatus ? 'translate-y-0' : '-translate-y-full'
//             }`}>
//             <div className={`${isOnline
//                     ? 'bg-gradient-to-r from-green-500 to-emerald-600'
//                     : 'bg-gradient-to-r from-red-500 to-red-600'
//                 } text-white py-3 px-4 shadow-lg`}>
//                 <div className="max-w-md mx-auto flex items-center justify-center space-x-3">
//                     {/* Status Icon */}
//                     <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isOnline ? 'bg-white bg-opacity-20' : 'bg-white bg-opacity-20'
//                         }`}>
//                         {isOnline ? (
//                             <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
//                             </svg>
//                         ) : (
//                             <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
//                             </svg>
//                         )}
//                     </div>

//                     {/* Status Text */}
//                     <div className="flex-1 text-center">
//                         <div className="flex items-center justify-center space-x-2">
//                             <div className={`w-2 h-2 rounded-full animate-pulse ${isOnline ? 'bg-green-200' : 'bg-red-200'
//                                 }`}></div>
//                             <span className="font-semibold text-lg">
//                                 {isOnline ? 'CONNECTED' : 'NO INTERNET'}
//                             </span>
//                             <div className={`w-2 h-2 rounded-full animate-pulse ${isOnline ? 'bg-green-200' : 'bg-red-200'
//                                 }`}></div>
//                         </div>
//                         <p className="text-sm opacity-90 mt-1">
//                             {isOnline
//                                 ? '✓ Internet connection is working perfectly'
//                                 : '✗ Please check your internet connection'
//                             }
//                         </p>
//                     </div>

//                     {/* Signal Strength Indicator */}
//                     <div className="flex-shrink-0 flex space-x-1">
//                         {[...Array(4)].map((_, i) => (
//                             <div
//                                 key={i}
//                                 className={`w-1 rounded-full transition-all duration-300 ${isOnline
//                                         ? 'bg-white bg-opacity-80'
//                                         : 'bg-white bg-opacity-30'
//                                     }`}
//                                 style={{
//                                     height: `${8 + i * 4}px`,
//                                     animationDelay: `${i * 0.1}s`
//                                 }}
//                             />
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const LoginPage = () => {
//     const [formData, setFormData] = useState({
//         username: '',
//         password: '',
//         loginAs: 'salesman'
//     });

//     const [error, setError] = useState('');
//     const [isLoading, setIsLoading] = useState(false);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         setError('');

//         const { username, password, loginAs } = formData;

//         if (!username || !password) {
//             setError('Please enter both username and password.');
//             return;
//         }

//         setIsLoading(true);

//         // Simulate login process
//         setTimeout(() => {
//             setIsLoading(false);
//             alert(`Login attempt as ${loginAs}: ${username}`);
//         }, 2000);
//     };

//     return (
//         <div className="min-h-screen bg-gray-50">
//             {/* Network Status Component */}
//             <NetworkStatus />

//             {/* Main Login Content */}
//             <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-20">
//                 <div className="max-w-md w-full space-y-8">
//                     <div>
//                         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//                             Sign in to your account
//                         </h2>
//                         <p className="mt-2 text-center text-sm text-gray-600">
//                             Access your real estate property dashboard
//                         </p>
//                     </div>

//                     {error && (
//                         <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
//                             <div className="flex">
//                                 <div className="flex-shrink-0">
//                                     <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                                     </svg>
//                                 </div>
//                                 <div className="ml-3">
//                                     <p className="text-sm text-red-700">
//                                         {error}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     <div className="mt-8 space-y-6">
//                         <div className="rounded-md shadow-sm -space-y-px">
//                             <div>
//                                 <label htmlFor="username" className="sr-only">Username</label>
//                                 <input
//                                     id="username"
//                                     name="username"
//                                     type="text"
//                                     autoComplete="username"
//                                     required
//                                     value={formData.username}
//                                     onChange={handleChange}
//                                     className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                                     placeholder="Username"
//                                 />
//                             </div>
//                             <div>
//                                 <label htmlFor="password" className="sr-only">Password</label>
//                                 <input
//                                     id="password"
//                                     name="password"
//                                     type="password"
//                                     autoComplete="current-password"
//                                     required
//                                     value={formData.password}
//                                     onChange={handleChange}
//                                     className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                                     placeholder="Password"
//                                 />
//                             </div>
//                         </div>

//                         <div className="flex items-center justify-between">
//                             <div className="flex items-center">
//                                 <input
//                                     id="remember-me"
//                                     name="remember-me"
//                                     type="checkbox"
//                                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                                 />
//                                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
//                                     Remember me
//                                 </label>
//                             </div>

//                             <div className="text-sm">
//                                 <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
//                                     Forgot your password?
//                                 </a>
//                             </div>
//                         </div>

//                         <div className="flex flex-col space-y-4">
//                             <div className="flex space-x-4 justify-center">
//                                 <div className="flex items-center">
//                                     <input
//                                         id="loginAsSalesman"
//                                         name="loginAs"
//                                         type="radio"
//                                         checked={formData.loginAs === 'salesman'}
//                                         value="salesman"
//                                         onChange={handleChange}
//                                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                                     />
//                                     <label htmlFor="loginAsSalesman" className="ml-2 block text-sm text-gray-900">
//                                         Login as Salesman
//                                     </label>
//                                 </div>
//                                 <div className="flex items-center">
//                                     <input
//                                         id="loginAsAdmin"
//                                         name="loginAs"
//                                         type="radio"
//                                         checked={formData.loginAs === 'admin'}
//                                         value="admin"
//                                         onChange={handleChange}
//                                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                                     />
//                                     <label htmlFor="loginAsAdmin" className="ml-2 block text-sm text-gray-900">
//                                         Login as Admin
//                                     </label>
//                                 </div>
//                             </div>

//                             <button
//                                 type="button"
//                                 disabled={isLoading}
//                                 onClick={handleSubmit}
//                                 className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
//                             >
//                                 {isLoading ? (
//                                     <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                     </svg>
//                                 ) : (
//                                     <span className="absolute left-0 inset-y-0 flex items-center pl-3">
//                                         <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                                             <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
//                                         </svg>
//                                     </span>
//                                 )}
//                                 {isLoading ? 'Signing in...' : 'Sign in'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LoginPage;

import React, { useState, useEffect } from 'react';

// Network Status Component
const NetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
        };

        const handleOffline = () => {
            setIsOnline(false);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-50 transition-all duration-500">
            <div className={`${isOnline
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                    : 'bg-gradient-to-r from-red-500 to-red-600'
                } text-white py-3 px-4 shadow-lg`}>
                <div className="max-w-md mx-auto flex items-center justify-center space-x-3">
                    {/* Status Icon */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isOnline ? 'bg-white bg-opacity-20' : 'bg-white bg-opacity-20'
                        }`}>
                        {isOnline ? (
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                            </svg>
                        )}
                    </div>

                    {/* Status Text */}
                    <div className="flex-1 text-center">
                        <div className="flex items-center justify-center space-x-2">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${isOnline ? 'bg-green-200' : 'bg-red-200'
                                }`}></div>
                            <span className="font-semibold text-lg">
                                {isOnline ? 'CONNECTED' : 'NO INTERNET'}
                            </span>
                            <div className={`w-2 h-2 rounded-full animate-pulse ${isOnline ? 'bg-green-200' : 'bg-red-200'
                                }`}></div>
                        </div>
                        <p className="text-sm opacity-90 mt-1">
                            {isOnline
                                ? '✓ Internet connection is working perfectly'
                                : '✗ Please check your internet connection'
                            }
                        </p>
                    </div>

                    {/* Signal Strength Indicator */}
                    <div className="flex-shrink-0 flex space-x-1">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-1 rounded-full transition-all duration-300 ${isOnline
                                        ? 'bg-white bg-opacity-80'
                                        : 'bg-white bg-opacity-30'
                                    }`}
                                style={{
                                    height: `${8 + i * 4}px`,
                                    animationDelay: `${i * 0.1}s`
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        loginAs: 'salesman'
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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

        setIsLoading(true);

        // Simulate login process
        setTimeout(() => {
            setIsLoading(false);
            alert(`Login attempt as ${loginAs}: ${username}`);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Network Status Component */}
            <NetworkStatus />

            {/* Main Login Content */}
            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-20">
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
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
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

                    <div className="mt-8 space-y-6">
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
                                type="button"
                                disabled={isLoading}
                                onClick={handleSubmit}
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;