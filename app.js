const canvas = document.getElementById('tetris')
const pixel = 40
const ctx = canvas.getContext('2d')
canvas.width = 600
canvas.height = 800


const rows = canvas.height / pixel
const cols = canvas.width / pixel
currPlayer = {
    shape: [],
    posX: ((cols / 2) - 1) * pixel,
    posY: 0,
    collided: false,
    canStart: true,
    inPlay: true,
    time: 0
}

let gameMatrix = []

for (i = 0; i < rows; i++) {
    let cll = []
    for (j = 0; j < cols; j++) {
        cll.push(0)
    }
    gameMatrix.push(cll)
}

// console.table(gameMatrix)

let level = 1
let speed = 10
let frame = 0
let score = 0
const calc = (start, distX, distY) => {
    let dist = 0
    if (distX) {
        dist = distX
    }
    if (distX == 'y') {

        dist = distY + 1
            // console.log('fgf ' + dist)
    }
    return ((start + dist) * pixel)
}

const player = [
    [
        [0, 0, 0],
        [0, 1, 0],
        [1, 1, 1]
    ],
    [
        [2, 2, 0],
        [0, 2, 2]
    ],

    [
        [0, 3, 0],
        [0, 3, 0],
        [0, 3, 3]
    ],

]

class Player {
    constructor(matrix, x, y, color) {
        this.matrix = matrix
        this.x = x
        this.y = y
        this.color = color
    }
    draw() {
        // console.log(this)
        ctx.fillStyle = this.color
        this.matrix.forEach((row, j) => {

            row.forEach((cell, i) => {
                if (cell > 0) {
                    // console.log(`x:  ${calc(this.x, i)}  y: ${calc(this.y, 'y', j)}`)
                    ctx.beginPath()
                    ctx.rect(calc(this.x, i), calc(this.y, 'y', j), pixel, pixel)
                    ctx.fill()
                    ctx.closePath()
                    ctx.fillRect(calc(this.x, i), calc(this.y, 'y', j), pixel, pixel)
                }

            })
        });
    }

    down() {
        this.y++


    }
    left() {
        this.x = this.x--
            // console.log(this.x + ' new x')
    }

    right() {
        this.x = this.x++
            // console.log(this.x + ' new x')
    }

}
const xPixels = canvas.width / pixel
const yPixels = canvas.height / pixel

function drawLine(startX, startY, toX, toY, ) {
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(toX, toY)
    ctx.strokeStyle = 'rgba(248, 218, 51, 0.3)'
    ctx.stroke()

    ctx.closePath()

}

function setUpStage() {
    let x = pixel
    let y = pixel
    for (let i = 0; i <= xPixels; i++) {


        drawLine(x, 0, x, canvas.height)
        x += pixel
    }

    for (let i = 0; i <= yPixels; i++) {


        drawLine(0, y, canvas.width, y)
        y += pixel
    }

}


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setUpStage()
    if (currPlayer.inPlay) {
        if (!currPlayer.collided && !currPlayer.canStart) {
            currPlayer.shape.down()
            currPlayer.shape.draw()
            console.log(currPlayer)
        }
        if (!currPlayer.collided && currPlayer.canStart) {
            currPlayer.shape = new Player(player[2], 5, -1, 'red')
            currPlayer.shape.draw()
            currPlayer.canStart = false
        }







        currPlayer.time = frame
    }


    window.setInterval(function() {

        requestAnimationFrame(animate)
    }, 3000)




}



animate()