function slider(metadata_data, activities_data, appearance_data, interactions_data) {
    let unique_day = _.uniq(_.map(metadata_data, 'day'));
    let unique_month = _.uniq(_.map(metadata_data, 'month'));
    let unique_year = _.uniq(_.map(metadata_data, 'year'));

    let all_dates = metadata_data.map(row => `${row.day}-${row.month}-${row.year}`);
    let unique_dates = _.uniq(all_dates);

    function filter_rows(data, dates) {
        return data.filter(item => {
            let date_string = `${item.day}-${item.month}-${item.year}`;
            return dates.includes(date_string);
        });
    };

    let metadata_output = {};
    let interactions_output = {};
    unique_dates.forEach(item => {
        metadata_output[item] = filter_rows(metadata_data, item);
        interactions_output[item] = filter_rows(interactions_data, item);
    });

    // NEED TO FILTER THE METADATA_OUTPUT FOR THE SQUIRREL_ID AND USE THAT!
    
    console.log(metadata_output, interactions_output);
    // create_radar(metadata_output["20-10-2018"], interactions_output["20-10-2018"], "test_radar");
};