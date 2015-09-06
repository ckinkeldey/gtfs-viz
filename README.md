# gtfs-viz
This is a small exercise using a GTFS dataset describing public transportation in Mexico City.  
The idea was to show the reliability of planned trips, i.e., the probability that all transfers work as planned. For each transfer point, a reliability in percent is given that represents the probability of successful transfer. For each trip, the probabilities of all transfers are multiplied, i.e., if the planned trip requires two transfers with 80% reliability each, overall reliability is 64%, because they depend on each other and only if both transfers are successful, the whole trip is successful.  
The idea could be especially useful when irregularities of one or more lines (e.g., casued by rail replacement service) affect other parts of the transport network. Routing information may be of limited value in those cases and reliability information could help to find better routes. 
 
*Since the effort for the estimation of reliability from supplementary data would have been too much I generate random probabilities for the transfer points to demonstrate the idea.*


## Usage
Start an OpenTripPlanner server instance in the project directory:  
`java -Xmx2G -jar lib/otp-0.18.0.jar --build data/ --inMemory`  
(or change base url in `index.html`)

Start local server in the project directory, e.g. using PHP:  
`php -S localhost:8000`  

Open browser and navigate to [http://localhost:8000](http://localhost:8000 "http://localhost:8000").

Two markers are placed randomly on the map and represent start and stop of a planned trip. Drag the markers to change start and stop.
	
## Limitations
This is a quick hack. The relaibility values are random and the legend values are arbitrarily chosen.  
Nevertheless, the prototype is functional and not restricted to the Mexico City dataset.

In a 'real' project I would first setup a database (e.g., PostgreSQL/PostGIS) to be more flexible and performant with queries and put the data in. Next I would gather more public transit data from the same city, for example, the complete last year. I would analyse when (dates, weekdays, daytime) trips were not punctual and would generate probabilities for different times of the day. From this, it would be possible for a specific itinerary, to determine how likely it is that I miss a connection after a transfer (e.g., my vehicle is late and I miss the connection, or the connection departs early (because of irregularities) and I don't make it).  

## Technical background
The routing is done using [OpenTripPlanner](http://opentripplanner.org "OpenTripPlanner") 0.18.

[Leaflet](http://http://leafletjs.com "Leaflet") is used as map client.
[Leaflet label by Mapbox](https://www.mapbox.com/mapbox.js/example/v1.0.0/leaflet-label/ Leaflet label by Mapbox) is used for simple labeling.  
The basemap is [CartoDB base-dark](https://github.com/CartoDB/cartodb/wiki/BaseMaps-available "CartoDB base-dark")  
The color scheme for reliability is [5-class Spectral](http://colorbrewer2.org/?type=diverging&scheme=Spectral&n=5 "5-class Spectral") from [ColorBrewer](http://colorbrewer2.org "ColorBrewer")
