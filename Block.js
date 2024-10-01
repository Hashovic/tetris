class Block {
    // Constructs a block object with a position, color, and where to draw it (i.e canvas)
    constructor(pos, coloring, instance, pg) {
        this.p = instance;
        this.cur_pos = pos;
        this.color = coloring;
        this.pg = pg;
    }

    // Draws the block
    draw() {
        this.pg.push();
        let pos = this.cur_pos.copy().mult(B_SIZE);
        this.pg.fill(this.color);
        this.pg.strokeWeight(0);
        this.pg.square(pos.x, pos.y, B_SIZE);
        this.pg.pop();
    }

    // Moves the block down
    mvdwn() {
        this.cur_pos.add(this.p.createVector(0,1));
    }

    // Moves the block left
    mvleft() {
        this.cur_pos.add(this.p.createVector(-1,0));
    }

    // Moves the block right
    mvright() {
        this.cur_pos.add(this.p.createVector(1,0));
    }

    // Moves the block a certain vector amount
    mvvect(vect){
        this.cur_pos.add(vect);
    }

    // Sets the position of the block
    set_pos(val) {
        this.cur_pos = val;
    }

    // Gets the position of the block
    get_pos(){
        return this.cur_pos.copy();
    }

    // Changes the color of the block
    set_color(color){
        this.color = color;
    }
}