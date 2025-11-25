/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
};
const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
};
/**
 * Check if a point is within a certain radius of another point
 */
export const isWithinRadius = (lat1, lon1, lat2, lon2, radiusKm) => {
    const distance = calculateDistance(lat1, lon1, lat2, lon2);
    return distance <= radiusKm;
};
/**
 * Get bounding box coordinates for a given point and radius
 * Used for efficient database queries
 */
export const getBoundingBox = (lat, lon, radiusKm) => {
    const latChange = radiusKm / 111; // 1 degree latitude ≈ 111 km
    const lonChange = radiusKm / (111 * Math.cos(toRadians(lat)));
    return {
        minLat: lat - latChange,
        maxLat: lat + latChange,
        minLon: lon - lonChange,
        maxLon: lon + lonChange,
    };
};
