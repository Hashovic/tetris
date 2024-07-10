let shape_O, shape_I, shape_J, shape_L, shape_S, shape_Z, shape_T;
let shapey;
let shapes = [];
let lastTime = 0;
let interval = 500;

function setup(){
    
    // Creates all the different possible combinations of shapes using vectors provided by p5.js

    shape_O = {
        positions: [createVector(0,0), createVector(1, 0), createVector(0, 1), createVector(1, 1)],
        coloring: color(255, 0, 0),
        rotate_pos: createVector(1, 1)
    }

    shape_I = {
        positions: [createVector(0,1), createVector(1, 1), createVector(2, 1), createVector(3, 1)],
        coloring: color(255, 0, 0),
        rotate_pos: createVector(2, 1)
    }

    shape_J = {
        positions: [createVector(0,0), createVector(0, 1), createVector(1, 1), createVector(2, 1)],
        coloring: color(255, 0, 0),
        rotate_pos: createVector(1.5, 1.5)
    }

    shape_L = {
        positions: [createVector(2,0), createVector(0, 1), createVector(1, 1), createVector(2, 1)],
        coloring: color(255, 0, 0),
        rotate_pos: createVector(1.5, 1.5)
    }

    shape_S = {
        positions: [createVector(1,0), createVector(2, 0), createVector(0, 1), createVector(1, 1)],
        coloring: color(255, 0, 0),
        rotate_pos: createVector(1.5, 1.5)
    }

    shape_Z = {
        positions: [createVector(0,0), createVector(1, 0), createVector(1, 1), createVector(2, 1)],
        coloring: color(255, 0, 0),
        rotate_pos: createVector(1.5, 1.5)
    }

    shape_T = {
        positions: [createVector(1,0), createVector(0, 1), createVector(1, 1), createVector(2, 1)],
        coloring: color(255, 0, 0),
        rotate_pos: createVector(1.5, 1.5)
    }

    window.canvas = createCanvas(700, 700);
    window.canvas.addClass('my_canvas');
    shapey = drawBlock(shape_Z);

    centerCanvas();
}

function draw(){
    background(220);

    let currentTime = millis();
    if (currentTime - lastTime >= interval) {
        shapey.mvdwn();
        lastTime = currentTime;
    }

    shapey.draw();
}

function centerCanvas(){
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    window.canvas.position(x, y)
}

function windowResized() {
    centerCanvas();
}

function drawBlock(shape) {
    let temp = new Shape(createVector(10, 0), shape);
    shapes.push(temp);
    
    return temp;
}