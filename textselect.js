/*
*/

function textSelect() {
    ctx.font = "32px " + font
    ctx.fillStyle = "#fff"
    centerText("select teXt souRce",120)

    renderBtn(250,400,64,"defAult")
	renderBtn(350,400,64,"custoM")
	renderBtn(450,400,64,"WikipediA")
	
}

function startGame() {
	game.running = true
	game.startTime = performance.now()
	screen = renderFrame
}

window.addEventListener("mousedown", function() {
    if (screen == textSelect) {
        if (calculateBtnBounds(250,400,64)) { // default
            startGame()
        }
		if (calculateBtnBounds(350,400,64)) {
			var text = prompt("Text?")
			if (text && text.trim().length > 1) {
				game.text = text.toLowerCase()
				game.textLength = text.length
				startGame()
			}
		}
		if (calculateBtnBounds(450,400,64)) {
			var url = "https://en.wikipedia.org/w/api.php"; 

			var params = {
				action: "parse",
				page: prompt("Page?"),
				format: "json",
				contentmodel: "wikitext"
			};

			url = url + "?origin=*";
			Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

			fetch(url)
				.then(function(response){return response.json();})
				.then(function(response) {
				   var body = document.createElement("body")
					body.innerHTML = response.parse.text["*"]
					
			for (var a of body.querySelectorAll(".thumb")) {a.remove()}
			for (var a of body.querySelectorAll(".navigation-not-searchable")) {a.remove()}
			for (var a of body.querySelectorAll("table")) {a.remove()}
			for (var a of body.querySelectorAll(".mw-empty-elt")) {a.remove()}
			for (var a of body.querySelectorAll(".nowrap")) {a.remove()}
			for (var a of body.querySelectorAll("*[title='Help:Pronunciation respelling key']")) {a.remove()}
			for (var a of body.querySelectorAll(".reference")) {a.remove()}
			console.log(body.innerHTML,body)
					console.log( body.querySelector("p").innerText)
					game.text = body.querySelector("p").innerText.toLowerCase()
					startGame()
				})
				.catch(function(error){console.log(error);})	
		}
    }
})
