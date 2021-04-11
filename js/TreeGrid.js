export default class TreeGrid {
  constructor(x, y, dx, dy) {
    this.dx = dx;
    this.dy = dy;
    this.nbc = Math.floor(x/dx);
    this.nbl = Math.floor(y/dy);
    this.maxx = this.nbc*this.dx;
    this.maxy = this.nbl*this.dy;
    this.grid = new Array(this.nbc);
    this.cnv = null;
    this.ctx = null;
    for(let i = 0; i < this.nbc; i += 1) {
      this.grid[i] = [];
      for(let j = 0; j < this.nbl; j += 1) {
        this.grid[i].push(0);
      }
    }
  }
  setCellSize(cell_dx, cell_dy) {
    this.cnv = document.createElement('canvas');
    this.cnv.width = cell_dx;
    this.cnv.height = cell_dy;
    this.ctx = this.cnv.getContext("2d");
  }
  addTree(posx, posy) {
    let nx = Math.floor(posx/this.dx);
    let ny = Math.floor(posy/this.dy);
    if(this.grid[nx][ny] == 0) { this.grid[nx][ny] = 1; }
  }
	initRandom(posx, posy) {
		let nbrt = Math.floor(Math.random()*(this.nbc*this.nbl));
		for(let i = 0; i < nbrt; i += 1) {
			let rx = Math.floor(Math.random()*this.nbc);
      let ry = Math.floor(Math.random()*this.nbl);
      this.grid[rx][ry] = 1;
		}
    let nx = Math.floor(posx/this.dx);
    let ny = Math.floor(posy/this.dy);
    this.grid[nx][ny] = 0;
  }
  draw(ctx, mapdx, mapdy) {
    if(this.cnv == null) return;
    for(let i = 0; i < this.nbc; i += 1) {
      for(let j = 0; j < this.nbl; j += 1) {
        if(this.grid[i][j] == 1) {
          ctx.drawImage(this.cnv, mapdx+i*this.dx, mapdy+j*this.dy);
        }
      }
    }
  }
}
