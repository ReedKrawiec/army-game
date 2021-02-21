import {obj} from "lib/object";
import { sprite_gen } from "lib/sprite";
import { obj_state, Vector } from "lib/state";
import {tile, tile_state} from "./abstract/tile";
import {positioned_sprite} from "lib/sprite";
import {copy} from "src/van";

interface water_state extends tile_state{
    
}
    
interface water_parameters{
  corner:number
}
    
export class water extends tile{
  sprite_url = "./sprites/water.png";
  state:water_state;
  params:water_parameters;
  defense = 2;
  layer = 2;
  constructor(state:obj_state,params:water_parameters = copy(water.default_params)){
    super(state,params);
  }
  static default_params:water_parameters = {
    corner:0
  }
  renderf(delta_time:number){
    let sprites = sprite_gen(this.sprite_sheet,this.width,this.height);
    let selected = super.renderf(delta_time) as positioned_sprite;
    if(this.params.corner == 1){
      selected.sprite = sprites[0][1];
    }
    return selected;
  }
}