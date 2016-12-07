// Transformation Functions
var xScale = null
var yScale = null

// Display Constants
var viewHeight = 600
var viewWidth = 1200
var padding = 50
var dragbarw = 10

var rectangleConstants = {
  strokeWidth: 2,
  strokeColor: "black",
  fillOpacity: .05,
  cornerSize: 30
}

var numPeople = 500
d3.select('#num-people').property('value', numPeople)
var participationBucket = 0.1

var normalMean = 0.5
var normalStdev = 0.1
var betaAlpha = 2
var betaBeta = 5
var selected = 'normal'
d3.select('#mean').property('value', normalMean)
d3.select('#stdev').property('value', normalStdev)
d3.select('#alpha').property('value', betaAlpha)
d3.select('#beta').property('value', betaBeta)

var circleData
function initCircleData() {
  var randomValues = []
  for(let i = 0; i < numPeople; i++) {
    randomValues[i] = selected==='normal'?jStat.normal.sample(normalMean,normalStdev) : jStat.beta.sample(betaAlpha, betaBeta)
    randomValues[i] -= randomValues[i] % participationBucket
  }
  randomValues = _.map(randomValues, (p) => {if(p > 0.95) return 0.95; if(p < 0.05) return 0.05; return p;})

  circleData = d3
  .range(numPeople)
  .map(function(i) {
    return {
      id: i,
      color: d3.interpolateLab("steelblue", "brown")(randomValues[i]),
      idealEffort: randomValues[i],  // p
      progress: 1,
      xPos: 0,
      yPos: 0
    };
  });
}
// Display Variables
var initClickCoords = {
  x: 0,
  y: 0
}
var timeBoxData = [
];

// svg variables
var svg = null

minValueY = 0
maxValueY = 100

minValueX = 0
maxValueX = 120
d3.select('#num-steps').property('value', maxValueX)

lineGenerator = null
progressLineGenerator = null

function defineTransformations() {
  yScale = d3.scaleLinear()
    .domain([minValueY, maxValueY])
    .range([viewHeight-padding, padding])

  yScale = d3.scaleLinear()
    .domain([minValueY, maxValueY])
    .range([viewHeight-padding, padding])

  xScale = d3.scaleLinear()
    .domain([minValueX, maxValueX])
    .range([padding, viewWidth-padding])

  lineGenerator = d3.line()
    .x((d)=>xScale(d.t+1))
    .y((d)=>yScale(d.x*100))

  progressLineGenerator = d3.line()
    .x((d)=>xScale(d.x+1))
    .y((d)=>yScale(d.y*100))
}

let progressedDataLine
selectedBadgeId = 0
function reset() {
  svg.remove()
  badgeData = []
  selectedBadgeId = 0
  averageLine = undefined
  progressedDataLine = undefined
}



function visualize() {
  initCircleData()
  defineTransformations()
  svg = d3.select('#visArea')
    .append("svg")
    .attr("width", viewWidth)
    .attr("height", viewHeight)

  var xAxis = d3.axisBottom(xScale)
    .ticks(80)
  var yAxis = d3.axisLeft(yScale)
    .ticks(20)
  
  svg.append('g')
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (viewHeight-padding) + ")")
    .call(xAxis)

  svg.append('g')
    .attr("class", "y axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis)

  // remove every third label
  var ticks = d3.selectAll(".x.axis .tick text");
  ticks.attr("class", function(d,i){
      if(i%3 != 0) d3.select(this).remove();
  });

  visualizeCircles()
  visualizeBadges()
  showAverageData()
}

// num-steps
//     gamma
//     mean
//     stdev
//     alpha
//     beta
//     distribution

d3.select("#num-people").on("input", function() {
  numPeople = parseInt(this.value)
  console.log(numPeople)
  reset()
  visualize()
})

d3.select("#num-steps").on("input", function() {
  maxValueX = parseInt(this.value)
  reset()
  visualize()
})

d3.select("#gamma").on("input", function() {
  gamma  = parseFloat(this.value)
  reset()
  visualize()
})

d3.select("#mean").on("input", function() {
  normalMean = parseFloat(this.value)
  reset()
  visualize()
})
d3.select("#stdev").on("input", function() {
  normalStdev = parseFloat(this.value)
  reset()
  visualize()
})

d3.select("#alpha").on("input", function() {
  betaAlpha = parseFloat(this.value)
  reset()
  visualize()
})
d3.select("#beta").on("input", function() {
  betaBeta = parseFloat(this.value)
  reset()
  visualize()
})

d3.select("#beta").on("input", function() {
  betaBeta = parseFloat(this.value)
  reset()
  visualize()
})

d3.selectAll('.radio').on("click", function() {
  selected = this.value
})

d3.select('body')
  .on('keydown', function() {
    // delete
    if (d3.event.keyCode == 32) {
      console.log('spaced')
      selected = d3.selectAll("circle").data(circleData)
        .attr("transform", function(d) {
          d.xPos = xScale(d.progress)
          d.yPos = yScale(0) - d.id*30 - 40
          return "translate(" + d.xPos + "," + d.yPos + ")";
        })
    }
})

// b = next utility
// a = give up
// p = ideal probability.
function sqr(x) {return x*x}

function nativeEquation(a,b,p,x,v) {
  return (v+a*b*x-(x-p)*(x-p))/(1-a*(1-x))
}

function nativeDiff (a,b,p,x,v) {
  let denomRoot = (1 - a + a*x)
  let denom = sqr(denomRoot)
  return  
    (- (2*a*p*x)/denom
    - (2*x)/denomRoot
    - (a*v)/denom 
    - (b*x*a*a)/denom
    + (2*p)/denomRoot
    + (a*b)/denomRoot
    + (a*p*a*p)/denom 
    + (a*x*a*x)/denom);
}


let equation = CQ("(v+a*b*x-(x-p)*(x-p))/(1-a*(1-x))")
let diff = equation.differentiate('x')
let gamma = 0.75
d3.select('#gamma').property('value', gamma)
function computeActivities(inBadges, p) {
  let sortedBadges = _.sortBy(inBadges, (b)=>b.position)
  if (inBadges.length === 0) {
    sortedBadges = [{position: 0, value:0, id: 0}]
  }
  let badgeIndex = sortedBadges.length-1
  let a = gamma
  let v = _.reduce(sortedBadges, (memo, badge) => memo+badge.value, 0)
  let finishBadgeValue = v / (1-a)
  let highestTimeBadge = _.max(sortedBadges, (badge) => badge.position)
  let result = [] // U
  let u = []
  for(var i = 0; highestTimeBadge.position+i< maxValueX; ++i) {
    u[highestTimeBadge.position+i] = finishBadgeValue  
    result[highestTimeBadge.position+i] = {x: p, t: highestTimeBadge.position+i}
  }

  for (let i = highestTimeBadge.position - 1; i>=0; i--) {
    if (badgeIndex >=0 && i < sortedBadges[badgeIndex].position) {
      v-=sortedBadges[badgeIndex].value
      badgeIndex--;
    }
    let solvedX
    try {
     solvedX = diff.sub({'a': a, 'b': u[i+1], 'p': p, 'v': v}).nsolve(0.5, "x")
    } catch (e){
      solvedX = participationBucket
    }
    if (solvedX < participationBucket || solvedX > 1) {
      if (solvedX > 1) solvedX = 1
      else solvedX = participationBucket
    }

    result[i] = {x: solvedX, t: i}
    u[i] = equation.sub({'a' : a, 'b' : u[i+1], 'p': p, 'x': solvedX, 'v' : v})
    // u[i] = nativeEquation(a, u[i+1], p, solvedX, v)
  }
  return result
}


function compileAverageData() {
  let sortedCircles = _.sortBy(circleData, (b)=>b.idealEffort)
  var t0 = performance.now();
  let result = computeActivities(badgeData, sortedCircles[sortedCircles.length/2].idealEffort)
  console.log('finished showAverageData')
  console.log(result)
  visualizeLine(result)
  var t1 = performance.now();
  console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
  d3.select("#loading").style('display', 'none')

  let expectedTime = 0
  for(var i = 0; i < result.length; ++i) {
    if (result[i].x>0) {
      expectedTime += 1/result[i].x
    }
  }
  expectedTime -= expectedTime%1
  console.log('expectedTime:' + expectedTime)
  d3.select('#expected-time').html(expectedTime)
}

function showAverageData () {
  d3.select("#loading").style('display', 'block')
  setTimeout(compileAverageData, 100)
}



let compiledMap = {}

function compileStuff () {
  d3.select("#loading").style('display', 'block')
  setTimeout(compilePreferredActivities, 100)
}
function compilePreferredActivities () {
  var t0 = performance.now();
  compiledMap = {}
  for (var i = 0; i < circleData.length; ++i) {
    if (compiledMap[circleData[i].idealEffort] === undefined) {
      compiledMap[circleData[i].idealEffort] = computeActivities(badgeData, circleData[i].idealEffort)
    }
  }
  var t1 = performance.now();
  d3.select("#loading").style('display', 'none')
  console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
}


visualize()
