d3.json("interactions_url", function (behaviorData) { 
    
    console.log(behaviorData); 
  
  // counts
    let indifferent_count = 0
    let approaches_count = 0
    let runsFrom_count = 0
    let watching_count = 0
  
    for (let i= 0; i < behaviorData.length; i++ ){
  
        let indifferents = behaviorData[i].indifferent;
        let approach = behaviorData[i].approaches;
        let runsFrom = behaviorData[i].runs_from;
        let watch = behaviorData[i].watching;
        
        if(indifferents == 1){
            indifferent_count += 1
        }
        else if (approach == 1) {
            approaches_count += 1
        }
        else if (runsFrom == 1) {
            runsFrom_count += 1
        }
        else if (watch == 1) {
            watching_count += 1
        }
    }
  //}
  // diction
    let my_dict = {
      "Cinnamon": cinnamon_count,
      "Gray": gray_count
    };
    console.log(my_dict)
   
  // my data
    let data = [{
      values: [cinnamon_count, gray_count],
      labels: ['Cinnamon', 'Gray'],
      type: 'pie'
    }];
    // layout
    let layout = {
      height: 500,
      width: 900
    };
    
    // 
    Plotly.newPlot('pie_chart', data, layout);
  
  });

console.log("Testing HTML");

// Define the URLs for the dataset
const metadata_url = "http://127.0.0.1:5000/metadata";
const appearance_url = "http://127.0.0.1:5000/appearance";
const activities_url = "http://127.0.0.1:5000/activities";
const interactions_url = "http://127.0.0.1:5000/interactions";

// Define the map parameters
// let map_centre = [40.730610, -73.935242]; // New York City. https://www.latlong.net/place/new-york-city-ny-usa-1848.html
let map_centre = [40.769361, -73.977655]; // Central Park. https://latitude.to/articles-by-country/us/united-states/605/central-park
let map_zoom = 11;

function create_plots(metadata_data, appearance_data, activities_data, interactions_data) {
    console.log("I'm in the function");
    console.log(metadata_data);
    console.log(appearance_data);
    console.log(activities_data);
    console.log(interactions_data);
};

function create_map(
    autumn_layer, spring_layer,
    heat_layer, autumn_heat, spring_heat,
    primary_black_layer, primary_cinnamon_layer, primary_gray_layer) {
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
        Heat: heat_layer,
        Autumn: autumn_layer,
        Spring: spring_layer,
        Autumn_Heatmap: autumn_heat,
        Spring_Heatmap: spring_heat,
        Primary_Black: primary_black_layer,
        Primary_Cinnamon: primary_cinnamon_layer,
        Primary_Gray: primary_gray_layer
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

function create_map_markers(metadata_data, appearance_data) {
    // console.log(location_data)

    let autumn_markers = [];
    let spring_markers = [];
    let autumn_heatmarkers = [];
    let spring_heatmarkers = [];
    let heat_array = [];

    let primary_black = [];
    let primary_cinnamon = [];
    let primary_gray = [];
    
    for (let i=0; i<metadata_data.length; i++) {
        
        console.log(appearance_data[i]);
        
        let latitude = metadata_data[i].latitude
        let longitude = metadata_data[i].longitude
        let month = metadata_data[i].month

        let marker = L.circleMarker([latitude, longitude], {
            radius: 10
        });

        heat_array.push([latitude, longitude]);

        if (month === 10) {
            autumn_markers.push(marker);
            autumn_heatmarkers.push([latitude, longitude]);
        }
        else {
            spring_markers.push(marker);
            spring_heatmarkers.push([latitude, longitude]);
        }

        //-------- APPEARANCE DATA --------//
        let primary_colour = appearance_data[i].primary_colour
        
        if (primary_colour === "Black") {
            primary_black.push(marker);
        }
        else if (primary_colour === "Cinnamon") {
            primary_cinnamon.push(marker);
        }
        else if (primary_colour === "Gray") {
            primary_gray.push(marker);
        }
        
    };

    
    //-------- LAYERS --------//
    let autumn_layer = L.layerGroup(autumn_markers);
    let spring_layer = L.layerGroup(spring_markers);

    let heat_layer = L.heatLayer(heat_array, {
        radius: 10,
        blur: 5
    });
    
    let autumn_heat = L.heatLayer(autumn_heatmarkers, {
        radius: 10,
        blur: 5
    });
    let spring_heat = L.heatLayer(spring_heatmarkers, {
        radius: 10,
        blur: 5
    });

    let primary_black_layer = L.layerGroup(primary_black);
    let primary_cinnamon_layer = L.layerGroup(primary_cinnamon);
    let primary_gray_layer = L.layerGroup(primary_gray);
    
    create_map(
        autumn_layer, spring_layer,
        heat_layer, autumn_heat, spring_heat,
        primary_black_layer, primary_cinnamon_layer, primary_gray_layer);
};





// const url = "localhost:8000/locations";
console.log("HERE??");

d3.json(metadata_url).then(function(metadata_data) {
    d3.json(appearance_url).then(function(appearance_data) {
        d3.json(activities_url).then(function(activities_data) {
            d3.json(interactions_url).then(function(interactions_data) {
                // create_plots(location_data, appearance_data, activities_data, interactions_data);
                create_map_markers(metadata_data, appearance_data);
            });
        });
    });
});

// let rawdata = require('static/data/locations.json');
// console.log(rawdata);