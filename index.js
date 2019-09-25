var canvas = document.querySelector("canvas")
var ctx = canvas.getContext("2d");
var width = canvas.width
var height = canvas.height
const fontSize = 30
const font = "Major Mono Display"
const maxLines = 5000

var game = {
    running: true,
    health: 50,
    maxHealth: 50,
    text: "A computer keyboard is an input device that allows a person to enter letters, numbers, and other symbols (these are called characters in a keyboard) into a computer. It is one of the most used input devices for computers. Using a keyboard to enter lots of data is called typing.".toLowerCase(),
    textLength : 0,
    startTime: performance.now(),
    textHeight: 0,
    textOffset: 0,
    speed: 0.25,
    score: 0,
    streak: 0,
    correct: 0,
    wrong: 0,
}
var frame = 0

game.textLength = game.text.length

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
    ctx.font = fontSize.toString() + "px " + font;
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
        game.score -= lines[0].length * 2
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
        //ctx.strokeText(line,offset,top,width);
        top += fontSize
        offset = 0
    }
    
}

function drawScore() {
    ctx.strokeStyle = "#001e38"
    ctx.fillStyle = "#bfe1ff"
    ctx.font = height * 0.1 + "px " + font
    var scoreText = Math.floor(game.score)
    var scoreWidth = ctx.measureText(scoreText).width
    ctx.fillText(scoreText,(width * 0.5) - (scoreWidth * 0.5), height * 0.085, width)
    ctx.strokeText(scoreText,(width * 0.5) - (scoreWidth * 0.5), height * 0.085, width)

    // streak
    ctx.font = height * 0.05 + "px " + font
    var streakText = Math.floor(game.streak)
    var streakWidth = ctx.measureText(streakText).width
    ctx.fillText(streakText,(width * 0.5) - (scoreWidth * 0.5) - streakWidth, height * 0.085, width)
    ctx.strokeText(streakText,(width * 0.5) - (scoreWidth * 0.5) - streakWidth, height * 0.085, width)

    // acc text
    var accText = Math.floor((game.correct / (game.wrong + game.correct)) * 100) + "%"
    var accWidth = ctx.measureText(accText).width
    ctx.fillText(accText,(width * 0.5)  +(scoreWidth * 0.5), height * 0.085, width)
    ctx.strokeText(accText,(width * 0.5) + (scoreWidth * 0.5), height * 0.085, width)



    ctx.font = fontSize.toString() + "px " + font;
}

var frameTime = performance.now()
var fpses = []
var avgfps = -1

function renderFrame() {
    try {
        frame += 1
        
        // clear
        ctx.clearRect(0,0,width,height);
        // draw backdrop
        ctx.drawImage(loadAndGrabImage("assets/img/stars.jpg"), 0,(-frame % height),width,height)
        ctx.drawImage(loadAndGrabImage("assets/img/stars.jpg"), 0,(-frame % height) + height,width,height)

        ctx.globalAlpha = 0.4
        ctx.drawImage(loadAndGrabImage("assets/img/gradient.png"), 0,0,width,height)
        ctx.globalAlpha = 1

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
        if (game.score < 0) {game.score = 0}
        drawScore()

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
        ctx.font = "16px " + font;
        ctx.fillStyle = `hsl(${avgfps * 2},100%,50%)`
        ctx.strokeStyle = "#000"
        //ctx.lineWidth = 0
        ctx.fillText(Math.floor(avgfps) + "fps",0,16)
        //ctx.strokeText(Math.floor(avgfps) + "fps",0,16)
        ctx.font = fontSize.toString() + "px " + font;
    } catch(e) {console.error(e)}
    var score = Math.round(game.score) * (game.maxHealth / game.maxHealth)
    if (game.health <= 0) {
        game.running = false
        alert("Ooopsie Poopsie! You lose. Score: " + score)
    }
    if (game.text == "") {
        game.running = false
        var now = performance.now()
        var timeTaken =  now - game.startTime
        var avgC = (timeTaken / game.textLength) / 1000
        var wpm = (60 / avgC) / 5 
        console.log({now,timeTaken,avgC,wpm})
        alert("YOU WIN! GOWON LAD! SCORE " + score + ". WPM: "+ Math.floor(wpm))
    }
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

        for (var i =0; i < 100; i++) {
            particles.create(game.textOffset - (cwidth / 2), (height - game.textHeight) + (fontSize / 2))
        }

        if (game.textOffset > width - cwidth) {
            game.textOffset = 0
            game.textHeight -= fontSize * (2 + (game.streak/50)) 
            game.speed = game.speed * (2 - (game.textLength / 250))
        }

    } else {
        game.score -= 5
        game.streak = 0 
        game.wrong += 1
    }
    if (game.textHeight < 0) {
        game.textHeight = fontSize
    }
    if (game.score < 0) {game.score = 0}
}


requestAnimationFrame(renderFrame) 