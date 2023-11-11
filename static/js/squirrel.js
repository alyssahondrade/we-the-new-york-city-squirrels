// Define the URLs for the dataset
const metadata_url = "http://127.0.0.1:5000/metadata";
const appearance_url = "http://127.0.0.1:5000/appearance";
const activities_url = "http://127.0.0.1:5000/activities";
const interactions_url = "http://127.0.0.1:5000/interactions";

// Define the map parameters
let map_centre = [40.769361, -73.977655]; // Central Park. https://latitude.to/articles-by-country/us/united-states/605/central-park
let map_zoom = 11;



console.log("Testing HTML");



//---------------- DECLARE THE INITIAL MAP ----------------//
// Create the initial map
let my_map = L.map("interactive_map", {
    center: map_centre,
    zoom: map_zoom
});

// Create the street tile layer
let street_tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy;\
        <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>\
        contributors &copy;\
        <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(my_map);



//---------------- CREATE THE INTERACTIVE MAP ----------------//
function build_interactive_map(layer_array, layer_labels) {
    // Create the base maps object
    let base_maps = {
        Street: street_tiles
    };

    // Create overlay maps object
    let overlay_maps = {};
    for (let i=0; i<layer_array.length; i++) {
        let layer_name = layer_labels[i];
        let layer_value = layer_array[i];
        overlay_maps[layer_name] = layer_value;
    };

    // Remove map if it already exists
    if (my_map) {
        my_map.remove();
    };
    
    // Create the map
    my_map = L.map("interactive_map", {
        center: map_centre,
        zoom: map_zoom,
        layers: [street_tiles, layer_array[0]], // set the first overlay as default
        worldCopyJump: true
    });

    // Create the layer control and add to the map
    L.control.layers(base_maps, overlay_maps, {collapsed: false}).addTo(my_map);
};



//---------------- BUILD THE LAYER GROUPS FOR THE INTERACTIVE MAP ----------------//
function build_layer_groups(feature, dataset, metadata, appearance_data) {
    // Get the layer options per feature
    let layer_options = _.pull(Object.keys(dataset[0]), 'squirrel_id');

    if (feature === "appearance") {
        var unique_primary = _.uniq(_.map(appearance_data, 'primary_colour'));
        unique_primary.forEach(colour => layer_options.push(`${colour}`));
    };

    // Create an array for each layer item - push markers to
    let layer_arrays = {};
    layer_options.forEach(option => {
        // if (option != 'primary_colour') {
        //     layer_arrays[option] = [];
        // };
        layer_arrays[option] = [];
    });

    // Create a chroma.scale array
    let colour_scale = chroma.scale(chroma.brewer.Dark2).colors(layer_options.length);

    for (let i=0; i<metadata.length; i++) {
        let latitude = metadata[i].latitude;
        let longitude = metadata[i].longitude;
        let squirrel_id = metadata[i].squirrel_id;

        for (let j=0; j<Object.keys(layer_arrays).length; j++) {
            let item = Object.keys(layer_arrays)[j];
            console.log("ITEM IS: ", item);

            if (dataset[i][item]) {
                var marker = L.circleMarker([latitude, longitude], {
                    radius: 10,
                    fillColor: colour_scale[0],
                    fillOpacity: 0.5,
                    color: colour_scale[0],
                    weight: 1
                });
                
                // Adjust the marker colour
                marker.options.fillColor = colour_scale[j];
                marker.options.color = colour_scale[j];

                // Add bindPopup to marker
                marker.bindPopup(squirrel_id);

                // Add a click event listener to the marker
                marker.on("click", sighting_metadata(dataset, metadata, squirrel_id, appearance_data))
                
                // Push to the correct list
                if (item === "primary_colour") {
                    let colour_value = dataset[i].primary_colour;
                    
                    layer_arrays[colour_value].push(marker);

                    // Get the index of the colour in options
                    let colour_index = _.indexOf(layer_options, colour_value);
                    
                    // Adjust the marker colour
                    marker.options.fillColor = colour_scale[colour_index];
                    marker.options.color = colour_scale[colour_index];
                }
                else {
                    layer_arrays[item].push(marker);
                }
            };
        };
    };

    // Edit the layer arrays and options if "appearance"
    if (feature === "appearance") {
        layer_arrays = _.omit(layer_arrays, "primary_colour");
        layer_options = _.without(layer_options, "primary_colour");
        
        // Append "Highlight - " to the highlight colours
        let highlight_options = layer_options.slice(0,4).map(option => `Highlight - ${_.capitalize(option)}`);
        let primary_options = layer_options.slice(4,9).map(option => `Primary - ${option}`);

        // Recombine the layer_options
        layer_options = _.concat(highlight_options, primary_options);
    }
    else {
        // Capitalise each word for the dropdown option
        layer_options = layer_options.map(option => _.capitalize(option).replace("_", " "));
    }

    // Create a list of layer groups to pass as a single argument
    let function_params = [];
    for (let item of Object.values(layer_arrays)) {
        function_params.push(L.layerGroup(item));
    };

    // Call the function to build the interactive map
    build_interactive_map(function_params, layer_options);

};






//---------------- BUILD THE MARKERS FOR THE INTERACTIVE MAP ----------------//
function interactive_markers(metadata_data, activities_data, appearance_data, interactions_data) {
    // Get the unique activities
    let unique_activities = _.pull(Object.keys(activities_data[0]), 'squirrel_id');

    // Define the seasonal markers
    let spring_markers = [];
    let autumn_markers = [];
    let both_markers = [];

    //-------- DEFINE THE SEASONAL vs FEATURE DATASETS --------//
    // Define the seasonal vs feature datasets
    let season_feature = {};
    
    let seasons = ["spring", "autumn", "both"];
    let features = ["activities", "appearance", "interactions", "metadata"];

    // Build seasonal_feature
    seasons.forEach(season => {
        season_feature[season] = {};
        features.forEach(feature => {
            season_feature[season][feature] = [];
        });
    });

    // Populate seasonal_feature
    for (let i=0; i<metadata_data.length; i++) {
        for (let j=0; j<features.length; j++) {
            // Spring dataset
            if (metadata_data[i].month === 3) {
                // console.log(eval(`${features[j]}_data`)[i]);
                season_feature["spring"][features[j]].push(eval(`${features[j]}_data`)[i]);
            }
            // Autumn dataset
            else if (metadata_data[i].month === 10) {
                season_feature["autumn"][features[j]].push(eval(`${features[j]}_data`)[i]);
            }
            // All data
            season_feature["both"][features[j]].push(eval(`${features[j]}_data`)[i]);
        };
    };

    console.log(season_feature);
    
    for (let i=0; i<unique_activities.length; i++) {
        for (let j=0; j<metadata_data.length; j++) {
            let latitude = metadata_data[j].latitude;
            let longitude = metadata_data[j].longitude;
            let month = metadata_data[j].month;

            //-------- CREATE MARKER --------//
            let marker = L.circleMarker([latitude, longitude], {
                radius: 10
            });

            //-------- SEPARATE BY SEASON --------//
            if (metadata_data[j].month === 3) { // Spring
                spring_markers.push(marker);
            }
            else if (metadata_data[j].month === 10) { // Autumn
                autumn_markers.push(marker);
            }

            both_markers.push(marker);
        };
    };

    //-------- CREATE LAYERS --------//
    let spring_layer = L.layerGroup(spring_markers);
    let autumn_layer = L.layerGroup(autumn_markers);
    let both_layer = L.layerGroup(both_markers);

    //-------- CHECK USER SELECTION --------//
    let chosen_dataset;

    d3.selectAll("#data_options button").on("click", function() {
        let selected_button = d3.select(this);
        let dataset_type = selected_button.attr("id").replace("data_", "");
        // build_interactive_map(eval(`${dataset_type}_layer`));
        console.log(`${dataset_type} PUSHED`);
        chosen_dataset = dataset_type;

        // Remove the bootstrap "btn-primary"
        d3.selectAll("#data_options button").classed("btn-primary", false);

        // Reset the feature button to force user to select a feature
        d3.selectAll("#feature_options button").classed("btn-primary", false);

        // Reapply for clicked button only
        d3.select(this).classed("btn-primary", true);
    });

    let feature_options = ["activities", "appearance", "interactions"];
    let relevant_dataset = [activities_data, appearance_data, interactions_data];

    d3.selectAll("#feature_options button").on("click", function() {
        let selected_option = d3.select(this).attr('id');

        for (let i=0; i<feature_options.length; i++) {
            if (selected_option === feature_options[i]) {
                let chosen_feature = feature_options[i]

                build_layer_groups(
                    feature_options[i],
                    season_feature[chosen_dataset][chosen_feature],
                    season_feature[chosen_dataset]["metadata"],
                    season_feature[chosen_dataset]["appearance"]);
            };
        };
        // Remove the bootstrap "btn-primary"
        d3.selectAll("#feature_options button").classed("btn-primary", false);

        // Reapply for clicked button only
        d3.select(this).classed("btn-primary", true);
    });
};

















function create_testmap(
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
    let my_map = L.map("testmap", {
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

    console.log("sitting_layer", sitting_layer);
    
    create_testmap(
        autumn_layer, spring_layer,
        heat_layer, autumn_heat, spring_heat,
        primary_black_layer, primary_cinnamon_layer, primary_gray_layer,
        chasing_layer, climbing_layer, digging_layer, eating_layer,
        foraging_layer, running_layer, shouting_layer, sitting_layer
    );
};


d3.json(metadata_url).then(function(metadata_data) {
    d3.json(appearance_url).then(function(appearance_data) {
        d3.json(activities_url).then(function(activities_data) {
            d3.json(interactions_url).then(function(interactions_data) {
                // create_plots(location_data, appearance_data, activities_data, interactions_data);
                create_map_markers(metadata_data, appearance_data, activities_data);
                create_bar(metadata_data, activities_data);
                create_heatmap(metadata_data, appearance_data);
                create_pie(interactions_data);
                create_radar(metadata_data, interactions_data);
                interactive_markers(metadata_data, activities_data, appearance_data, interactions_data);
                sighting_metadata((metadata_data, activities_data, appearance_data, interactions_data));
            });
        });
    });
});