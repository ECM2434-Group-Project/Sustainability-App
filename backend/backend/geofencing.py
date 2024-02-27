class GeoFencing:
    '''
    A class for creating and managing geofencing areas.

    Attributes:
        lat (float): Latitude of the center of the geofencing area.
        lon (float): Longitude of the center of the geofencing area.
        radius (float): Radius of the geofencing area in kilometers.
    '''

    def __init__(self, lat, lon, radius):
        '''
        Initializes a new GeoFencing instance.

        Parameters:
            lat (float): Latitude of the geofencing center.
            lon (float): Longitude of the geofencing center.
            radius (float): Radius of the geofencing area in kilometers.
        '''
        self.lat = lat
        self.lon = lon
        self.radius = radius

    def distance(self, lat, lon):
        '''
        Calculate the great-circle distance between the geofencing center and a given point.

        Uses the Haversine formula to calculate the distance.

        Parameters:
            lat (float): Latitude of the point to calculate distance to.
            lon (float): Longitude of the point to calculate distance to.

        Returns:
            float: The distance in kilometers between the center of the geofenced center and the given point.
        '''
        from math import acos, sin, cos, radians

        # Convert latitude and longitude from degrees to radians
        lat1, lon1 = map(radians, [self.lat, self.lon])
        lat2, lon2 = map(radians, [lat, lon])

        return acos(sin(lat1) * sin(lat2) + cos(lat1) * cos(lat2) * cos(lon2 - lon1)) * 6371

    def is_inside(self, lat, lon, accuracy=0):
        '''
        Determine whether a given point is inside the geofencing area.

        Parameters:
            lat (float): Latitude of the point to check.
            lon (float): Longitude of the point to check.
            accuracy (float): Accuracy of the given point in meters.

        Returns:
            bool: True if the point is within the geofencing area, False otherwise.
        '''
        # calculate smallest possible distance user can be
        distance = self.distance(lat, lon)
        distance -= accuracy/1000 # accuracy is given in meters

        return distance <= self.radius

