//---------------- BUILD THE METADATA BOX ----------------//
function sighting_metadata(dataset, metadata, squirrel_id, appearance_data) {
    // Need to return another function, otherwise called straight away
    return function() {
        console.log("MARKER HAS BEEN CLICKED", squirrel_id);

        // Use filter to find the correct squirrel_id
        function find_id(sighting) {
            return(sighting.squirrel_id === squirrel_id);
        };

        // Get the squirrel specifics
        let squirrel_metadata = metadata.filter(find_id)[0];
        let squirrel_appearance = appearance_data.filter(find_id)[0];

        // Get the squirrel highlights
        let highlight_options = _.pull(Object.keys(squirrel_appearance), 'squirrel_id', 'primary_colour');

        let squirrel_highlights = [];
        for (let i=0; i<highlight_options.length; i++) {
            if (squirrel_appearance[highlight_options[i]]) {
                squirrel_highlights.push(highlight_options[i])
            };
        };

        // Format the highlights list
        let formatted_highlights = squirrel_highlights.map(word => word[0].toUpperCase() + word.substring(1));

        // Update the table
        let info_id = d3.select("#meta_id").text(squirrel_id);
        
        let info_date = d3.select("#meta_date").text(
            `${squirrel_metadata.day}-${squirrel_metadata.month}-${squirrel_metadata.year}`);
        
        let info_coords = d3.select("#meta_coords").text(
            `[${squirrel_metadata.latitude.toFixed(6)}, ${squirrel_metadata.longitude.toFixed(6)}]`);
        
        let info_primary = d3.select("#meta_primary").text(`${squirrel_appearance.primary_colour}`);

        let info_highlights = d3.select("#meta_highlights").text(formatted_highlights.join(", "));
        console.log(info_highlights);
    };
    
};