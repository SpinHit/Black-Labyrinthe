export default class SpriteAnime {
  constructor(ctx, json, prefix, first_id, last_id, cur_id, e, dx, dy) {
    this.event_code = e;
    this.dx = dx;
    this.dy = dy;
    this.animestep = cur_id;
    this.animeseq = [];
    for(let i = first_id; i < last_id+1; i += 1) {
      let filename = prefix;
      if(i < 10) { filename += ".00"+i; }
      else if(i < 100) { filename += ".0"+i; }
      else { filename += "."+i; }
      let x = json["frames"][filename]["frame"]["x"];
      let y = json["frames"][filename]["frame"]["y"];
      let w = json["frames"][filename]["frame"]["w"];
      let h = json["frames"][filename]["frame"]["h"];
      let canvasImageData1 = ctx.getImageData(x, y, w, h);
      let canvas2 = document.createElement('canvas');
      canvas2.width = w;
      canvas2.height = h;
      let context2 = canvas2.getContext('2d');
      context2.putImageData(canvasImageData1, 0,0);
      this.animeseq.push(canvas2);
    }
  }
  getAnime() {
    return this.animeseq[this.animestep];
  }
}
