//---------------- BUILD THE DATA FOR THE RADAR PLOT ----------------//
function databuild_radar(metadata_data, interactions_data) {
    // Get the unique interactions    
    let unique_interactions = _.pull(Object.keys(interactions_data[0]), 'squirrel_id')

    // Capitalise each word and replace underscores with spaces
    let formatted_interactions = unique_interactions.map(word => _.capitalize(word).replace("_", " "));
    
    // Initialise objects to hold the values
    let default_value = 0;
    let spring_interactions = Object.fromEntries(unique_interactions.map(key => [key, default_value])); // March / Spring
    let autumn_interactions = Object.fromEntries(unique_interactions.map(key => [key, default_value])); // October / Autumn

    // Separate the interactions by month and type
    for (let i=0; i<unique_interactions.length; i++) {
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

    // Convert the y-values to a percentage of the season total
    let r_spring = percentRound(Object.values(spring_interactions));
    let r_autumn = percentRound(Object.values(autumn_interactions));

    return [formatted_interactions, r_spring, r_autumn];
};


//---------------- CREATE THE RADAR PLOT ----------------//
function create_radar(feature, metadata_data, interactions_data, plot_div) {
    // Call the data build function
    let data = databuild_radar(metadata_data, interactions_data);

    // Parse the results
    let formatted_interactions = data[0];
    let r_spring = data[1];
    let r_autumn = data[2];
    
    // Create the traces
    let spring_trace = {
        r: r_spring,
        theta: formatted_interactions,
        fill: 'toself',
        name: "Spring",
        type: 'scatterpolar'
    };
    let autumn_trace = {
        r: r_autumn,
        theta: formatted_interactions,
        fill: 'toself',
        name: "Autumn",
        type: 'scatterpolar'
    };
    
    // Define the plot layout
    let radar_layout = {
        title: `Squirrel Behaviour - ${_.capitalize(feature)}<br>(Percentage of Season Total)`,
        legend: {
            x: 1,
            y: 1
        },
        margin: {t: 120}
    };

    // Create a list of the traces based on selected dataset
    let checksum_autumn = _.sum(r_autumn);
    let checksum_spring = _.sum(r_spring);

    let radar_data;
    if (checksum_autumn === 0) { // Spring Dataset selected
        radar_data = [spring_trace];
        radar_layout.title = `Squirrel ${_.capitalize(feature)} - Spring<br>(Percentage of Season Total)`;
    }
    else if (checksum_spring === 0) { // Autumn Dataset selected
        radar_data = [autumn_trace];
        radar_layout.title = `Squirrel ${_.capitalize(feature)} - Autumn<br>(Percentage of Season Total)`;
    }
    else {
        radar_data = [spring_trace, autumn_trace];
    }   

    // Create the plot
    Plotly.newPlot(plot_div, radar_data, radar_layout);
};