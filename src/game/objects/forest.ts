import {obj} from "lib/object";
import { obj_state, Vector } from "lib/state";
import {tile, tile_state} from "./abstract/tile";

interface forest_state extends tile_state{
    
}
    
interface forest_parameters{
    
}
    
export class forest extends tile{
  sprite_url = "./sprites/forest.png";
  state:forest_state;
  params:forest_parameters;
  defense = 2;
  layer = 2;
}