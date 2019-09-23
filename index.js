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
    //console.log(lines)
    var top = fontSize + (height - game.textHeight)
    var offset = game.textOffset
    ctx.fillStyle = "#e22"
    ctx.fillRect(game.textOffset-2, (height - game.textHeight) + 5, 2, fontSize)
    ctx.fillStyle = "#fff"
    for (var line of lines) {

        ctx.fillText(line,offset,top,width);
        ctx.strokeText(line,offset,top,width);
        top += fontSize
        offset = 0
    }
    
}
var frameTime = performance.now()
var fpses = []
var avgfps = -1

function renderFrame() {
    // clear
    ctx.clearRect(0,0,width,height);
    // draw backdrop
    ctx.drawImage(loadAndGrabImage("assets/img/gradient.png"), 0,0,width,height)
    // draw base
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, width, height * 0.1)

    // draw lasers!!1!!!
    ctx.strokeStyle = "#e22"
    ctx.lineWidth = 2
    ctx.beginPath();
    ctx.moveTo(width / 2, height * 0.1);
    var cwidth = ctx.measureText(game.text.substr(0,1)).width
    ctx.lineTo(game.textOffset-1, (height - game.textHeight) + 5);
    ctx.stroke();
    ctx.lineWidth = 1
    // healthbar
    ctx.fillStyle = "#f00"
    ctx.fillRect(0,0,width,2);
    ctx.fillStyle = "#0f0"
    ctx.fillRect(0,0,width * (game.health / game.maxHealth),2);

    game.textHeight += game.speed

    drawLines()

    particles.render(ctx, game.running ? 1 : 0)

    // fps
    var now = performance.now()
    var fps = Math.floor(1000 / (now - frameTime));
    frameTime = now
    fpses.push(fps)
    if (fpses.length >= 5 || avgfps == -1) {
        var avg = 0
        for (var fps of fpses) {
            avg += fps
        }
        avg = avg / fpses.length
        avgfps = avg
        fpses = []
    }
    ctx.fillStyle = "#fff"
    ctx.strokeStyle = "#000"
    ctx.fillText(Math.floor(avgfps) + "fps",0,fontSize)
    ctx.strokeText(Math.floor(avgfps) + "fps",0,fontSize)

    if (game.running) {
        requestAnimationFrame(renderFrame)
    }

}

onkeydown = function(evt) {
    //console.log(evt)
    var key = evt.key
    if (game.text.substr(0,1) == key) {
        game.score += 10 *(game.speed * 10)
        game.correct += 1
        game.streak += 1
        game.text = game.text.substr(1,game.text.length - 1)
        var cwidth = ctx.measureText(key).width
        game.textOffset += cwidth

        for (var i =0; i < 5000; i++) {
            particles.create(game.textOffset - (cwidth / 2), (height - game.textHeight) + (fontSize / 2))
        }

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