import {obj} from "lib/object";
import { obj_state, Vector } from "lib/state";

export interface loader_state extends obj_state{
    
}
    
export interface loader_parameters{
    
}
    
export class loader extends obj{
  sprite_url = "./sprites/loader.png";
  height = 100;
  width = 100;
  tags:Array<string>;
  collision = true;
  render = true;
  save_to_file = false;
  state:loader_state;
  params:loader_parameters;
  static default_params:loader_parameters = {}
  constructor(state:obj_state,params:loader_parameters = loader.default_params){
    super(state,params);
  }
  statef(time_delta:number){
    super.statef(time_delta);
    this.state.rotation += 0.5;
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