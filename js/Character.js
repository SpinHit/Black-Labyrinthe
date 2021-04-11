export default class Character {
  constructor(anime_freq) {
    this.last_event = null;
    this.animes = [];
    this.anime_freq = anime_freq;
    this.anime_freq_step = anime_freq;
    this.posx = 0;
    this.posy = 0;
    this.animeId = 0;
  }
  next_step(minx, miny, maxx, maxy, event_code) {
    if(event_code != this.last_event) {
      this.animestep = 0;
      for(let i = 0; i < this.animes.length; i += 1) {
        if(this.animes[i].event_code == event_code) {
          this.animeId = i;
          this.last_event = event_code;
        }
      }
    } else {
      if(this.anime_freq_step > 0) {
        
        this.animes[this.animeId].animestep += 1;

        if(this.animes[this.animeId].animestep >= this.animes[this.animeId].animeseq.length){
          this.animes[this.animeId].animestep = 0;
        }

        this.posx += this.animes[this.animeId].dx;
        this.posy += this.animes[this.animeId].dy;
        if(this.posx < minx) this.posx = minx;
        
        if(this.posx > maxx) this.posx = maxx;
        
        if(this.posy < miny) this.posy = miny;
        
        if(this.posy > maxy) this.posy = maxy;
        
        this.anime_freq_step = this.anime_freq;
      }
    }
  }

  reset_step() {
    this.animes[this.animeId].animestep = 1;
  }

  getImage() {
    if(this.animeId >= this.animes.length) { return new Image(); }
    return this.animes[this.animeId].getAnime();
  }

  getPosX() {
    return this.posx;
  }
  getPosY() {
    return this.posy;
  }
}
