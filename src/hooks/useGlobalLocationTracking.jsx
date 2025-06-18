import React, { useEffect, useState } from 'react'
import socketService from '../../src/services/socketService';
import locationService from '../../src/services/locationService';

const useGlobalLocationTracking = () => {
    const [trackingSettings, setTrackingSettings] = useState(null);
    const [locationPermission, setLocationPermission] = useState('prompt');
    const [isTracking, setIsTracking] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [batteryLevel, setBatteryLevel] = useState(null);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    console.log("trackingSettings", trackingSettings)
    // Check if user is salesman
    const getUserRole = () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return null;

            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.role;
        } catch (error) {
            console.error('Error getting user role:', error);
            return null;
        }
    };

    const addNotification = (message, type) => {
        const notification = {
            id: Date.now(),
            message,
            type,
            timestamp: new Date()
        };

        // Dispatch custom event for notifications
        window.dispatchEvent(new CustomEvent('globalNotification', {
            detail: notification
        }));

        console.log(`[Global Tracking] ${type.toUpperCase()}: ${message}`);
    };

    const initializeTracking = async () => {
        const userRole = getUserRole();

        if (userRole !== 'salesman') {
            console.log('[Global Tracking] User is not a salesman, skipping tracking initialization');
            return;
        }

        try {
            console.log('[Global Tracking] Initializing tracking system...');

            // Load tracking settings
            await loadTrackingSettings();

            // Check location permission
            await checkLocationPermission();

            // Initialize socket connection
            await initializeSocket();

            // Get battery info
            await getBatteryInfo();

            setIsInitialized(true);
            console.log('[Global Tracking] Tracking system initialized successfully');

        } catch (error) {
            console.error('[Global Tracking] Error initializing tracking:', error);
            addNotification('Failed to initialize location tracking', 'error');
        }
    };

    const initializeSocket = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('[Global Tracking] No token found, skipping socket connection');
                return;
            }

            const userRole = 'salesman';
            await socketService.connect(token, userRole);
            setIsSocketConnected(true);
            console.log('[Global Tracking] Socket connected successfully');

            // Auto-start tracking if conditions are met
            setTimeout(() => {
                autoStartTracking();
            }, 2000); // Give some time for settings to load

        } catch (error) {
            console.error('[Global Tracking] Failed to connect socket:', error);
            setIsSocketConnected(false);
            addNotification('Failed to connect to tracking service', 'error');
        }
    };

    const loadTrackingSettings = async () => {
        try {
            const response = await locationService.getMyTrackingSettings();
            setTrackingSettings(response.data);
            console.log('[Global Tracking] Settings loaded:', response.data);
        } catch (error) {
            console.error('[Global Tracking] Error loading settings:', error);
            // Don't show error notification for settings loading failure
        }
    };

    const checkLocationPermission = async () => {
        if (!navigator.geolocation) {
            setLocationPermission('unsupported');
            return;
        }

        try {
            const permission = await navigator.permissions.query({ name: 'geolocation' });
            setLocationPermission(permission.state);

            permission.addEventListener('change', () => {
                setLocationPermission(permission.state);
                console.log('[Global Tracking] Location permission changed:', permission.state);

                if (permission.state === 'granted') {
                    autoStartTracking();
                } else if (permission.state === 'denied') {
                    stopLocationTracking();
                }
            });
        } catch (error) {
            console.error('[Global Tracking] Error checking location permission:', error);
        }
    };

    const getBatteryInfo = async () => {
        try {
            if ('getBattery' in navigator) {
                const battery = await navigator.getBattery();
                setBatteryLevel(Math.round(battery.level * 100));

                battery.addEventListener('levelchange', () => {
                    setBatteryLevel(Math.round(battery.level * 100));
                });
            }
        } catch (error) {
            console.error('[Global Tracking] Error getting battery info:', error);
        }
    };

    const requestLocationPermission = async () => {
        if (!navigator.geolocation) {
            addNotification('Geolocation is not supported by this browser', 'error');
            return false;
        }

        try {
            return new Promise((resolve) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLocationPermission('granted');
                        setCurrentLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy
                        });
                        addNotification('Location permission granted', 'success');

                        // Update permissions on server
                        locationService.updateLocationPermissions({
                            locationGranted: true
                        }).catch(err => console.error('Error updating permissions:', err));

                        resolve(true);
                    },
                    (error) => {
                        setLocationPermission('denied');
                        addNotification('Location permission denied', 'error');

                        // Update permissions on server
                        locationService.updateLocationPermissions({
                            locationGranted: false
                        }).catch(err => console.error('Error updating permissions:', err));

                        resolve(false);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 60000
                    }
                );
            });
        } catch (error) {
            console.error('[Global Tracking] Error requesting location permission:', error);
            return false;
        }
    };

    const autoStartTracking = async () => {
        console.log('[Global Tracking] Attempting to auto-start tracking...');

        // Check all conditions
        if (!trackingSettings?.trackingEnabled) {
            console.log('[Global Tracking] Tracking disabled by admin');
            return;
        }

        if (!isSocketConnected) {
            console.log('[Global Tracking] Socket not connected');
            return;
        }

        if (isTracking) {
            console.log('[Global Tracking] Already tracking');
            return;
        }

        // Request permission if not granted
        if (locationPermission !== 'granted') {
            console.log('[Global Tracking] Requesting location permission...');
            const granted = await requestLocationPermission();
            if (!granted) {
                console.log('[Global Tracking] Permission not granted, cannot start tracking');
                return;
            }
        }

        // Start tracking
        startLocationTracking();
    };

    const startLocationTracking = () => {
        if (locationPermission !== 'granted') {
            console.log('[Global Tracking] Location permission required');
            return;
        }

        if (!isSocketConnected) {
            console.log('[Global Tracking] Socket not connected');
            return;
        }

        if (!trackingSettings?.trackingEnabled) {
            console.log('[Global Tracking] Tracking disabled by admin');
            return;
        }

        const frequency = trackingSettings?.trackingFrequency || 30;
        console.log('[Global Tracking] Starting location tracking with frequency:', frequency);

        socketService.startLocationTracking(frequency);
        setIsTracking(true);

        // Send status update
        socketService.sendStatusUpdate('tracking', batteryLevel, true);
        addNotification('Location tracking started automatically', 'success');
    };

    const stopLocationTracking = () => {
        console.log('[Global Tracking] Stopping location tracking');
        socketService.stopLocationTracking();
        setIsTracking(false);
        socketService.sendStatusUpdate('idle', batteryLevel, false);
        addNotification('Location tracking stopped', 'info');
    };

    // Initialize tracking when app loads
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && getUserRole() === 'salesman') {
            initializeTracking();
        }

        // Listen for socket events
        const handleTrackingToggled = (event) => {
            const data = event.detail;
            console.log('[Global Tracking] Tracking toggled by admin:', data);

            // Reload settings
            loadTrackingSettings();

            if (data.enabled) {
                addNotification(`Location tracking enabled by ${data.adminName}`, 'success');
                setTimeout(() => autoStartTracking(), 1000);
            } else {
                addNotification('Location tracking disabled by admin', 'warning');
                stopLocationTracking();
            }
        };

        const handleSocketNotification = (event) => {
            addNotification(event.detail.message, event.detail.type);
        };

        window.addEventListener('trackingToggled', handleTrackingToggled);
        window.addEventListener('socketNotification', handleSocketNotification);

        return () => {
            window.removeEventListener('trackingToggled', handleTrackingToggled);
            window.removeEventListener('socketNotification', handleSocketNotification);
        };
    }, []);

    // Auto-start tracking when conditions change
    useEffect(() => {
        if (isInitialized && trackingSettings?.trackingEnabled && locationPermission === 'granted' && isSocketConnected && !isTracking) {
            console.log('[Global Tracking] Conditions met, auto-starting tracking...');
            setTimeout(() => autoStartTracking(), 1000);
        }
    }, [isInitialized, trackingSettings?.trackingEnabled, locationPermission, isSocketConnected]);

    // Handle page visibility changes to maintain tracking in background
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                console.log('[Global Tracking] Page hidden, maintaining tracking in background');
            } else {
                console.log('[Global Tracking] Page visible, checking tracking status');
                if (trackingSettings?.trackingEnabled && locationPermission === 'granted' && isSocketConnected && !isTracking) {
                    setTimeout(() => autoStartTracking(), 1000);
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [trackingSettings?.trackingEnabled, locationPermission, isSocketConnected, isTracking]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (getUserRole() === 'salesman') {
                console.log('[Global Tracking] App unmounting, cleaning up...');
                socketService.disconnect();
            }
        };
    }, []);

    return {
        trackingSettings,
        locationPermission,
        isTracking,
        currentLocation,
        batteryLevel,
        isSocketConnected,
        isInitialized,
        startLocationTracking,
        stopLocationTracking,
        requestLocationPermission
    };
};

export default useGlobalLocationTracking
