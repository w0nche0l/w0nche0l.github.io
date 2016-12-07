function clicked(d, i) {
  if (d3.event.defaultPrevented) return; // dragged

  d3.select(this).transition()
      .style("fill", "black")
      .attr("r", 64)
    .transition()
      .attr("r", 32)
      .style("fill", d3.color(i));
}

function dragged(d) {
  d.xPos = d3.event.x, d.yPos = d3.event.y;
  if (this.nextSibling) this.parentNode.appendChild(this);
  d3.select(this).attr("transform", "translate(" + d.xPos + "," + d.yPos + ")");
}

var drag = d3.drag()
  .on("drag", dragged);

function verticalInterval(index) {
  return yScale(0) - index * 10 - 10
}

function collapsePoints(data) {
  clusterMap = new Map();
  for(var i = 0; i < data.length; i++) {
    cluster = data[i].progress
    if(clusterMap.has(cluster)) {
      clusterMap.get(cluster).push(data[i])
    } else {
      clusterMap.set(cluster, [data[i]])
    }
  }
  for(var [cluster, arr] of clusterMap.entries()) {
    for(var i = 0; i < arr.length; i++) {
      arr[i].xPos = xScale(arr[i].progress)
      arr[i].yPos = verticalInterval(i) 
    }
  }
}

function progressSuccessful(person) {
  if (person.progress >= compiledMap[person.idealEffort].length)
    return 0;
  return Math.random() < compiledMap[person.idealEffort][person.progress].x
}

function progress(data) {
  numProgressedAt = []
  numAt = []
  for(var i = 0; i < data.length; i++) {
    numProgressedAt[i] = 0
    numAt[i] = 0
  }
  for(var i = 0; i < data.length; i++) {
    numAt[data[i].progress]++
    // figure out if each participant progresses or not
    if(progressSuccessful(data[i])) {
      numProgressedAt[data[i].progress]++
      data[i].progress += 1
    }
  }

  let progress = _.map(numProgressedAt, (value, i)=>({x:i, y: numAt[i]<=3?0:value/numAt[i]}))
  progress = _.filter(progress, (elem)=>(elem.y > 0))

  drawProgress(progress)
  collapsePoints(data)
  return data
}

function updateCircles(data) {
  var t = d3.transition().duration(400)

  // join
  var circles = svg.selectAll("circle")
    .data(data, function(d) { return d.id; })

  // exit old elements
  circles.exit()
      .attr("class", "exit")
    .transition(t)
      .style("fill-opacity", 1e-6)
      .remove()
 
  // update old elements
  circles.attr("class", "update")
      .attr("y", 60)
      .style("fill-opacity", 1)
    .transition(t) 
      .attr("transform", function(d, i) {
        return "translate(" + d.xPos + "," + d.yPos + ")";
      })

  // enter new elements
  circles.enter().append("circle")
    .attr('class', 'people-circle')
    .attr("transform", function(d) {
      d.xPos = xScale(d.progress)
      d.yPos = verticalInterval(d.id)
      return "translate(" + d.xPos + "," + d.yPos + ")";
    })
    .attr("id", (d) => 'circle' + d.id)
    .attr("r", 4)
    .style("fill", function(d, i) { return d.color; })
    .on("click", clicked)
    .call(drag)
}

function visualizeCircles() {
  updateCircles(circleData)
}

let timeStep = 0
function runSimulation() {
  timeStep = 0
  compileStuff()
  setInterval(function() {
    updateCircles(progress(circleData))
    timeStep++
    console.log(timeStep)
    d3.select('#counter').html(timeStep)
  }, 400)
}

d3.select("#run")
  .on("click", function() {
    runSimulation()
  })
