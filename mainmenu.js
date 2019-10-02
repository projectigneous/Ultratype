

function renderMainMenu() {
    ctx.font = "64px " + font
    ctx.fillStyle = "#fff"
    centerText("ultrAtype",250)

    renderBtn(500,200,64,"plAy")
}

window.addEventListener("mousedown", function() {
    if (screen == renderMainMenu) {
        var mouseover = calculateBtnBounds(500,200,64)
        if (mouseover) {
            screen = textSelect
        }
    }
})