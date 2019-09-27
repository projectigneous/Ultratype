

function renderMainMenu() {
    ctx.font = "64px " + font
    ctx.fillStyle = "#fff"
    centerText("ultrAtype",250)

    ctx.strokeStyle = "#fff"
    ctx.lineWidth = 5
    
    ctx.strokeRect((width * 0.5) - 100, 500, 200, 64)
    
    var mouseover = mousePosition[0] > (width * 0.5) - 100 &&
                    mousePosition[0] < (width * 0.5) + 100 &&
                    mousePosition[1] > 500 &&
                    mousePosition[1] < 564
    if (mouseover) {
        ctx.fillRect((width * 0.5) - 100, 500, 200, 64)
        ctx.fillStyle = "#000"
    }
    ctx.font = "50px " + font
    centerText("stArt",550)
}

window.addEventListener("mousedown", function() {
    if (screen == renderMainMenu) {
        var mouseover = mousePosition[0] > (width * 0.5) - 100 &&
                    mousePosition[0] < (width * 0.5) + 100 &&
                    mousePosition[1] > 500 &&
                    mousePosition[1] < 564
        if (mouseover) {
            game.running = true
            game.startTime = performance.now()
            screen = renderFrame
        }
    }
})