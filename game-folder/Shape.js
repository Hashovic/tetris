class Shape {
    // Constructs shape object with a start_position(as a vector), type and where to draw it (i.e. canvas)
    constructor(start_pos, shape_type, pg, instance) {
        this.p = instance;
        this.cur_pos = start_pos;
        this.type = shape_type;
        this.blocks = [];
        this.pg = pg;
        this.rotate_amount = 0;

        // Creates blocks to make up the shape
        for(let v of this.type.positions){
            this.blocks.push(new Block(this.p.createVector(v.x,v.y).add(this.cur_pos), this.type.coloring, this.p, this.pg));
        }
    }

    // Draws the shape
    draw() {
        for(let b of this.blocks){
            b.draw();
        }
    }

    // Moves the shape down one block length
    mvdwn() {
        this.cur_pos.add(this.p.createVector(0,1));
        for(let block of this.blocks){
            block.mvdwn();
        }
    }

    // Moves the shape left
    mvleft() {
        this.cur_pos.add(this.p.createVector(-1,0));
        for(let block of this.blocks){
            block.mvleft();
        }
    }

    // Moves the shape right
    mvright() {
        this.cur_pos.add(this.p.createVector(1,0));
        for(let block of this.blocks){
            block.mvright();
        }
    }

    // Moves the shape by a vector amount
    mvvect(vect){
        this.cur_pos.add(vect);
        for(let block of this.blocks){
            block.mvvect(vect);
        }
    }

    // Rotates the shape
    rotate() {
        // Finds the reference rotation block in comparison to the top-left
        // corner of the shape by adding the rotate_pos vector to the cur_pos vector
        const center = this.p.createVector(this.cur_pos.x, this.cur_pos.y).add(this.type.rotate_pos);
        this.rotate_amount++;

        // Iterates over all the blocks
        for (let block of this.blocks) {
            // Finds the distance between it and the center
            // let block_pos;
            let relativePos = block.get_pos().sub(center);

            // Inverts the x and y coordinates of the relative position
            // and flips it along the y-axis
            // This simulates the 90 degree turn we want
            let rotatedPos = this.p.createVector(-relativePos.y, relativePos.x);

            // Sets the block's new position to the position
            // rotated 90 degrees clockwise
            block.set_pos(this.p.createVector(rotatedPos.x, rotatedPos.y).add(center));
        }
    }

    // Gets the future positions of the shape for collision detection purposes
    future_pos(c) {
        let future = [];
        switch(c){
            case 0: // down case
                for(let b of this.blocks){
                    future.push(b.get_pos().add(this.p.createVector(0, 1)));
                }
                return future;

            case 1: // left case
                for(let b of this.blocks){
                    future.push(b.get_pos().add(this.p.createVector(-1, 0)));
                }
                return future;

            case 2: // right case
                for(let b of this.blocks){
                    future.push(b.get_pos().add(this.p.createVector(1, 0)));
                }
                return future;
            
            case 3: // rotate case (simple) *functionality explained in rotate method
                const center = this.p.createVector(this.cur_pos.x, this.cur_pos.y).add(this.type.rotate_pos);
                for(let b of this.blocks) {
                    let relativePos = b.get_pos().sub(center);
                    let rotatedPos = this.p.createVector(-relativePos.y, relativePos.x);
                    future.push(this.p.createVector(rotatedPos.x, rotatedPos.y).add(center));
                }
                return future;
        }
    }

    // Gets current position of each block
    get_pos(){
        let current = [];
        for(let b of this.blocks){
            current.push(b.get_pos());
        }
        return current;
    }

    // Gets the current position of the shape
    get_cur_pos(){
        return this.cur_pos.copy();
    }

    // Gets the type of shape
    get_type(){
        return this.type;
    }

    // Sets the color of the shape
    set_color(c){
        for(let b of this.blocks){
            b.set_color(c);
        }
    }

    // Returns the shape color to the default
    reset_color(){
        for(let b of this.blocks){
            b.set_color(this.type.coloring);
        }
    }

    // Returns rotation state
    get_rotate_amount(){
        return this.rotate_amount % 4;
    }
}
