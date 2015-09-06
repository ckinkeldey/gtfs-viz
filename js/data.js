function getPlan(from, to, drawPlan) {
	return $.ajax(url + "plan", {
	    data: { fromPlace : from.toString(), toPlace : to.toString(),
	    	date:"09-06-2015"},            
	    dataType: 'JSON',
	    success: function(data) {
	    	if (data.plan !== undefined) {
	    		computeReliabilityInfo(data.plan);
		    	drawPlan(data.plan);
	    	}
	    }, error: function() {
	    	alert("Could not determine route!");
	    }
	});
}

// Compute overall reliability for an itinerary based on transfers
function getOverallReliability(itinerary) {
	var overall = 1.0;
	for (var i = 0; i < itinerary.legs.length; i++) {
		if (itinerary.legs[i].reliability !== undefined) {
			overall *= itinerary.legs[i].reliability;
		}
	}
	return overall;
}

function computeReliabilityInfo(plan) {
	reliability = [];
	$.each(plan.itineraries, function(i, itinerary) {
		if (i==0 || i==plan.itineraries.length-1)
		$.each(itinerary.legs, function(i, leg) {
			if (leg.mode === "WALK") {
				leg.reliability = 1.0 - 0.1*Math.random();
//				console.log("reliability = " + leg.reliability);
			}
		});
		var overallReliability = getOverallReliability(itinerary);
		 reliability.push(overallReliability);
		 console.log("route reliability = " + overallReliability);
	});
}

function decodePoints(encoded, precision) {
    precision = Math.pow(10, -precision);
    var len = encoded.length, index=0, lat=0, lng = 0, array = [];
    while (index < len) {
        var b, shift = 0, result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += dlat;
        shift = 0;
        result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lng += dlng;
        array.push( [lat * precision, lng * precision] );
    }
    return array;
}