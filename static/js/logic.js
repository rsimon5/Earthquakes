  // API key
const API_KEY = "pk.eyJ1IjoicnNpbW9uNSIsImEiOiJjanhobG9oYm0xOGg1NDBwNnJ3eW82aHZlIn0.KN1XnmELvovyMT_X8QCceA";


  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", function(data) {
    createFeatures(data.features);
});

function createFeatures(quakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<b>Place: </b>" + feature.properties.place +
      "<br/><b>Date: </b> " + new Date(feature.properties.time) + 
      "<br/><b>Magnitude: </b> " + feature.properties.mag);
  }

  var quakes = L.geoJSON(quakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      var color;
      var r = Math.floor(255-80*feature.properties.mag);
      var g = Math.floor(255-80*feature.properties.mag);
      var b = 255;
      color= "rgb("+r+" ,"+g+","+ b+")"
      
      var MarkerOptions = {
        radius: 4*feature.properties.mag,
        fillColor: color,
        color: color,
        weight: 1,
        opacity: .9,
        fillOpacity: 0.65
      };
      return L.circleMarker(latlng, MarkerOptions);
    }
  });

  createMap(quakes);  
}

function createMap(quakes) {

var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.outdoors",
  accessToken: API_KEY
});

var baseMaps = {
    Outdoors: outdoors
  };

  var overlayMaps = {
    Earthquakes: quakes
  };

  var myMap = L.map("map", {
    center: [
      37, -95
    ],
    zoom: 4.4,
    layers: [outdoors, quakes]
  });


  function getColor(color) {
      return color < 1 ? 'rgb(255,255,255)' :
            color < 2  ? 'rgb(225,225,255)' :
            color < 3  ? 'rgb(195,195,255)' :
            color < 4  ? 'rgb(165,165,255)' :
            color < 5  ? 'rgb(135,135,255)' :
            color < 6  ? 'rgb(105,105,255)' :
            color < 7  ? 'rgb(75,75,255)' :
            color < 8  ? 'rgb(45,45,255)' :
            color < 9  ? 'rgb(15,15,255)' :
                        'rgb(0,0,255)';
  }

  // Create legend 
  var legend = L.control({position: 'bottomleft'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5, 6, 7, 8],
      labels = [];

      div.innerHTML+='Magnitude<br><hr>'
  
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  
  return div;
  };
  
  legend.addTo(myMap);

}