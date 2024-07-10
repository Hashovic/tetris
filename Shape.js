class Shape {
    constructor(start_pos, shape_type) {
        this.cur_pos = start_pos;
        this.type = shape_type;
        this.blocks = [];

        for(let v of this.type.positions){
            this.blocks.push(new Block(p5.Vector.add(v, start_pos), this.type.coloring));
        }
    }

    draw() {
        for(let b of this.blocks){
            b.draw();
        }
    }

    mvdwn() {
        for(let b of this.blocks){
            b.mvdwn();
        }
    }
}
