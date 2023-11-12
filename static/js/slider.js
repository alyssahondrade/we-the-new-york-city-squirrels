function slider(metadata_data, activities_data, appearance_data, interactions_data) {
    let unique_day = _.uniq(_.map(metadata_data, 'day'));
    let unique_month = _.uniq(_.map(metadata_data, 'month'));
    let unique_year = _.uniq(_.map(metadata_data, 'year'));

    let all_dates = metadata_data.map(row => `${row.day}-${row.month}-${row.year}`);
    let unique_dates = _.uniq(all_dates);
    console.log(unique_dates);

    // Use filter to isolate the correct dates
    function filter_rows(data, dates) {
        return data.filter(item => {
            let date_string = `${item.day}-${item.month}-${item.year}`;
            return(dates.includes(date_string));
        });
    };

    let metadata_output = {};
    unique_dates.forEach(item => {
        metadata_output[item] = filter_rows(metadata_data, item);
    });

    let test_date = "8-10-2018";
    let squirrel_ids = metadata_output[test_date].map(row => row.squirrel_id);

    function filter_squirrels(data, squirrels) {
        return data.filter(row => squirrels.includes(row.squirrel_id));
    };
    
    console.log(squirrel_ids);
    let interactions_output = filter_squirrels(interactions_data, squirrel_ids);

    // NEED TO FILTER THE METADATA_OUTPUT FOR THE SQUIRREL_ID AND USE THAT!
    
    console.log(interactions_output);
    create_radar(metadata_output[test_date], interactions_output, "test_radar");

    console.log(metadata_output);
    
    let activity_by_date = {};
    // metadata_output.forEach(day => {
    //     squirrels_by_date[day] = filter_squirrels(activities_data, day.map(row => row.squirrel_id));
    // });

    for (let item in metadata_output) {
        console.log(item);
        activity_by_date[item] = filter_squirrels(activities_data, metadata_output[item].map(row => row.squirrel_id));
    };



    let output = [];
    for (let item in activity_by_date) {
        console.log(activity_by_date[item]);
        let total_counts = {};
        let one_day = activity_by_date[item];

        one_day.forEach((row) => {
            Object.keys(row).forEach((key) => {
                if (key !== "squirrel_id") {
                    if (!total_counts[key]) {
                        total_counts[key] = 0;
                    }
                    if (row[key]) {
                        console.log(row[key]);
                        total_counts[key] += row[key];
                    }
                }
            });
        });
        output.push(total_counts);
    };

    console.log(output);
    
    let labels = Object.keys(output[0]).map(label => _.capitalize(label));
    console.log("labels", labels);

    let output_arrays = output.map(obj => Object.values(obj));
    console.log(output_arrays);

    let pairs = unique_dates.map((date, index) => ({
        date: new Date(
            parseInt(date.split("-")[2]),
            parseInt(date.split("-")[1])-1,
            parseInt(date.split("-")[0])
        ),
        array: output_arrays[index]
    }));

    pairs.sort((a, b) => a.date - b.date);

    unique_dates = pairs.map(pair => pair.date.toLocaleDateString("en-GB"));
    output_arrays = pairs.map(pair => pair.array);

    let total_sightings = _.map(output_arrays, array => _.sum(array));
    
    // let violin_data = [{
    //     type: 'violin',
    //     x: unique_dates,
    //     y: output_arrays,
    //     points: 'none',
    //     box: {visible: true},
    //     line: {color: 'green'},
    //     meanline: {visible: true}
    // }];

    // Plotly.newPlot("test_violin", violin_data);


    // let testbar_data = [{
    //     x: unique_dates,
    //     y: output_arrays,
    //     type: 'bar',
    //     marker: {color: chroma.lab(80,-20,50).hex()}
    // }];

    //     let spring_trace = {
    //     r: r_spring,
    //     theta: formatted_interactions,
    //     fill: 'toself',
    //     name: "Spring",
    //     type: 'scatterpolar'
    // };

    let testbar_data = [{
        r: output_arrays[0],
        theta: labels,
        fill: 'toself',
        type: 'scatterpolar'
    }];

    // Use d3 to get the label
    // let slider_label = d3.select(".slider-label");
    // console.log("SLIDER LABEL", slider_label);
    
    let testbar_layout = {
        title: "Squirrel Activities",
        legend: {
            x: 0.7,
            y: 0.9
        },
        margin: {t: 120},
        polar: {
            radialaxis: {
                visible: true,
                // autorange: false
                range: [0, Math.max(...output_arrays.flat())]
            }
        },
        sliders: [{
            pad: {t: 30},
            currentvalue: {
                xanchor: "right",
                prefix: "Total Sightings: ",
                suffix: " sightings",
            },
            steps: unique_dates.map((date, index) => ({
                label: date,
                method: "animate",
                args: [
                    // "currentvalue.text", `${total_sightings[index]}`
                    // {"polar.r": [output_arrays[index]]}
                    // indices: [0],
                    // update: {r: [output_arrays[index]]}
                    
                    [date], {
                        mode: "immediate",
                        frame: {duration: 300, redraw: true},
                        transition: {duration: 300},
                    }
                ]
                // execute: function() {slider_label.text(`${total_sightings[index]}`)}
            }))
        }],
        updatemenus: [{
            type: "buttons",
            showactive: false,
            x: 0.8,
            y: 0,
            xanchor: "left",
            yanchor: "bottom",
            buttons: [{
                method: "animate",
                args: [
                    null, {
                        mode: "immediate",
                        fromcurrent: true,
                        frame: {duration: 300, redraw: true},
                        transition: {duration: 300}
                    }
                ]
            }]
        }]
    }
    // Hide the button
    testbar_layout.updatemenus = [];

    let testbar_frames = unique_dates.map((date, index) => ({
        name: date,
        data: [{
            r: output_arrays[index],
            theta: labels,
            fill: 'toself',
            type: 'scatterpolar'
        }]
    }))

    testbar_layout.frames = testbar_frames;
    
    // Create the plot
    Plotly.newPlot("test_violin", testbar_data, testbar_layout).then(graph_div => {
        Plotly.addFrames(graph_div, testbar_frames);
        // Plotly.animate(graph_div, unique_dates, {fromcurrent: true});
        // Plotly.animate(graph_div, unique_dates, {
        //     fromcurrent: true,
        //     step: (slider_step) => {
        //         const index = slider_step.frameIndex;
        //         graph_div.layout.sliders[0].currentvalue.text = `${total_sightings[index]}`;
        //     }
        // });
    });

    // document.getElementById("test_violin").on('plotly_sliderchange', function (eventdata) {
    //     // Get the current value of the slider
    //     let currentSliderValue = eventdata.active;
    //     console.log("slider value", currentSliderValue);
    
    //     // Now you can use currentSliderValue to update your text
    //     let totalSightingsDisplay = d3.select(".slider-label");
    //     totalSightingsDisplay.text("Total Sightings: " + currentSliderValue);
    // });

    // Listen for the relayout event
    document.getElementById("test_violin").on('plotly_sliderchange', function(eventdata) {
        // Check if the event contains xaxis.range[0]

        let current_step = eventdata.slider.active;
        console.log(eventdata, current_step);

        // let current_label = `${total_sightings[current_step]}`;
        // console.log(current_label);

        let slider_label = document.querySelector(".slider-label");
        

        // // Get the existing value of the data-unformatted attribute
        // let existingValue = slider_label.getAttribute("data-unformatted");
    
        // // Update the existing value with the new label
        // let updatedValue = existingValue.replace(/\d{2}\/\d{2}\/\d{4}/, current_label);
    
        // // Set the updated value back to the attribute
        // slider_label.setAttribute("data-unformatted", updatedValue);

        slider_label.textContent = `${total_sightings[current_step]}`;
        console.log(slider_label);
        // slider_label.text("Total Sightings: HERE");
    
        
        
    });

    
};