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

    console.log(activity_by_date);

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

    let output_arrays = output.map(obj => Object.values(obj));
    console.log(output_arrays);


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


    let testbar_data = [{
        x: unique_dates,
        y: output_arrays,
        type: 'bar',
        marker: {color: chroma.lab(80,-20,50).hex()}
    }];


    // Create the plot
    Plotly.newPlot("testbar", testbar_data);
};