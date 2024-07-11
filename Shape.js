class Shape {
    constructor(start_pos, shape_type) {
        this.cur_pos = start_pos;
        this.type = shape_type;
        this.blocks = [];

        for(let v of this.type.positions){
            this.blocks.push(new Block(p5.Vector.add(v, this.cur_pos), this.type.coloring));
        }
    }

    draw() {
        for(let b of this.blocks){
            b.draw();
        }
    }

    mvdwn() {
        this.cur_pos.add(createVector(0,1));
        for(let block of this.blocks){
            block.mvdwn();
        }
    }

    mvleft() {
        this.cur_pos.add(createVector(-1,0));
        for(let block of this.blocks){
            block.mvleft();
        }
    }

    mvright() {
        this.cur_pos.add(createVector(1,0));
        for(let block of this.blocks){
            block.mvright();
        }
    }

    rotate() {
        // Finds the reference rotation block in comparison to the top-left
        // corner of the shape by adding the rotate_pos vector to the cur_pos vector
        const center = p5.Vector.add(this.cur_pos, this.type.rotate_pos);

        // Iterates over all the blocks
        for (let block of this.blocks) {
            // Finds the distance between it and the center 
            let relativePos = p5.Vector.sub(block.get_pos(), center);

            // Inverts the x and y coordinates of the relative position
            // and flips it along the y-axis
            // This simulates the 90 degree turn we want
            let rotatedPos = createVector(-relativePos.y, relativePos.x);

            // Sets the block's new position to the position
            // rotated 90 degrees clockwise
            block.set_pos(p5.Vector.add(rotatedPos, center));
        }
    }
}
