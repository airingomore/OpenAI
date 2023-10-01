const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

class Tetris {
  constructor() {
    this.board = Array.from({ length: rows }, () => Array(columns).fill(0));
    this.score = 0;
    this.piece = this.newPiece();
  }

  newPiece() {
    const shapes = [
      [[1, 1, 1], [1]],
      [[1, 1, 1], [0, 0, 1]],
      [[1, 1], [1, 1]],
      // Add more shapes as desired
    ];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const x = Math.floor(columns / 2) - Math.ceil(shape[0].length / 2);
    const y = 0;
    return { x, y, shape };
  }

  collision(x, y, shape) {
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        if (shape[i][j] && (this.board[y + i] === undefined || this.board[y + i][x + j] === undefined || this.board[y + i][x + j])) {
          return true;
        }
      }
    }
    return false;
  }

  merge() {
    for (let i = 0; i < this.piece.shape.length; i++) {
      for (let j = 0; j < this.piece.shape[i].length; j++) {
        if (this.piece.shape[i][j]) {
          this.board[this.piece.y + i][this.piece.x + j] = 1;
        }
      }
    }
  }

  clearLines() {
    outer: for (let i = rows - 1; i >= 0; i--) {
      for (let j = 0; j < columns; j++) {
        if (!this.board[i][j]) {
          continue outer;
        }
      }
      this.board.splice(i, 1);
      this.board.unshift(Array(columns).fill(0));
      this.score += 10;
    }
  }

  update() {
    if (!this.collision(this.piece.x, this.piece.y + 1, this.piece.shape)) {
      this.piece.y++;
    } else {
      this.merge();
      this.clearLines();
      this.piece = this.newPiece();
      if (this.collision(this.piece.x, this.piece.y, this.piece.shape)) {
        this.board = Array.from({ length: rows }, () => Array(columns).fill(0));
        this.score = 0;
      }
    }
  }

  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        if (this.board[i][j]) {
          ctx.fillStyle = "white";
          ctx.fillRect(j * scale, i * scale, scale, scale);
          ctx.strokeStyle = "black";
          ctx.strokeRect(j * scale, i * scale, scale, scale);
        }
      }
    }

    for (let i = 0; i < this.piece.shape.length; i++) {
      for (let j = 0;

j < this.piece.shape[i].length; j++) {
if (this.piece.shape[i][j]) {
ctx.fillStyle = "white";
ctx.fillRect((this.piece.x + j) * scale, (this.piece.y + i) * scale, scale, scale);
ctx.strokeStyle = "black";
ctx.strokeRect((this.piece.x + j) * scale, (this.piece.y + i) * scale, scale, scale);
}
}
}
this.drawScore();
}

drawScore() {
ctx.fillStyle = "white";
ctx.font = "16px Arial";
ctx.fillText("Score: " + this.score, 10, 20);
}
}

const tetris = new Tetris();

document.addEventListener("keydown", (event) => {
if (event.key === "ArrowUp") {
const shape = tetris.piece.shape[0].map((_, i) => tetris.piece.shape.map(row => row[i])).reverse();
if (!tetris.collision(tetris.piece.x, tetris.piece.y, shape)) {
tetris.piece.shape = shape;
}
} else if (event.key === "ArrowRight") {
if (!tetris.collision(tetris.piece.x + 1, tetris.piece.y, tetris.piece.shape)) {
tetris.piece.x++;
}
} else if (event.key === "ArrowLeft") {
if (!tetris.collision(tetris.piece.x - 1, tetris.piece.y, tetris.piece.shape)) {
tetris.piece.x--;
}
} else if (event.key === "ArrowDown") {
if (!tetris.collision(tetris.piece.x, tetris.piece.y + 1, tetris.piece.shape)) {
tetris.piece.y++;
}
}
});

function gameLoop() {
tetris.update();
tetris.draw();
setTimeout(() => gameLoop(), 500);
}

gameLoop();