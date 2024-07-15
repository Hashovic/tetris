let orientations;
let shapey;
let down_time = 0;
let left_time = 0;
let right_time = 0;
let interval = 50;
let dead = [];
let grid_width = 20;
let grid_height = 28;

function setup(){
    /*
        Creates all the different possible combinations of shapes using vectors provided by p5.js

        Postions is the relative positions of each shape in comparison to the top left corner of
        the shape's 'bounding box' or the possible that it takes up in a square shape

        Coloring allows the changing of the color of each shape directly in the shape configuration

        Rotate_pos can be thought of as the imaginary square in which everything rotates around
    */
    orientations = [
        // shape_O
        {
            positions: [createVector(0,0), createVector(1, 0), createVector(0, 1), createVector(1, 1)],
            coloring: color(240, 220, 60),
            rotate_pos: createVector(0.5, 0.5)
        },

        // shape_I
        {
            positions: [createVector(0,1), createVector(1, 1), createVector(2, 1), createVector(3, 1)],
            coloring: color(60, 240, 180),
            rotate_pos: createVector(1.5, 0.5)
        },

        // shape_J
        {
            positions: [createVector(0,0), createVector(0, 1), createVector(1, 1), createVector(2, 1)],
            coloring: color(130, 90, 240),
            rotate_pos: createVector(1, 1)
        },

        // shape_L
        {
            positions: [createVector(2,0), createVector(0, 1), createVector(1, 1), createVector(2, 1)],
            coloring: color(245, 140, 80),
            rotate_pos: createVector(1, 1)
        },

        // shape_S
        {
            positions: [createVector(1,0), createVector(2, 0), createVector(0, 1), createVector(1, 1)],
            coloring: color(140, 240, 100),
            rotate_pos: createVector(1, 1)
        },

        // shape_Z
        {
            positions: [createVector(0,0), createVector(1, 0), createVector(1, 1), createVector(2, 1)],
            coloring: color(255, 80, 80),
            rotate_pos: createVector(1, 1)
        },

        // shape_T
        {
            positions: [createVector(1,0), createVector(0, 1), createVector(1, 1), createVector(2, 1)],
            coloring: color(220, 90, 240),
            rotate_pos: createVector(1, 1)
        }
    ]

    window.canvas = createCanvas(grid_width * B_SIZE, grid_height * B_SIZE);
    window.canvas.addClass('my_canvas');
    shapey = drawBlock(1, 1, orientations[6]);

    centerCanvas();
}

function draw(){
    background(220);
    for(let j of dead){
        j.draw();
    }
    shapey.draw();

    let col = check_collide();

    if(col == 1){
        for(let block = 0; block < shapey.blocks.length; block++){
            dead.push(shapey.blocks[block]);
        }
        shapey = drawBlock(1, 1, orientations[floor(random(orientations.length))]);
    }
    else{
        movement(col);
    }
}

function centerCanvas(){
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    window.canvas.position(x, y)
}

function windowResized() {
    centerCanvas();
}

function drawBlock(x, y, shape) {
    return new Shape(createVector(x, y), shape);
}

function keyPressed() {

    if (keyCode == '38') {
        shapey.rotate();
    }

    if (keyCode == '32') {
        while (check_collide() != 1){
            shapey.mvdwn();
        }
    }
}

function movement(num) {
    
    let currentTime = millis();
    // down
    if (keyIsDown(40)){
        if (currentTime - down_time >= interval) {
            shapey.mvdwn();
            down_time = currentTime;
        }
    }

    // left
    if (keyIsDown(37) && num != 2){
        if (currentTime - left_time >= interval) {
            shapey.mvleft();
            left_time = currentTime;
        }
    }

    // right
    if (keyIsDown(39) && num != 3){
        if (currentTime - right_time >= interval) {
            shapey.mvright();
            right_time = currentTime;
        }
    }
}

function check_collide() {
    let future_positions = shapey.future_pos();
    let current = shapey.get_pos();

    // lower bound
    for(let i = 0; i < future_positions.length; i++){
        let y_pos = future_positions[i].y;
        if(y_pos >= grid_height){
            return 1;
        }
        for(let k = 0; k < dead.length; k++){
            if(p5.Vector.equals(future_positions[i], dead[k].get_pos())){
                return 1;
            }
        }
    }

    // left and right bounds
    for(let j = 0; j < current.length; j++){
        if(current[j].x <= 0){
            return 2;
        }
        if(current[j].x + 1 >= grid_width){
            return 3;
        }
    }
    return 0;
}