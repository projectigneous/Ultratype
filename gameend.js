function gameEndRender() {
    var win = typeof wpm != "undefined"
    ctx.globalAlpha = 0.4
    if (win) {
        ctx.drawImage(loadAndGrabImage("assets/img/green.png"), 0,0,width,height)
    } else {
        ctx.drawImage(loadAndGrabImage("assets/img/red.png"), 0,0,width,height)
    }
    ctx.globalAlpha = 1
    s = 240
    if (win) { s = s - 51.5}
    ctx.font = "54px " + font
    ctx.fillStyle = "#fff"
    centerText("you " + (win ? "WIN" : "LOSE"), s )
    
    ctx.font = "18px " + font
    centerText("score", s + 50)
    ctx.font = "72px " + font
    centerText(Math.floor(game.score), s + 120)

    ctx.font = "14px " + font
    centerText("highest streAk", s + 150)
    ctx.font = "54px " + font
    centerText(game.highestStreak, s + 200)
    ctx.font = "14px " + font
    centerText("AccurAcy", s + 230)
    ctx.font = "54px " + font
    centerText(Math.floor((game.correct / (game.wrong + game.correct)) * 100) + "%", s + 280)
    if (win) {
        ctx.font = "14px " + font
        centerText("wpm", s + 310)    
        ctx.font = "54px " + font
        centerText(Math.floor(wpm), s + 360)
        s = s + 80
    } 
    s = s + 360
    

    ctx.strokeStyle = "#fff"
    ctx.lineWidth = 5
    
    ctx.strokeRect((width * 0.5) - 75,  s - 37, 150, 48)
    
    var mouseover = mousePosition[0] > (width * 0.5) - 75 &&
                    mousePosition[0] < (width * 0.5) + 75 &&
                    mousePosition[1] > s - 37 &&
                    mousePosition[1] < s + 11
    if (mouseover) {
        ctx.fillRect((width * 0.5) - 75, s - 37, 150, 48)
        ctx.fillStyle = "#000"
    }
    ctx.font = "36px " + font
    centerText("Menu",s)
    
    

    
    
}
window.addEventListener("mousedown", function() {
    if (screen == gameEndRender) {
        var mouseover = mousePosition[0] > (width * 0.5) - 75 &&
                    mousePosition[0] < (width * 0.5) + 75 &&
                    mousePosition[1] > s - 37 &&
                    mousePosition[1] < s + 11
        if (mouseover) {
            game = defaultGame
            screen = renderMainMenu
        }
    }
})