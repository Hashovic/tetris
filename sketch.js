let shapey;

function setup(){

    // Creates all the different possible combinations of shapes using vectors provided by p5.js

    const shape_O = {
        positions: [createVector(0,0), createVector(1, 0), createVector(0, 1), createVector(1, 1)],
        coloring: color(255, 0, 0),
        rotate_pos: createVector(1, 1)
    }

    const shape_I = {
        positions: [createVector(0,1), createVector(1, 1), createVector(2, 1), createVector(3, 1)],
        coloring: color(255, 0, 0),
        rotate_pos: createVector(2, 1)
    }

    const shape_J = {
        positions: [createVector(0,0), createVector(0, 1), createVector(1, 1), createVector(2, 1)],
        coloring: color(255, 0, 0),
        rotate_pos: createVector(1.5, 1.5)
    }

    const shape_L = {
        positions: [createVector(2,0), createVector(0, 1), createVector(1, 1), createVector(2, 1)],
        coloring: color(255, 0, 0),
        rotate_pos: createVector(1.5, 1.5)
    }

    const shape_S = {
        positions: [createVector(1,0), createVector(2, 0), createVector(0, 1), createVector(1, 1)],
        coloring: color(255, 0, 0),
        rotate_pos: createVector(1.5, 1.5)
    }

    const shape_Z = {
        positions: [createVector(0,0), createVector(1, 0), createVector(1, 1), createVector(2, 1)],
        coloring: color(255, 0, 0),
        rotate_pos: createVector(1.5, 1.5)
    }

    const shape_T = {
        positions: [createVector(1,0), createVector(0, 1), createVector(1, 1), createVector(2, 1)],
        coloring: color(255, 0, 0),
        rotate_pos: createVector(1.5, 1.5)
    }


    window.canvas = createCanvas(700, 700);
    window.canvas.addClass('my_canvas');
    shapey = new Shape(createVector(10, 10), shape_T);

    centerCanvas();
}

function draw(){
    background(220);

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