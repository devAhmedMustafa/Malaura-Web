'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import styles from './GoogleMap.module.css';

declare global {
  interface Window {
    initGoogleMap?: () => void;
  }
}

// Google Maps types
type GoogleMap = google.maps.Map;
type GoogleMarker = google.maps.Marker;
type GoogleGeocoder = google.maps.Geocoder;
type GoogleMapMouseEvent = google.maps.MapMouseEvent;

interface GoogleMapProps {
  onLocationSelect: (location: {
    address: string;
    latitude: number;
    longitude: number;
  }) => void;
  initialLocation?: {
    latitude: number;
    longitude: number;
  };
  className?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  onLocationSelect,
  initialLocation,
  className = ''
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<GoogleMap | null>(null);
  const markerRef = useRef<GoogleMarker | null>(null);
  const geocoderRef = useRef<GoogleGeocoder | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const initializationRef = useRef<boolean>(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentAddress, setCurrentAddress] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [autoLocationFetched, setAutoLocationFetched] = useState(false);

  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Initialize Google Maps
  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.google || initializationRef.current) return;
    
    initializationRef.current = true;

    try {
      // Default location (Cairo, Egypt)
      const defaultLocation = { lat: 30.0444, lng: 31.2357 };
      const initialPos = initialLocation 
        ? { lat: initialLocation.latitude, lng: initialLocation.longitude }
        : defaultLocation;

      // Create map with enhanced styling
      const map = new google.maps.Map(mapRef.current, {
        center: initialPos,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#f5f1e8' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#c9c9c9' }]
          }
        ]
      });

      mapInstanceRef.current = map;

      // Create marker with custom styling
      const marker = new google.maps.Marker({
        position: initialPos,
        map: map,
        draggable: true,
        title: 'Delivery Location',
        animation: google.maps.Animation.DROP,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5S14.5 7.62 14.5 9S13.38 11.5 12 11.5Z" fill="#FF6B35"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 32)
        }
      });

      markerRef.current = marker;

      // Create geocoder
      geocoderRef.current = new google.maps.Geocoder();

      // Initialize Places Service for search (safer than DOM replacement)
      if (searchInputRef.current) {
        try {
          // Use Places Service with the input for autocomplete suggestions
          const placesService = new google.maps.places.PlacesService(map);
          
          // Add input event listener for manual search
          let searchTimeout: NodeJS.Timeout;
          
          const handleSearch = (query: string) => {
            if (!query || query.length < 3) return;
            
            const request = {
              query: query,
              fields: ['name', 'geometry', 'formatted_address'],
              locationBias: map.getBounds(),
            };
            
            placesService.textSearch(request, (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
                const place = results[0];
                if (place.geometry && place.geometry.location) {
                  const location = place.geometry.location;
                  const newPos = { lat: location.lat(), lng: location.lng() };
                  
                  map.setCenter(newPos);
                  map.setZoom(17);
                  marker.setPosition(newPos);
                  
                  const address = place.formatted_address || place.name || '';
                  setCurrentAddress(address);
                  onLocationSelect({
                    address,
                    latitude: location.lat(),
                    longitude: location.lng()
                  });
                }
              }
            });
          };
          
          searchInputRef.current.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const target = e.target as HTMLInputElement;
            searchTimeout = setTimeout(() => handleSearch(target.value), 500);
          });
          
          searchInputRef.current.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
              clearTimeout(searchTimeout);
              const target = e.target as HTMLInputElement;
              handleSearch(target.value);
            }
          });
          
        } catch (error) {
          console.log('Places Service not available:', error);
        }
      }

      // Handle marker drag
      marker.addListener('dragend', () => {
        const position = marker.getPosition();
        if (position && geocoderRef.current) {
          const lat = position.lat();
          const lng = position.lng();
          
          // Reverse geocoding to get address
          geocoderRef.current.geocode(
            { location: { lat, lng } },
            (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
              if (status === 'OK' && results && results[0]) {
                const address = results[0].formatted_address;
                setCurrentAddress(address);
                onLocationSelect({
                  address,
                  latitude: lat,
                  longitude: lng
                });
              }
            }
          );
        }
      });

      // Handle map click
      map.addListener('click', (event: GoogleMapMouseEvent) => {
        if (event.latLng) {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          
          marker.setPosition({ lat, lng });
          
          if (geocoderRef.current) {
            geocoderRef.current.geocode(
              { location: { lat, lng } },
              (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
                if (status === 'OK' && results && results[0]) {
                  const address = results[0].formatted_address;
                  setCurrentAddress(address);
                  onLocationSelect({
                    address,
                    latitude: lat,
                    longitude: lng
                  });
                }
              }
            );
          }
        }
      });

      // If initial location is provided, get its address
      if (initialLocation && geocoderRef.current) {
        geocoderRef.current.geocode(
          { location: { lat: initialPos.lat, lng: initialPos.lng } },
          (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
            if (status === 'OK' && results && results[0]) {
              const address = results[0].formatted_address;
              setCurrentAddress(address);
              onLocationSelect({
                address,
                latitude: initialPos.lat,
                longitude: initialPos.lng
              });
            }
          }
        );
      } else if (!autoLocationFetched) {
        // Auto-fetch current location if no initial location provided
        autoFetchCurrentLocation();
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
      setIsLoading(false);
    }
  }, [initialLocation, onLocationSelect]);

  // Load Google Maps script
  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      setError('Google Maps API key is not configured');
      setIsLoading(false);
      return;
    }

    const loadGoogleMaps = () => {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      // Check if script is already loading/loaded
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (existingScript) {
        // Script already exists, wait for it to load
        if (window.google && window.google.maps) {
          initializeMap();
        } else {
          // Wait for existing script to complete
          existingScript.addEventListener('load', initializeMap);
        }
        return;
      }

      // Set up callback
      window.initGoogleMap = initializeMap;

      // Load Google Maps script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMap`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        setError('Failed to load Google Maps');
        setIsLoading(false);
      };

      document.head.appendChild(script);
    };

    loadGoogleMaps();

    // Cleanup
    return () => {
      initializationRef.current = false;
      if (window.initGoogleMap) {
        window.initGoogleMap = undefined;
      }
    };
  }, [GOOGLE_MAPS_API_KEY]);

  // Auto-fetch current location silently
  const autoFetchCurrentLocation = () => {
    if (!navigator.geolocation || autoLocationFetched) {
      return;
    }

    setAutoLocationFetched(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        if (mapInstanceRef.current && markerRef.current) {
          const newPos = { lat: latitude, lng: longitude };
          
          // Smoothly animate to user's location
          mapInstanceRef.current.panTo(newPos);
          mapInstanceRef.current.setZoom(16);
          markerRef.current.setPosition(newPos);
          
          // Get address for current location
          if (geocoderRef.current) {
            geocoderRef.current.geocode(
              { location: newPos },
              (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
                if (status === 'OK' && results && results[0]) {
                  const address = results[0].formatted_address;
                  setCurrentAddress(address);
                  onLocationSelect({
                    address,
                    latitude,
                    longitude
                  });
                }
              }
            );
          }
        }
      },
      (error) => {
        console.log('Auto-location failed (this is normal):', error);
        // Silently fail - user can manually select location
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        if (mapInstanceRef.current && markerRef.current) {
          const newPos = { lat: latitude, lng: longitude };
          
          mapInstanceRef.current.setCenter(newPos);
          mapInstanceRef.current.setZoom(17);
          markerRef.current.setPosition(newPos);
          
          // Get address for current location
          if (geocoderRef.current) {
            geocoderRef.current.geocode(
              { location: newPos },
              (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
                if (status === 'OK' && results && results[0]) {
                  const address = results[0].formatted_address;
                  setCurrentAddress(address);
                  onLocationSelect({
                    address,
                    latitude,
                    longitude
                  });
                }
                setIsGettingLocation(false);
              }
            );
          } else {
            setIsGettingLocation(false);
          }
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        setError('Unable to get your current location');
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  if (error) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className={styles.error}>
          <Icon icon="mdi:alert-circle" className={styles.errorIcon} />
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className={styles.retryButton}
          >
            <Icon icon="mdi:refresh" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Search Input */}
      <div className={styles.searchContainer}>
        <Icon icon="mdi:magnify" className={styles.searchIcon} />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Type to search for an address..."
          className={styles.searchInput}
          autoComplete="off"
        />
        <button
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className={styles.locationButton}
          title="Get current location"
        >
          {isGettingLocation ? (
            <Icon icon="mdi:loading" className={styles.loadingIcon} />
          ) : (
            <Icon icon="mdi:crosshairs-gps" />
          )}
        </button>
      </div>

      {/* Map Container */}
      <div className={styles.mapContainer}>
        {isLoading && (
          <div className={styles.mapLoading}>
            <div className={styles.mapLoadingSpinner}></div>
            <p>Loading interactive map...</p>
            <small>We're preparing your location selector</small>
          </div>
        )}
        <div
          ref={mapRef}
          className={styles.map}
          style={{ display: isLoading ? 'none' : 'block' }}
        />
      </div>

      {/* Selected Address Display */}
      {currentAddress && (
        <div className={styles.addressDisplay}>
          <Icon icon="mdi:map-marker" className={styles.addressIcon} />
          <div className={styles.addressText}>
            <strong>Selected Location:</strong>
            <p>{currentAddress}</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className={styles.instructions}>
        <p>
          <Icon icon="mdi:information" />
          {currentAddress 
            ? "Perfect! You can adjust the marker if needed or search for a different address"
            : "Click on the map, drag the marker, or search for your delivery address"
          }
        </p>
      </div>
    </div>
  );
};

export default GoogleMap;