const canvas = document.getElementById('tetris')
const pixel = 50
const ctx = canvas.getContext('2d')
canvas.width = pixel * 12
canvas.height = pixel * 16
let level = 1
let speed = 10
let frame = 0
let score = 0

const shapeModels = [
    [0, 0, 0, 0, 1, 0, 1, 1, 1]
]

const xPixels = canvas.width / pixel
const yPixels = canvas.height / pixel

function drawLine(startX, startY, toX, toY, ) {
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(toX, toY)
    ctx.strokeStyle = 'rgba(0,0,0,0.4)'
    ctx.stroke()

    ctx.closePath()
    console.log('done')
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
setUpStage()