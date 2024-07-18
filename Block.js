class Block {
    constructor(pos, coloring, pg=window) {
        this.cur_pos = pos;
        this.color = coloring;
        this.pg = pg;
    }

    draw() {
        this.pg.push();
        let pos = this.cur_pos.copy().mult(B_SIZE);
        this.pg.fill(this.color);
        this.pg.strokeWeight(0);
        this.pg.square(pos.x, pos.y, B_SIZE);
        this.pg.pop();
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

    mvvect(vect){
        this.cur_pos.add(vect);
    }

    set_pos(val) {
        this.cur_pos = val;
    }

    get_pos(){
        return this.cur_pos.copy();
    }

    set_color(color){
        this.color = color;
    }
}