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

        //shape_J
        {
            positions: [createVector(0,0), createVector(0, 1), createVector(1, 1), createVector(2, 1)],
            coloring: color(130, 90, 240),
            rotate_pos: createVector(1, 1)
        },

        //shape_L
        {
            positions: [createVector(2,0), createVector(0, 1), createVector(1, 1), createVector(2, 1)],
            coloring: color(245, 140, 80),
            rotate_pos: createVector(1, 1)
        },

        //shape_S
        {
            positions: [createVector(1,0), createVector(2, 0), createVector(0, 1), createVector(1, 1)],
            coloring: color(140, 240, 100),
            rotate_pos: createVector(1, 1)
        },

        //shape_Z
        {
            positions: [createVector(0,0), createVector(1, 0), createVector(1, 1), createVector(2, 1)],
            coloring: color(255, 80, 80),
            rotate_pos: createVector(1, 1)
        },

        //shape_T
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
    movement();

    if(check_collide() == 1){
        for(let block = 0; block < shapey.blocks.length; block++){
            dead.push(shapey.blocks[block]);
        }
        shapey = drawBlock(1, 1, orientations[floor(random(orientations.length))])
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
    let temp = new Shape(createVector(x, y), shape);
    
    return temp;
}

function keyPressed() {

    if (keyCode == '38') {
        shapey.rotate();
    }
}

function movement() {
    
    let currentTime = millis();
    // down
    if (keyIsDown(40)){
        if (currentTime - down_time >= interval) {
            shapey.mvdwn();
            down_time = currentTime;
        }
    }

    // left
    if (keyIsDown(37)){
        if (currentTime - left_time >= interval) {
            shapey.mvleft();
            left_time = currentTime;
        }
    }

    // right
    if (keyIsDown(39)){
        if (currentTime - right_time >= interval) {
            shapey.mvright();
            right_time = currentTime;
        }
    }
}

function check_collide() {
    for(let i = 0; i < shapey.blocks.length; i++){
        if(shapey.blocks[i].cur_pos.y + 1 >= grid_height){
            return 1;
        }
    }
}