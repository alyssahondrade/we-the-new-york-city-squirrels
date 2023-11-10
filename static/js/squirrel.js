// Define the URLs for the dataset
const metadata_url = "http://127.0.0.1:5000/metadata";
const appearance_url = "http://127.0.0.1:5000/appearance";
const activities_url = "http://127.0.0.1:5000/activities";
const interactions_url = "http://127.0.0.1:5000/interactions";


// Define the map parameters
// let map_centre = [40.730610, -73.935242]; // New York City. https://www.latlong.net/place/new-york-city-ny-usa-1848.html
let map_centre = [40.769361, -73.977655]; // Central Park. https://latitude.to/articles-by-country/us/united-states/605/central-park
let map_zoom = 11;

//-------- PIE CHART --------//
function create_pie(interactions_data) {
    
    // console.log(interactions_data); 
  
  // counts
    let indifferent_count = 0
    let approaches_count = 0
    let runsFrom_count = 0
    let watching_count = 0
  
    for (let i= 0; i < interactions_data.length; i++ ){
  
        let indifferents = interactions_data[i].indifferent;
        let approach = interactions_data[i].approaches;
        let runsFrom = interactions_data[i].runs_from;
        let watch = interactions_data[i].watching;
        
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
      "Indifferent": indifferent_count,
      "Approaches": approaches_count,
      "Runs from": runsFrom_count,
      "Watching": watching_count
    };
    // console.log(my_dict)
   
  // my data
    let data = [{
      values: [indifferent_count, approaches_count, runsFrom_count, watching_count],
      labels: ['Indifferent', 'Approaches', 'Runs from', 'Watching'],
      type: 'pie'
    }];
    // layout
    let layout = {
      height: 500,
      width: 900
    };
    
    // 
    Plotly.newPlot('pie_chart', data, layout);
  
  };

console.log("Testing HTML");

function create_bar(metadata_data, activities_data) {
    console.log(activities_data);
    console.log(metadata_data);

    // Get the x-values
    console.log(Object.keys(activities_data[0]));
    let activities = Object.keys(activities_data[0]);
    let x_values = activities.slice(0, activities.length-1) // remove squirrel_id
    let formatted_xvals = x_values.map(word => word[0].toUpperCase()+word.substring(1)); // capitalise each word
    // console.log(x_values.length);

    // Define lists that will hold the y-values
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
        x: formatted_xvals,
        y: y_spring,
        type: 'bar',
        name: "Spring",
        marker: {
            color: chroma.lab(80,-20,50).hex()
        }
    };

    let autumn_trace = {
        x: formatted_xvals,
        y: y_autumn,
        type: 'bar',
        name: "Autumn",
        marker: {
            color: chroma.temperature(2000).hex()
        }
    };

    let bar_data = [spring_trace, autumn_trace];

    let bar_layout = {
        title: "Squirrel Activity - Spring vs Autumn",
        xaxis: {
            title: {text: "Activity"},
            automargin: true
        },
        yaxis: {
            title: {text: "% of Season Total"},
            automargin: true
        }
    };

    Plotly.newPlot("bar", bar_data, bar_layout);
};



function create_colourmap(metadata_data, appearance_data) {
    console.log(appearance_data);
    console.log(metadata_data);
    
    
    
    // Get the unique highlights
    let remove_keys = function(arr, ...args) {
        return arr.filter(val => !args.includes(val) )
    };
    
    console.log(Object.keys(appearance_data[0]));
    let unique_highlights = remove_keys(Object.keys(appearance_data[0]), 'squirrel_id','primary_colour');

    console.log(unique_highlights);

    // Get the primary colours
    let unique_primary = [];
    for (let i=0; i<appearance_data.length; i++) {
        let primary = appearance_data[i].primary_colour;
        if (!unique_primary.includes(primary)) {
            unique_primary.push(primary);
        };
    };
    console.log("unique_primary", unique_primary);

    // Define lists that will hold the values
    let default_value = 0;


    // Create an object with each combination
    let colourmap_values = [];
    for (let i=0; i<unique_primary.length; i++) {
        for (let j=0; j<unique_highlights.length; j++) {
            
            console.log(unique_primary[i], unique_highlights[j]);

            let combination = {};
            combination['x'] = unique_primary[i];
            combination['y'] = unique_highlights[j];
            combination['value'] = default_value;
            colourmap_values.push(combination);
        };
    };

    console.log(colourmap_values);

    // QUESTION: how to account for squirrels with more than one highlight? Put in a separate visualisation?
    let multi_highlight = 0;

    for (let i=0; i<appearance_data.length; i++) {
        // console.log(appearance_data[i]);

        let count = 0;
        // console.log(Object.keys(highlight_values).length);
        
        for (let j=0; j<unique_highlights.length; j++) {
            // console.log(Object.keys(highlight_values)[j]);
            // console.log(appearance_data[i][Object.keys(highlight_values)[j]]);
            let highlight_value = appearance_data[i][unique_highlights[j]];

            // Use count to identify squirrels with more than one highlight
            if (highlight_value === 1) {
                count += 1;
            };
        };

        if (count > 1) {
            // console.log(appearance_data[i]);
            console.log("More than one highlight");
        }
        else {
            // Loop over the unique_primary
            for (let j=0; j<unique_primary.length; j++) {
                for (let k=0; k<unique_highlights.length; k++) {
                    for (let m=0; m<colourmap_values.length; m++) {
                        if (colourmap_values[m].x === unique_primary[j] // match primary to the colourmap
                            && colourmap_values[m].y === unique_highlights[k] // match highlight to the colourmap
                            && appearance_data[i].primary_colour === unique_primary[j] // match the sighting to the primary
                           ) {
                            if (appearance_data[i][unique_highlights[k]]) {
                                console.log("Here");
                                console.log(appearance_data[i], colourmap_values[m], unique_primary[j], unique_highlights[k]);
                                colourmap_values[m].value += 1;
                            };
                            
                            // console.log(appearance_data[i], colourmap_values[m], unique_primary[j], unique_highlights[k]);
                            // check the value of the primary_colour
                            // if (appearance_data[i][unique_primary[j]]) {}
                        };
                    };
                };
            };
        }
    };
    console.log(colourmap_values);

    // Flatten colourmap_values
    let condense_values = {};
    
    // Loop through each row of colourmap_values
    Object.values(colourmap_values).forEach(item => {
        // Get the x-value and the value at each row
        let key = item.x;
        let value = item.value;

        // While same x-value, push to that value
        if (condense_values[key]) {
            condense_values[key].push(value);
        }
        // Otherwise create a list with the value
        else {
            condense_values[key] = [value];
        };
    });
    
    let colourmap_zval = Object.values(condense_values);
    let colourmap_yval = Object.keys(condense_values);
    let colourmap_xval = unique_highlights;
    let formatted_xvals = colourmap_xval.map(word => word[0].toUpperCase()+word.substring(1)); // capitalise each word

    console.log(colourmap_zval, colourmap_yval, colourmap_xval);
    // // Loop through primary then check highlight
    // for (let i=0; i<appearance_data.length; i++) {
    //     for (let j=0; j<unique_primary.length; j++) {
    //         // Check the highlight colours
    //         for (let k=0; k<unique_highlights.length; k++) {
                
    //         };
    //     };
    // };

    // let colour_scale = chroma.scale([chroma.lab(80,-20,50).hex(), chroma.temperature(2000).hex()]).colours(5);

    var colorscaleValue = [
        // [0, chroma.lab(80,-20,50).hex()],
        // [1, chroma.temperature(2000).hex()]
        // [0, "#1b9e77"],
        [0, "#7570b3"],
        [1, "#d95f02"]
    ];
    let heat_data = [{
        z: colourmap_zval,
        x: formatted_xvals,
        y: colourmap_yval,
        type: 'heatmap',
        // colorscale: chroma.brewer.YlGnBu
        // colorscale: chroma.scale([chroma.lab(80,-20,50), chroma.temperature(2000)])
        // colorscale: chroma.scale('BuPu')
        // colorscale: chroma.scale(["peachpuff", "rebeccapurple"])
        colorscale: colorscaleValue
    }];

    let heat_layout = {
        title: "Primary vs (Single) Highlight Distribution",
        xaxis: {
            title: {
                text: "Highlight Colour"
            },
            automargin: true
        },
        yaxis: {
            title: {
                text: "Primary Colour",
                standoff: 10
            },
            automargin: true
        },
        margin: {t: 30}
    };
    Plotly.newPlot("colour_heatmap", heat_data, heat_layout);
};




function create_radar(metadata_data, interactions_data) {
    console.log(interactions_data);

    // Get the unique interactions
    let remove_keys = function(arr, ...args) {
        return arr.filter(val => !args.includes(val) )
    };
    
    let unique_interactions = remove_keys(Object.keys(interactions_data[0]), 'squirrel_id');
    console.log(unique_interactions);
    
    // Initialise objects to hold the values
    let default_value = 0;
    let spring_interactions = Object.fromEntries(unique_interactions.map(key => [key, default_value])); // March
    let autumn_interactions = Object.fromEntries(unique_interactions.map(key => [key, default_value])); // October
    
    for (let i=0; i<unique_interactions.length; i++) {
        // console.log(metadata_data[i].month);

        for (let j=0; j<interactions_data.length; j++) {
            if (interactions_data[j][unique_interactions[i]]) {
                if (metadata_data[j].month === 3) { // Spring
                    spring_interactions[unique_interactions[i]] += 1;
                }
                else if (metadata_data[j].month === 10) { // Autumn
                    autumn_interactions[unique_interactions[i]] += 1;
                }
            }
        };

        
    };

    console.log(spring_interactions, autumn_interactions);

    let sum_spring = Object.values(spring_interactions).reduce((accumulator, value) => {
        return accumulator + value;
    }, 0);

    let sum_autumn = Object.values(autumn_interactions).reduce((accumulator, value) => {
        return accumulator + value;
    }, 0);
    

    // import percentRound from "percent-round";
    
    // console.log(sum_spring, sum_autumn);
    // let r_spring = Object.values(spring_interactions).map(function(spring_val) {
    //     return Math.round(100 * spring_val / sum_spring);
    // });
    
    // let r_autumn = Object.values(autumn_interactions).map(function(autumn_val) {
    //     return Math.round(100 * autumn_val / sum_autumn);
    // });

    

    let r_spring = percentRound(Object.values(spring_interactions));
    let r_autumn = percentRound(Object.values(autumn_interactions));

    // console.log(typeof r_spring, r_autumn);

    let spring_trace = {
        r: r_spring,
        theta: unique_interactions,
        fill: 'toself',
        name: "Spring",
        type: 'scatterpolar'
    };

    let autumn_trace = {
        r: r_autumn,
        theta: unique_interactions,
        fill: 'toself',
        name: "Autumn",
        type: 'scatterpolar'
    };

    let radar_data = [spring_trace, autumn_trace];

    let radar_layout = {
        legend: {
            x: 0.7,
            y: 0.9
        },
    };

    Plotly.newPlot("interaction_radar", radar_data, radar_layout);
    
};



















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
                create_colourmap(metadata_data, appearance_data);
                create_pie(interactions_data);
                create_radar(metadata_data, interactions_data);
            });
        });
    });
});

// let rawdata = require('static/data/locations.json');
// console.log(rawdata);