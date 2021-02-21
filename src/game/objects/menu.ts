import { Vec } from "lib/math";
import {composite_obj, obj} from "lib/object";
import { obj_state, Vector } from "lib/state";
import {Text} from "lib/hud";
import { exec_type, Poll_Mouse } from "lib/controls";
import { positioned_sprite, sprite_gen } from "lib/sprite";
import { g } from "game/main";
export interface menu_state extends obj_state{
    
}

export interface menu_item_state extends obj_state{
  mouse_over:boolean;
}

export interface menu_parameters{
  items:menu_item_parameters[],
  item_width:number
}

interface menu_item_full_parameters{
  item:menu_item_parameters,
  scaling:number
}

export interface menu_item_parameters{
  on_click:{
    ():void
  },
  text:string    
}

export class menu_item extends obj{
  sprite_url = "./sprites/menu-background.png";
  height = 1;
  width = 1;
  layer = 8;
  tags:Array<string>;
  collision = false;
  render = true;
  state:menu_item_state;
  params:menu_item_full_parameters;
  save_to_file = false;
  text_node:Text;
  static default_params:menu_item_full_parameters = {
    item:{on_click:()=>{},
    text:"not set"},
    scaling:1
  }
  constructor(state:obj_state,params:menu_item_full_parameters = menu_item.default_params){
    super(state,params);
  }
  delete(){
    let nodes = this.game.getRoom().text_nodes;
    nodes.splice(nodes.indexOf(this.text_node),1);
    super.delete();
  }
  registerControls(){
    this.bindControl("mouse0down",exec_type.once,()=>{
      if(this.state.mouse_over){
        this.params.item.on_click();
        this.parent.delete();
      }
    })
  }
  statef(time_delta:number){
    if(!this.text_node){
      let t = new Text({
        position:Vec.sub(this.state.position,Vec.create(0,10)),
         size:30 * this.params.scaling,
         scaling:1,
         font:"VT323",
         color:"white"
       },()=>this.params.item.text);
      this.game.getRoom().text_nodes.push(t)
      this.text_node = t;
    }
    let mouse = Poll_Mouse(this.getRoom().cameras[0]);
    if(mouse){
      if(this.collidesWithBox({x:mouse.x,y:mouse.y,width:1,height:1})){
        this.state.mouse_over = true;
      }
      else{
        this.state.mouse_over = false;
      }
      
    }
    super.statef(time_delta);
  }
  renderf(time_delta:number){
    let sprites = sprite_gen(this.sprite_sheet,this.width,this.height);
    let selected = super.renderf(time_delta) as positioned_sprite;
    if(this.state.mouse_over){
      selected.sprite = sprites[0][1];
    }
   return selected; 
  }
  register_animations(){
    
  }
  register_audio(){
    
  }
  register_controls(){
        
  }
}

export class menu extends composite_obj{
  sprite_url = "./sprites/menu-background.png";
  height = 1;
  width = 1;
  tags:Array<string>;
  collision = false;
  render = false;
  state:menu_state;
  params:menu_parameters;
  save_to_file = false;
  static default_params:menu_parameters = {
    items:[],
    item_width:100,
  }
  constructor(state:obj_state,params:menu_parameters = menu.default_params){
    super(state,params);
    for(let i = 0; i < this.params.items.length;i++){
      let item = this.params.items[i];
      let camera_scaling = 1/g.getRoom().cameras[0].state.scaling;
      this.addItem(new menu_item({
        position:Vec.add(this.state.position,Vec.create(0,i * 30 * camera_scaling)),
        velocity:Vec.create(0,0),
        scaling:{width:params.item_width * camera_scaling,height:30 * camera_scaling},
        rotation:0
      },{item,scaling:camera_scaling}));
    }
  }
  statef(time_delta:number){
    super.statef(time_delta);
  }
  renderf(time_delta:number){
   return super.renderf(time_delta); 
  }
  register_animations(){
    
  }
  register_audio(){
    
  }
  register_controls(){
        
  }
}