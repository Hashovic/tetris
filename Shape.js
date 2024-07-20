class Shape {
    constructor(start_pos, shape_type, pg, instance) {
        this.p = instance;
        this.cur_pos = start_pos;
        this.type = shape_type;
        this.blocks = [];
        this.pg = pg;
        this.rotate_amount = 0;

        for(let v of this.type.positions){
            this.blocks.push(new Block(this.p.createVector(v.x,v.y).add(this.cur_pos), this.type.coloring, this.p, this.pg));
        }
    }

    draw() {
        for(let b of this.blocks){
            b.draw();
        }
    }

    mvdwn() {
        this.cur_pos.add(this.p.createVector(0,1));
        for(let block of this.blocks){
            block.mvdwn();
        }
    }

    mvleft() {
        this.cur_pos.add(this.p.createVector(-1,0));
        for(let block of this.blocks){
            block.mvleft();
        }
    }

    mvright() {
        this.cur_pos.add(this.p.createVector(1,0));
        for(let block of this.blocks){
            block.mvright();
        }
    }

    mvvect(vect){
        this.cur_pos.add(vect);
        for(let block of this.blocks){
            block.mvvect(vect);
        }
    }

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

    // gets the future positions of the shape for collision detection purposes
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

    // gets current position
    get_pos(){
        let current = [];
        for(let b of this.blocks){
            current.push(b.get_pos());
        }
        return current;
    }

    get_cur_pos(){
        return this.cur_pos.copy();
    }

    get_type(){
        return this.type;
    }

    set_color(c){
        for(let b of this.blocks){
            b.set_color(c);
        }
    }

    reset_color(){
        for(let b of this.blocks){
            b.set_color(this.type.coloring);
        }
    }

    get_rotate_amount(){
        return this.rotate_amount % 4;
    }
}
