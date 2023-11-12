//---------------- BUILD THE DATA FOR THE HEAT MAP ----------------//
function databuild_heatmap(metadata_data, appearance_data) {
    // Get the unique highlights
    let unique_highlights = _.pull(Object.keys(appearance_data[0]), 'squirrel_id', 'primary_colour');

    // Get the primary colours
    let unique_primary = _.uniq(_.map(appearance_data, 'primary_colour'));
    
    // Define the objects that will hold the y-values
    let default_value = 0;
    let colourmap_values = [];
    
    for (let i=0; i<unique_primary.length; i++) {
        for (let j=0; j<unique_highlights.length; j++) {
            // Create an object that will hold the x, y, and value
            let combination = {};
            combination['x'] = unique_primary[i];
            combination['y'] = unique_highlights[j];
            combination['value'] = default_value;
            colourmap_values.push(combination);
        };
    };

    // Use a counter to account for squirrels with more than one highlight
    let multi_highlight = 0;

    for (let i=0; i<appearance_data.length; i++) {
        // Reset the counter for each sighting
        let count = 0;        
        for (let j=0; j<unique_highlights.length; j++) {
            let highlight_value = appearance_data[i][unique_highlights[j]];

            // Increment the counter for each highlight
            if (highlight_value === 1) {
                count += 1;
            };
        };

        //-------- SQUIRRELS WITH MORE THAN ONE HIGHLIGHT --------//
        if (count > 1) {
            console.log("More than one highlight");
        }
            
        //-------- SQUIRRELS WITH WITH ONLY ONE HIGHLIGHT --------//
        else {
            // Loop over the unique_primary, unique_highlights, and the colourmap_values
            for (let j=0; j<unique_primary.length; j++) {
                for (let k=0; k<unique_highlights.length; k++) {
                    for (let m=0; m<colourmap_values.length; m++) {

                        // Check multiple conditions to increment the correct value
                        if (colourmap_values[m].x === unique_primary[j] // match primary to the colourmap
                            && colourmap_values[m].y === unique_highlights[k] // match highlight to the colourmap
                            && appearance_data[i].primary_colour === unique_primary[j] // match the sighting to the primary
                           ) {
                            // Increment the value
                            if (appearance_data[i][unique_highlights[k]]) {
                                colourmap_values[m].value += 1;
                            };
                        };
                    };
                };
            };
        }
    };

    //-------- PARSE THE PARAMETERS FOR PLOTTING --------//
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

    // Define the values to use in the plot
    let colourmap_xval = unique_highlights;
    let colourmap_yval = Object.keys(condense_values);
    let colourmap_zval = Object.values(condense_values);
    console.log(colourmap_zval);

    // Capitalise the x-values
    let formatted_xvals = colourmap_xval.map(word => _.capitalize(word));

    return [formatted_xvals, colourmap_yval, colourmap_zval];
};

//---------------- CREATE THE HEAT MAP ----------------//
function create_heatmap(metadata_data, appearance_data, plot_div) {
    // Call the data build function
    let data = databuild_heatmap(metadata_data, appearance_data);

    // Parse the results
    let formatted_xvals = data[0];
    let colourmap_yval = data[1];
    let colourmap_zval = data[2];
    
    // Define the colour scale
    let colorscaleValue = [
        [0, "#7570b3"],
        [1, "#d95f02"]
    ];
    
    //-------- CREATE THE HEAT MAP --------//
    // Create the trace
    let heat_data = [{
        x: formatted_xvals,
        y: colourmap_yval,
        z: colourmap_zval,
        type: 'heatmap',
        colorscale: colorscaleValue
    }];

    // Define the plot layout
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

    // Create the plot
    Plotly.newPlot(plot_div, heat_data, heat_layout);
};