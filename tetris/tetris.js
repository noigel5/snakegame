const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const tetrisboard = document.getElementById("board");
const tetrisboard_ctx = tetrisboard.getContext("2d");

tetrisboard_ctx.canvas.width = COLS * BLOCK_SIZE;
tetrisboard_ctx.canvas.height = ROWS * BLOCK_SIZE;

tetrisboard_ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

const KEY = {
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    DOWN: 'ArrowDown',
    SPACE: 'Space',
    UP: 'ArrowUp'
}
Object.freeze(KEY);

const moves = {
    [KEY.LEFT]: p => ({...p, x: p.x - 1}),
    [KEY.RIGHT]: p => ({...p, x: p.x + 1}),
    [KEY.DOWN]: p => ({...p, y: p.y + 1}),
    [KEY.SPACE]: p => ({...p, y: p.y + 1}),
    [KEY.UP]: p => ({...p})
};

document.addEventListener('keydown', event => {
    if (moves[event.code]) {
        event.preventDefault();

        let p = moves[event.code](board.piece);

        if (event.code === KEY.UP) {
            board.piece.rotate();
        }

        if (board.valid(p)) {
            if (event.code === KEY.SPACE) {
                while (board.valid(p)) {
                    board.piece.move(p);
                    p = moves[KEY.DOWN](board.piece);
                }
            } else {
                board.piece.move(p);
            }

            tetrisboard_ctx.clearRect(0, 0, tetrisboard_ctx.canvas.width, tetrisboard_ctx.canvas.height);

            board.piece.draw();
        } else {
            if (event.code === KEY.UP) {
                board.piece.rotate();
                board.piece.rotate();
                board.piece.rotate();
            }
        }
    }
});

class Board {

    isEmpty(value) {
        return value <= 0;
    }

    insideWalls(x) {
        return !(x > 9 || x < 0);
    }

    aboveFloor(y) {
        return y <= 19;
    }

    reset() {
        this.grid = this.getEmptyBoard();
    }

    getEmptyBoard() {
        return Array.from(
            {length: ROWS}, () => Array(COLS).fill(0)
        );
    }

    valid(p) {
        return p.shape.every((row, dy) => {
            return row.every((value, dx) => {
                let x = p.x + dx;
                let y = p.y + dy;
                return (
                    this.isEmpty(value) ||
                    (this.insideWalls(x) &&
                        this.aboveFloor(y)
                    )
                );
            });
        });
    }
}

class Piece {
    constructor(ctx) {
        this.ctx = ctx;
        this.color = 'blue';
        this.shape = [
            [2, 0, 0],
            [2, 2, 2],
            [0, 0, 0]
        ];

        this.x = 3;
        this.y = 0;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
                }
            });
        });
    }

    move(p) {
        this.x = p.x;
        this.y = p.y;
    }

    rotate() {
        for (let y = 0; y < this.shape.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [this.shape[x][y], this.shape[y][x]] = [this.shape[y][x], this.shape[x][y]];
            }
        }

        this.shape.forEach(row => row.reverse());

        return this;
    }
}

let board = new Board();

function play() {
    board.reset();
    console.table(board.grid);

    let piece = new Piece(tetrisboard_ctx);
    piece.draw()
    board.piece = piece;
}