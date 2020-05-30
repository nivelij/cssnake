const DEFAULT_WIDTH = 40;
const DEFAULT_HEIGHT = 30;
const DEFAULT_SNAKE_LENGTH = 5;
const DIRECTION_RIGHT = 39;
const DIRECTION_LEFT = 37;
const DIRECTION_UP = 38;
const DIRECTION_DOWN = 40;
const DEFAULT_SPEED = 500;

var arena = new Array(DEFAULT_HEIGHT);
var currentDirection = DIRECTION_RIGHT;
var snake = null;
var currentFood = null;
var isGameOver = false;
var score = 0;

var initArena = function() {
    for (i=0;i < DEFAULT_HEIGHT;i++) {
        arena[i] = new Array(DEFAULT_WIDTH);

        let startRow = "<div class='arena' id='row-"+i+"'>";

        for (j=0;j < DEFAULT_WIDTH;j++) {
            arena[i][j] = "";
            startRow += "<span class='arena' id='col-"+j+"'>"+arena[i][j]+"</span>";
        }

        startRow += "</div>";

        $("#arena").append(startRow);
    }

    setInterval(function() {move(currentDirection)}, DEFAULT_SPEED);
}

var randomNumber = function(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

var addClass = function(x, y, strClass) {
    arena[x][y] = strClass;
    $("div.arena#row-"+x).find("span.arena#col-"+y).addClass(strClass);
}

var removeClass = function(x, y, strClass) {
    arena[x][y] = "";
    $("div.arena#row-"+x).find("span.arena#col-"+y).removeClass(strClass);
}

var initSnake = function() {
    let headY = randomNumber(0+(DEFAULT_SNAKE_LENGTH-1), DEFAULT_WIDTH-(DEFAULT_SNAKE_LENGTH-1));
    let headX = randomNumber(0, DEFAULT_HEIGHT-1);

    snake = new Snake();

    for (i=0;i <= DEFAULT_SNAKE_LENGTH-1;i++) {
        snake.body.push(new Coordinate(headX, headY - i));

        if (i==0) {
            addClass(headX, headY, "snake-head");
        }
        else {
            addClass(headX, headY-i, "snake-body");
        }
    }
}

var addFood = function() {
    let slotAvailable = false;

    while (!slotAvailable) {
        let foodX = randomNumber(0, DEFAULT_HEIGHT-1);
        let foodY = randomNumber(0, DEFAULT_WIDTH-1);

        if (arena[foodX][foodY] == "") {
            slotAvailable = true;
            addClass(foodX, foodY, "food");
            currentFood = new Coordinate(foodX, foodY);
        }
    }
}

var move = function(direction) {
    if (!isGameOver) {
        let t = null;
        let expandBody = false;
        
        for (i=0;i < snake.body.length;i++) {
            if (i==0) {
                t = $.extend({}, snake.body[i]);
                removeClass(snake.body[i].x, snake.body[i].y, "snake-head");

                switch (direction) {
                    case DIRECTION_RIGHT:
                        if (snake.body[i].y + 1 == DEFAULT_WIDTH) {
                            snake.body[i].y = 0;
                        }
                        else {
                            snake.body[i].y += 1;
                        }
                        currentDirection = DIRECTION_RIGHT;
                        break;
                    case DIRECTION_LEFT:
                        if (snake.body[i].y - 1 == -1) {
                            snake.body[i].y = DEFAULT_WIDTH - 1;
                        }
                        else {
                            snake.body[i].y -= 1;
                        }
                        currentDirection = DIRECTION_LEFT;
                        break;
                    case DIRECTION_UP:
                        if (snake.body[i].x - 1 == -1) {
                            snake.body[i].x = DEFAULT_HEIGHT - 1;
                        }
                        else {
                            snake.body[i].x -= 1;
                        }
                        currentDirection = DIRECTION_UP;
                        break;
                    case DIRECTION_DOWN:
                        if (snake.body[i].x + 1 == DEFAULT_HEIGHT) {
                            snake.body[i].x = 0;
                        }
                        else {
                            snake.body[i].x += 1;
                        }
                        currentDirection = DIRECTION_DOWN;
                        break;
                    default:
                        return;
                }

                if (isFoodEaten()) {
                    expandBody = true;
                }
                addClass(snake.body[i].x, snake.body[i].y, "snake-head");
            }
            else {
                removeClass(snake.body[i].x, snake.body[i].y, "snake-body");
                let x = $.extend({}, snake.body[i]);
                snake.body[i] = t;
                addClass(snake.body[i].x, snake.body[i].y, "snake-body");
                t = x;
            }
        }

        if (expandBody) {
            snake.body.push(t);
            addClass(t.x, t.y, "snake-body");
        }
    }
    
}

var isFoodEaten = function() {
    if (snake.body[0].x == currentFood.x && snake.body[0].y == currentFood.y) {
        removeClass(currentFood.x, currentFood.y, "food");
        addFood();
        addScore();
        return true;
    }

    return false;
}

var initEvent = function() {
    $(document).keydown(function(e) {
        if (e.keyCode >= DIRECTION_LEFT && e.keyCode <= DIRECTION_DOWN) {
            if (Math.abs(currentDirection - e.keyCode) == 2 || currentDirection == e.keyCode) {
                return;
            }

            currentDirection = e.keyCode
        }
    });
}

var gameOver = function() {
    alert("Game Over! Your Score: "+score);
}

var addScore = function() {
    score += 1;
    $("span#score").text(score);
}

$(document).ready(function() {
    initArena();
    initSnake();
    initEvent();
    addFood();
});