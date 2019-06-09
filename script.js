"use strict";

// array to hold place name and coordinates
var placeSearch = [];
// array used as source for autocomplete search
var returnPlace = [];

// initialize map
var map = L.map('map', {
   center: [40.914722, -77.774722],
   zoom: 7   
});

// Open Street Map base map
var osm = L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a>'
}).addTo(map);

// URL to GeoJSON data for members (geoJson file path)
var geojsonData = './map.geojson';

// create members layer from GeoJSON and add to map
var pmgPlace = new L.GeoJSON.AJAX(geojsonData, {
    // A Function that will be called once for each created Feature, after it has been created and styled
    // see http://leafletjs.com/reference.html#geojson
    onEachFeature: function(feature, layer) {
        // add data about each place to an array
        placeSearch.push({
            // place will be used in the autocomplete search
            //here in Place we can enter the place name
            place: layer.feature.properties.Place,
            // coords will be used to zoom to each member when they are selected from search
            coords: L.latLng(layer.feature.geometry.coordinates[1], layer.feature.geometry.coordinates[0])
        });
    }            
}).addTo(map); 

// create source (array) for autocomplete search
// wrap array.push() within timeout function to compensate for time to load GeoJSON?
var createPlaceList = setTimeout(function() {
    for (var i=0; i < placeSearch.length; i++) {
        returnPlace.push(placeSearch[i]["place"]);
    }
    return returnPlace;
}, 5000);

// initialize jQuery UI autocomplete
// target #userSearch input element
// see https://api.jqueryui.com/autocomplete/
$("#placeSearch").autocomplete({
  autoFocus:true,
  minLength:2,   
  disabled: false,
  delay:300, // how long after a user types until text appears   
  source: returnPlace, // source for autocomplete (an array)
  select: function(event, ui) {
    // get member and zoom to selected member
    new function() {
      for (var i=0; i < placeSearch.length; i++) {
        if (ui.item.value === placeSearch[i]["place"]) {
            // store L.latLng object for selected member
            var coords = placeSearch[i]["coords"];
            // change map view to zoom to member if they are selected
            map.setView(coords, 15);
        } // end if                
      } // end for loop      
    }; // end new function
  } // end select
});

/* Prevent hitting enter from refreshing the page */
$("#userSearch").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});