import {obj} from "lib/object";
import { positioned_sprite } from "lib/sprite";
import { obj_state, Vector } from "lib/state";

interface move_overlay_state extends obj_state{
    
}
    
interface move_overlay_parameters{
    
}
    
export class move_overlay extends obj{
  sprite_url = "./sprites/move_overlay.png";
  height = 100;
  width = 100;
  tags:Array<string>;
  collision = false;
  render = true;
  layer = 6;
  state:move_overlay_state;
  params:move_overlay_parameters;
  tick_state = false;
  static default_params:move_overlay_parameters = {}
  constructor(state:obj_state,params:move_overlay_parameters = move_overlay.default_params){
    super(state,params);
    this.tags.push("move_overlay");
  }
  statef(time_delta:number){
    super.statef(time_delta);
  }
  renderf(time_delta:number){
   let r = super.renderf(time_delta) as positioned_sprite;
   r.sprite.opacity = 0.2;
   return r; 
  }
  register_animations(){
    
  }
  register_audio(){
    
  }
  register_controls(){
        
  }
}