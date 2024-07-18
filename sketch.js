const LONG_INTERVAL = 125;
const INTERVAL = 30;
const AUTO_INTERVAL = 600;
const DOWN_INTERVAL = 40;
const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;
const B_SIZE = 30;
const NUM_NEXT = 5;

let font;
let held_canvas;
let next_canvas;
let held_piece;
let next_pieces = [];
let next_shapes = [];
let score = 0;
let orientations;
let shapey;
let down_time = 0;
let auto_down_time = 0;
let left_time = 0;
let right_time = 0;
let long_time = 0;
let dead = [];
let first_left = true;
let first_right = true;
let has_switched = false;
let kill = false;

function preload(){
    font = loadFont('/assets/cool_font.otf');
}

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
    window.canvas = createCanvas(GRID_WIDTH * B_SIZE * 2, GRID_HEIGHT * B_SIZE);
    held_canvas = createGraphics(floor(GRID_HEIGHT / 4) * B_SIZE, floor(GRID_HEIGHT / 4)  * B_SIZE - B_SIZE);
    next_canvas = createGraphics(floor(GRID_HEIGHT / 4) * B_SIZE, GRID_WIDTH * 1.5 * B_SIZE);

    window.canvas.addClass('my_canvas');
    shapey = draw_block(floor(GRID_WIDTH / 3), 0, orientations[floor(random(orientations.length))]);

    // populates next_pieces and next_shapes array
    for(let i = 0; i < NUM_NEXT; i++){
        next_pieces.push(orientations[floor(random(orientations.length))]);
    }

    let modx,mody;
    for(let j = 0; j < NUM_NEXT; j++){
        modx = 0;
        mody = 0;
        if(next_pieces[j] == orientations[1]){
            modx = -0.5;
            mody = -0.5;
        }
        else if(next_pieces[j] == orientations[0]){
            modx = 0.5;
        }
        next_shapes.push(draw_block(1 + modx, 3 * j + 0.5 + mody, next_pieces[j], next_canvas));
    }

    centerCanvas();

    textFont(font);
    textSize(B_SIZE);
    textAlign(CENTER, CENTER);

}

function draw(){
    background(220);

    createHold();
    createInstructions();

    translate(floor(GRID_WIDTH / 2) * B_SIZE, 0);

    createNext();
    createGrid();

    for(let j of dead){
        j.draw();
    }
    shapey.draw();

    if(kill){
        for(let block = 0; block < shapey.blocks.length; block++){
            dead.push(shapey.blocks[block]);
        }
        line_clear();
        if (held_piece) held_piece.reset_color();
        has_switched = false;
        shapey = draw_block(floor(GRID_WIDTH/3), 0, next_piece());
        check_lose();
        kill = false;
    }
    else{
        movement();
    }
    
}

function createHold(){
    text('HOLD', B_SIZE * GRID_WIDTH / 4, B_SIZE);
    held_canvas.background(255);
    if (held_piece){
        held_piece.draw();
    }
    image(held_canvas, 0, 2 * B_SIZE);
}

function createNext(){
    push();
    translate(B_SIZE * GRID_WIDTH, B_SIZE);
    text('NEXT', B_SIZE * GRID_WIDTH / 4, 0);
    next_canvas.background(255);
    translate(0,B_SIZE);
    for(let s of next_shapes){
        s.draw();
    }
    image(next_canvas, 0, 0);
    pop();
}

function createGrid(){
    push();
    stroke(0, 50);
    strokeWeight(1);
    for(let i = 0; i <= GRID_WIDTH; i++){
        line(B_SIZE * i, 0, B_SIZE * i, GRID_HEIGHT * B_SIZE);
    }
    for (let j = 1; j < GRID_HEIGHT; j++){
        line(0,B_SIZE * j, GRID_WIDTH * B_SIZE, B_SIZE * j);
    }
    pop();
}

function createInstructions(){
    push();
    textSize(floor(B_SIZE / 2));
    textAlign(LEFT, TOP);
    text('UP --\nROTATE\n\nDOWN --\nSLOW DROP\n\nLEFT+RIGHT --\nHORIZONTAL\n\nSPACE --\nHARD DROP\n\nC --\nHOLD', B_SIZE / 2, B_SIZE * GRID_HEIGHT / 2,floor(GRID_HEIGHT / 3.5) * B_SIZE);
    pop();
}

function centerCanvas(){
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    window.canvas.position(x,y);
}

function windowResized() {
    centerCanvas();
}

const draw_block = (x, y, shape, pg=window) => new Shape(createVector(x, y), shape, pg);

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

    // c (for holding)
    if (keyCode == '67'){
        add_held();
    }
}

function movement() {
    let currentTime = millis();
    // down

    if(currentTime - auto_down_time >= AUTO_INTERVAL){
        if(check_valid(0)) shapey.mvdwn();
        auto_down_time = currentTime;
    }

    if (keyIsDown(40)){
        if (currentTime - down_time >= DOWN_INTERVAL) {
            if(check_valid(0)) shapey.mvdwn();
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
            if (check_valid(1)) shapey.mvleft();
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
            if (check_valid(2)) shapey.mvright();
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
    let removed = [];
    for(let key in counts){
        
        if(counts[key] == GRID_WIDTH){
            removed.push(key);
            score++;
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

function add_held(){
    let shape_type = shapey.get_type();
    if(has_switched) return;

    has_switched = true;

    if(!held_piece){
        held_piece = draw_block(1,1, shape_type, held_canvas);
        
        shapey = draw_block(floor(GRID_WIDTH/3), 0, next_piece());
    }
    else{
        let temp = held_piece.get_type();
        held_piece = draw_block(1,1, shape_type, held_canvas);
        shapey = draw_block(floor(GRID_WIDTH/3), 0, temp);
    }
    if(held_piece && held_piece.get_type() == orientations[1]){
        held_piece.mvvect(createVector(-0.5,-0.5));
    }
    else if(held_piece && held_piece.get_type() == orientations[0]){
        held_piece.mvvect(createVector(0.5,0));
    }
    held_piece.set_color(color(100));
}

function next_piece(){
    let modx = 0;
    let mody = 0;
    let next = next_pieces.shift();
    next_shapes.shift();
    let new_orientation = orientations[floor(random(orientations.length))];
    next_pieces.push(new_orientation);

    for(let shape of next_shapes){
        shape.mvvect(createVector(0,-3));
    }

    if(new_orientation == orientations[1]){
        modx = -0.5;
        mody = -0.5;
    }
    else if(new_orientation == orientations[0]){
        modx = 0.5;
    }

    next_shapes.push(draw_block(1 + modx, 3 * (NUM_NEXT-1) + 0.5 + mody, new_orientation, next_canvas));
    return next;
}

function check_lose(){
    for(let b of shapey.blocks){
        let pos = b.get_pos();
        for(let i = 0; i < dead.length; i++){
            if(p5.Vector.equals(pos, dead[i].get_pos())){
                dead.splice(0,dead.length);
                held_piece = null;
                score = 0;
                return;
            }
        }
    }
}

function create_outline(){
    
}