let canvasW;
let canvasH;

let mouseX = 0;
let mouseY = 0;

const canvas = document.getElementById("screen");

let bottles = []
let holes = []
let explosions = []
// сдесь будем хранить счет
let score = 0
let loaded_images = 0;
let time = 60;

const images = {
    "cross": "/static/images/cross.png",
    "bottle": "/static/images/bottle.png",
    "hole": "/static/images/hole.png",
}

const explosiosns_images = []

for (let i = 0; i <= 34; i++) {
    explosiosns_images.push('/static/images/imgs_explode/img_' + i + '.png')
}


function loadAllImages() {

    Object.keys(images).forEach((image_title) => {
        let img = new Image()

        img.addEventListener("load", () => {
            loaded_images += 1
            if (loaded_images === Object.keys(images).length) {
                loadExplosions()
            }
        });
        img.src = images[image_title]
        images[image_title] = img
    })
}


function loadExplosions() {
    for (let i = 0; i < explosiosns_images.length; i++) {
        let img = new Image()
        img.addEventListener("load", () => {
            loaded_images += 1
            if (loaded_images === explosiosns_images.length) {
                startGame()
            }
        });
        img.src = explosiosns_images[i]
        explosiosns_images[i] = img
    }


}

function random(a, b) {
    return Math.random() * (b - a) + a
}

function createBottle() {
    const bottle = {
        x: random(0, canvasW),
        y: random(0, canvasH),
    }
    bottles.push(bottle)

}

function removeOldBottles() {
    if (bottles.length > 3) {
        bottles.shift()
    }
}

function mouseClick(e) {
    makeShot(e.clientX, e.clientY)
}

// функция для обработки выстрела
function makeShot(x, y) {
    let counter = 0

    for (bottle of bottles) {

        if (bottle.x - 50 <= x && x <= bottle.x + 50 && bottle.y - 100 <= y && y <= bottle.y + 100) {
            counter += 1
            explosions.push(
                {
                    "x": bottle.x,
                    "y": bottle.y,
                    "img": 0
                }
            )

        }

    }

    if (counter == 0) {
        const hole = {
            "x": x,
            "y": y,
        }
        holes.push(hole)
    }

    score += counter


    let currentSize = bottles.length
    bottles = bottles.filter(bottle => !(bottle.x - 50 <= x && x <= bottle.x + 50 && bottle.y - 100 <= y && y <= bottle.y + 100))



    // прибавляем к счету количество бутылок, по которым мы попали

}


function updateExplosion() {
    for (let i = 0; i < explosions.length; i++) {
        if (explosions[i].img === 34) {
            explosions.splice(i)
        }

        else {
            explosions[i].img += 1
        }

    }
}


function drawExplosions(ctx) {
    if (explosions.length > 0) {
        explosions.forEach((exp) => {
            ctx.drawImage(explosiosns_images[exp.img], exp.x - 100, exp.y - 100, 200, 200)
        })
        updateExplosion()
    }
}

function makeFullscreen() {
    canvas.width = document.body.clientWidth
    canvas.height = document.body.clientHeight

    canvasW = canvas.width
    canvasH = canvas.height
}

function saveMousePosition(e) {
    mouseX = e.clientX
    mouseY = e.clientY
}

function drawBackground(ctx) {
    ctx.fillStyle = "#f5f5dc"
    ctx.fillRect(0, 0, canvasW, canvasH)
}

function drawCursor(ctx) {
    // рисуем курсор (размер 50 на 50)
    ctx.drawImage(images.cross, mouseX - 25, mouseY - 25, 50, 50)
}

function drawBottles(ctx) {
    bottles.forEach((bottle) => {
        // рисуем цели (размер 100 на 200)
        ctx.drawImage(images.bottle, bottle.x - 50, bottle.y - 100, 100, 200)
    })
}

function drawHoles(ctx) {
    holes.forEach((hole) => {
        ctx.drawImage(images.hole, hole.x - 50, hole.y - 50, 100, 100)
    })
}

// функция для вывода счета на экран
function drawScore(ctx) {
    ctx.font = "48px serif";
    let textSize = ctx.measureText(score)
    ctx.fillStyle = 'rgb(0, 0, 0)'
    ctx.fillText(score, canvasW - 50 - textSize.width, 50);
}


function drawTime(ctx) {
    ctx.font = "48px serif";
    let textSize = ctx.measureText(score)
    ctx.fillStyle = 'rgb(0, 0, 0)'
    ctx.fillText(time, 50, 50);
}


function changeTime() {
    time -= 1
    if (time <= 0) {
        send()
       
        
    }
}


function send() {

    fetch('/update_score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ result_score: score })
    }).then(() => {
        redirect()
    })

}

function redirect() {
    location.href = '/'
}




function drawFrame() {
    makeFullscreen()
    removeOldBottles()

    const ctx = canvas.getContext("2d")

    drawBackground(ctx)
    drawHoles(ctx)
    drawBottles(ctx)
    drawExplosions(ctx)
    drawCursor(ctx)
    drawScore(ctx)
    drawTime(ctx)
}

function startGame() {
    setInterval(drawFrame, 20)
    setInterval(createBottle, 1000)
    console.log(location.href)
    if (location.href == 'http://127.0.0.1:5000/game') {
        setInterval(changeTime, 1000)
    }
    addEventListener("mousemove", saveMousePosition)
    addEventListener("mousedown", mouseClick)
}

loadAllImages()

