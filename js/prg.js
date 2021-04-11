import SpriteAnime from "./SpriteAnime.js"
import Character from "./Character.js"



let cnv = document.getElementById("myCanvas");
let ctx = cnv.getContext("2d");

ctx.imageSmoothingEnabled= false;

let cnvCircle = document.getElementById("myCanvas2");
let ctxCircle = cnvCircle.getContext("2d");

let map_cnv = document.createElement('canvas');
map_cnv.width = cnv.width;
map_cnv.height = cnv.height;
let map_ctx = map_cnv.getContext("2d");

let personnage_cnv = document.createElement('canvas');
personnage_cnv.width = cnv.width;
personnage_cnv.height = cnv.height;
let personnage_ctx = personnage_cnv.getContext("2d");
personnage_ctx.imageSmoothingEnabled= false;

let soldier_character = new Character(1);

let tilemap;
let tilemap_loaded = 0;
let tileset;
let tileset_loaded = 0; 
let tileset_elts = [];

let pos_X = 0;
let pos_Y = 0;

let zoom = 1;
let zoomPersonnage = 1.2;
let velocity = 7;
let count = 0;
let keyPressed = false;
let nowKeyPressed = "";
let lastKeyPressed = "";
let layer;
let displayFog = true;

let collides = Array.from(Array(Math.round(32)), () => new Array(Math.round(32)).fill(0));

//Detecte touche directionels

window.addEventListener("keydown", (e) => {
	lastKeyPressed = nowKeyPressed;
	if(((e.code == "ArrowLeft") || 
		(e.code == "ArrowRight") ||
		(e.code == "ArrowDown") ||
		(e.code == "ArrowUp")) && !keyPressed){
		nowKeyPressed = e.code;
		keyPressed = true;
	}
	if(e.code == "KeyP"){
		if(displayFog){
			displayFog = false;
		} else {
			displayFog = true;
		}
	}
})

window.addEventListener("keyup", (e) => {
	keyPressed = false;
})

function generationProcedurale(x,y) {
    let n=x*y-1;
    if (n<0) {alert("illegal generationProcedurale dimensions");return;}
    let horiz=[]; for (let j= 0; j<x+1; j++) horiz[j]= [];
    let verti=[]; for (let j= 0; j<y+1; j++) verti[j]= [];
    let here= [Math.floor(Math.random()*x), Math.floor(Math.random()*y)];
    let path= [here];
    let unvisited= [];
    for (let j= 0; j<x+2; j++) {
        unvisited[j]= [];
        for (let k= 0; k<y+1; k++)
            unvisited[j].push(j>0 && j<x+1 && k>0 && (j != here[0]+1 || k != here[1]+1));
    }
    while (0<n) {
        let potential= [[here[0]+1, here[1]], [here[0],here[1]+1],
            [here[0]-1, here[1]], [here[0],here[1]-1]];
        let neighbors= [];
        for (let j= 0; j < 4; j++)
            if (unvisited[potential[j][0]+1][potential[j][1]+1])
                neighbors.push(potential[j]);
        if (neighbors.length) {
            n= n-1;
            let next= neighbors[Math.floor(Math.random()*neighbors.length)];
            unvisited[next[0]+1][next[1]+1]= false;
            if (next[0] == here[0])
                horiz[next[0]][(next[1]+here[1]-1)/2]= true;
            else 
                verti[(next[0]+here[0]-1)/2][next[1]]= true;
            path.push(here= next);
        } else 
            here= path.pop();
    }
    return ({x: x, y: y, horiz: horiz, verti: verti});
}

function addColision() {
	   for(let ih = 0, nh = 32; ih < nh; ih += 1) {
        for(let iw = 0, nw = 32; iw < nw; iw += 1) {
        	if((iw == 1) && (ih >= 1 && ih <= 28)) {
        		
        		collides[ih][iw] = 1;
        	} 
        	if((iw == 27) && (ih >= 1 && ih <= 28)) {
        		
        		collides[ih][iw] = 1;
        	} 
        	if((iw >= 2 && iw <= 27) && (ih ==1)) {
        		
        		collides[ih][iw] = 1;
        	}
        	if((iw >= 2 && iw <= 27) && (ih ==28)) {
        		
        		collides[ih][iw] = 1;
        	}
        	//Entrer
        	if((iw == 1) && (ih == 3)){
        		
        		collides[ih][iw] = 0;
        	}
        	//Sortit
        	if((iw == 27) && (ih == 24)){
        		
        		collides[ih][iw] = 0;
        	}
        }
      }

	    for (let j= 0, x = 2; j<laby.x*2+1; j++,x++) {

	        //let line= [];

	        if (0 == j%2){

	            for (let k=0, y = 2 ; k<laby.y*4+1; k++,y++){

	                if (0 == k%4) {
	                    
	                    //line[k]= '+';
	                    collides[x][y] = 1;
	                } else {

	                	if (j>0 && laby.verti[j/2-1][Math.floor(k/4)]){
	                        //line[k]= ' ';
	                    } else {
	   						//line[k]= '-';
	   						collides[x][y] = 1;
	   					}
	   				}
	   			}
	        } else {

	            for (let k=0, y = 2 ; k<laby.y*4+1; k++,y++){

	                if (0 == k%4){

	                    if (k>0 && laby.horiz[(j-1)/2][k/4-1]){

	                       // line[k]= ' ';

	                    } else {
	                    	
	                        //line[k]= '|';
	                        collides[x][y] = 1;
	                    }

	                } else {
	                	
	                    //line[k]= ' ';
	                }
	            }
	        }

	        if (1 == j){
				//line[0] = ' ';
				collides[3][2] = 0;
			}

	        if (laby.x*2-1 == j) 	{
	        	
	        	//line[4*laby.y]= ' ';
	        	collides[laby.x*2-1][4*laby.y] = 0;
	        }
	        //text.push(line.join('')+'\r\n');

	}
}

function display(m) {
	    var text= [];
	    for (var j= 0; j<m.x*2+1; j++) {
	        var line= [];
	        if (0 == j%2)
	            for (var k=0; k<m.y*4+1; k++)
	                if (0 == k%4) 
	                    line[k]= '+';
	                else
	                    if (j>0 && m.verti[j/2-1][Math.floor(k/4)])
	                        line[k]= ' ';
	                    else
	                        line[k]= '-';
	        else
	            for (var k=0; k<m.y*4+1; k++)
	                if (0 == k%4)
	                    if (k>0 && m.horiz[(j-1)/2][k/4-1])
	                        line[k]= ' ';
	                    else
	                        line[k]= '|';
	                else
	                    line[k]= ' ';
	        if (0 == j) line[1]= line[2]= line[3]= ' ';
	        if (m.x*2-1 == j) line[4*m.y]= ' ';
	        text.push(line.join('')+'\r\n');
	    }
	    return text.join('');
}


let laby = generationProcedurale(6,6);
addColision();


//Generation de la map
function onload_tilemap () {

  if(this.status == 200) {
    tilemap_loaded = 1;
    tilemap = JSON.parse(this.responseText);
    let map_height = tilemap["height"];
    let map_width = tilemap["width"];
    tileset = new Image();
    tileset.src = window.location.pathname+"assets/tilemaps/"+tilemap["tilesets"][0]["image"];
    tileset.onload = function() {
      tileset_loaded = 1;
      let tileset_i = 1;
      let tileset_j = 1;
      let tileset_imageheight = tilemap["tilesets"][0]["imageheight"];
      let tileset_imagewidth = tilemap["tilesets"][0]["imagewidth"];
      let tileset_margin = tilemap["tilesets"][0]["margin"];
      let tileset_spacing = tilemap["tilesets"][0]["spacing"];
      let tileset_tileheight = tilemap["tilesets"][0]["tileheight"];
      let tileset_tilecount = tilemap["tilesets"][0]["tilecount"];

      let layer0_data = tilemap["layers"][0]["data"];
      let layer0_height = tilemap["layers"][0]["height"];
      let layer0_width = tilemap["layers"][0]["width"];

      let layer1_data = tilemap["layers"][1]["data"];
      let layer1_height = tilemap["layers"][1]["height"];
      let layer1_width = tilemap["layers"][1]["width"];


     
      
      //console.log(collides);
      let layer2_data = tilemap["layers"][2]["data"];
      let layer2_height = tilemap["layers"][2]["height"];
      let layer2_width = tilemap["layers"][2]["width"];

      let canvas = document.createElement('canvas');
      canvas.height = map_height*tileset_tileheight;
      canvas.width = map_width*tileset_tileheight;
      let context = canvas.getContext('2d');

     

      context.drawImage(tileset, 0, 0, tileset.width, tileset.height);

      let ih = 1;
      for(let ih = 1, nh = tileset_imageheight; ih < nh; ih += (tileset_tileheight)) {
        for(let iw = 1, nw = tileset_imagewidth; iw < nw; iw += (tileset_tileheight)) {
          let canvas2 = document.createElement('canvas');
          canvas2.height = tileset_tileheight;
          canvas2.width = tileset_tileheight;
          let context2 = canvas2.getContext('2d');
          let canvasImageData = context.getImageData(iw, ih, tileset_tileheight, tileset_tileheight);
          let canvasData = canvasImageData.data;
          let canvasImageData2 = context2.getImageData(0, 0, tileset_tileheight, tileset_tileheight);
          let canvasData2 = canvasImageData2.data;
          for(let i = 0, n = canvasData.length; i < n; i += 4) {
            canvasData2[i] = canvasData[i];
            canvasData2[i + 1] = canvasData[i + 1];
            canvasData2[i + 2] = canvasData[i + 2];
            canvasData2[i + 3] = canvasData[i + 3];
          }
          context2.putImageData(canvasImageData2, 0,0);
          tileset_elts.push(canvas2);
        }
      }
      
      let layer0_data_i = 0;
      for(let ih = 0, nh = layer0_height; ih < nh; ih += 1) {
        for(let iw = 0, nw = layer0_width; iw < nw; iw += 1) {
          if(layer0_data[layer0_data_i] > 0) {
			map_ctx.drawImage(tileset_elts[(layer0_data[layer0_data_i]-1)],(iw*tileset_tileheight),(ih*tileset_tileheight),tileset_tileheight,tileset_tileheight);
          }
          layer0_data_i += 1;
        }
      }
      for(let i =0, j=15;i<15;i++,j++){
      	map_ctx.drawImage(tileset_elts[(601-1)],(2*tileset_tileheight),(j*tileset_tileheight),tileset_tileheight,tileset_tileheight);
      }

      let layer1_data_i = 0;

      //Mur exteurieur

      for(let ih = 0, nh = layer1_height; ih < nh; ih += 1) {
        for(let iw = 0, nw = layer1_width; iw < nw; iw += 1) {
        	if((iw == 1) && (ih >= 1 && ih <= 28)) {
        		map_ctx.drawImage(tileset_elts[693-1],(iw*tileset_tileheight),(ih*tileset_tileheight),tileset_tileheight,tileset_tileheight);
     
        	} 
        	if((iw == 27) && (ih >= 1 && ih <= 28)) {
        		map_ctx.drawImage(tileset_elts[693-1],(iw*tileset_tileheight),(ih*tileset_tileheight),tileset_tileheight,tileset_tileheight);
     
        	} 
        	if((iw >= 2 && iw <= 27) && (ih ==1)) {
        		map_ctx.drawImage(tileset_elts[693-1],(iw*tileset_tileheight),(ih*tileset_tileheight),tileset_tileheight,tileset_tileheight);
     
        	}
        	if((iw >= 2 && iw <= 27) && (ih ==28)) {
        		map_ctx.drawImage(tileset_elts[693-1],(iw*tileset_tileheight),(ih*tileset_tileheight),tileset_tileheight,tileset_tileheight);
     
        	}
        	//Entrer
        	if((iw == 1) && (ih == 3)){
        		map_ctx.drawImage(tileset_elts[601-1],(iw*tileset_tileheight),(ih*tileset_tileheight),tileset_tileheight,tileset_tileheight);
     
        	}
        	//Sortit
        	if((iw == 27) && (ih == 24)){
        		map_ctx.drawImage(tileset_elts[601-1],(iw*tileset_tileheight),(ih*tileset_tileheight),tileset_tileheight,tileset_tileheight);
     
        	}
        }
      }

      let text= [];
	    for (let j= 0, x = 2; j<laby.x*2+1; j++,x++) {

	        let line= [];

	        if (0 == j%2){

	            for (let k=0, y = 2 ; k<laby.y*4+1; k++,y++){

	                if (0 == k%4) {
	                    map_ctx.drawImage(tileset_elts[637-1],(y*tileset_tileheight), (x*tileset_tileheight),tileset_tileheight,tileset_tileheight);
	                    line[k]= '+';
	               
	                } else {

	                	if (j>0 && laby.verti[j/2-1][Math.floor(k/4)]){
	                        line[k]= ' ';
	                    } else {
	                    	map_ctx.drawImage(tileset_elts[637-1],(y*tileset_tileheight), (x*tileset_tileheight),tileset_tileheight,tileset_tileheight);
	   						line[k]= '-';
	   	
	   					}
	   				}
	   			}
	        } else {

	            for (let k=0, y = 2 ; k<laby.y*4+1; k++,y++){

	                if (0 == k%4){

	                    if (k>0 && laby.horiz[(j-1)/2][k/4-1]){

	                        line[k]= ' ';

	                    } else {
	                    	map_ctx.drawImage(tileset_elts[637-1],(y*tileset_tileheight), (x*tileset_tileheight),tileset_tileheight,tileset_tileheight);
	                        line[k]= '|';
	                   
	                    }

	                } else {
	                	
	                    line[k]= ' ';
	                }
	            }
	        }

	        if (1 == j){
	        	map_ctx.drawImage(tileset_elts[601-1],(2*tileset_tileheight), (3*tileset_tileheight),tileset_tileheight,tileset_tileheight);
				line[0] = ' ';
			}

	        if (laby.x*2-1 == j) 	{
	        	map_ctx.drawImage(tileset_elts[1-1],((4*laby.y)*tileset_tileheight), ((laby.x*4)*tileset_tileheight),tileset_tileheight,tileset_tileheight);
	        	line[4*laby.y]= ' ';
	    
	        }
	        text.push(line.join('')+'\r\n');
	    }


      let layer2_data_i = 0;
      for(let ih = 0, nh = layer2_height; ih < nh; ih += 1) {
        for(let iw = 0, nw = layer2_width; iw < nw; iw += 1) {
          if(layer2_data[layer2_data_i] > 0) {
            map_ctx.drawImage(tileset_elts[(layer2_data[layer2_data_i]-1)],(iw*tileset_tileheight), (ih*tileset_tileheight),tileset_tileheight,tileset_tileheight);
          }
          layer2_data_i += 1;
        }
      }

    }
  }
}


//Generation du Personage 

function onload_atlas () {
  if(this.status == 200) {
    let json_infos = JSON.parse(this.responseText);
    let spritesheet = new Image();
    spritesheet.src = "./assets/atlas/"+json_infos["meta"]["image"];
    spritesheet.onload = function() {
      let canvas1 = document.createElement('canvas');
      canvas1.width = json_infos["meta"]["size"]["w"];
      canvas1.height = json_infos["meta"]["size"]["h"];
      let context1 = canvas1.getContext('2d');
      context1.drawImage(spritesheet, 0,0,canvas1.width,canvas1.height);
      soldier_character.animes.push(new SpriteAnime(context1, json_infos, "soldier-right-walk",0,3,3,"ArrowRight",velocity,0));
      soldier_character.animes.push(new SpriteAnime(context1, json_infos, "soldier-left-walk",0,3,3,"ArrowLeft",-velocity,0));
      soldier_character.animes.push(new SpriteAnime(context1, json_infos, "soldier-back-walk",0,3,3,"ArrowUp",0,-velocity));
      soldier_character.animes.push(new SpriteAnime(context1, json_infos, "soldier-front-walk",0,3,3,"ArrowDown",0,velocity));
    }
  }
}


 let xobj = new XMLHttpRequest();
 xobj.onload = onload_tilemap;
 xobj.overrideMimeType("application/json");
 xobj.open("GET", "./assets/tilemaps/carte.json", true);
 xobj.send();

 let xobj_soldier = new XMLHttpRequest();
 xobj_soldier.onload = onload_atlas;
 xobj_soldier.overrideMimeType("application/json");
 xobj_soldier.open("GET", "./assets/atlas/soldier.json", true);
 xobj_soldier.send();


function draw() {

  count += 1;
  if(count > 20){
    soldier_character.reset_step();
  }
  ctx.clearRect(0, 0, personnage_cnv.width, personnage_cnv.height);
  let canvasImageData = map_ctx.getImageData(0, 0, cnv.width, cnv.height);
  ctx.putImageData(canvasImageData, 0,0);
 
  ctx.resetTransform();
  ctx.translate(cnv.width-pos_X, cnv.height-pos_Y);
  ctx.scale(zoom,zoom);
  ctx.translate(-cnv.width / zoom, -cnv.height / zoom);
  
  ctx.drawImage(cnv, 0, 0);
  ctx.drawImage(soldier_character.getImage(), soldier_character.posx, soldier_character.posy,30*zoomPersonnage,41*zoomPersonnage);

}

//Filtre de vision

function draw1(){

	ctxCircle.globalCompositeOperation = "source-over";
	ctxCircle.clearRect(0,0,cnv.width,cnv.height);

	ctxCircle.fillStyle = "black";
	ctxCircle.fillRect(0, 0, cnv.width, cnv.height);
	ctxCircle.fillStyle = "white";
	ctxCircle.globalCompositeOperation = "destination-out";
	ctxCircle.beginPath();
	let tempX = soldier_character.posx+20;
	let tempY = soldier_character.posy+20;
	ctxCircle.arc(tempX, tempY, 50, 0, 2 * Math.PI, false);
	ctxCircle.fill();


}

//Arret du personnage

function sleep(milliseconds) {
	  const date = Date.now();
	  let currentDate = null;
	  do {
	    currentDate = Date.now();
	  } while (currentDate - date < milliseconds);
}

//Mouvement du personnage

function move(){
	let t1 = (soldier_character.posx / 32),
  		t2 = (soldier_character.posy / 32);

  	let t3 = t1 * 10,
  		t4 = t2 * 10;
  	if((t3 %10) >= 9){
  		t1 = Math.round(t1);
  	} else {
  		t1 = Math.floor(t1);
  	}
  	if((t4 %10) >= 7){
  		t2 = Math.round(t2);
  	} else {
  		t2 = Math.floor(t2);
  	}
  	
	if(nowKeyPressed == "ArrowLeft"){
		if((lastKeyPressed == nowKeyPressed)){
			if(t1 > 0){
				if(collides[t2][t1-1] === 0){
	  			pos_X -= velocity*zoom;
	  			soldier_character.next_step(0, 0, (cnv.width-30), (cnv.height-70), nowKeyPressed);
	  			}
	  		} else if (t1 == 0){
	  			soldier_character.next_step(0, 0, (cnv.width-30), (cnv.height-70), nowKeyPressed);
	  		}

	  	}
		if(pos_X < 0) pos_X = 0;
		count = 0;
		keyPressed = true;
	}
	if(nowKeyPressed == "ArrowRight"){
		if((lastKeyPressed == nowKeyPressed)){
			if(t1 < (cnv.width-30)){
				if(collides[t2][t1+1] === 0){
					
		  			pos_X += velocity*zoom;
		  			soldier_character.next_step(0, 0, (cnv.width-30), (cnv.height-70), nowKeyPressed);
		  		} else {
		  		}
	  		}	
		}
		if(pos_X > map_cnv.height*zoom - cnv.height) pos_X = map_cnv.height*zoom-cnv.height;
		count = 0;
		keyPressed = true;
	}
	if(nowKeyPressed == "ArrowUp"){
		if((lastKeyPressed == nowKeyPressed)){
			if(t2 > 0){
				if(collides[t2-1][t1] === 0){ 
					pos_Y -= velocity*zoom;
					soldier_character.next_step(0, 0, (cnv.width-30), (cnv.height-70), nowKeyPressed);
				}
			} else if(t2 == 0){
				soldier_character.next_step(0, 0, (cnv.width-30), (cnv.height-70), nowKeyPressed);
			}
		}
		if(pos_Y < 0) pos_Y = 0;
		count = 0;
		keyPressed = true;
	}
	if(nowKeyPressed == "ArrowDown"){
		if((lastKeyPressed == nowKeyPressed)){
			if(t2 < (cnv.height-70)){
				if(collides[t2+1][t1] === 0){ 
		  			pos_Y += velocity*zoom;
		  			soldier_character.next_step(0, 0, (cnv.width-30), (cnv.height-70), nowKeyPressed);
		  		}			
	  		}
		}
		if(pos_Y > map_cnv.height*zoom - cnv.height) pos_Y = map_cnv.height*zoom-cnv.height;
		count = 0;
		keyPressed = true;
	}
	

}

function update(e) {
  if(tilemap_loaded == 1 && tileset_loaded == 1 ) {
  	if(keyPressed){
  		sleep(100);
  		move();
    	draw();
    	if(displayFog){
    		draw1();
    	} else {
    		ctxCircle.clearRect(0,0,cnv.width,cnv.height);
    	}
	}
	draw();
	if(displayFog){
		draw1();
	} else {
		ctxCircle.clearRect(0,0,cnv.width,cnv.height);
	}
  	requestAnimationFrame(update,10);
  } else {
    requestAnimationFrame(update,10);
  }
  
}


requestAnimationFrame(update,10);

