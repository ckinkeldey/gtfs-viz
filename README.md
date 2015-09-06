# gtfs-viz
This is a small exercise using a GTFS dataset of public transportation in Mexico City.  
The idea was to show the reliability of planned trips, i.e., the probability that all transfers work as planned. For each transfer point, a reliability in percent is given that represents the probability of successful transfer. For each trip, the probabilities of all transfers are multiplied, i.e., if the planned trip requires two transfers with 80% reliability each, the overall reliability is 64%, because only if both transfers are successful, the whole trip works as planned.  
The idea could be especially useful when irregularities of one or more lines (e.g., caused by rail replacement service) affect other parts of the transport network. Routing information may be of limited value in those cases and reliability information could help to find better routes. 
 
*Since the effort for the estimation of the reliability from supplementary data would have been too much I generate random probabilities for the transfer points at each run to demonstrate the idea.*

![gtfs-viz](http://kinkeldey.com/ally/gtfs-viz.png)

## Usage
Start an OpenTripPlanner (OTP) server instance in the project directory:  
`java -Xmx2G -jar lib/otp-0.18.0.jar --build data/ --inMemory`  
(or change base url to a different server in `index.html`)

*I could not make the application available over the web because for that I would need a servlet container for OTP.*

Start local server in the project directory, e.g. using PHP:  
`php -S localhost:8000`  

Open browser and navigate to [http://localhost:8000](http://localhost:8000 "http://localhost:8000").

Two markers are placed randomly on the map and represent start and stop of a planned trip. Drag the markers to change start and stop. Retrieve reliability information from stops and trip lines by clicking on them.

## Technical background
The routing is done using [OpenTripPlanner](http://opentripplanner.org "OpenTripPlanner") 0.18.

[Leaflet](http://http://leafletjs.com "Leaflet") is used as map client.
[Leaflet label by Mapbox](https://www.mapbox.com/mapbox.js/example/v1.0.0/leaflet-label/ Leaflet label by Mapbox) is used for simple labeling.  
The basemap is [CartoDB base-dark](https://github.com/CartoDB/cartodb/wiki/BaseMaps-available "CartoDB base-dark")  
The color scheme for reliability is [5-class Spectral](http://colorbrewer2.org/?type=diverging&scheme=Spectral&n=5 "5-class Spectral") from [ColorBrewer](http://colorbrewer2.org "ColorBrewer")
	
## Limitations
This is a quick hack. I use random reliability values and the legend breaks are arbitrarily chosen.  
Nevertheless, the prototype is functional and can be used with other GTFS datasets as well.

In a 'real' project I would first setup a database (e.g., PostgreSQL/PostGIS) to be more flexible and performant with queries and put the data in. Next I would gather more public transit data from the same city, for example, the complete last year. I would analyze when (dates, weekdays, daytime) trips were not punctual and would generate probabilities for this to happen on different times of the day. From this, it would be possible to determine for specific itineraries how likely it is that the user misses a connection after a transfer (e.g., my vehicle is late and I miss the connection, or the connection departs early because of irregularities and I don't make it in time).  

In addition, I would use unit tests to secure and document the code.
