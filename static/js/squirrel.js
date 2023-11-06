d3.json("dcdfdsf", function (behaviorData) { 
    
    console.log(behaviorData); 
  
  // counts
    var gray_count=0
    var cinnamon_count=0
  
    for (let i= 0; i < behaviorData.length; i++ ){
  
        let primary_color = behaviorData[i].primary_fur_color;
        let indifferents = behaviorData[i].indifferent;
        
        if(indifferents=="True" && primary_color=="Cinnamon"){
            cinnamon_count+=1
        }
        else if (indifferents=="True" && primary_color=="Gray") {
            gray_count+=1
            }
    }
  //}
  // diction
    let my_dict = {
      "Cinnamon": cinnamon_count,
      "Gray": gray_count
    };
    console.log(my_dict)
   
  // my data
    let data = [{
      values: [cinnamon_count, gray_count],
      labels: ['Cinnamon', 'Gray'],
      type: 'pie'
    }];
    // layout
    let layout = {
      height: 500,
      width: 900
    };
    
    // 
    Plotly.newPlot('pie_chart', data, layout);
  
  });