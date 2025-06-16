// // import { io } from 'socket.io-client';

// // class SocketService {
// //     constructor() {
// //         this.socket = null;
// //         this.isConnected = false;
// //         this.reconnectAttempts = 0;
// //         this.maxReconnectAttempts = 5;
// //         this.locationUpdateInterval = null;
// //         this.watchId = null;
// //     }

// //     connect(token, userRole) {
// //         if (this.socket) {
// //             this.disconnect();
// //         }

// //         // const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:5029';
// //         const serverUrl = 'http://localhost:5029';

// //         this.socket = io(`${serverUrl}/location`, {
// //             auth: {
// //                 token: token
// //             },
// //             transports: ['websocket', 'polling'],
// //             timeout: 20000,
// //             forceNew: true
// //         });

// //         this.setupEventListeners(userRole);

// //         return new Promise((resolve, reject) => {
// //             this.socket.on('connect', () => {
// //                 console.log('Connected to location socket');
// //                 this.isConnected = true;
// //                 this.reconnectAttempts = 0;
// //                 resolve();
// //             });

// //             this.socket.on('connect_error', (error) => {
// //                 console.error('Socket connection error:', error);
// //                 this.isConnected = false;
// //                 reject(error);
// //             });
// //         });
// //     }

// //     setupEventListeners(userRole) {
// //         if (!this.socket) return;

// //         // Common events
// //         this.socket.on('disconnect', (reason) => {
// //             console.log('Disconnected from location socket:', reason);
// //             this.isConnected = false;

// //             if (reason === 'io server disconnect') {
// //                 // Server disconnected, try to reconnect
// //                 this.handleReconnection();
// //             }
// //         });

// //         this.socket.on('error', (error) => {
// //             console.error('Socket error:', error);
// //         });

// //         // Role-specific events
// //         if (userRole === 'salesman') {
// //             this.setupSalesmanEvents();
// //         } else if (userRole === 'admin') {
// //             this.setupAdminEvents();
// //         }
// //     }

// //     setupSalesmanEvents() {
// //         this.socket.on('trackingToggled', (data) => {
// //             console.log('Tracking toggled:', data);

// //             if (data.enabled) {
// //                 this.startLocationTracking(data.frequency || 30);
// //                 this.showNotification(`Location tracking enabled by ${data.adminName}`, 'info');
// //             } else {
// //                 this.stopLocationTracking();
// //                 this.showNotification('Location tracking disabled', 'warning');
// //             }
// //         });

// //         this.socket.on('locationRequested', (data) => {
// //             console.log('Location requested by admin:', data);
// //             this.sendCurrentLocation();
// //         });

// //         this.socket.on('trackingDisabled', (data) => {
// //             console.log('Tracking disabled:', data);
// //             this.stopLocationTracking();
// //             this.showNotification(data.message, 'warning');
// //         });

// //         this.socket.on('locationUpdateAck', (data) => {
// //             console.log('Location update acknowledged:', data);
// //         });
// //     }

// //     setupAdminEvents() {
// //         this.socket.on('realtimeLocationUpdate', (data) => {
// //             console.log('Real-time location update:', data);
// //             // Dispatch custom event for admin dashboard
// //             window.dispatchEvent(new CustomEvent('locationUpdate', { detail: data }));
// //         });

// //         this.socket.on('salesmanStatusUpdate', (data) => {
// //             console.log('Salesman status update:', data);
// //             window.dispatchEvent(new CustomEvent('salesmanStatusUpdate', { detail: data }));
// //         });

// //         this.socket.on('salesmanDisconnected', (data) => {
// //             console.log('Salesman disconnected:', data);
// //             window.dispatchEvent(new CustomEvent('salesmanDisconnected', { detail: data }));
// //         });

// //         this.socket.on('trackingToggleConfirm', (data) => {
// //             console.log('Tracking toggle confirmed:', data);
// //             window.dispatchEvent(new CustomEvent('trackingToggleConfirm', { detail: data }));
// //         });
// //     }

// //     startLocationTracking(frequency = 30) {
// //         if (!this.isConnected || !navigator.geolocation) {
// //             console.error('Cannot start location tracking: socket not connected or geolocation not available');
// //             return;
// //         }

// //         // Stop existing tracking
// //         this.stopLocationTracking();

// //         const options = {
// //             enableHighAccuracy: true,
// //             timeout: 10000,
// //             maximumAge: 5000
// //         };

// //         // Start watching position
// //         this.watchId = navigator.geolocation.watchPosition(
// //             (position) => {
// //                 this.sendLocationUpdate(position);
// //             },
// //             (error) => {
// //                 console.error('Geolocation error:', error);
// //                 this.handleGeolocationError(error);
// //             },
// //             options
// //         );

// //         // Set up interval for regular updates
// //         this.locationUpdateInterval = setInterval(() => {
// //             navigator.geolocation.getCurrentPosition(
// //                 (position) => {
// //                     this.sendLocationUpdate(position);
// //                 },
// //                 (error) => {
// //                     console.error('Geolocation error:', error);
// //                 },
// //                 options
// //             );
// //         }, frequency * 1000);

// //         console.log(`Location tracking started with ${frequency}s interval`);
// //     }

// //     stopLocationTracking() {
// //         if (this.watchId) {
// //             navigator.geolocation.clearWatch(this.watchId);
// //             this.watchId = null;
// //         }

// //         if (this.locationUpdateInterval) {
// //             clearInterval(this.locationUpdateInterval);
// //             this.locationUpdateInterval = null;
// //         }

// //         console.log('Location tracking stopped');
// //     }

// //     sendLocationUpdate(position) {
// //         if (!this.isConnected || !this.socket) {
// //             console.error('Cannot send location update: socket not connected');
// //             return;
// //         }

// //         const locationData = {
// //             latitude: position.coords.latitude,
// //             longitude: position.coords.longitude,
// //             accuracy: position.coords.accuracy,
// //             speed: position.coords.speed || 0,
// //             heading: position.coords.heading || 0,
// //             altitude: position.coords.altitude || 0,
// //             timestamp: new Date(position.timestamp)
// //         };

// //         console.log("Emitting locationUpdate event from salemsman" , locationData)
// //         this.socket.emit('locationUpdate', locationData);
// //     }

// //     sendCurrentLocation() {
// //         if (!navigator.geolocation) {
// //             console.error('Geolocation not available');
// //             return;
// //         }

// //         navigator.geolocation.getCurrentPosition(
// //             (position) => {
// //                 this.sendLocationUpdate(position);
// //             },
// //             (error) => {
// //                 console.error('Error getting current location:', error);
// //             },
// //             {
// //                 enableHighAccuracy: true,
// //                 timeout: 10000,
// //                 maximumAge: 5000
// //             }
// //         );
// //     }

// //     sendStatusUpdate(status, battery = null, isActive = true) {
// //         if (!this.isConnected || !this.socket) return;

// //         this.socket.emit('statusUpdate', {
// //             status,
// //             battery,
// //             isActive,
// //             timestamp: new Date()
// //         });
// //     }

// //     requestSalesmanLocation(salesmanId) {
// //         if (!this.isConnected || !this.socket) return;

// //         this.socket.emit('requestSalesmanLocation', {
// //             salesmanId,
// //             timestamp: new Date()
// //         });
// //     }

// //     toggleTracking(salesmanId, enabled) {
// //         if (!this.isConnected || !this.socket) return;

// //         this.socket.emit('toggleTracking', {
// //             salesmanId,
// //             enabled,
// //             timestamp: new Date()
// //         });
// //     }

// //     handleGeolocationError(error) {
// //         let message = 'Location access error';

// //         switch (error.code) {
// //             case error.PERMISSION_DENIED:
// //                 message = 'Location access denied by user';
// //                 break;
// //             case error.POSITION_UNAVAILABLE:
// //                 message = 'Location information unavailable';
// //                 break;
// //             case error.TIMEOUT:
// //                 message = 'Location request timed out';
// //                 break;
// //         }

// //         console.error('Geolocation error:', message);
// //         this.showNotification(message, 'error');
// //     }

// //     handleReconnection() {
// //         if (this.reconnectAttempts >= this.maxReconnectAttempts) {
// //             console.error('Max reconnection attempts reached');
// //             return;
// //         }

// //         this.reconnectAttempts++;
// //         const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff

// //         console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

// //         setTimeout(() => {
// //             if (this.socket) {
// //                 this.socket.connect();
// //             }
// //         }, delay);
// //     }

// //     showNotification(message, type = 'info') {
// //         // Dispatch custom event for notifications
// //         window.dispatchEvent(new CustomEvent('socketNotification', {
// //             detail: { message, type }
// //         }));
// //     }

// //     disconnect() {
// //         this.stopLocationTracking();

// //         if (this.socket) {
// //             this.socket.disconnect();
// //             this.socket = null;
// //         }

// //         this.isConnected = false;
// //         console.log('Socket service disconnected');
// //     }

// //     isSocketConnected() {
// //         return this.isConnected && this.socket && this.socket.connected;
// //     }
// // }

// // export default new SocketService();

// import { io } from 'socket.io-client';

// class SocketService {
//     constructor() {
//         this.socket = null;
//         this.isConnected = false;
//         this.reconnectAttempts = 0;
//         this.maxReconnectAttempts = 5;
//         this.locationUpdateInterval = null;
//         this.watchId = null;
//         this.userRole = null;
//     }

//     connect(token, userRole) {
//         if (this.socket) {
//             this.disconnect();
//         }

//         this.userRole = userRole;
//         const serverUrl = 'http://localhost:5029';

//         console.log('Connecting to socket with role:', userRole);

//         this.socket = io(`${serverUrl}/location`, {
//             auth: {
//                 token: token
//             },
//             transports: ['websocket', 'polling'],
//             timeout: 20000,
//             forceNew: true
//         });

//         this.setupEventListeners(userRole);

//         return new Promise((resolve, reject) => {
//             this.socket.on('connect', () => {
//                 console.log('Connected to location socket');
//                 this.isConnected = true;
//                 this.reconnectAttempts = 0;
//                 resolve();
//             });

//             this.socket.on('connect_error', (error) => {
//                 console.error('Socket connection error:', error);
//                 this.isConnected = false;
//                 reject(error);
//             });
//         });
//     }

//     setupEventListeners(userRole) {
//         if (!this.socket) return;

//         // Common events
//         this.socket.on('disconnect', (reason) => {
//             console.log('Disconnected from location socket:', reason);
//             this.isConnected = false;

//             if (reason === 'io server disconnect') {
//                 // Server disconnected, try to reconnect
//                 this.handleReconnection();
//             }
//         });

//         this.socket.on('error', (error) => {
//             console.error('Socket error:', error);
//         });

//         // Role-specific events
//         if (userRole === 'salesman') {
//             this.setupSalesmanEvents();
//         } else if (userRole === 'admin') {
//             this.setupAdminEvents();
//         }
//     }

//     setupSalesmanEvents() {
//         this.socket.on('trackingToggled', (data) => {
//             console.log('Tracking toggled:', data);

//             // Dispatch custom event for the component
//             window.dispatchEvent(new CustomEvent('trackingToggled', { detail: data }));

//             if (data.enabled) {
//                 this.startLocationTracking(data.frequency || 30);
//                 this.showNotification(`Location tracking enabled by ${data.adminName}`, 'info');
//             } else {
//                 this.stopLocationTracking();
//                 this.showNotification('Location tracking disabled', 'warning');
//             }
//         });

//         this.socket.on('locationRequested', (data) => {
//             console.log('Location requested by admin:', data);
//             this.sendCurrentLocation();
//         });

//         this.socket.on('trackingDisabled', (data) => {
//             console.log('Tracking disabled:', data);
//             this.stopLocationTracking();
//             this.showNotification(data.message, 'warning');
//         });

//         this.socket.on('locationUpdateAck', (data) => {
//             console.log('Location update acknowledged:', data.success);
//         });
//     }

//     setupAdminEvents() {
//         this.socket.on('realtimeLocationUpdate', (data) => {
//             console.log('Real-time location update received:', data);
//             // Dispatch custom event for admin dashboard
//             window.dispatchEvent(new CustomEvent('locationUpdate', { detail: data }));
//         });

//         this.socket.on('salesmanStatusUpdate', (data) => {
//             console.log('Salesman status update:', data);
//             window.dispatchEvent(new CustomEvent('salesmanStatusUpdate', { detail: data }));
//         });

//         this.socket.on('salesmanDisconnected', (data) => {
//             console.log('Salesman disconnected:', data);
//             window.dispatchEvent(new CustomEvent('salesmanDisconnected', { detail: data }));
//         });

//         this.socket.on('trackingToggleConfirm', (data) => {
//             console.log('Tracking toggle confirmed:', data);
//             window.dispatchEvent(new CustomEvent('trackingToggleConfirm', { detail: data }));
//         });
//     }

//     startLocationTracking(frequency = 30) {
//         if (!this.isConnected || !navigator.geolocation) {
//             console.error('Cannot start location tracking: socket not connected or geolocation not available');
//             return;
//         }

//         console.log('Starting location tracking with frequency:', frequency, 'seconds');

//         // Stop existing tracking
//         this.stopLocationTracking();

//         const options = {
//             enableHighAccuracy: true,
//             timeout: 15000,
//             maximumAge: 10000
//         };

//         // Start watching position
//         this.watchId = navigator.geolocation.watchPosition(
//             (position) => {
//                 console.log('Got position from watchPosition:', position);
//                 this.sendLocationUpdate(position);
//             },
//             (error) => {
//                 console.error('Geolocation error:', error);
//                 this.handleGeolocationError(error);
//             },
//             options
//         );

//         // Set up interval for regular updates (backup to watchPosition)
//         this.locationUpdateInterval = setInterval(() => {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     console.log('Got position from interval:', position);
//                     this.sendLocationUpdate(position);
//                 },
//                 (error) => {
//                     console.error('Interval geolocation error:', error);
//                 },
//                 options
//             );
//         }, frequency * 1000);

//         console.log(`Location tracking started with ${frequency}s interval`);
//     }

//     stopLocationTracking() {
//         if (this.watchId) {
//             navigator.geolocation.clearWatch(this.watchId);
//             this.watchId = null;
//             console.log('Stopped watching position');
//         }

//         if (this.locationUpdateInterval) {
//             clearInterval(this.locationUpdateInterval);
//             this.locationUpdateInterval = null;
//             console.log('Cleared location update interval');
//         }

//         console.log('Location tracking stopped');
//     }

//     sendLocationUpdate(position) {
//         if (!this.isConnected || !this.socket) {
//             console.error('Cannot send location update: socket not connected');
//             return;
//         }

//         const locationData = {
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//             accuracy: position.coords.accuracy,
//             speed: position.coords.speed || 0,
//             heading: position.coords.heading || 0,
//             altitude: position.coords.altitude || 0,
//             timestamp: new Date(position.timestamp)
//         };

//         console.log("Emitting locationUpdate event:", locationData);
//         this.socket.emit('locationUpdate', locationData);
//     }

//     sendCurrentLocation() {
//         if (!navigator.geolocation) {
//             console.error('Geolocation not available');
//             return;
//         }

//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 console.log('Sending current location:', position);
//                 this.sendLocationUpdate(position);
//             },
//             (error) => {
//                 console.error('Error getting current location:', error);
//             },
//             {
//                 enableHighAccuracy: true,
//                 timeout: 10000,
//                 maximumAge: 5000
//             }
//         );
//     }

//     sendStatusUpdate(status, battery = null, isActive = true) {
//         if (!this.isConnected || !this.socket) {
//             console.log('Cannot send status update: socket not connected');
//             return;
//         }

//         const statusData = {
//             status,
//             battery,
//             isActive,
//             timestamp: new Date()
//         };

//         console.log('Sending status update:', statusData);
//         this.socket.emit('statusUpdate', statusData);
//     }

//     requestSalesmanLocation(salesmanId) {
//         if (!this.isConnected || !this.socket) return;

//         console.log('Requesting location for salesman:', salesmanId);
//         this.socket.emit('requestSalesmanLocation', {
//             salesmanId,
//             timestamp: new Date()
//         });
//     }

//     toggleTracking(salesmanId, enabled) {
//         if (!this.isConnected || !this.socket) return;

//         console.log('Toggling tracking for salesman:', salesmanId, 'enabled:', enabled);
//         this.socket.emit('toggleTracking', {
//             salesmanId,
//             enabled,
//             timestamp: new Date()
//         });
//     }

//     handleGeolocationError(error) {
//         let message = 'Location access error';

//         switch (error.code) {
//             case error.PERMISSION_DENIED:
//                 message = 'Location access denied by user';
//                 break;
//             case error.POSITION_UNAVAILABLE:
//                 message = 'Location information unavailable';
//                 break;
//             case error.TIMEOUT:
//                 message = 'Location request timed out';
//                 break;
//         }

//         console.error('Geolocation error:', message);
//         this.showNotification(message, 'error');
//     }

//     handleReconnection() {
//         if (this.reconnectAttempts >= this.maxReconnectAttempts) {
//             console.error('Max reconnection attempts reached');
//             this.showNotification('Connection lost. Please refresh the page.', 'error');
//             return;
//         }

//         this.reconnectAttempts++;
//         const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff

//         console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

//         setTimeout(() => {
//             if (this.socket) {
//                 this.socket.connect();
//             }
//         }, delay);
//     }

//     showNotification(message, type = 'info') {
//         console.log('Notification:', message, type);
//         // Dispatch custom event for notifications
//         window.dispatchEvent(new CustomEvent('socketNotification', {
//             detail: { message, type }
//         }));
//     }

//     disconnect() {
//         this.stopLocationTracking();

//         if (this.socket) {
//             this.socket.disconnect();
//             this.socket = null;
//         }

//         this.isConnected = false;
//         console.log('Socket service disconnected');
//     }

//     isSocketConnected() {
//         return this.isConnected && this.socket && this.socket.connected;
//     }
// }

// export default new SocketService();

import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.locationUpdateInterval = null;
        this.watchId = null;
        this.userRole = null;
    }

    connect(token, userRole) {
        if (this.socket) {
            this.disconnect();
        }

        this.userRole = userRole;
        const serverUrl = 'http://localhost:5029';

        console.log('Connecting to socket with role:', userRole);

        this.socket = io(`${serverUrl}/location`, {
            auth: {
                token: token
            },
            transports: ['websocket', 'polling'],
            timeout: 20000,
            forceNew: true
        });

        this.setupEventListeners(userRole);

        return new Promise((resolve, reject) => {
            this.socket.on('connect', () => {
                console.log('Connected to location socket');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                resolve();
            });

            this.socket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
                this.isConnected = false;
                reject(error);
            });
        });
    }

    setupEventListeners(userRole) {
        if (!this.socket) return;

        // Common events
        this.socket.on('disconnect', (reason) => {
            console.log('Disconnected from location socket:', reason);
            this.isConnected = false;

            if (reason === 'io server disconnect') {
                // Server disconnected, try to reconnect
                this.handleReconnection();
            }
        });

        this.socket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        // Role-specific events
        if (userRole === 'salesman') {
            this.setupSalesmanEvents();
        } else if (userRole === 'admin') {
            this.setupAdminEvents();
        }
    }

    setupSalesmanEvents() {
        this.socket.on('trackingToggled', (data) => {
            console.log('Tracking toggled:', data);

            // Dispatch custom event for the component
            window.dispatchEvent(new CustomEvent('trackingToggled', { detail: data }));

            if (data.enabled) {
                this.startLocationTracking(data.frequency || 30);
                this.showNotification(`Location tracking enabled by ${data.adminName}`, 'info');
            } else {
                this.stopLocationTracking();
                this.showNotification('Location tracking disabled', 'warning');
            }
        });

        this.socket.on('locationRequested', (data) => {
            console.log('Location requested by admin:', data);
            this.sendCurrentLocation();
        });

        this.socket.on('trackingDisabled', (data) => {
            console.log('Tracking disabled:', data);
            this.stopLocationTracking();
            this.showNotification(data.message, 'warning');
        });

        this.socket.on('locationUpdateAck', (data) => {
            console.log('Location update acknowledged:', data.success);
        });
    }

    setupAdminEvents() {
        this.socket.on('realtimeLocationUpdate', (data) => {
            console.log('Real-time location update received:', data);
            // Dispatch custom event for admin dashboard
            window.dispatchEvent(new CustomEvent('locationUpdate', { detail: data }));
        });

        this.socket.on('salesmanStatusUpdate', (data) => {
            console.log('Salesman status update:', data);
            window.dispatchEvent(new CustomEvent('salesmanStatusUpdate', { detail: data }));
        });

        this.socket.on('salesmanDisconnected', (data) => {
            console.log('Salesman disconnected:', data);
            window.dispatchEvent(new CustomEvent('salesmanDisconnected', { detail: data }));
        });

        this.socket.on('trackingToggleConfirm', (data) => {
            console.log('Tracking toggle confirmed:', data);
            window.dispatchEvent(new CustomEvent('trackingToggleConfirm', { detail: data }));
        });
    }

    startLocationTracking(frequency = 30) {
        if (!this.isConnected || !navigator.geolocation) {
            console.error('Cannot start location tracking: socket not connected or geolocation not available');
            return;
        }

        console.log('Starting location tracking with frequency:', frequency, 'seconds');

        // Stop existing tracking
        this.stopLocationTracking();

        const options = {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000
        };

        // Start watching position
        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                console.log('Got position from watchPosition:', position);
                this.sendLocationUpdate(position);
            },
            (error) => {
                console.error('Geolocation error:', error);
                this.handleGeolocationError(error);
            },
            options
        );

        // Set up interval for regular updates (backup to watchPosition)
        this.locationUpdateInterval = setInterval(() => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('Got position from interval:', position);
                    this.sendLocationUpdate(position);
                },
                (error) => {
                    console.error('Interval geolocation error:', error);
                },
                options
            );
        }, frequency * 1000);

        console.log(`Location tracking started with ${frequency}s interval`);
    }

    stopLocationTracking() {
        if (this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
            console.log('Stopped watching position');
        }

        if (this.locationUpdateInterval) {
            clearInterval(this.locationUpdateInterval);
            this.locationUpdateInterval = null;
            console.log('Cleared location update interval');
        }

        console.log('Location tracking stopped');
    }

    sendLocationUpdate(position) {
        if (!this.isConnected || !this.socket) {
            console.error('Cannot send location update: socket not connected');
            return;
        }

        const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            speed: position.coords.speed || 0,
            heading: position.coords.heading || 0,
            altitude: position.coords.altitude || 0,
            timestamp: new Date(position.timestamp)
        };

        console.log("Emitting locationUpdate event:", locationData);
        this.socket.emit('locationUpdate', locationData);
    }

    sendCurrentLocation() {
        if (!navigator.geolocation) {
            console.error('Geolocation not available');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('Sending current location:', position);
                this.sendLocationUpdate(position);
            },
            (error) => {
                console.error('Error getting current location:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 5000
            }
        );
    }

    sendStatusUpdate(status, battery = null, isActive = true) {
        if (!this.isConnected || !this.socket) {
            console.log('Cannot send status update: socket not connected');
            return;
        }

        const statusData = {
            status,
            battery,
            isActive,
            timestamp: new Date()
        };

        console.log('Sending status update:', statusData);
        this.socket.emit('statusUpdate', statusData);
    }

    requestSalesmanLocation(salesmanId) {
        if (!this.isConnected || !this.socket) return;

        console.log('Requesting location for salesman:', salesmanId);
        this.socket.emit('requestSalesmanLocation', {
            salesmanId,
            timestamp: new Date()
        });
    }

    toggleTracking(salesmanId, enabled) {
        if (!this.isConnected || !this.socket) return;

        console.log('Toggling tracking for salesman:', salesmanId, 'enabled:', enabled);
        this.socket.emit('toggleTracking', {
            salesmanId,
            enabled,
            timestamp: new Date()
        });
    }

    handleGeolocationError(error) {
        let message = 'Location access error';

        switch (error.code) {
            case error.PERMISSION_DENIED:
                message = 'Location access denied by user';
                break;
            case error.POSITION_UNAVAILABLE:
                message = 'Location information unavailable';
                break;
            case error.TIMEOUT:
                message = 'Location request timed out';
                break;
        }

        console.error('Geolocation error:', message);
        this.showNotification(message, 'error');
    }

    handleReconnection() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached');
            this.showNotification('Connection lost. Please refresh the page.', 'error');
            return;
        }

        this.reconnectAttempts++;
        const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff

        console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

        setTimeout(() => {
            if (this.socket) {
                this.socket.connect();
            }
        }, delay);
    }

    showNotification(message, type = 'info') {
        console.log('Notification:', message, type);
        // Dispatch custom event for notifications
        window.dispatchEvent(new CustomEvent('socketNotification', {
            detail: { message, type }
        }));
    }

    disconnect() {
        this.stopLocationTracking();

        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }

        this.isConnected = false;
        console.log('Socket service disconnected');
    }

    isSocketConnected() {
        return this.isConnected && this.socket && this.socket.connected;
    }
}

export default new SocketService();