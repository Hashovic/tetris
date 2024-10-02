
// *** (Multiplayer)

// Global Constants + Multiplayer Values

const LONG_INTERVAL = 125;  // For left and right delay
const INTERVAL = 30;        // Left and right speed
const AUTO_INTERVAL = 600;  // Auto down speed
const DOWN_INTERVAL = 40;   // Down speed
const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;
const B_SIZE = 30;          // Size of grid blocks
const NUM_NEXT = 5;         // Number of next pieces
let garbage = [0,0];        // Garbage amounts for sending and receiving
let isSinglePlayer = false;

// Creates a p5 instance
const tetris = p => {
    // CONTROLS
    p.rotate_key = '87';
    p.down_key = '83';
    p.left_key = '65';
    p.right_key = '68';
    p.hard_key = '86';
    p.hold_key = '67';

    // Local Variables
    let font;
    p.canvas;
    p.held_canvas;
    p.next_canvas;
    let held_piece;
    let next_pieces = [];
    let next_shapes = [];
    let score = 0;
    let orientations;
    let shapey; // Active Shape
    let outline;
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

    // Runs before setup
    p.preload = () => {
        font = p.loadFont('https://hashovic.github.io/tetris/assets/cool_font.otf');
    }

    // Runs one time prior to game start
    p.setup = () => {
        /*
            Creates all the different possible combinations of shapes using vectors provided by p5.js

            Postions is the relative positions of each shape in comparison to the top left corner of
            the shape's 'bounding box' or the possible space that it takes up in a square shape

            Coloring allows the changing of the color of each shape directly in the shape configuration

            Rotate_pos can be thought of as the imaginary square in which everything rotates around
        */
        orientations = [
            // shape_O
            {
                positions: [p.createVector(0,0), p.createVector(1, 0), p.createVector(0, 1), p.createVector(1, 1)],
                coloring: p.color(240, 220, 60),
                rotate_pos: p.createVector(0.5, 0.5)
            },

            // shape_I
            {
                positions: [p.createVector(0,1), p.createVector(1, 1), p.createVector(2, 1), p.createVector(3, 1)],
                coloring: p.color(56, 196, 236),
                rotate_pos: p.createVector(1.5, 0.5)
            },

            // shape_J
            {
                positions: [p.createVector(0,0), p.createVector(0, 1), p.createVector(1, 1), p.createVector(2, 1)],
                coloring: p.color(130, 90, 240),
                rotate_pos: p.createVector(1, 1)
            },

            // shape_L
            {
                positions: [p.createVector(2,0), p.createVector(0, 1), p.createVector(1, 1), p.createVector(2, 1)],
                coloring: p.color(245, 140, 80),
                rotate_pos: p.createVector(1, 1)
            },

            // shape_S
            {
                positions: [p.createVector(1,0), p.createVector(2, 0), p.createVector(0, 1), p.createVector(1, 1)],
                coloring: p.color(140, 240, 100),
                rotate_pos: p.createVector(1, 1)
            },

            // shape_Z
            {
                positions: [p.createVector(0,0), p.createVector(1, 0), p.createVector(1, 1), p.createVector(2, 1)],
                coloring: p.color(255, 80, 80),
                rotate_pos: p.createVector(1, 1)
            },

            // shape_T
            {
                positions: [p.createVector(1,0), p.createVector(0, 1), p.createVector(1, 1), p.createVector(2, 1)],
                coloring: p.color(220, 90, 240),
                rotate_pos: p.createVector(1, 1)
            }
        ]

        // play area
        p.canvas = p.createCanvas(GRID_WIDTH * B_SIZE * 2 + (isSinglePlayer ? 0 : p.floor(B_SIZE / 1.5)), GRID_HEIGHT * B_SIZE);
        p.held_canvas = p.createGraphics(p.floor(GRID_HEIGHT / 4) * B_SIZE, p.floor(GRID_HEIGHT / 4)  * B_SIZE - B_SIZE);
        p.next_canvas = p.createGraphics(p.floor(GRID_HEIGHT / 4) * B_SIZE, GRID_WIDTH * 0.3 * NUM_NEXT * B_SIZE);

        p.canvas.addClass('my_canvas');
        let o = orientations[p.floor(p.random(orientations.length))];
        shapey = draw_block(p.floor(GRID_WIDTH / 3), 0, o);
        outline = draw_block(p.floor(GRID_WIDTH / 3), 0, o);
        draw_outline();

        // populates next_pieces and next_shapes array
        for(let i = 0; i < NUM_NEXT; i++){
            next_pieces.push(orientations[p.floor(p.random(orientations.length))]);
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
            next_shapes.push(draw_block(1 + modx, 3 * j + 0.5 + mody, next_pieces[j], p.next_canvas));
        }

        p.centerCanvas();

        p.textFont(font);
        p.textSize(B_SIZE);
        p.textAlign(p.CENTER, p.CENTER);

    }

    // Game loop (Constantly loops)
    p.draw = () => {
        p.background(220);

        createHold();
        createInstructions();

        p.translate(p.floor(B_SIZE / 1.5), 0);
        createGarbage();

        p.translate(p.floor(GRID_WIDTH / 2) * B_SIZE, 0);

        createNext();
        playerNum();

        createGrid();

        for(let j of dead){
            j.draw();
        }

        outline.draw();
        shapey.draw();

        if(kill){
            for(let block = 0; block < shapey.blocks.length; block++){
                dead.push(shapey.blocks[block]);
            }

            let lines = line_clear();
            if(!isSinglePlayer && lines){
                // DOUBLE
                if(lines == 2){
                    sendGarbage(1);
                }
                // TRIPLE
                else if(lines == 3){
                    sendGarbage(2);
                }
                // TETRIS
                else if(lines == 4){
                    sendGarbage(4);
                }
            }

            // PERFECT CLEAR
            if(!isSinglePlayer && dead.length == 0){
                sendGarbage(10);
            }

            if(!(isSinglePlayer || lines)) addGarbageBlocks();

            if (held_piece) held_piece.reset_color();
            has_switched = false;
            let next = next_piece();
            shapey = draw_block(p.floor(GRID_WIDTH/3), 0, next);
            outline = draw_block(p.floor(GRID_WIDTH / 3), 0, next);

            check_lose();
            draw_outline();

            kill = false;
        }
        else{
            movement();
        }
        
    }

    // Draws the held piece
    function createHold(){
        p.text('HOLD', B_SIZE * GRID_WIDTH / 4, B_SIZE);
        p.held_canvas.background(255);
        if (held_piece){
            held_piece.draw();
        }
        p.image(p.held_canvas, 0, 2 * B_SIZE);
    }

    // *** Draws the red garbage bar
    function createGarbage(){
        let g_width = p.floor(B_SIZE / 1.5);
        let num_garbage = garbage[0];
        p.push();
        p.translate(p.floor(GRID_WIDTH / 2) * B_SIZE - g_width, 0);
        p.fill(p.color(50, 100));
        p.rect(0,0, g_width, p.height);
        p.rectMode(p.CORNERS);
        p.fill(p.color(255,0,0));
        p.rect(0, p.height, g_width, p.height - (num_garbage * B_SIZE));
        p.pop();
    }

    // *** Adds the garbage to the game
    function addGarbageBlocks(){
        let num_garbage = garbage[0];
        let hole = p.floor(p.random(GRID_WIDTH));
        let block_pos;
        let c = p.color(160,156,156);
        for(let b of dead){
            b.mvvect(p.createVector(0, -num_garbage));
        }
        for(let i = 1; i <= num_garbage; i++){
            for(let j = 0; j < GRID_WIDTH; j++){
                if(j != hole){
                    block_pos = p.createVector(j, GRID_HEIGHT - i);
                    dead.push(new Block(block_pos,c,p,p));
                }
            }
        }
        garbage[0] = 0;
    }

    // *** Sends garbage to the opponent
    function sendGarbage(amount){
        if(amount <= garbage[0]){
            garbage[0] -= amount;
        }
        else {
            amount -= garbage[0];
            garbage[0] = 0;
            garbage[1] += amount;
        }
    }

    // Draws the next shapes
    function createNext(){
        p.push();
        p.translate(B_SIZE * GRID_WIDTH, B_SIZE);
        p.text('NEXT', B_SIZE * GRID_WIDTH / 4, 0);
        p.next_canvas.background(255);
        p.translate(0,B_SIZE);
        for(let s of next_shapes){
            s.draw();
        }
        p.image(p.next_canvas, 0, 0);
        p.pop();
    }

    // *** Shows player number
    function playerNum(){
        p.push();
        p.translate(B_SIZE * GRID_WIDTH, p.next_canvas.height);
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(26);
        p.text("Player 1", p.floor(B_SIZE / 2), 2.5 * B_SIZE);
        p.pop();
    }

    // Draws the grid
    function createGrid(){
        p.push();
        p.stroke(0, 50);
        p.strokeWeight(1);
        for(let i = 0; i <= GRID_WIDTH; i++){
            p.line(B_SIZE * i, 0, B_SIZE * i, GRID_HEIGHT * B_SIZE);
        }
        for (let j = 1; j < GRID_HEIGHT; j++){
            p.line(0,B_SIZE * j, GRID_WIDTH * B_SIZE, B_SIZE * j);
        }
        p.pop();
    }

    // Writes the instructions
    function createInstructions(){
        p.push();
        p.textSize(p.floor(B_SIZE / 2));
        p.textAlign(p.LEFT, p.TOP);
        p.text('W >>\nROTATE\n\nS >>\nSLOW DROP\n\nA + D >>\nHORIZONTAL\n\nV --\nHARD DROP\n\nC --\nHOLD', B_SIZE / 2, B_SIZE * GRID_HEIGHT / 2,p.floor(GRID_HEIGHT / 3.5) * B_SIZE);
        p.pop();
    }

    // Centers the canvas
    p.centerCanvas = () => {
        let x = (p.windowWidth) / 2 - p.width - B_SIZE;
        let y = (p.windowHeight - p.height) / 2;
        p.canvas.position(x,y);
    }

    // Runs the center canvas method when window is resized
    p.windowResized = () => {
        p.centerCanvas();
    }

    // Creates a shape object at position (x,y) with a certain shape type
    const draw_block = (x, y, shape, pg=p) => new Shape(p.createVector(x, y), shape, pg, p);

    // Runs when a key is pressed
    p.keyPressed = () => {
        
        // w key
        if (p.keyCode == p.rotate_key) {
            if(check_valid(3)){
                shapey.rotate();
                draw_outline();
            }
        }

        // spacebar (x)
        if (p.keyCode == p.hard_key) {
            while (check_valid(0)){
                shapey.mvdwn();
            }
        }

        // left (a)
        if (p.keyCode == p.left_key) {
            first_left = true;
            if (check_valid(1)){
                shapey.mvleft();
                draw_outline();
            }
        }

        // right (d)
        if (p.keyCode == p.right_key) {
            first_right = true;
            if (check_valid(2)){
                shapey.mvright();
                draw_outline();
            }
        }

        // c (for holding)
        if (p.keyCode == p.hold_key){
            add_held();
        }
    }

    // Deals with all the movement
    function movement() {
        let currentTime = p.millis();
        // down

        if(currentTime - auto_down_time >= AUTO_INTERVAL){
            if(check_valid(0)) shapey.mvdwn();
            auto_down_time = currentTime;
        }

        if (p.keyIsDown(Number(p.down_key))){
            if (currentTime - down_time >= DOWN_INTERVAL) {
                if(check_valid(0)) shapey.mvdwn();
                down_time = currentTime;
            }
        }

        // left
        if (p.keyIsDown(Number(p.left_key))){
            if (first_left) {
                long_time = currentTime;
                first_left = false;
            }
            else if (currentTime - left_time >= INTERVAL && currentTime - long_time >= LONG_INTERVAL) {
                if (check_valid(1)){
                    shapey.mvleft();
                    draw_outline();
                }
                left_time = currentTime;
            }
        }

        // right
        if (p.keyIsDown(Number(p.right_key))){
            if (first_right) {
                long_time = currentTime;
                first_right = false;
            }
            else if (currentTime - right_time >= INTERVAL && currentTime - long_time >= LONG_INTERVAL) {
                if (check_valid(2)){
                    shapey.mvright();
                    draw_outline();
                }
                right_time = currentTime;
            }
        }
    }

    // Checks if a move is a valid move
    function check_valid(c, s=shapey){
        const future_positions = s.future_pos(c);
        
        for(let pos of future_positions){
            if(pos.y + 1 > GRID_HEIGHT){
                if(c == 0 && s == shapey){kill = true;}
                return false;
            }
            if(pos.x < 0){
                return false;
            }
            if(pos.x + 1 > GRID_WIDTH){
                return false;
            }
            for(let i = 0; i < dead.length; i++){
                if(pos.equals(dead[i].get_pos())){
                    if(c == 0 && s == shapey){kill = true;}
                    return false;
                }
            }
        }
        return true;
    }

    // Checks if a line is cleared
    // *** Returns lines cleared to be used for garbage sending
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

        return removed.length;
    }

    // Deals with adding a held piece
    function add_held(){
        let shape_type = shapey.get_type();
        if(has_switched) return;

        has_switched = true;

        if(!held_piece){
            held_piece = draw_block(1,1, shape_type, p.held_canvas);
            
            let next = next_piece();
            shapey = draw_block(p.floor(GRID_WIDTH/3), 0, next);
            outline = draw_block(p.floor(GRID_WIDTH/3), 0, next);

            draw_outline();
        }
        else{
            let temp = held_piece.get_type();
            held_piece = draw_block(1,1, shape_type, p.held_canvas);
            shapey = draw_block(p.floor(GRID_WIDTH/3), 0, temp);
            outline = draw_block(p.floor(GRID_WIDTH/3), 0, temp);

            draw_outline();
        }
        if(held_piece && held_piece.get_type() == orientations[1]){
            held_piece.mvvect(p.createVector(-0.5,-0.5));
        }
        else if(held_piece && held_piece.get_type() == orientations[0]){
            held_piece.mvvect(p.createVector(0.5,0));
        }
        held_piece.set_color(p.color(100));
    }

    // Returns the next piece in the queue and moves the rest accordingly
    function next_piece(){
        let modx = 0;
        let mody = 0;
        let next = next_pieces.shift();
        next_shapes.shift();
        let new_orientation = orientations[p.floor(p.random(orientations.length))];
        next_pieces.push(new_orientation);

        for(let shape of next_shapes){
            shape.mvvect(p.createVector(0,-3));
        }

        if(new_orientation == orientations[1]){
            modx = -0.5;
            mody = -0.5;
        }
        else if(new_orientation == orientations[0]){
            modx = 0.5;
        }

        next_shapes.push(draw_block(1 + modx, 3 * (NUM_NEXT-1) + 0.5 + mody, new_orientation, p.next_canvas));
        return next;
    }

    // Checks for loss and calls window.gameOver method
    function check_lose(){
        for(let b of shapey.blocks){
            let pos = b.get_pos();
            for(let i = 0; i < dead.length; i++){
                if(pos.equals(dead[i].get_pos())){
                    dead.splice(0,dead.length);
                    held_piece = null;
                    score = 0;

                    if (typeof window.gameOver === 'function') window.gameOver(2);

                    return true;
                }
            }
        }
    }

    // Draws the shadow shape
    function draw_outline(){
        let pos = shapey.get_cur_pos();
        let t = shapey.get_type();
        outline = draw_block(pos.x, pos.y, t);

        let r = shapey.get_rotate_amount();
        for(let i = 0; i < r; i++){
            outline.rotate();
        }

        while (check_valid(0, outline)){
            outline.mvdwn();
        }

        let c = p.color(100);
        p.push();
        c.setAlpha(75);
        outline.set_color(c);
        p.pop();
    }
}

// Creates a p5 instance (This instance is used for single player)
const tetris2 = p => {
    // CONTROLS
    p.rotate_key = '38';
    p.down_key = '40';
    p.left_key = '37';
    p.right_key = '39';
    p.hard_key = isSinglePlayer ? '32' :'188';
    p.hold_key = isSinglePlayer ? '67': '190';

    // Local Variables
    let font;
    p.canvas;
    p.held_canvas;
    p.next_canvas;
    let held_piece;
    let next_pieces = [];
    let next_shapes = [];
    let score = 0;
    let orientations;
    let shapey; // Active Shape
    let outline;
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

    // Runs before setup
    p.preload = () => {
        font = p.loadFont('https://hashovic.github.io/tetris/assets/cool_font.otf');
    }

    // Runs one time prior to game start
    p.setup = () => {
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
                positions: [p.createVector(0,0), p.createVector(1, 0), p.createVector(0, 1), p.createVector(1, 1)],
                coloring: p.color(240, 220, 60),
                rotate_pos: p.createVector(0.5, 0.5)
            },

            // shape_I
            {
                positions: [p.createVector(0,1), p.createVector(1, 1), p.createVector(2, 1), p.createVector(3, 1)],
                coloring: p.color(56, 196, 236),
                rotate_pos: p.createVector(1.5, 0.5)
            },

            // shape_J
            {
                positions: [p.createVector(0,0), p.createVector(0, 1), p.createVector(1, 1), p.createVector(2, 1)],
                coloring: p.color(130, 90, 240),
                rotate_pos: p.createVector(1, 1)
            },

            // shape_L
            {
                positions: [p.createVector(2,0), p.createVector(0, 1), p.createVector(1, 1), p.createVector(2, 1)],
                coloring: p.color(245, 140, 80),
                rotate_pos: p.createVector(1, 1)
            },

            // shape_S
            {
                positions: [p.createVector(1,0), p.createVector(2, 0), p.createVector(0, 1), p.createVector(1, 1)],
                coloring: p.color(140, 240, 100),
                rotate_pos: p.createVector(1, 1)
            },

            // shape_Z
            {
                positions: [p.createVector(0,0), p.createVector(1, 0), p.createVector(1, 1), p.createVector(2, 1)],
                coloring: p.color(255, 80, 80),
                rotate_pos: p.createVector(1, 1)
            },

            // shape_T
            {
                positions: [p.createVector(1,0), p.createVector(0, 1), p.createVector(1, 1), p.createVector(2, 1)],
                coloring: p.color(220, 90, 240),
                rotate_pos: p.createVector(1, 1)
            }
        ]

        // play area
        p.canvas = p.createCanvas(GRID_WIDTH * B_SIZE * 2 + (isSinglePlayer ? 0 : p.floor(B_SIZE / 1.5)), GRID_HEIGHT * B_SIZE);
        p.held_canvas = p.createGraphics(p.floor(GRID_HEIGHT / 4) * B_SIZE, p.floor(GRID_HEIGHT / 4)  * B_SIZE - B_SIZE);
        p.next_canvas = p.createGraphics(p.floor(GRID_HEIGHT / 4) * B_SIZE, GRID_WIDTH * 0.3 * NUM_NEXT * B_SIZE);

        p.canvas.addClass('my_canvas');
        let o = orientations[p.floor(p.random(orientations.length))];
        shapey = draw_block(p.floor(GRID_WIDTH / 3), 0, o);
        outline = draw_block(p.floor(GRID_WIDTH / 3), 0, o);
        draw_outline();

        // populates next_pieces and next_shapes array
        for(let i = 0; i < NUM_NEXT; i++){
            next_pieces.push(orientations[p.floor(p.random(orientations.length))]);
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
            next_shapes.push(draw_block(1 + modx, 3 * j + 0.5 + mody, next_pieces[j], p.next_canvas));
        }

        p.centerCanvas();

        p.textFont(font);
        p.textSize(B_SIZE);
        p.textAlign(p.CENTER, p.CENTER);

    }

    // Game loop (Constantly loops)
    p.draw = () => {
        p.background(220);

        createHold();
        createInstructions();
        
        if(!isSinglePlayer){
            p.translate(p.floor(B_SIZE / 1.5), 0);
            createGarbage();
        }

        p.translate(p.floor(GRID_WIDTH / 2) * B_SIZE, 0);

        createNext();
        if(isSinglePlayer){
            createScore();
        }
        else {
            playerNum();
        }
        createGrid();

        for(let j of dead){
            j.draw();
        }

        outline.draw();
        shapey.draw();

        if(kill){
            for(let block = 0; block < shapey.blocks.length; block++){
                dead.push(shapey.blocks[block]);
            }

            let lines = line_clear();
            if(!isSinglePlayer && lines){
                // DOUBLE
                if(lines == 2){
                    sendGarbage(1);
                }
                // TRIPLE
                else if(lines == 3){
                    sendGarbage(2);
                }
                // TETRIS
                else if(lines == 4){
                    sendGarbage(4);
                }
            }

            // PERFECT CLEAR
            if(!isSinglePlayer && dead.length == 0){
                sendGarbage(10);
            }

            if(!(isSinglePlayer || lines)) addGarbageBlocks();

            if (held_piece) held_piece.reset_color();
            has_switched = false;
            let next = next_piece();
            shapey = draw_block(p.floor(GRID_WIDTH/3), 0, next);
            outline = draw_block(p.floor(GRID_WIDTH / 3), 0, next);

            check_lose();
            draw_outline();

            kill = false;
        }
        else{
            movement();
        }
        
    }

    // Draws the held piece
    function createHold(){
        p.text('HOLD', B_SIZE * GRID_WIDTH / 4, B_SIZE);
        p.held_canvas.background(255);
        if (held_piece){
            held_piece.draw();
        }
        p.image(p.held_canvas, 0, 2 * B_SIZE);
    }

    // *** Draws the red garbage bar
    function createGarbage(){
        let g_width = p.floor(B_SIZE / 1.5);
        let num_garbage = garbage[1];
        p.push();
        p.translate(p.floor(GRID_WIDTH / 2) * B_SIZE - g_width, 0);
        p.fill(p.color(50, 100));
        p.rect(0,0, g_width, p.height);
        p.rectMode(p.CORNERS);
        p.fill(p.color(255,0,0));
        p.rect(0,p.height,g_width,p.height - (num_garbage * B_SIZE));
        p.pop();
    }

    // *** Adds the garbage to the game
    function addGarbageBlocks(){
        let num_garbage = garbage[1];
        let hole = p.floor(p.random(GRID_WIDTH));
        let block_pos;
        let c = p.color(160,156,156);
        for(let b of dead){
            b.mvvect(p.createVector(0, -num_garbage));
        }
        for(let i = 1; i <= num_garbage; i++){
            for(let j = 0; j < GRID_WIDTH; j++){
                if(j != hole){
                    block_pos = p.createVector(j, GRID_HEIGHT - i);
                    dead.push(new Block(block_pos,c,p,p));
                }
            }
        }
        garbage[1] = 0;
    }

    // *** Sends garbage to the opponent
    function sendGarbage(amount){
        if(amount <= garbage[1]){
            garbage[1] -= amount;
        }
        else {
            amount -= garbage[1];
            garbage[1] = 0;
            garbage[0] += amount;
        }
    }

    // Draws the next shapes
    function createNext(){
        p.push();
        p.translate(B_SIZE * GRID_WIDTH, B_SIZE);
        p.text('NEXT', B_SIZE * GRID_WIDTH / 4, 0);
        p.next_canvas.background(255);
        p.translate(0,B_SIZE);
        for(let s of next_shapes){
            s.draw();
        }
        p.image(p.next_canvas, 0, 0);
        p.pop();
    }

    // (Single Player exclusive) Draws the score
    function createScore() {
        p.push();
        p.translate(B_SIZE * GRID_WIDTH, p.next_canvas.height);
        p.textAlign(p.LEFT, p.TOP);
        p.text("SCORE >>", p.floor(B_SIZE / 2), 2.5 * B_SIZE);
        p.text(`${score}`, B_SIZE * 2, 3.5 * B_SIZE);
        p.pop();
    }

    // *** Shows player number
    function playerNum(){
        p.push();
        p.translate(B_SIZE * GRID_WIDTH, p.next_canvas.height);
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(26);
        p.text("Player 2", p.floor(B_SIZE / 2), 2.5 * B_SIZE);
        p.pop();
    }

    // Draws the grid
    function createGrid(){
        p.push();
        p.stroke(0, 50);
        p.strokeWeight(1);
        for(let i = 0; i <= GRID_WIDTH; i++){
            p.line(B_SIZE * i, 0, B_SIZE * i, GRID_HEIGHT * B_SIZE);
        }
        for (let j = 1; j < GRID_HEIGHT; j++){
            p.line(0,B_SIZE * j, GRID_WIDTH * B_SIZE, B_SIZE * j);
        }
        p.pop();
    }

    // Writes the instructions
    function createInstructions(){
        p.push();
        p.textSize(p.floor(B_SIZE / 2));
        p.textAlign(p.LEFT, p.TOP);
        p.text(`UP >>\nROTATE\n\nDOWN >>\nSLOW DROP\n\nLEFT+RIGHT >>\nHORIZONTAL\n\n${isSinglePlayer ? 'SPACE': '<'} --\nHARD DROP\n\n${isSinglePlayer ? 'C': '>'} --\nHOLD`,
               B_SIZE / 2, B_SIZE * GRID_HEIGHT / 2,p.floor(GRID_HEIGHT / 3.5) * B_SIZE);
        p.pop();
    }

    // Centers the canvas
    p.centerCanvas = () => {
        let x = isSinglePlayer ? (p.windowWidth - p.width) / 2 : (p.windowWidth - p.width) / 2 + p.width / 2 + B_SIZE;
        let y = (p.windowHeight - p.height) / 2;
        p.canvas.position(x,y);
    }

    // Runs the center canvas method when window is resized
    p.windowResized = () => {
        p.centerCanvas();
    }

    // Creates a shape object at position (x,y) with a certain shape type
    const draw_block = (x, y, shape, pg=p) => new Shape(p.createVector(x, y), shape, pg, p);

    // Runs when a key is pressed
    p.keyPressed = () => {
        
        // w key
        if (p.keyCode == p.rotate_key) {
            if(check_valid(3)){
                shapey.rotate();
                draw_outline();
            }
        }

        // spacebar (x)
        if (p.keyCode == p.hard_key) {
            while (check_valid(0)){
                shapey.mvdwn();
            }
        }

        // left (a)
        if (p.keyCode == p.left_key) {
            first_left = true;
            if (check_valid(1)){
                shapey.mvleft();
                draw_outline();
            }
        }

        // right (d)
        if (p.keyCode == p.right_key) {
            first_right = true;
            if (check_valid(2)){
                shapey.mvright();
                draw_outline();
            }
        }

        // c (for holding)
        if (p.keyCode == p.hold_key){
            add_held();
        }
    }

    // Deals with all the movement
    function movement() {
        let currentTime = p.millis();
        // down

        if(currentTime - auto_down_time >= AUTO_INTERVAL){
            if(check_valid(0)) shapey.mvdwn();
            auto_down_time = currentTime;
        }

        if (p.keyIsDown(Number(p.down_key))){
            if (currentTime - down_time >= DOWN_INTERVAL) {
                if(check_valid(0)) shapey.mvdwn();
                down_time = currentTime;
            }
        }

        // left
        if (p.keyIsDown(Number(p.left_key))){
            if (first_left) {
                long_time = currentTime;
                first_left = false;
            }
            else if (currentTime - left_time >= INTERVAL && currentTime - long_time >= LONG_INTERVAL) {
                if (check_valid(1)){
                    shapey.mvleft();
                    draw_outline();
                }
                left_time = currentTime;
            }
        }

        // right
        if (p.keyIsDown(Number(p.right_key))){
            if (first_right) {
                long_time = currentTime;
                first_right = false;
            }
            else if (currentTime - right_time >= INTERVAL && currentTime - long_time >= LONG_INTERVAL) {
                if (check_valid(2)){
                    shapey.mvright();
                    draw_outline();
                }
                right_time = currentTime;
            }
        }
    }

    // Checks if a move is a valid move
    function check_valid(c, s=shapey){
        const future_positions = s.future_pos(c);
        
        for(let pos of future_positions){
            if(pos.y + 1 > GRID_HEIGHT){
                if(c == 0 && s == shapey){kill = true;}
                return false;
            }
            if(pos.x < 0){
                return false;
            }
            if(pos.x + 1 > GRID_WIDTH){
                return false;
            }
            for(let i = 0; i < dead.length; i++){
                if(pos.equals(dead[i].get_pos())){
                    if(c == 0 && s == shapey){kill = true;}
                    return false;
                }
            }
        }
        return true;
    }

    // Checks if a line is cleared
    // *** Returns lines cleared to be used for garbage sending
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

        return removed.length;
    }

    // Deals with adding a held piece
    function add_held(){
        let shape_type = shapey.get_type();
        if(has_switched) return;

        has_switched = true;

        if(!held_piece){
            held_piece = draw_block(1,1, shape_type, p.held_canvas);
            
            let next = next_piece();
            shapey = draw_block(p.floor(GRID_WIDTH/3), 0, next);
            outline = draw_block(p.floor(GRID_WIDTH/3), 0, next);

            draw_outline();
        }
        else{
            let temp = held_piece.get_type();
            held_piece = draw_block(1,1, shape_type, p.held_canvas);
            shapey = draw_block(p.floor(GRID_WIDTH/3), 0, temp);
            outline = draw_block(p.floor(GRID_WIDTH/3), 0, temp);

            draw_outline();
        }
        if(held_piece && held_piece.get_type() == orientations[1]){
            held_piece.mvvect(p.createVector(-0.5,-0.5));
        }
        else if(held_piece && held_piece.get_type() == orientations[0]){
            held_piece.mvvect(p.createVector(0.5,0));
        }
        held_piece.set_color(p.color(100));
    }

    // Returns the next piece in the queue and adds new piece
    function next_piece(){
        let modx = 0;
        let mody = 0;
        let next = next_pieces.shift();
        next_shapes.shift();
        let new_orientation = orientations[p.floor(p.random(orientations.length))];
        next_pieces.push(new_orientation);

        for(let shape of next_shapes){
            shape.mvvect(p.createVector(0,-3));
        }

        if(new_orientation == orientations[1]){
            modx = -0.5;
            mody = -0.5;
        }
        else if(new_orientation == orientations[0]){
            modx = 0.5;
        }

        next_shapes.push(draw_block(1 + modx, 3 * (NUM_NEXT-1) + 0.5 + mody, new_orientation, p.next_canvas));
        return next;
    }

    // Checks for loss and calls window.gameOver method
    function check_lose(){
        for(let b of shapey.blocks){
            let pos = b.get_pos();
            for(let i = 0; i < dead.length; i++){
                if(pos.equals(dead[i].get_pos())){
                    dead.splice(0,dead.length);
                    held_piece = null;

                    if (typeof window.gameOver === 'function') window.gameOver(1, score);
                    score = 0;

                    return true;
                }
            }
        }
    }

    // Draws the shadow shape to help with placement
    function draw_outline(){
        let pos = shapey.get_cur_pos();
        let t = shapey.get_type();
        outline = draw_block(pos.x, pos.y, t);

        let r = shapey.get_rotate_amount();
        for(let i = 0; i < r; i++){
            outline.rotate();
        }

        while (check_valid(0, outline)){
            outline.mvdwn();
        }

        let c = p.color(100);
        p.push();
        c.setAlpha(75);
        outline.set_color(c);
        p.pop();
    }
}
