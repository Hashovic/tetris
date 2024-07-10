const B_SIZE = 20;

class Block {
    constructor(pos, coloring) {
        this.cur_pos = pos;
        this.color = coloring;
    }

    draw() {
        push();
        let pos = this.cur_pos;
        fill(this.color);
        stroke(0);
        strokeWeight(3);
        square(pos.x * B_SIZE, pos.y * B_SIZE, B_SIZE);
        pop();
    }

    mvdwn() {
        this.cur_pos.y++;
    }
}