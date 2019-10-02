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
    
	renderBtn(s-50,154,52,"Menu")

}
window.addEventListener("mousedown", function() {
    if (screen == gameEndRender) {
        var mouseover = calculateBtnBounds(s-37,150,48)
        if (mouseover) {
            game = Object.assign({}, defaultGame);
            screen = renderMainMenu
        }
    }
})