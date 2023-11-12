function slider(metadata_data, activities_data, appearance_data, interactions_data) {
    let unique_day = _.uniq(_.map(metadata_data, 'day'));
    let unique_month = _.uniq(_.map(metadata_data, 'month'));
    let unique_year = _.uniq(_.map(metadata_data, 'year'));

    let all_dates = metadata_data.map(row => `${row.day}-${row.month}-${row.year}`);
    let unique_dates = _.uniq(all_dates);
    // console.log(unique_dates);

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
    
    // console.log(squirrel_ids);
    let interactions_output = filter_squirrels(interactions_data, squirrel_ids);

    // NEED TO FILTER THE METADATA_OUTPUT FOR THE SQUIRREL_ID AND USE THAT!
    
    // console.log(interactions_output);
    create_radar(metadata_output[test_date], interactions_output, "test_radar");

    // console.log(metadata_output);
    
    let activity_by_date = {};

    for (let item in metadata_output) {
        // console.log(item);
        activity_by_date[item] = filter_squirrels(activities_data, metadata_output[item].map(row => row.squirrel_id));
    };



    let output = [];
    for (let item in activity_by_date) {
        // console.log(activity_by_date[item]);
        let total_counts = {};
        let one_day = activity_by_date[item];

        one_day.forEach((row) => {
            Object.keys(row).forEach((key) => {
                if (key !== "squirrel_id") {
                    if (!total_counts[key]) {
                        total_counts[key] = 0;
                    }
                    if (row[key]) {
                        // console.log(row[key]);
                        total_counts[key] += row[key];
                    }
                }
            });
        });
        output.push(total_counts);
    };

    // console.log(output);
    
    let labels = Object.keys(output[0]).map(label => _.capitalize(label));
    // console.log("labels", labels);

    let output_arrays = output.map(obj => Object.values(obj));
    // console.log(output_arrays);

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


    let testbar_data = [{
        r: output_arrays[0],
        theta: labels,
        fill: 'toself',
        type: 'scatterpolar'
    }];
   
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
                range: [0, Math.max(...output_arrays.flat())]
            }
        },
        sliders: [{
            pad: {t: 30},
            currentvalue: {xanchor: "right"},
            steps: unique_dates.map((date, index) => ({
                label: date,
                method: "animate",
                args: [[date], {
                    mode: "immediate",
                    frame: {duration: 300, redraw: true},
                    transition: {duration: 300},
                }]
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
                args: [null, {
                    mode: "immediate",
                    fromcurrent: true,
                    frame: {duration: 300, redraw: true},
                    transition: {duration: 300}
                }]
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
            fill: "toself",
            type: 'scatterpolar'
        }]
    }))

    // Update "frames" with testbar_frames
    testbar_layout.frames = testbar_frames;
    
    // Create the plot
    Plotly.newPlot("test_violin", testbar_data, testbar_layout).then(graph_div => {
        Plotly.addFrames(graph_div, testbar_frames);
    });
    
};