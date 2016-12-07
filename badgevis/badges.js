badgeData = []

function updateBadgeLabels() {
  console.log(selectedBadgeId)
  d3.select('#badge-value')
    .property('value', badgeData[selectedBadgeId].value)
  d3.select('#badge-position')
    .property('value', badgeData[selectedBadgeId].position)
  d3.select('#badge-id-label')
    .text(selectedBadgeId)
  d3.select('#badge-value-label')
    .text(badgeData[selectedBadgeId].value)
  d3.select('#badge-position-label')
    .text(badgeData[selectedBadgeId].position)
}

function selectBadge(id) {
  selectedBadgeId = id

  circleElem = d3.select("#badge-circle" + id)
  lineElem = d3.select("#badge-line" + id)
  circleSelected = circleElem.classed("badge-selected")
  lineSelected = lineElem.classed("badge-selected")
  d3.selectAll(".badge-selected")
    .classed("badge-selected", false)
  circleElem.classed("badge-selected", !circleSelected)
  lineElem.classed("badge-selected", !lineSelected) 

  updateBadgeLabels()
}

function updateBadges() {
  badges = svg.selectAll("line")
    .attr("class", "badge-line")
    .data(badgeData, (d) => d.id)

  badgeCircles = svg.selectAll('.badge-circle')
    .data(badgeData, (d) => d.id)

  badges
    .attr('x1', (d) => xScale(d.position))
    .attr('y1', (d) => padding)
    .attr('x2', (d) => xScale(d.position))
    .attr('y2', (d) => viewHeight - padding)
    .classed('badge-selected', (d) => d.id == selectedBadgeId)

  badgeCircles
    .attr('transform', function(d) {
      xPos = xScale(d.position) 
      yPos = viewHeight - padding
      return 'translate(' + xPos + ',' + yPos + ')'
    })

  newBadges = badges.enter()
  newBadgeCircles = badgeCircles.enter()

  newBadges
    .append('line')
      .attr('class', 'badge-line')
      .attr('id', (d) => 'badge-line' + d.id)
      .attr('x1', (d) => xScale(d.position))
      .attr('y1', (d) => padding)
      .attr('x2', (d) => xScale(d.position))
      .attr('y2', (d) => viewHeight - padding)
      .style("stroke-dasharray", ("3, 3"))
      .attr('stroke', 'rgb(254,152,73)')
      .attr('stroke-width', 2)

  newBadgeCircles 
    .append('circle')
      .attr('class', 'badge-circle')
      .attr('id', (d) => 'badge-circle' + d.id)
      .attr('transform', function(d) {
        xPos = xScale(d.position) 
        yPos = viewHeight - padding
        return 'translate(' + xPos + ',' + yPos + ')'
      })
      .attr('r', 6)
      .style('fill', 'rgb(254,152,73)')
      .on('click', function(d) {
        selectBadge(d.id)
      })
}

d3.select('#badge-value').on('input', function() {
  badgeData[selectedBadgeId].value = parseFloat(this.value)
  console.log('badgevalueupdate')
  updateBadgeLabels()
})

d3.select('#badge-position').on('input', function() {
  badgeData[selectedBadgeId].position = parseInt(this.value)
  console.log('badgepositionupdate')
  updateBadgeLabels()
  updateBadges()
})

d3.select('#badge-value').on('change', function() {
  showAverageData()
})

d3.select('#badge-position').on('change', function() {
  showAverageData()
})

function visualizeBadges() {
  svg.append('rect')
    .attr('id', 'badgeRect')
    .attr('x', padding)
    .attr('y', viewHeight - padding - 5)
    .attr('width', viewWidth - padding*2)
    .attr('height', 10)

  updateBadges()

  d3.select('#badgeRect')
    .on("click", function() {
      newBadge = {
        position: Math.round(xScale.invert(d3.event.pageX)-1),
        id: badgeData.length,
        value: 0.5
      }
      badgeData.push(newBadge) 
      console.log('gonna update badges')
      updateBadges()
      console.log('gonna update badge labels')
      updateBadgeLabels()
      console.log('gonna select badge')
      selectBadge(badgeData.length-1)
      console.log('gonna show average')
      showAverageData()
    })
}
