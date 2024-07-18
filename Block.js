class Block {
    constructor(pos, coloring) {
        this.cur_pos = pos;
        this.color = coloring;
    }

    draw() {
        push();
        let pos = this.cur_pos.copy().mult(B_SIZE);
        fill(this.color);
        strokeWeight(0);
        square(pos.x, pos.y, B_SIZE);
        pop();
    }

    mvdwn() {
        this.cur_pos.add(createVector(0,1));
    }

    mvleft() {
        this.cur_pos.add(createVector(-1,0));
    }

    mvright() {
        this.cur_pos.add(createVector(1,0));
    }

    set_pos(val) {
        this.cur_pos = val;
    }

    get_pos(){
        return this.cur_pos.copy();
    }
}