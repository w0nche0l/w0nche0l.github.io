// data is of the form: 
// [{t: 0, x: 0.5}, {t:1, x: 0.6}, ...

let averageLine

function visualizeLine(data) {
  // creating svg groups by symbol
  if(averageLine === undefined) {
    averageLine = svg.append("path")
      .datum(data)
      .attr('class', 'line')
      .attr("d", (d)=>lineGenerator(d))  
  } else {
    averageLine.datum(data).transition(d3.transition().duration(200)).attr("d", (d)=>lineGenerator(d))
  }
}


function drawProgress(progressedData) {
  if(progressedDataLine === undefined) {
    progressedDataLine = svg.append("path")
      .datum(progressedData)
      .attr('class', 'line')
      .attr("d", (d)=>progressLineGenerator(d))
  } else {
    progressedDataLine.datum(progressedData).transition(d3.transition().duration(200)).attr("d", (d)=>progressLineGenerator(d))
  }
}