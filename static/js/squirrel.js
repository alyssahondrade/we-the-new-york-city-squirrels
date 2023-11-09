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
const metadata_url = "http://127.0.0.1:5000/metadata";
const appearance_url = "http://127.0.0.1:5000/appearance";
const activities_url = "http://127.0.0.1:5000/activities";
const interactions_url = "http://127.0.0.1:5000/interactions";


function create_bar(metadata_data, activities_data) {
    console.log(activities_data);
    console.log(metadata_data);

    // Get the x-values
    console.log(Object.keys(activities_data[0]));
    let activities = Object.keys(activities_data[0]);
    let x_values = activities.slice(0, activities.length-1) // remove squirrel_id
    // console.log(x_values.length);

    // Define a list that will hold the y-values
    // let y_values = [];
    let default_value = 0;
    let y_values = Object.fromEntries(x_values.map(key => [key, default_value]));
    let spring_values = Object.fromEntries(x_values.map(key => [key, default_value])); // March
    let autumn_values = Object.fromEntries(x_values.map(key => [key, default_value])); // October
    

    console.log(y_values)

    // Get the y-values
    for (let i=0; i<activities_data.length; i++) {
        let sighting = activities_data[i];
        let month = metadata_data[i].month;
        
        let num_activities = Object.keys(sighting).length - 1;
        // console.log(sighting, Object.keys(sighting).length);
        
        // for (let j=0; j<x_values.length-1; j++) { // -1 to exclude squirrel_id
        for (let j=0; j<num_activities; j++) {
            // console.log(sighting[x_values[j]], x_values[j]);

            if (sighting[x_values[j]]) {
                y_values[x_values[j]] += 1
                if (month === 3) {
                    spring_values[x_values[j]] += 1
                }
                else if (month === 10) {
                    autumn_values[x_values[j]] += 1
                }
                
            }
            
        };
    };

    let sum_spring = Object.values(spring_values).reduce((accumulator, value) => {
        return accumulator + value;
    }, 0);

    let sum_autumn = Object.values(autumn_values).reduce((accumulator, value) => {
        return accumulator + value;
    }, 0);
    

    let y_spring = Object.values(spring_values).map(function(spring_val) {
       return Math.round(100 * spring_val / sum_spring);
    });
    
    let y_autumn = Object.values(autumn_values).map(function(autumn_val) {
        return Math.round(100 * autumn_val / sum_autumn);
    });
    
    console.log(y_values);
    console.log(spring_values);
    console.log(autumn_values);
    console.log(y_spring);
    console.log(y_autumn);
    console.log(sum_spring);
    console.log(sum_autumn);

    // Create the traces
    let spring_trace = {
        x: x_values,
        y: y_spring,
        type: 'bar',
        name: "Spring"
        // text: spring_values.map(String)
    };

    let autumn_trace = {
        x: x_values,
        y: y_autumn,
        type: 'bar',
        name: "Autumn"
    };

    let bar_data = [spring_trace, autumn_trace];

    let bar_layout = {
        title: "Squirrel Activity - Spring vs Autumn"
    };

    Plotly.newPlot("bar", bar_data, bar_layout);
};
























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
    primary_black_layer, primary_cinnamon_layer, primary_gray_layer,
    chasing_layer, climbing_layer, digging_layer, eating_layer,
    foraging_layer, running_layer, shouting_layer, sitting_layer
) {
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
        Primary_Gray: primary_gray_layer,
        Chasing: chasing_layer,
        Climbing: climbing_layer,
        Digging: digging_layer,
        Eating: eating_layer,
        Foraging: foraging_layer,
        Running: running_layer,
        Shouting: shouting_layer,
        Sitting: sitting_layer
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

function create_map_markers(metadata_data, appearance_data, activities_data) {
    // console.log(location_data)

    let autumn_markers = [];
    let spring_markers = [];
    let autumn_heatmarkers = [];
    let spring_heatmarkers = [];
    let heat_array = [];

    let primary_black = [];
    let primary_cinnamon = [];
    let primary_gray = [];

    let chasing = [];
    let climbing = [];
    let digging = [];
    let eating = [];
    let foraging = [];
    let running = [];
    let shouting = [];
    let sitting = [];
    
    for (let i=0; i<metadata_data.length; i++) {
        
        // console.log(activities_data[i]);
        
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

        //-------- ACTIVITIES --------//
        if (activities_data[i].chasing) {
            chasing.push(marker);
        }
        if (activities_data[i].climbing) {
            climbing.push(marker);
        }
        if (activities_data[i].digging) {
            digging.push(marker);
        }
        if (activities_data[i].eating) {
            eating.push(marker);
        }
        if (activities_data[i].foraging) {
            foraging.push(marker);
        }
        if (activities_data[i].running) {
            running.push(marker);
        }
        if (activities_data[i].shouting) {
            shouting.push(marker);
        }
        if (activities_data[i].sitting) {
            sitting.push(marker);
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

    let chasing_layer = L.layerGroup(chasing);
    let climbing_layer = L.layerGroup(climbing);
    let digging_layer = L.layerGroup(digging);
    let eating_layer = L.layerGroup(eating);
    let foraging_layer = L.layerGroup(foraging);
    let running_layer = L.layerGroup(running);
    let shouting_layer = L.layerGroup(shouting);
    let sitting_layer = L.layerGroup(sitting);
    
    create_map(
        autumn_layer, spring_layer,
        heat_layer, autumn_heat, spring_heat,
        primary_black_layer, primary_cinnamon_layer, primary_gray_layer,
        chasing_layer, climbing_layer, digging_layer, eating_layer,
        foraging_layer, running_layer, shouting_layer, sitting_layer
    );
};




// const url = "localhost:8000/locations";
console.log("HERE??");

d3.json(metadata_url).then(function(metadata_data) {
    d3.json(appearance_url).then(function(appearance_data) {
        d3.json(activities_url).then(function(activities_data) {
            d3.json(interactions_url).then(function(interactions_data) {
                // create_plots(location_data, appearance_data, activities_data, interactions_data);
                create_map_markers(metadata_data, appearance_data, activities_data);
                create_bar(metadata_data, activities_data);
            });
        });
    });
});

// let rawdata = require('static/data/locations.json');
// console.log(rawdata);