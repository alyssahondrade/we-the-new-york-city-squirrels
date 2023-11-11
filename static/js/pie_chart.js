//-------- PIE CHART --------//
function create_pie(interactions_data) {
    
    // console.log(interactions_data); 
  
  // counts
    let indifferent_count = 0
    let approaches_count = 0
    let runsFrom_count = 0
    let watching_count = 0
  
    for (let i= 0; i < interactions_data.length; i++ ){
  
        let indifferents = interactions_data[i].indifferent;
        let approach = interactions_data[i].approaches;
        let runsFrom = interactions_data[i].runs_from;
        let watch = interactions_data[i].watching;
        
        if(indifferents == 1){
            indifferent_count += 1
        }
        else if (approach == 1) {
            approaches_count += 1
        }
        else if (runsFrom == 1) {
            runsFrom_count += 1
        }
        else if (watch == 1) {
            watching_count += 1
        }
    }
  //}
  // diction
    let my_dict = {
      "Indifferent": indifferent_count,
      "Approaches": approaches_count,
      "Runs from": runsFrom_count,
      "Watching": watching_count
    };
    // console.log(my_dict)
   
  // my data
    let data = [{
      values: [indifferent_count, approaches_count, runsFrom_count, watching_count],
      labels: ['Indifferent', 'Approaches', 'Runs from', 'Watching'],
      type: 'pie'
    }];
    // layout
    let layout = {
      height: 500,
      width: 900
    };
    
    // 
    Plotly.newPlot('pie_chart', data, layout);
  
  };