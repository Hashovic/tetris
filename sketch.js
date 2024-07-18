const LONG_INTERVAL = 120;
const INTERVAL = 40;
const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;
const B_SIZE = 30;

let orientations;
let shapey;
let down_time = 0;
let left_time = 0;
let right_time = 0;
let long_time = 0;
let dead = [];
let first_left = true;
let first_right = true;
let kill = false;



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
            coloring: color(56, 196, 236),
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

    // play area
    window.canvas = createCanvas(GRID_WIDTH * B_SIZE, GRID_HEIGHT * B_SIZE);
    window.canvas.addClass('my_canvas');
    shapey = draw_block(1, 1, orientations[floor(random(orientations.length))]);

    centerCanvas();

    // preview
    // createPreview();

    // held
    // createHeld();

}

function draw(){
    background(220);
    for(let j of dead){
        j.draw();
    }
    shapey.draw();

    if(kill){
        for(let block = 0; block < shapey.blocks.length; block++){
            dead.push(shapey.blocks[block]);
        }
        line_clear();
        shapey = draw_block(floor(GRID_WIDTH/3), 1, orientations[floor(random(orientations.length))]);
        kill = false;
    }
    else{
        movement();
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

const draw_block = (x, y, shape) => new Shape(createVector(x, y), shape);

function keyPressed() {
    
    // up arrow
    if (keyCode == '38') {
        if(check_valid(3)){shapey.rotate();}
    }

    // spacebar
    if (keyCode == '32') {
        while (check_valid(0)){
            shapey.mvdwn();
        }
    }

    // left
    if (keyCode == '37') {
        first_left = true;
        if (check_valid(1)){shapey.mvleft();}
    }

    // right
    if (keyCode == '39') {
        first_right = true;
        if (check_valid(2)){shapey.mvright();}
    }
}

function movement() {
    let currentTime = millis();
    // down
    if (keyIsDown(40)){
        if (currentTime - down_time >= INTERVAL) {
            if(check_valid(0)){shapey.mvdwn();}
            down_time = currentTime;
        }
    }

    // left
    if (keyIsDown(37)){
        if (first_left) {
            long_time = currentTime;
            first_left = false;
        }
        else if (currentTime - left_time >= INTERVAL && currentTime - long_time >= LONG_INTERVAL) {
            if (check_valid(1)){shapey.mvleft();}
            left_time = currentTime;
        }
    }

    // right
    if (keyIsDown(39)){
        if (first_right) {
            long_time = currentTime;
            first_right = false;
        }
        else if (currentTime - right_time >= INTERVAL && currentTime - long_time >= LONG_INTERVAL) {
            if (check_valid(2)){shapey.mvright();}
            right_time = currentTime;
        }
    }
}

function check_valid(c){
    const future_positions = shapey.future_pos(c);
    
    for(let pos of future_positions){
        if(pos.y + 1 > GRID_HEIGHT){
            if(c == 0){kill = true;}
            return false;
        }
        if(pos.x < 0){
            return false;
        }
        if(pos.x + 1 > GRID_WIDTH){
            return false;
        }
        for(let i = 0; i < dead.length; i++){
            if(p5.Vector.equals(pos, dead[i].get_pos())){
                if(c == 0){kill = true;}
                return false;
            }
        }
    }
    return true;
}

function line_clear(){
    let counts = {};
    for(let b of dead) {
        let y_pos = b.get_pos().y;
        if(counts[y_pos]){
            counts[y_pos]++;
        }
        else{
            counts[y_pos] = 1;
        }
    }
    let num = 0;
    let removed = [];
    for(let key in counts){
        
        if(counts[key] == GRID_WIDTH){
            removed.push(key);
            num++;
            for(let i = 0; i < dead.length; i++){
                if(dead[i].get_pos().y == Number(key)){
                    dead.splice(i, 1);
                    i--;
                }
            }
        }
        
    }

    removed.sort((a,b) => a - b);

    for(let line of removed){
        for(let i = 0; i < dead.length; i++){
            if(Number(line) > dead[i].get_pos().y){
                dead[i].mvdwn();
            }
        }
    }
}