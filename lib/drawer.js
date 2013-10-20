/*
  Simple drawing api
*/

Png = require('png').Png

module.exports.Drawer = Drawer

function hexToRgb (hexColor) {
  var rgb = new Array(3)
    , col = hexColor.substr(1) // trim off #
  for (i = 0; i < 3; i++) {
    k = parseInt(col.substring(i * 2, (i + 1) * 2), 16)
    rgb[i] = k
  }
  return rgb
}


function Drawer (width, height) {
  this.width = width
  this.height = height
  this.buffer = new Buffer(this.width * this.height * 3)
  this.color = [0, 0, 0]
}


Drawer.prototype.setColor = function (color) {
  this.color = (typeof color === 'string') ? hexToRgb(color) : color
  return this
}


Drawer.prototype.getColor = function (color) {
  if (typeof color === 'string') {
    return hexToRgb(color)
  } else if (color) {
    return color
  } else {
    return this.color
  }
}


Drawer.prototype.eachPoint = function (callback, context) {
  var x, y;
  for (x = 0; x < this.width; x++) {
    for (y = 0; y < this.height; y++) {
      this.point(x, y, callback.call(context || this, x, y))
    }
  }
  return this;
}


Drawer.prototype.draw = function (callback, context) {
  callback.call(context || this)
}


Drawer.prototype.brick = function (x, y, w, h, color) {
  var i, j
  for (i = 0; i < w; i++) {
    for (j = 0; j < h; j++) {
      this.point(x + i, y + j, color)
    }
  }
  return this
}


Drawer.prototype.point = function (x, y, color) {
  var i, color = this.getColor(color)

  if (x >= this.width ||
      y >= this.height ||
      x < 0 ||
      y < 0) return;

  for (i = 0; i < 3; i++) {
    this.buffer[x * 3 + y * this.width * 3 + i] = color[i]
  }
  return this
}


Drawer.prototype.toPng = function () {
  return new Png(this.buffer, this.width, this.height, 'rgb')
}


Drawer.prototype.getRandomPoint = function (padding) {
  return [
    Math.floor(Math.random() * (this.width - padding * 2 + 1)) + padding
  , Math.floor(Math.random() * (this.height - padding * 2 + 1)) + padding
  ]
}


Drawer.prototype.getPointColor = function (x, y) {
  x = Math.min(this.width, x)
  y = Math.min(this.height, y)
  return [
    this.buffer[x * 3 + y * this.width * 3]
  , this.buffer[x * 3 + y * this.width * 3 + 1]
  , this.buffer[x * 3 + y * this.width * 3 + 2]
  ]
}


Drawer.prototype.scale = function (k, trimW, trimH) {
  // Scales image by @k and limits size by @trimW and @trimH
  var drawer = new Drawer( Math.min(this.width * k, trimW)
                         , Math.min(this.height * k, trimH)
                         )
  return drawer.eachPoint(function (x, y) {
    return this.getPointColor(Math.floor(x / k), Math.floor(y / k))
  }, this)
}
