function visualizeTimeBoxes() {
    d3.select('body')
      .on('keydown', function() {
        // delete
        if (d3.event.keyCode == 46 || d3.event.keyCode == 8) {
          selected = d3.select('.selected')
          if (!selected.empty()) {
            console.log('hello delete this guy')
            for (i = 0; i < timeBoxData.length; i++) {
              if (timeBoxData[i].id == selected.datum().id) {
                timeBoxData.splice(i, 1)
                break
              }
            }
            drawRects()
          }
        }
    })
    var otherRect = null
    svg.call(d3.drag().
      on('start', function() {
        var mouse = d3.mouse(this);
        var newBox = { x: mouse[0], y: mouse[1], w: 1, h: 1, id: guid()}
        timeBoxData.push(newBox);
        drawRects();

        otherRect = d3.select('#rect' + newBox.id)
      })
      .on('drag', function () {
        otherRect.each(resizeBottomRight)
      })
    )


    drawRects();

    function onRectangleDragMove(d) {
      d3.select('#rect'+d.id)
        .attr('x', d.x = d3.event.x)
        .attr('y', d.y = d3.event.y)
      d3.select("#l" + d.id)
        .attr("x", (d) => d3.event.x - dragbarw/2)
        .attr("y", (d) => d3.event.y + dragbarw/2)
      d3.select("#r" + d.id)
        .attr("x", (d) => d3.event.x + d.w - dragbarw/2)
        .attr("y", (d) => d3.event.y + dragbarw/2)
      d3.select("#t" + d.id)
        .attr("x", (d) => d3.event.x + dragbarw/2)
        .attr("y", (d) => d3.event.y - dragbarw/2)
      d3.select("#b" + d.id)
        .attr("x", (d) => d3.event.x + dragbarw/2)
        .attr("y", (d) => d3.event.y + d.h - dragbarw/2)
      d3.select("#tl" + d.id)
        .attr("x", (d) => d3.event.x - dragbarw/2)
        .attr("y", (d) => d3.event.y - dragbarw/2)
      d3.select("#tr" + d.id)
        .attr("x", (d) => d3.event.x + d.w - dragbarw/2)
        .attr("y", (d) => d3.event.y - dragbarw/2)
      d3.select("#bl" + d.id)
        .attr("x", (d) => d3.event.x - dragbarw/2)
        .attr("y", (d) => d3.event.y + d.h - dragbarw/2)
      d3.select("#br" + d.id)
        .attr("x", (d) => d3.event.x + d.w - dragbarw/2)
        .attr("y", (d) => d3.event.y + d.h - dragbarw/2)
      // processTimeBoxes()
    }

    function drawRects() {
      svg.selectAll("#rectangles").remove();

      var timeBoxes = svg
        .append("g")
        .attr("id", "rectangles");

      var dragrect = timeBoxes
        .selectAll("rect")
        .data(timeBoxData)
        .enter()
        .append("g")

      var mainrect = dragrect 
        .append("rect")
        .attr("id", (d)=> 'rect'+d.id)
        .attr("x", (d)=>d.x)
        .attr("y", (d)=>d.y)
        .attr("height", (d)=>d.h)
        .attr("width", (d)=>d.w)
        .attr("stroke", rectangleConstants.strokeColor)
        .attr("stroke-width", rectangleConstants.strokeWidth)
        .attr("fill-opacity", rectangleConstants.fillOpacity)
        .attr("cursor", "move")
        .call(d3.drag().on('drag', onRectangleDragMove))
        .on("click", function() {
          elem = d3.select(this)
          selected = elem.classed("selected")
          d3.selectAll(".selected")
            .classed("selected", false)
          elem.classed("selected", !selected)
        })

      var dragCornerTopLeft = dragrect
        .append("rect")
        .attr("id", (d) => "tl" + d.id)
        .attr("x", (d) => d.x - dragbarw/2)
        .attr("y", (d) => d.y - dragbarw/2)
        .attr("width", dragbarw)
        .attr("height", dragbarw) 
        .attr("fill-opacity", "0")
        .attr("cursor", "nwse-resize")
        .call(d3.drag().on('drag', resizeTopLeft));

      var dragCornerTopRight = dragrect
        .append("rect")
        .attr("id", (d) => "tr" + d.id)
        .attr("x", (d) => d.x + d.w - dragbarw/2)
        .attr("y", (d) => d.y - dragbarw/2)
        .attr("width", dragbarw)
        .attr("height", dragbarw)
        .attr("fill-opacity", "0")
        .attr("cursor", "nesw-resize")
        .call(d3.drag().on('drag', resizeTopRight));

      var dragCornerBottomLeft = dragrect
        .append("rect")
        .attr("id", (d) => "bl" + d.id)
        .attr("x", (d) => d.x - dragbarw/2)
        .attr("y", (d) => d.y + d.h - dragbarw/2)
        .attr("width", dragbarw)
        .attr("height", dragbarw) 
        .attr("fill-opacity", "0")
        .attr("cursor", "nesw-resize")
        .call(d3.drag().on('drag', resizeBottomLeft));

      var dragCornerBottomRight = dragrect
        .append("rect")
        .attr("id", (d) => "br" + d.id)
        .attr("x", (d) => d.x + d.w - dragbarw/2)
        .attr("y", (d) => d.y + d.h - dragbarw/2)
        .attr("width", dragbarw)
        .attr("height", dragbarw)
        .attr("fill-opacity", "0")
        .attr("cursor", "nwse-resize")
        .call(d3.drag().on('drag', resizeBottomRight));

      var dragbarLeft = dragrect
        .append("rect")
        .attr("id", (d) => "l" + d.id)
        .attr("x", (d) => d.x - dragbarw/2)
        .attr("y", (d) => d.y + dragbarw/2)
        .attr("width", dragbarw)
        .attr("height", (d) => Math.max(0, d.h - dragbarw))
        .attr("fill-opacity", "0")
        .attr("cursor", "ew-resize")
        .call(d3.drag().on('drag', resizeLeft));

      var dragbarRight = dragrect
        .append("rect")
        .attr("id", (d) => "r" + d.id)
        .attr("x", (d) => d.x + d.w - dragbarw/2)
        .attr("y", (d) => d.y + dragbarw/2)
        .attr("width", dragbarw)
        .attr("height", (d) => Math.max(0, d.h - dragbarw))
        .attr("fill-opacity", "0")
        .attr("cursor", "ew-resize")
        .call(d3.drag().on('drag', resizeRight));

      var dragbarTop = dragrect
        .append("rect")
        .attr("id", (d) => "t" + d.id)
        .attr("x", (d) => d.x + dragbarw/2)
        .attr("y", (d) => d.y - dragbarw/2)
        .attr("width", (d) => Math.max(0, d.w - dragbarw))
        .attr("height", (d) => dragbarw)
        .attr("fill-opacity", "0")
        .attr("cursor", "ns-resize")
        .call(d3.drag().on('drag', resizeTop));

      var dragbarBottom = dragrect
        .append("rect")
        .attr("id", (d) => "b" + d.id)
        .attr("x", (d) => d.x + dragbarw/2)
        .attr("y", (d) => d.y + d.h - dragbarw/2)
        .attr("width", (d) => Math.max(0, d.w - dragbarw))
        .attr("height", (d) => dragbarw)
        .attr("fill-opacity", "0")
        .attr("cursor", "ns-resize")
        .call(d3.drag().on('drag', resizeBottom));

      // processTimeBoxes()
    }

    function resizeLeft(d) {
      var oldx = d.x
      d.x = Math.max(0, Math.min(d.x + d.w - (dragbarw / 2), d3.event.x)); 
      d.w = Math.max(0, d.w + oldx - d.x)
      d3.select("#rect" + d.id) 
        .attr("x", (d) => d.x)
        .attr("width", (d) => d.w)
      d3.select("#l" + d.id) 
        .attr("x", (d) => d.x - dragbarw/2)
      d3.select("#t" + d.id) 
        .attr("x", (d) => d.x + dragbarw/2)
        .attr("width", (d) => Math.max(d.w - dragbarw, 0))
      d3.select("#b" + d.id) 
        .attr("x", (d) => d.x + dragbarw/2)
        .attr("width", (d) => Math.max(d.w - dragbarw, 0))
      d3.select("#tl" + d.id)
        .attr("x", (d) => d.x - dragbarw/2)
      d3.select("#bl" + d.id)
        .attr("x", (d) => d.x - dragbarw/2)
      // processTimeBoxes()
    }

    function resizeRight(d) {
      var dragx = Math.max(d.x + dragbarw/2, Math.min(viewWidth, d.x + d.w + d3.event.dx))
      d.w = Math.max(0, dragx - d.x)
      d3.select("#rect" + d.id) 
        .attr("width", (d) => d.w)
      d3.select("#r" + d.id) 
        .attr("x", (d) => dragx - dragbarw/2)
      d3.select("#t" + d.id) 
        .attr("x", (d) => d.x + dragbarw/2)
        .attr("width", (d) => Math.max(0, d.w - dragbarw))
      d3.select("#b" + d.id) 
        .attr("x", (d) => d.x + dragbarw/2)
        .attr("width", (d) => Math.max(0, d.w - dragbarw, 0))
      d3.select("#tr" + d.id)
        .attr("x", (d) => d.x + d.w - dragbarw/2)
      d3.select("#br" + d.id)
        .attr("x", (d) => d.x + d.w - dragbarw/2)
      // processTimeBoxes()
    }

    function resizeTop(d) {
      var oldy = d.y
      d.y = Math.max(0, Math.min(d.y + d.h - dragbarw / 2, d3.event.y))
      d.h = Math.max(0, d.h + oldy - d.y)
      d3.select("#rect" + d.id) 
        .attr("y", (d) => d.y)
        .attr("height", (d) => d.h)
      d3.select("#t" + d.id) 
        .attr("y", (d) => d.y - dragbarw/2)
      d3.select("#l" + d.id) 
        .attr("y", (d) => d.y + dragbarw/2)
        .attr("height", (d) => Math.max(0, d.h - dragbarw))
      d3.select("#r" + d.id) 
        .attr("y", (d) => d.y + dragbarw/2)
        .attr("height", (d) => Math.max(0, d.h - dragbarw))
      d3.select("#tl" + d.id)
        .attr("y", (d) => d.y - dragbarw/2)
      d3.select("#tr" + d.id)
        .attr("y", (d) => d.y - dragbarw/2)
      // processTimeBoxes()
    }

    function resizeBottom(d) {
      var dragy = Math.max(d.y + dragbarw/2, Math.min(viewHeight, d.y + d.h + d3.event.dy))
      d.h = Math.max(0, dragy - d.y)
      d3.select("#rect" + d.id)
        .attr("height", (d) => d.h)
      d3.select("#l" + d.id) 
        .attr("height", (d) => Math.max(0, d.h - dragbarw))
      d3.select("#r" + d.id)
        .attr("height", (d) => Math.max(0, d.h - dragbarw))
      d3.select("#b" + d.id) 
        .attr("y", (d) => dragy - dragbarw/2)
      d3.select("#bl" + d.id)
        .attr("y", (d) => d.y + d.h - dragbarw/2)
      d3.select("#br" + d.id)
        .attr("y", (d) => d.y + d.h - dragbarw/2)
      // processTimeBoxes()
    }

    function resizeTopLeft(d) {
      dontProcess = true
      resizeTop(d);
      dontProcess = false
      resizeLeft(d);
    }

    function resizeTopRight(d) {
      dontProcess = true
      resizeTop(d);
      dontProcess = false
      resizeRight(d);
    }

    function resizeBottomLeft(d) {
      dontProcess = true
      resizeBottom(d);
      dontProcess = false
      resizeLeft(d);
    }
    
    function resizeBottomRight(d) {
      dontProcess = true
      resizeBottom(d);
      dontProcess = false
      resizeRight(d);
    }
}

var dontProcess = false

function processTimeBoxes() {
  if(dontProcess) return;
  timeBoxBounds = timeBoxData.map(generateTimeBoxBounds)
  selectedSymbols = []
  // figure out how to select
  for (const companyData of companyDataMap) {
    if (companyPassTimeBox(companyData.values)) {
      selectedSymbols.push(companyData.key)
    }
  }
  highlightSelected(selectedSymbols)
}

function companyPassTimeBox(values) {
  let timeBoxPassed = new Map()
  for (const timeBoxBound of timeBoxBounds) {
    timeBoxPassed[timeBoxBound.startTime] = false
  }


  for (const dataPoint of values) {
    for (const timeBoxBound of timeBoxBounds) {
      let timeBoxResult = passesTimeBox(dataPoint, timeBoxBound)
      if (timeBoxResult === -1) {
        return false
      }

      if (timeBoxResult === 1) {
        timeBoxPassed[timeBoxBound.startTime] = true
      }
    }
  }

  for (const timeBoxBound of timeBoxBounds) {
    if (!timeBoxPassed[timeBoxBound.startTime]) {
      return false
    }
  }

  return true
}


// TimeboxSchema: {
//   w: 100, h: 100,
//   x: 100, y: 100,
//   id: 0
// },
function passesTimeBox(dataPoint, timeBoxBound) {
  if (dataPoint.date < timeBoxBound.startTime || dataPoint.date > timeBoxBound.endTime) {
    return 0
  }
  if (dataPoint.price < timeBoxBound.minPrice || dataPoint.price > timeBoxBound.maxPrice) {
    return -1
  }

  return 1
}

function generateTimeBoxBounds(timeBox) {
  return {
    startTime: d3.timeDay.ceil(timeScale.invert(timeBox.x)),
    endTime: d3.timeDay.ceil(timeScale.invert(timeBox.x+timeBox.w)),
    maxPrice: dollarScale.invert(timeBox.y),
    minPrice: dollarScale.invert(timeBox.y+timeBox.h)
  }
}