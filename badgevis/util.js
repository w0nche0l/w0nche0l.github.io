function distance(x_1, y_1, x_2, y_2) {
  return Math.pow(
    Math.pow(x_1 - x_2, 2) + 
    Math.pow(y_1 - y_2, 2),
  0.5)
}

function startDrag(d) {
  var mouse = d3.mouse(this)
  initClick.active = true;
  initClick.x = mouse[0]
  initClick.y = mouse[1]
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
