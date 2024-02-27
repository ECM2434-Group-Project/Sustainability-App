class GeoFencing:
    '''
    A class for creating and managing geofencing areas.

    Attributes:
        lat (float): Latitude of the center of the geofencing area.
        lon (float): Longitude of the center of the geofencing area.
        radius (float): Radius of the geofencing area in kilometers.
    '''

    def __init__(self, location, radius=None):
        '''
        Initializes a new GeoFencing instance.

        Parameters:
            location (LocationModel): The location to create a geofencing area around.
        '''
        self.lat = location.latitude
        self.lon = location.longitude
        self.radius = location.radius if radius is None else radius # some geofencing areas may want to override the default radius

    def distance(self, location):
        '''
        Calculate the great-circle distance between the geofencing center and a given point.

        Uses the Haversine formula to calculate the distance.

        Parameters:


        Returns:
            float: The distance in meters between the center of the geofenced center and the given point.
        '''
        from math import acos, sin, cos, radians

        # Convert latitude and longitude from degrees to radians
        lat1, lon1 = map(radians, [self.lat, self.lon])
        lat = location.latitude
        lon = location.longitude
        lat2, lon2 = map(radians, [lat, lon])

        return acos(sin(lat1) * sin(lat2) + cos(lat1) * cos(lat2) * cos(lon2 - lon1)) * 6371000 # 6371000 radius of the earth in meters

    def is_inside(self,location, accuracy=0):
        '''
        Determine whether a given point is inside the geofencing area.

        Parameters:
            location (LocationModel): The location to check if it is within the geofencing area.
            accuracy (float): Accuracy of the given point in meters.

        Returns:
            bool: True if the point is within the geofencing area, False otherwise.
        '''
        # calculate smallest possible distance user can be

        distance = self.distance(location)
        distance -= accuracy # accuracy is given in meters

        return distance <= self.radius

