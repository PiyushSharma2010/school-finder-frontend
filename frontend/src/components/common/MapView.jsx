import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';

// Fix for default marker icon issues in React Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Component to recenter map when location changes
function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

const MapView = ({ schools, height = '400px' }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default center (India)
    const [zoom, setZoom] = useState(5);
    const navigate = useNavigate();

    // Get User Location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);
                    setMapCenter([latitude, longitude]);
                    setZoom(12);
                },
                (error) => {
                    console.error("Error fetching location:", error);
                    // Standard fallback is already set
                }
            );
        }
    }, []);

    // Filter schools that have valid location data
    const validSchools = schools?.filter(
        school => school.location &&
            school.location.coordinates &&
            school.location.coordinates.length === 2
    ) || [];

    return (
        <div style={{ height: height, width: '100%', borderRadius: '12px', overflow: 'hidden', zIndex: 0 }}>
            <MapContainer
                center={mapCenter}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <ChangeView center={mapCenter} zoom={zoom} />

                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* User Location Marker */}
                {userLocation && (
                    <Marker position={userLocation}>
                        <Popup>
                            <b>You are here</b>
                        </Popup>
                    </Marker>
                )}

                {/* School Markers */}
                {validSchools.map(school => (
                    <Marker
                        key={school._id}
                        position={[school.location.coordinates[1], school.location.coordinates[0]]}
                    >
                        <Popup>
                            <div style={{ textAlign: 'center' }}>
                                <h3 style={{ margin: '0 0 5px', fontSize: '16px' }}>{school.name}</h3>
                                <p style={{ margin: '0 0 5px', fontSize: '13px' }}>{school.city}</p>
                                <button
                                    onClick={() => navigate(`/school/${school.slug}`)}
                                    style={{
                                        backgroundColor: 'var(--primary)',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '5px 10px',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontSize: '12px'
                                    }}
                                >
                                    View Details
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapView;
