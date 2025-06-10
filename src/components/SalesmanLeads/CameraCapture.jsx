// import React, { useRef, useEffect, useState } from 'react';

// interface CameraCaptureProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onCapture: (imageFile: File) => void;
// }

// const CameraCapture: React.FC<CameraCaptureProps> = ({ isOpen, onClose, onCapture }) => {
//     const videoRef = useRef<HTMLVideoElement>(null);
//     const canvasRef = useRef<HTMLCanvasElement>(null);
//     const streamRef = useRef<MediaStream | null>(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState<string>('');
//     const [isVideoReady, setIsVideoReady] = useState(false);

//     useEffect(() => {
//         if (isOpen) {
//             startCamera();
//         } else {
//             stopCamera();
//             setIsVideoReady(false);
//             setError('');
//         }

//         return () => {
//             stopCamera();
//         };
//     }, [isOpen]);

//     const startCamera = async () => {
//         setIsLoading(true);
//         setError('');
//         setIsVideoReady(false);

//         try {
//             // Stop any existing stream first
//             if (streamRef.current) {
//                 streamRef.current.getTracks().forEach(track => track.stop());
//             }

//             // Request camera access with multiple fallback options
//             let stream: MediaStream | null = null;

//             // Try with ideal constraints first
//             try {
//                 stream = await navigator.mediaDevices.getUserMedia({
//                     video: {
//                         facingMode: 'environment',
//                         width: { ideal: 1280, max: 1920 },
//                         height: { ideal: 720, max: 1080 }
//                     },
//                     audio: false
//                 });
//             } catch (err) {
//                 console.log('Trying fallback camera constraints...');
//                 // Fallback to basic constraints
//                 stream = await navigator.mediaDevices.getUserMedia({
//                     video: {
//                         facingMode: 'environment'
//                     },
//                     audio: false
//                 });
//             }

//             if (!stream) {
//                 throw new Error('Failed to get camera stream');
//             }

//             streamRef.current = stream;

//             if (videoRef.current) {
//                 videoRef.current.srcObject = stream;

//                 // Wait for video to be ready
//                 videoRef.current.onloadedmetadata = () => {
//                     if (videoRef.current) {
//                         videoRef.current.play()
//                             .then(() => {
//                                 setIsVideoReady(true);
//                                 setIsLoading(false);
//                             })
//                             .catch((playError) => {
//                                 console.error('Error playing video:', playError);
//                                 setError('Failed to start video playback');
//                                 setIsLoading(false);
//                             });
//                     }
//                 };

//                 // Handle video errors
//                 videoRef.current.onerror = (e) => {
//                     console.error('Video error:', e);
//                     setError('Video playback error');
//                     setIsLoading(false);
//                 };
//             }
//         } catch (err) {
//             console.error('Error accessing camera:', err);
//             let errorMessage = 'Unable to access camera. ';

//             if (err instanceof Error) {
//                 if (err.name === 'NotAllowedError') {
//                     errorMessage += 'Please allow camera permissions and try again.';
//                 } else if (err.name === 'NotFoundError') {
//                     errorMessage += 'No camera found on this device.';
//                 } else if (err.name === 'NotReadableError') {
//                     errorMessage += 'Camera is being used by another application.';
//                 } else {
//                     errorMessage += err.message;
//                 }
//             } else {
//                 errorMessage += 'Please check permissions and try again.';
//             }

//             setError(errorMessage);
//             setIsLoading(false);
//         }
//     };

//     const stopCamera = () => {
//         if (streamRef.current) {
//             streamRef.current.getTracks().forEach(track => {
//                 track.stop();
//             });
//             streamRef.current = null;
//         }

//         if (videoRef.current) {
//             videoRef.current.srcObject = null;
//         }
//     };

//     const capturePhoto = () => {
//         if (!videoRef.current || !canvasRef.current || !isVideoReady) {
//             console.error('Video or canvas not ready for capture');
//             return;
//         }

//         const video = videoRef.current;
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');

//         if (!context) {
//             console.error('Could not get canvas context');
//             return;
//         }

//         // Set canvas dimensions to match video
//         canvas.width = video.videoWidth || video.clientWidth;
//         canvas.height = video.videoHeight || video.clientHeight;

//         // Draw the video frame to canvas
//         context.drawImage(video, 0, 0, canvas.width, canvas.height);

//         // Convert canvas to blob
//         canvas.toBlob((blob) => {
//             if (blob) {
//                 // Create a File object from the blob
//                 const file = new File([blob], `camera-photo-${Date.now()}.jpg`, {
//                     type: 'image/jpeg',
//                     lastModified: Date.now()
//                 });

//                 onCapture(file);
//                 handleClose();
//             } else {
//                 console.error('Failed to create blob from canvas');
//             }
//         }, 'image/jpeg', 0.9);
//     };

//     const handleClose = () => {
//         stopCamera();
//         onClose();
//     };

//     const retryCamera = () => {
//         setError('');
//         startCamera();
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
//             <div className="relative w-full h-full max-w-4xl max-h-full flex flex-col">
//                 {/* Header */}
//                 <div className="flex justify-between items-center p-4 bg-black bg-opacity-70 text-white relative z-10">
//                     <h3 className="text-lg font-semibold">Take Photo</h3>
//                     <button
//                         onClick={handleClose}
//                         className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
//                     >
//                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//                         </svg>
//                     </button>
//                 </div>

//                 {/* Camera View */}
//                 <div className="flex-1 flex items-center justify-center bg-black relative">
//                     {/* Loading State */}
//                     {isLoading && (
//                         <div className="text-white text-center absolute z-20">
//                             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
//                             <p>Starting camera...</p>
//                         </div>
//                     )}

//                     {/* Error State */}
//                     {error && !isLoading && (
//                         <div className="text-white text-center p-4 absolute z-20">
//                             <div className="mb-4">
//                                 <svg className="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
//                                 </svg>
//                             </div>
//                             <p className="mb-4 text-lg">{error}</p>
//                             <button
//                                 onClick={retryCamera}
//                                 className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                             >
//                                 Try Again
//                             </button>
//                         </div>
//                     )}

//                     {/* Video Element */}
//                     <video
//                         ref={videoRef}
//                         className={`max-w-full max-h-full object-contain ${isVideoReady ? 'block' : 'hidden'
//                             }`}
//                         autoPlay
//                         playsInline
//                         muted
//                         style={{
//                             transform: 'scaleX(-1)', // Mirror the video for better UX
//                         }}
//                     />

//                     {/* Video placeholder when not ready */}
//                     {!isVideoReady && !isLoading && !error && (
//                         <div className="text-white text-center">
//                             <div className="mb-4">
//                                 <svg className="w-16 h-16 mx-auto text-gray-400\" fill="none\" stroke="currentColor\" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round\" strokeLinejoin="round\" strokeWidth="2\" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
//                                 </svg>
//                             </div>
//                             <p>Preparing camera...</p>
//                         </div>
//                     )}
//                 </div>

//                 {/* Controls */}
//                 {isVideoReady && !error && (
//                     <div className="flex justify-center items-center p-6 bg-black bg-opacity-70 relative z-10">
//                         <div className="flex space-x-6">
//                             <button
//                                 onClick={handleClose}
//                                 className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={capturePhoto}
//                                 className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center font-semibold"
//                             >
//                                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
//                                 </svg>
//                                 Capture Photo
//                             </button>
//                         </div>
//                     </div>
//                 )}

//                 {/* Hidden canvas for photo capture */}
//                 <canvas ref={canvasRef} className="hidden" />
//             </div>
//         </div>
//     );
// };

// export default CameraCapture;

import React, { useRef, useEffect, useState } from 'react';

const CameraCapture = ({ isOpen, onClose, onCapture }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isVideoReady, setIsVideoReady] = useState(false);

    useEffect(() => {
        if (isOpen) {
            startCamera();
        } else {
            stopCamera();
            setIsVideoReady(false);
            setError('');
        }

        return () => {
            stopCamera();
        };
    }, [isOpen]);

    const startCamera = async () => {
        setIsLoading(true);
        setError('');
        setIsVideoReady(false);

        try {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }

            let stream = null;

            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'environment',
                        width: { ideal: 1280, max: 1920 },
                        height: { ideal: 720, max: 1080 }
                    },
                    audio: false
                });
            } catch (err) {
                console.log('Trying fallback camera constraints...');
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' },
                    audio: false
                });
            }

            if (!stream) {
                throw new Error('Failed to get camera stream');
            }

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;

                videoRef.current.onloadedmetadata = () => {
                    if (videoRef.current) {
                        videoRef.current.play()
                            .then(() => {
                                setIsVideoReady(true);
                                setIsLoading(false);
                            })
                            .catch((playError) => {
                                console.error('Error playing video:', playError);
                                setError('Failed to start video playback');
                                setIsLoading(false);
                            });
                    }
                };

                videoRef.current.onerror = (e) => {
                    console.error('Video error:', e);
                    setError('Video playback error');
                    setIsLoading(false);
                };
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
            let errorMessage = 'Unable to access camera. ';

            if (err && err.name) {
                if (err.name === 'NotAllowedError') {
                    errorMessage += 'Please allow camera permissions and try again.';
                } else if (err.name === 'NotFoundError') {
                    errorMessage += 'No camera found on this device.';
                } else if (err.name === 'NotReadableError') {
                    errorMessage += 'Camera is being used by another application.';
                } else {
                    errorMessage += err.message;
                }
            } else {
                errorMessage += 'Please check permissions and try again.';
            }

            setError(errorMessage);
            setIsLoading(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current || !isVideoReady) {
            console.error('Video or canvas not ready for capture');
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) {
            console.error('Could not get canvas context');
            return;
        }

        canvas.width = video.videoWidth || video.clientWidth;
        canvas.height = video.videoHeight || video.clientHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], `camera-photo-${Date.now()}.jpg`, {
                    type: 'image/jpeg',
                    lastModified: Date.now()
                });

                onCapture(file);
                handleClose();
            } else {
                console.error('Failed to create blob from canvas');
            }
        }, 'image/jpeg', 0.9);
    };

    const handleClose = () => {
        stopCamera();
        onClose();
    };

    const retryCamera = () => {
        setError('');
        startCamera();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
            <div className="relative w-full h-full max-w-4xl max-h-full flex flex-col">
                <div className="flex justify-between items-center p-4 bg-black bg-opacity-70 text-white relative z-10">
                    <h3 className="text-lg font-semibold">Take Photo</h3>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div className="flex-1 flex items-center justify-center bg-black relative">
                    {isLoading && (
                        <div className="text-white text-center absolute z-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                            <p>Starting camera...</p>
                        </div>
                    )}

                    {error && !isLoading && (
                        <div className="text-white text-center p-4 absolute z-20">
                            <div className="mb-4">
                                <svg className="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                </svg>
                            </div>
                            <p className="mb-4 text-lg">{error}</p>
                            <button
                                onClick={retryCamera}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    <video
                        ref={videoRef}
                        className={`max-w-full max-h-full object-contain ${isVideoReady ? 'block' : 'hidden'}`}
                        autoPlay
                        playsInline
                        muted
                        style={{ transform: 'scaleX(-1)' }}
                    />

                    {!isVideoReady && !isLoading && !error && (
                        <div className="text-white text-center">
                            <div className="mb-4">
                                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                            </div>
                            <p>Preparing camera...</p>
                        </div>
                    )}
                </div>

                {isVideoReady && !error && (
                    <div className="flex justify-center items-center p-6 bg-black bg-opacity-70 relative z-10">
                        <div className="flex space-x-6">
                            <button
                                onClick={handleClose}
                                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={capturePhoto}
                                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center font-semibold"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                Capture Photo
                            </button>
                        </div>
                    </div>
                )}

                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    );
};

export default CameraCapture;
