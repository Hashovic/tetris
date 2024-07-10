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
        for(let b of this.blocks){
            b.mvdwn();
        }
    }

    // DO THIS NEXT !!!!!!!!!!
    spin() {
        push();
        translate(p5.Vector.add(this.cur_pos, this.type.rotate_pos));
        pop();
    }
}
