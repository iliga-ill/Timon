import { Component, OnInit } from '@angular/core';





@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit{

  worldObj=[
    {name:"earth", id: "earth", width: 1500, height: 50, position: "absolute", top: 1000, left: 0, color: "green"},
    {name:"block",id: "block", width: 100, height: 100, position: "absolute", top: 900, left: 305, color: "red"}
  
  ];

  constructor() {
    
   }

   ngOnInit(){
    this.build_level()
   }

  generateElement(){
    this.create_elements({name:"block", id: "block", width: 50, height: 50, position: "absolute", top: 1, left: 1, color: "red"},20);
    this.create_elements({name:"food", id: "food", width: 25, height: 25, position: "absolute", top: 1, left: 1, color: "blue"},10);
    this.build_level();
    return this.worldObj
  }

  create_elements(element,number){
    for(let i=0;i<number;i++){
      let obj={name: element.name, id: element.id+"_"+(i+1), width: element.width, height: element.height, position: element.position, top: element.top, left: element.left, color: element.color};
      obj.top=Math.random()*1449+1;
      obj.left=Math.random()*1000+1
      this.worldObj.push(obj);
    }
  }

  build_level(){
    let world = this.getWorld();
    for (let i=0;i<this.worldObj.length;i++){
      var obj = document.createElement("div");
      obj.id=this.worldObj[i].id;
      obj.style.width=this.worldObj[i].width+"px";
      obj.style.height=this.worldObj[i].height + "px";
      obj.style.position=this.worldObj[i].position;
      obj.style.top=this.worldObj[i].top + "px";
      obj.style.left=this.worldObj[i].left + "px";
      obj.style.backgroundColor=this.worldObj[i].color;
      world.appendChild(obj);
    }
  }

  getWorld(){
    return document.getElementById("world");
  }

  getObj(){
    return this.worldObj;
  }


}
