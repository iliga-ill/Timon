import { Component, OnInit} from '@angular/core';
import { MapComponent } from './map/map.component'

//характеристики
//клавиши: 
let keyUP = 87;
let keyDOWN = 83;
let keyLEFT = 65;
let keyRIGHT = 68;

//положение стартового персонажа (x-player_x, y-player_y), в пикселях.
let player_x=500;
let player_y=500;
let player_height=50;
let player_width=50;

// проходит 3 пикселя (speedPX) каждые 10 миллисекунд (speedTime)
let speed_PX_x = 1;
let speed_PX_y = 2;
let speedTime_x = 4;
let speedTime_y = 4;

//ускорение гравитации
let gravA=3;

//счет съеденного
let score=0;

//------------------------------------------------

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'timon2';
  
  ngOnInit(){
    document.getElementById("timon").style.left = player_x + 'px';
    document.getElementById("timon").style.top = player_y + 'px';
    document.getElementById("timon").style.height = player_height + 'px';
    document.getElementById("timon").style.width = player_width + 'px';
  }


  getCharacter(){return document.getElementById("timon");}

  getWorld(){return document.getElementById("world");}

  getChild(id){return document.getElementById(id);}

  getObj(){
    return mapComp.getObj();
  }

}

let worldObj = [];
let Comp = new AppComponent();
let mapComp= new MapComponent();
let up=0;
let down=0;
let right=0;
let left=0;
let workX=true,workY=true;
let upL,downL,rightL,leftL;
let timeNotOnFloor=0;
let start=true;

document.addEventListener('keydown', function(keydown) {
  if (start){
    gravitation();
    standOnFloor();
    worldObj=mapComp.generateElement();
    start=false;
  }
  //console.log(worldObj);
    switch(keydown.keyCode) {
      case keyUP: 
        up=-1;
      break
      case keyDOWN: 
        down=1;
      break
      case keyLEFT:  
        left=-1;
      break
      case keyRIGHT:  
        right=1;
      break
      default:
      break
  }
  move();
})

document.addEventListener('keyup', function(keydown) {
  switch(keydown.keyCode) {
    case keyUP: 
      up=0;
    break
    case keyDOWN:  
      down=0;
    break
    case keyLEFT:  
      left=0;
    break
    case keyRIGHT:  
      right=0;
    break
    default:
    break
  }
  move();
})

function move(){
  if (rightL!=right||leftL!=left){moveX();}
  if (upL!=up||downL!=down){moveY();}
    upL=up;
    downL=down;
    rightL=right;
    leftL=left;
}

function moveX(){
  if (workX){
    workX=false;
    let character = Comp.getCharacter();
    if (checkMove(player_x + speed_PX_x*(right+left),player_y)==-1){
    player_x+=speed_PX_x*(right+left);
    character.style.left = player_x + 'px';
    }else{
      player_x+=checkMove(player_x + speed_PX_x*(right+left),player_y);
      character.style.left = player_x + 'px';
    }
    if ((right+left)!=0){setTimeout(moveX,speedTime_x);}
    workX=true;
    //console.log(checkMove(player_x + speed_PX_x*(right+left),player_y,speed_PX_x*(right+left)));
  }
  
};

function moveY(){
  if (workY){
    workY=false;
    let character = Comp.getCharacter();
    if (checkMove(player_x,player_y + speed_PX_y*(up+down))==-1){
    player_y+=speed_PX_y*(up+down);
    character.style.top = player_y + 'px';
    }else{
      player_y+=checkMove(player_x,player_y + speed_PX_y*(up+down));
      character.style.top = player_y + 'px';
    }
    if (up+down!=0){setTimeout(moveY,speedTime_y);}
    workY=true;
    //console.log(checkMove(player_x,player_y + speed_PX_y*(up+down),speed_PX_y*(up+down)))
  }
  
};

function gravitation(){
  //console.log(checkMove(player_x,player_y+2*gravA*timeNotOnFloor,2*gravA*timeNotOnFloor))
  let character = Comp.getCharacter();
  if (checkMove(player_x,player_y+2*gravA*timeNotOnFloor)==-1){
    player_y+=2*gravA*timeNotOnFloor;
    character.style.top = player_y + 'px';
  } else {
    player_y+=checkMove(player_x,player_y+2*gravA*timeNotOnFloor);
    character.style.top = player_y + 'px';
  }

setTimeout(gravitation,10);
}

function checkMove(x,y){
  for (let i=0;i<worldObj.length;i++){
    if (
      (x+player_width>worldObj[i].left||x>worldObj[i].left)&&
      (x<worldObj[i].left+worldObj[i].width||x+player_width<worldObj[i].left+worldObj[i].width)&&
      (y>worldObj[i].top||y+player_height>worldObj[i].top)&&
      (y<worldObj[i].top+worldObj[i].height||y+player_height<worldObj[i].top+worldObj[i].height)
      )
      {
        if (worldObj[i].id[0]+worldObj[i].id[1]+worldObj[i].id[2]+worldObj[i].id[3]!="food"){
          if (y!=player_y){
            let speed=y-player_y;
            if(speed>0){
              let deep=worldObj[i].top-(y+player_height);
              return speed+deep;
            }else{
              let deep=(worldObj[i].top+worldObj[i].height)-y;
              return speed+deep;
            }
          }else{
            let speed=x-player_x;
            if (speed>0){
              let deep=worldObj[i].left-(x+player_width);
              return speed+deep
            }else{
              let deep=(worldObj[i].left+worldObj[i].width)-x;
              return speed+deep;
            }
          }
        }else{
          score+=1;
          Comp.getWorld().removeChild(Comp.getChild(worldObj[i].id));
          worldObj.splice(i,1);
          console.log(score);
          return -1
        }
        
      }
  }
 return -1
}

function standOnFloor(){
  //console.log(timeNotOnFloor);
  let y=player_y+1;
  let x=player_x;
  let onFloor=false;
  for (let i=0;i<worldObj.length;i++){
    if (
      (x+player_width>worldObj[i].left||x>worldObj[i].left)&&
      (x<worldObj[i].left+worldObj[i].width||x+player_width<worldObj[i].left+worldObj[i].width)&&
      (y>worldObj[i].top||y+player_height>worldObj[i].top)&&
      (y<worldObj[i].top+worldObj[i].height||y+player_height<worldObj[i].top+worldObj[i].height)
      )
      {
        onFloor=true
      }
  }
  if (onFloor){timeNotOnFloor=0}else{timeNotOnFloor+=0.01;}
  setTimeout(standOnFloor,10)
}