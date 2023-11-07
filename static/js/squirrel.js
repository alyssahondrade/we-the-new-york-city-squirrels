// d3.json("dcdfdsf", function (behaviorData) { 
    
//     console.log(behaviorData); 
  
//   // counts
//     var gray_count=0
//     var cinnamon_count=0
  
//     for (let i= 0; i < behaviorData.length; i++ ){
  
//         let primary_color = behaviorData[i].primary_fur_color;
//         let indifferents = behaviorData[i].indifferent;
        
//         if(indifferents=="True" && primary_color=="Cinnamon"){
//             cinnamon_count+=1
//         }
//         else if (indifferents=="True" && primary_color=="Gray") {
//             gray_count+=1
//             }
//     }
//   //}
//   // diction
//     let my_dict = {
//       "Cinnamon": cinnamon_count,
//       "Gray": gray_count
//     };
//     console.log(my_dict)
   
//   // my data
//     let data = [{
//       values: [cinnamon_count, gray_count],
//       labels: ['Cinnamon', 'Gray'],
//       type: 'pie'
//     }];
//     // layout
//     let layout = {
//       height: 500,
//       width: 900
//     };
    
//     // 
//     Plotly.newPlot('pie_chart', data, layout);
  
//   });

console.log("Testing HTML");

const locations_url = "http://127.0.0.1:5000/locations";
const appearance_url = "http://127.0.0.1:5000/appearance";
const activities_url = "http://127.0.0.1:5000/activities";
const interactions_url = "http://127.0.0.1:5000/interactions";


function create_plots(location_data, appearance_data, activities_data, interactions_data) {
    console.log("I'm in the function");
    console.log(location_data);
    console.log(appearance_data);
    console.log(activities_data);
    console.log(interactions_data);
};







// const url = "localhost:8000/locations";
console.log("HERE??");

d3.json(locations_url).then(function(location_data) {
    d3.json(appearance_url).then(function(appearance_data) {
        d3.json(activities_url).then(function(activities_data) {
            d3.json(interactions_url).then(function(interactions_data) {
                create_plots(location_data, appearance_data, activities_data, interactions_data);
            });
        });
    });
});

// let rawdata = require('static/data/locations.json');
// console.log(rawdata);