import {obj} from "lib/object";
import { obj_state, Vector } from "lib/state";

interface cursor_state extends obj_state{
    
}
    
interface cursor_parameters{
    
}

export class cursor extends obj{
  sprite_url = "./sprites/cursor.png";
  height = 100;
  width = 100;
  tags:Array<string>;
  collision = false;
  render = true;
  layer = 3;
  state:cursor_state;
  params:cursor_parameters;
  static default_params:cursor_parameters = {}
  constructor(state:obj_state,params:cursor_parameters = cursor.default_params){
    super(state,params);
    this.tags.push("cursor");
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