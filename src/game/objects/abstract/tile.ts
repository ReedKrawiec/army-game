import {obj} from "lib/object";
import { obj_state, Vector } from "lib/state";
import { unit } from "./unit";
import {Vec} from "lib/math";
import {copy} from "src/van";

export interface tile_state extends obj_state{
  current_unit:unit;
}
    
export interface tile_parameters{

}
    
export class tile extends obj{
  sprite_url = "./sprites/Error.png";
  height = 100;
  width = 100;
  tags:Array<string>;
  collision = false;
  render = true;
  layer = -1;
  static = true;
  tick_state = false;
  state:tile_state;
  defense = 1;
  params:tile_parameters;
  static default_params:tile_parameters = {}
  constructor(state:obj_state,params:tile_parameters = copy(tile.default_params)){
    super(state,params);
    this.state.current_unit = undefined;
    this.tags.push("tile")
  }
  x_proxy(n:number){
    return super.x_proxy(Math.floor(n/100) * 100);
  }
  y_proxy(n:number){
    return super.y_proxy(Math.floor(n/100) * 100);
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