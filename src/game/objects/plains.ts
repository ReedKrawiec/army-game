import {obj} from "lib/object";
import { obj_state, Vector } from "lib/state";
import {tile, tile_state} from "./abstract/tile";

interface plains_state extends tile_state{
    
}
    
interface plains_parameters{
    
}
    
export class plains extends tile{
  sprite_url = "./sprites/grass.png";
  state:plains_state;
  params:plains_parameters;
  defense = 0;
  static default_params:plains_parameters = {}
  constructor(state:obj_state,params:plains_parameters = plains.default_params){
    super(state,params);
  }
}