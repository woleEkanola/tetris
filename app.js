const canvas = document.getElementById('tetris');
const pixel = 40;
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 800;
let score = 0
document.getElementById('score_board').innerHTML = score
const rows = canvas.height / pixel;
const cols = canvas.width / pixel;

var pause = true

let currPlayer = {
    shape: null,
    collided: false,
};

let gameMatrix = Array.from({ length: rows }, () => Array(cols).fill(0));

let frame = 0;
let pixelSpeed = 30; // Higher value = slower falling speed
const dropSpeedIncrease = 5; // Decrease this value for faster drops when the down key is pressed
const normalSpeed = 30; // Normal falling speed

const calc = (start, distX, distY) => {
    let dist = 0;
    if (distX) {
        dist = distX;
    }
    if (distX === 'y') {
        dist = distY + 1;
    }
    return (start + dist) * pixel;
};

// Expanded player shapes with more variations
const playerShapes = [
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
    [
        [4, 4],
        [4, 4]
    ],
    [
        [0, 5, 5],
        [5, 5, 0]
    ],
    [
        [6, 6, 6],
        [0, 0, 6]
    ],
    [
        [0, 7, 0],
        [7, 7, 7]
    ],

    [
        [0, 8, 0],
        [0, 8, 0],
        [0, 8, 0],
        [0, 8, 0]
    ],

           [ [0, 9, 0]],


    
];

class Player {
    constructor(matrix, x, y, color) {
        this.matrix = matrix;
        this.x = x;
        this.y = y;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        this.matrix.forEach((row, j) => {
            row.forEach((cell, i) => {
                if (cell > 0) {
                    ctx.fillStyle = this.color;
                    ctx.fillRect(calc(this.x, i), calc(this.y, 'y', j), pixel, pixel);
                }
            });
        });
    }

    down() {
        // Check if the shape is colliding with the bottom or another shape before moving down
        if (!this.isColliding(0, 1)) {
            this.y++;
        } else {
            // Lock the shape in place and indicate collision
            this.lockShape();
            currPlayer.collided = true; // Set collision state to true
            clearLines(); // Check for filled lines and clear them
        }
    }

    left() {
        // Check if the shape can move left
        if (!this.isColliding(-1, 0)) {
            this.x--;
        }
    }

    right() {
        // Check if the shape can move right
        if (!this.isColliding(1, 0)) {
            this.x++;
        }
    }

    rotate() {
        const rotatedMatrix = this.matrix[0].map((_, index) =>
            this.matrix.map(row => row[index]).reverse()
        );

        // Store the original position before potential collision
        const originalMatrix = this.matrix;
        this.matrix = rotatedMatrix;

        // Check for collision with the new rotated shape
        if (this.isColliding(0, 0)) {
            // If there's a collision, revert to the original matrix
            this.matrix = originalMatrix;
        }
    }

    isColliding(directionX = 0, directionY = 0) {
        const shapeHeight = this.matrix.length;
        const shapeWidth = this.matrix[0].length;

        // Check if the shape has reached the bottom of the visible canvas
        if (this.y + shapeHeight + directionY >= rows) {
            return true;
        }

        // Check for left and right collisions
        for (let j = 0; j < shapeHeight; j++) {
            for (let i = 0; i < shapeWidth; i++) {
                if (this.matrix[j][i] > 0) {
                    const newX = this.x + i + directionX;
                    const newY = this.y + j + directionY;

                    // Check boundaries
                    if (newX < 0 || newX >= cols) {
                        return true;
                    }

                    // Check if the cell in the gameMatrix is filled
                    if (newY >= 0 && newY < rows && gameMatrix[newY][newX] > 0) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    lockShape() {
        this.matrix.forEach((row, j) => {
            row.forEach((cell, i) => {
                if (cell > 0) {
                    gameMatrix[this.y + j][this.x + i] = cell;
                }
            });
        });
    }
}

// Function to draw the gameMatrix
function drawGameMatrix() {
    gameMatrix.forEach((row, j) => {
        row.forEach((cell, i) => {
            if (cell > 0) {
                ctx.fillStyle = (cell === 1) ? 'red' : 
                                (cell === 2) ? 'green' : 
                                (cell === 3) ? 'blue' :
                                (cell === 4) ? 'purple' :
                                (cell === 5) ? 'cyan' :
                                (cell === 6) ? 'orange' :
                                (cell === 7) ? 'yellow' : 
                                'brown'; // Color by cell value
                ctx.fillRect(calc(i, 0), calc(j, 'y', 0), pixel, pixel);
            }
        });
    });
}

function clearLines() {
  let filled_rows = []
    for (let row = rows - 1; row >= 0; row--) {
        // Check if the row is filled
        if (gameMatrix[row].every(cell => cell > 0)) {
            // Remove the filled row
            filled_rows.push(row)
        }
    }

    filled_rows.forEach((rw,i) =>{
            gameMatrix.splice(rw+i, 1); // Remove the filled row
            score +=10
            document.getElementById('score_board').innerHTML = score
            // Add a new empty row at the top
            gameMatrix.unshift(Array(cols).fill(0));
    })
}

function drawLine(startX, startY, toX, toY) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(toX, toY);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.stroke();
    ctx.closePath();
}

function setUpStage() {
    for (let x = pixel; x <= canvas.width; x += pixel) {
        drawLine(x, 0, x, canvas.height);
    }

    for (let y = pixel; y <= canvas.height; y += pixel) {
        drawLine(0, y, canvas.width, y);
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setUpStage();
    drawGameMatrix();

    if (currPlayer.shape) {
        if (!currPlayer.collided) {
            if (frame % pixelSpeed === 0) {
                currPlayer.shape.down();  // Move the shape down every 'pixelSpeed' frames
            }
            currPlayer.shape.draw();
        }

        if (currPlayer.collided) {
            // Generate a new shape when the current one has collided
            const randomShape = Math.floor(Math.random() * playerShapes.length);
            currPlayer.shape = new Player(playerShapes[randomShape], 5, 0, 'red'); // Start at row 0
            currPlayer.collided = false; // Reset collision state
        }
    } else {
        // Start the first shape
        const randomShape = Math.floor(Math.random() * playerShapes.length);
        currPlayer.shape = new Player(playerShapes[randomShape], 5, 0, 'red'); // Start at row 0
    }
    if(!pause){

        frame++;
        requestAnimationFrame(animate);
    }
}

// Event listeners for key presses
document.addEventListener('keydown', (event) => {
    if (currPlayer.shape) {
        switch (event.key) {
            case 'ArrowLeft':
                currPlayer.shape.left();  // Move left
                break;
            case 'ArrowRight':
                currPlayer.shape.right(); // Move right
                break;
            case 'ArrowUp':
                currPlayer.shape.rotate(); // Rotate shape
                break;
            case 'ArrowDown':
                pixelSpeed = dropSpeedIncrease; // Set speed for faster dropping
                break;
        }
    }
});

// Reset speed when the down arrow key is released
document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowDown') {
        pixelSpeed = normalSpeed; // Reset to normal speed
    }
});

// Start the animation loop
animate();
``

const toggleStart = () =>{
    console.log('working...')
    if(pause){
        document.getElementById('trigger').innerHTML = 'Pause'
    }else{
         document.getElementById('trigger').innerHTML = 'Start'
    }
    pause = !pause
    animate()
}