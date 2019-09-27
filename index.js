var canvas = document.querySelector("canvas")
var ctx = canvas.getContext("2d");
var width = canvas.width
var height = canvas.height
var frame = 0
var loadedImages = {}

function loadAndGrabImage(url) {
    if (loadedImages[url]) {
        return loadedImages[url]
    } else {
        var image = document.createElement("img")
        image.src = url
        loadedImages[url] = image
        return image
    }
}

function centerText(text,height) {
    var size = ctx.measureText(text).width
    if (size < width) {
        ctx.fillText(text,(width * 0.5) - size * 0.5, height,width)
    } else {
        ctx.fillText(text,0, height,width)
    }
}

const fontSize = 30
const font = "Major Mono Display"
const maxLines = 5000


var screen  = renderMainMenu
function render() {
    frame += 1    
    // clear
    ctx.clearRect(0,0,width,height);
    // draw backdrop
    ctx.drawImage(loadAndGrabImage("assets/img/stars.jpg"), 0,(-frame % height),width,height)
    ctx.drawImage(loadAndGrabImage("assets/img/stars.jpg"), 0,(-frame % height) + height,width,height)
    ctx.globalAlpha = 0.4
    //ctx.drawImage(loadAndGrabImage("assets/img/fog.png"), 0,(-frame% height),width,height)
    ctx.drawImage(loadAndGrabImage("assets/img/gradient.png"), 0,0,width,height)
    ctx.globalAlpha = 1

    if (typeof screen == "function") {screen()}

    // cursor
    ctx.fillRect(mousePosition[0],mousePosition[1],5,5) 
    ctx.lineWidth = 1
    ctx.strokeStyle = "#000"
    ctx.strokeRect(mousePosition[0],mousePosition[1],5,5) 

    requestAnimationFrame(render)
}

var mousePosition = [width / 2, height /2]
function getMousePos(evt) {
    canvas.requestPointerLock()
}
canvas.addEventListener('mousedown',getMousePos)

document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

function lockChangeAlert() {
  if (document.pointerLockElement === canvas ||
      document.mozPointerLockElement === canvas) {
    console.log('The pointer lock status is now locked');
    document.addEventListener("mousemove", updatePosition, false);
  } else {
    console.log('The pointer lock status is now unlocked');  
    document.removeEventListener("mousemove", updatePosition, false);
  }
}


function updatePosition(e) {
    mousePosition[0] += e.movementX;
    mousePosition[1] += e.movementY;
    if (mousePosition[0] > width - 2) {mousePosition[0] = width - 2}
    if (mousePosition[0] < 0) {mousePosition[0] = 0}
    if (mousePosition[1] > height - 2) {mousePosition[1] = height - 2}
    if (mousePosition[1] < 0) {mousePosition[1] = 0}
}
requestAnimationFrame(render)