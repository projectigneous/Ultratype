var canvas = document.querySelector("canvas")
var ctx = canvas.getContext("2d");
var width = canvas.width
var height = canvas.height
const fontSize = 30
const maxLines = 5000

var game = {
    running: true,
    health: 50,
    maxHealth: 50,
    text: "The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.".toLowerCase(),
    textHeight: 0,
    textOffset: 0,
    speed: 0.25,
    score: 0,
    streak: 0,
    correct: 0,
    wrong: 0,
}

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

function drawLines() {
    ctx.font = fontSize.toString() + "px monospace";
    ctx.fillStyle = "#fff"
    ctx.strokeStyle = "#000"
    var lines = []
    var lineWidth = game.textOffset;
    var line = ""
    for (var char of game.text.split("")) {
        var cwidth = ctx.measureText(char).width
        if (lineWidth + cwidth > width) {
            if (lines.length < maxLines) {
                lines.push(line)
                line = char
                lineWidth = cwidth
            }
        } else {
            lineWidth += cwidth
            line += char
        }

    }
    if (lineWidth > 1) {
        lines.push(line)
    }
    if (game.textHeight > (height * 0.9)) {
        game.health -= lines[0].length
        game.wrong += lines[0].length
        game.streak = 0
        game.text = game.text.replace(lines[0],"")
        game.textHeight -= fontSize * 2
        game.textOffset = 0
        game.speed = 0.25
        
    }
    console.log(lines)
    var top = fontSize + (height - game.textHeight)
    var offset = game.textOffset
    ctx.fillRect(game.textOffset-2, (height - game.textHeight) + 5, 2, fontSize)
    for (var line of lines) {

        ctx.fillText(line,offset,top,width);
        ctx.strokeText(line,offset,top,width);
        top += fontSize
        offset = 0
    }
    
}

function renderFrame() {
    // clear
    ctx.clearRect(0,0,width,height);
    // draw backdrop
    ctx.drawImage(loadAndGrabImage("assets/img/gradient.png"), 0,0,width,height)
    // draw base
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, width, height * 0.1)
    // healthbar
    ctx.fillStyle = "#f00"
    ctx.fillRect(0,0,width,2);
    ctx.fillStyle = "#0f0"
    ctx.fillRect(0,0,width * (game.health / game.maxHealth),2);

    game.textHeight += game.speed

    drawLines()
    if (game.running) {
        requestAnimationFrame(renderFrame)
    }
}

onkeydown = function(evt) {
    console.log(evt)
    var key = evt.key
    if (game.text.substr(0,1) == key) {
        game.score += 10 *(game.speed * 10)
        game.correct += 1
        game.streak += 1
        game.text = game.text.substr(1,game.text.length - 1)
        var cwidth = ctx.measureText(key).width
        game.textOffset += cwidth
        if (game.textOffset > width - cwidth) {
            game.textOffset = 0
            game.textHeight -= fontSize * (2 + (game.streak/50)) 
            game.speed = game.speed * 1.1
        }

    } else {
        game.score -= 5
        game.streak = 0
        game.wrong += 1
    }
    if (game.textHeight < 0) {
        game.textHeight = fontSize
    }
}


requestAnimationFrame(renderFrame) 