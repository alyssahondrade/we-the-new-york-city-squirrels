// d3.json("dcdfdsf", function (behaviorData) { 
    
//     console.log(behaviorData); 
  
//   // counts
//     var gray_count=0
//     var cinnamon_count=0
  
//     for (let i= 0; i < behaviorData.length; i++ ){
  
//         let primary_color = behaviorData[i].primary_fur_color;
//         let indifferents = behaviorData[i].indifferent;
        
//         if(indifferents=="True" && primary_color=="Cinnamon"){
//             cinnamon_count+=1
//         }
//         else if (indifferents=="True" && primary_color=="Gray") {
//             gray_count+=1
//             }
//     }
//   //}
//   // diction
//     let my_dict = {
//       "Cinnamon": cinnamon_count,
//       "Gray": gray_count
//     };
//     console.log(my_dict)
   
//   // my data
//     let data = [{
//       values: [cinnamon_count, gray_count],
//       labels: ['Cinnamon', 'Gray'],
//       type: 'pie'
//     }];
//     // layout
//     let layout = {
//       height: 500,
//       width: 900
//     };
    
//     // 
//     Plotly.newPlot('pie_chart', data, layout);
  
//   });

console.log("Testing HTML");

// Define the URLs for the dataset
const locations_url = "http://127.0.0.1:5000/locations";
const appearance_url = "http://127.0.0.1:5000/appearance";
const activities_url = "http://127.0.0.1:5000/activities";
const interactions_url = "http://127.0.0.1:5000/interactions";

// Define the map parameters
let map_centre = [40.730610, -73.935242]; // New York City. https://www.latlong.net/place/new-york-city-ny-usa-1848.html
let map_zoom = 11;

function create_plots(location_data, appearance_data, activities_data, interactions_data) {
    console.log("I'm in the function");
    console.log(location_data);
    console.log(appearance_data);
    console.log(activities_data);
    console.log(interactions_data);
};

function create_map(layer) {
    // Create the street tile layer
    let street_tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy;\
            <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>\
            contributors &copy;\
            <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    });

    // Create the base maps object
    let base_maps = {
        Street: street_tiles
    };

    // Create overlay maps object
    let overlay_maps = {
        TestLayer: layer
    };

    // Create the map
    let my_map = L.map("map", {
        center: map_centre,
        zoom: map_zoom,
        layers: [street_tiles],
        worldCopyJump: true
    });

    // Create the layer control and add to the map
    L.control.layers(base_maps, overlay_maps).addTo(my_map);
    
};

function create_map_markers(location_data) {
    // console.log(location_data)

    let location_markers = [];
    for (let i=0; i<location_data.length; i++) {
        console.log(location_data[i]);
        let latitude = location_data[i].latitude
        let longitude = location_data[i].longitude

        let marker = L.circleMarker([latitude, longitude], {
            radius: 10
        });

        location_markers.push(marker);
    };

    let markers_layer = L.layerGroup(location_markers);
    create_map(markers_layer);
};





// const url = "localhost:8000/locations";
console.log("HERE??");

d3.json(locations_url).then(function(location_data) {
    d3.json(appearance_url).then(function(appearance_data) {
        d3.json(activities_url).then(function(activities_data) {
            d3.json(interactions_url).then(function(interactions_data) {
                // create_plots(location_data, appearance_data, activities_data, interactions_data);
                create_map_markers(location_data);
            });
        });
    });
});

// let rawdata = require('static/data/locations.json');
// console.log(rawdata);