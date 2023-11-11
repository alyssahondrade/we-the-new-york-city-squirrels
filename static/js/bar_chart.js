//---------------- BUILD THE DATA FOR THE BAR CHART ----------------//
function databuild_bar(metadata_data, activities_data) {
    // Get the x-values
    let x_values = _.pull(Object.keys(activities_data[0]), 'squirrel_id');
    console.log("databuild_bar", x_values);
    let formatted_xvals = x_values.map(word => word[0].toUpperCase() + word.substring(1)); // capitalise each word

    // Define the objects that will hold the y-values
    let default_value = 0;
    let combined_values = Object.fromEntries(x_values.map(key => [key, default_value]));
    let spring_values = Object.fromEntries(x_values.map(key => [key, default_value])); // March / Spring
    let autumn_values = Object.fromEntries(x_values.map(key => [key, default_value])); // October / Autumn

    // Get the y-values
    for (let i=0; i<activities_data.length; i++) {
        let sighting = activities_data[i];
        let month = metadata_data[i].month;
        let num_activities = Object.keys(sighting).length - 1;

        // Loop through the different activities
        for (let j=0; j<num_activities; j++) {
            // Check if the sighting equivalent is true
            if (sighting[x_values[j]]) {
                // Increment the combined values
                combined_values[x_values[j]] += 1;

                // Increment spring_values if March / Spring
                if (month === 3) {
                    spring_values[x_values[j]] += 1;
                }
                // Increment autumn_values if October / Autumn
                else if (month === 10) {
                    autumn_values[x_values[j]] += 1;
                }
            }
        };
    };

    // Convert the y-values to a percentage of the season total
    let y_spring = percentRound(Object.values(spring_values));
    let y_autumn = percentRound(Object.values(autumn_values));

    return [formatted_xvals, y_spring, y_autumn];
};



//---------------- CREATE THE BAR CHART ----------------//
function create_bar(metadata_data, activities_data) {
    // Call the data build function
    let data = databuild_bar(metadata_data, activities_data);

    // Parse the results
    let formatted_xvals = data[0];
    let y_spring = data[1];
    let y_autumn = data[2];
    
    // Create the traces
    let spring_trace = {
        x: formatted_xvals,
        y: y_spring,
        type: 'bar',
        name: "Spring",
        marker: {color: chroma.lab(80,-20,50).hex()}
    };
    let autumn_trace = {
        x: formatted_xvals,
        y: y_autumn,
        type: 'bar',
        name: "Autumn",
        marker: {color: chroma.temperature(2000).hex()}
    };

    // Create a list of the traces
    let bar_data = [spring_trace, autumn_trace];

    // Define the plot layout
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

    // Create the plot
    Plotly.newPlot("bar", bar_data, bar_layout);
};