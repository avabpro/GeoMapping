// Using the all earthquakes for the past week
dataUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(dataUrl, function(data) {
	mapCode(data.features);
});

function mapCode(earthquakeData) {

	// Give each feature a popup describing the place and time of the earthquake
	function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
		"</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
		"</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }
	
	// Create a GeoJSON layer containing the features array on the earthquakeData object
	// Run the onEachFeature function once for each piece of data in the array
	var earthquakes = L.geoJSON(earthquakeData, {
		onEachFeature: onEachFeature,
		pointToLayer: function (feature, latlng) {
			var color;
			var r = Math.floor(0+255*feature.properties.mag);
			var greenScale = 50*(feature.properties.mag - 1);
			if (greenScale >= 200)
			{
				greenScale = 255;
			}
			var g = Math.floor(255-greenScale);
			var b = 0;
			color= "rgb("+r+" ,"+g+","+ b+")"
      
			var geojsonMarkerOptions = {
				radius: 7*feature.properties.mag,
				fillColor: color,
				color: "black",
				weight: 1,
				opacity: 1,
				fillOpacity: 0.8
			};
		
			return L.circleMarker(latlng, geojsonMarkerOptions);
		}
	});
  
	var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiZ2hhc3NhbjEwMCIsImEiOiJjam4yY3Jvemw0dWVzM2txY3RuY3NjZzkwIn0.YjVWkKdjq4YnDdsWz0qMeg"); 

	// Define a baseMaps object to hold our base layers
	var baseMaps = {
		"Street Map": streetmap
	};

	// Create overlay object to hold our overlay layer
	var overlayMaps = {
		Earthquakes: earthquakes
	};

	// Create our map, giving it the streetmap and earthquakes layers to display on load
	var myMap = L.map("map", {
		center: [
		37.09, -95.71
		],
		zoom: 5,
		layers: [streetmap, earthquakes]
	});

	L.esri.basemapLayer("Imagery").addTo(myMap);
	L.esri.basemapLayer('ImageryLabels').addTo(myMap);

	function getColor(d) {
		return d < 2 ? 'rgb(0,255,0)' :
            d < 3  ? 'rgb(255,255,0)' :
            d < 4  ? 'rgb(255,205,0)' :
            d < 5  ? 'rgb(255,155,0)' :
            d < 6  ? 'rgb(255,105,0)' :
					'rgb(255,0,0)';
	}

	// Create a legend to display information about our map
	var legend = L.control({position: 'bottomright'});

	legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend'),
		grades = [0, 1, 2, 3, 4, 5],
		labels = [];

		div.innerHTML+='Earthquake<br>Magnitude<br><hr>'
  
		// loop through our density intervals and generate a label with a colored square for each interval
		for (var i = 0; i < grades.length; i++) {
			div.innerHTML +=
			'<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
			grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
		}  
		return div;
	};
  
	legend.addTo(myMap);
}