import {obj} from "lib/object";
import { obj_state, Vector } from "lib/state";

interface GameSpace_state extends obj_state{
    
}
    
interface GameSpace_parameters{
    
}
    
export class GameSpace extends obj{
  sprite_url = "./sprites/Error.png";
  height = 100;
  width = 100;
  tags:Array<string>;
  collision = false;
  render = false;
  state:GameSpace_state;
  layer = -125;
  tick_state = false;
  params:GameSpace_parameters;
  static default_params:GameSpace_parameters = {}
  constructor(state:obj_state,params:GameSpace_parameters = GameSpace.default_params){
    super(state,params);
    this.tags.push("floor");
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