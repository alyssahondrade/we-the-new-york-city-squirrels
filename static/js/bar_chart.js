//---------------- BUILD THE DATA FOR THE BAR CHART ----------------//
function databuild_bar(metadata_data, activities_data) {
    // Get the x-values
    let x_values = _.pull(Object.keys(activities_data[0]), 'squirrel_id');
    let formatted_xvals = x_values.map(word => _.capitalize(word));

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

    // Sort the y-values depending on selected
    let checksum_autumn = _.sum(y_autumn);
    let checksum_spring = _.sum(y_spring);

    let combined;
    if (checksum_autumn === 0) {
        combined = y_spring.map((value, index) => ({
            value,
            formatted_xvals: formatted_xvals[index]
        }));
        
        combined.sort((a, b) => b.value - a.value);
        
        y_spring = combined.map(data => data.value);
        formatted_xvals = combined.map(data => data.formatted_xvals);
    }
    else if (checksum_spring === 0) {
        combined = y_autumn.map((value, index) => ({
            value,
            formatted_xvals: formatted_xvals[index]
        }));
        
        combined.sort((a, b) => b.value - a.value);
        
        y_autumn = combined.map(data => data.value);
        formatted_xvals = combined.map(data => data.formatted_xvals);
    }
    else {
        combined = y_spring.map((value, index) => ({
            value,
            formatted_xvals: formatted_xvals[index],
            y_autumn: y_autumn[index]
        }));
        
        combined.sort((a, b) => b.value - a.value);
        
        y_spring = combined.map(data => data.value);
        formatted_xvals = combined.map(data => data.formatted_xvals);
        y_autumn = combined.map(data => data.y_autumn);
    }

    return [formatted_xvals, y_spring, y_autumn];
};



//---------------- CREATE THE BAR CHART ----------------//
function create_bar(metadata_data, activities_data, plot_div) {
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
    
    // Create a list of the traces
    console.log("traces", y_spring, y_autumn);

    let checksum_autumn = _.sum(y_autumn);
    let checksum_spring = _.sum(y_spring);

    let bar_data;
    if (checksum_autumn === 0) {
        bar_data = [spring_trace];
        bar_layout.title = "Squirrel Activity - Spring";
    }
    else if (checksum_spring === 0) {
        bar_data = [autumn_trace];
        bar_layout.title = "Squirrel Activity - Autumn";
    }
    else {
        bar_data = [spring_trace, autumn_trace];
    }

    // let bar_data = [spring_trace, autumn_trace];



    // Create the plot
    Plotly.newPlot(plot_div, bar_data, bar_layout);
};