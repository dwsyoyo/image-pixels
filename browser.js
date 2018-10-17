'use strict'


// var extname = require('get-ext')
// var GifReader = require('omggif').GifReader
// var parseDataURI = require('data-uri-to-buffer')
// var isBuffer = require('is-buffer')
// var isUrl = require('is-url')
// var isBlob = require('is-blob')

var isPromise = require('is-promise')
var isObj = require('is-plain-obj')
var isBase64 = require('is-base64')
var toab = require('string-to-arraybuffer')


module.exports = load


function load(src, o, cb) {
  // handle arguments
  if ((typeof o === 'function' || !o) && isObj(src)) {
    cb = o
    o = src
  }
  if (typeof o === 'string') o = {type: o}
  if (!o) o = {}

  // detect clipping
  var clip = o.clip || {}
  clip.x = o.x || o.left || 0
  clip.y = o.y || o.top || 0
  clip.w = o.w || o.width
  clip.h = o.h || o.height

  // handle source type
  var result
  if (typeof src === 'string') {
    // convert base64, datauri to arraybuffer
    if (isBase64(src) || /^data\:/i.test(src)) {
      result = loadBuffer(toab(src))
    }

    else {
      result = loadURL(src)
    }
  }

  // make sure result is promise
  if (!isPromise(result)) result = Promise.resolve(result)
  if (cb) return result.then(function (result) {
    cb(null, result)
  })

  return result

  // else {
  //   if (arg.buffer || arg.data || arg._data)
  // }

  // // NDArray, ImageData
  // else if (arg.buffer || arg.data || arg._data) {

  // }

  // // TypedArray, Buffer
  // else if () {

  // }

  // // Array of Arrays
  // else if () {

  // }

  // // ImageBitmap
  // else if () {

  // }

  // // File, Blob
  // else if (isBlob(data) || (data instanceof File)) {

  // }

  // // Canvas, canvas-like
  // else if (src.canvas || src.context || src.gl || src.getContext) {

  // }

  function loadURL (url) {
    return new Promise(function (ok, nok) {
      var img = new Image()
      img.crossOrigin = 'Anonymous'
      img.onload = function() {
        var idata = getImageData(img)
        var pixels = new Uint8Array(idata.data)
        pixels.width = clip.w || idata.width
        pixels.height = clip.h || idata.height

        ok(pixels)
      }
      img.onerror = function(err) {
        nok(err)
      }
      img.src = url
    })
  }

  var canvas, context
  function getImageData(img) {
    if (!canvas) {
      canvas = document.createElement('canvas')
      context = canvas.getContext('2d')
    }
    canvas.width = img.width
    canvas.height = img.height
    context.drawImage(img, 0, 0)

    return context.getImageData(clip.x, clip.y, clip.w || img.width, clip.h || img.height)
  }
}


function loadBuffer (buffer) {

}

function loadDefault () {
  // imageBitmap first
  if (window.createImageBitmap) {

  }

  // createObjectURL second
  else if (window.URL && window.URL.createObjectURL) {
    var img = document.createElement('img')
    img.addEventListener('load', function() {
        resolve(this);
    });
    img.src = URL.createObjectURL(blob)
  }

  // Canvas2D third
  else {
    if (!img.crossOrigin) img.crossOrigin = 'Anonymous'

    if (!context) {
        canvas = document.createElement("canvas")
        context = canvas.getContext('2d')
    }

    img.onload = function () {
      var canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      var context = canvas.getContext('2d')
      context.drawImage(img, 0, 0)
      var pixels = context.getImageData(0, 0, img.width, img.height)
    }

    img.onerror = function(err) {
      nok(err)
    }

    img.src = url
  }
}
