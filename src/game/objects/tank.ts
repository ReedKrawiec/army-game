import {obj} from "lib/object";
import { sprite_gen,positioned_sprite } from "lib/sprite";
import { obj_state, Vector } from "lib/state";
import { unit, unit_parameters, unit_state} from "./abstract/unit";
import {copy} from "src/van";
interface tank_state extends unit_state{
  last_direction:number    
}
    
interface tank_parameters extends unit_parameters{
  
}

class tank_body extends obj{
  sprite_url = "./sprites/tank.png";
  height = 44;
  width = 96;
  layer = 4;
  params:tank_parameters;
  constructor(state:obj_state,params:tank_parameters){
    super(state,params);
  }
  statef(time_delta:number){
    super.statef(time_delta);
    this.state.position.x = this.parent.state.position.x;
    this.state.position.y = this.parent.state.position.y;
  }
  renderf(time_delta:number){
    let selected =  super.renderf(time_delta) as positioned_sprite;
    let sprites = sprite_gen(this.sprite_sheet,this.width,this.height);
    let parent = this.parent as tank;
    let moved_offset = parent.state.has_moved ? 2 : 0
    if(parent.state.last_direction == 0){
      selected.sprite = sprites[this.params.team_id][1 + moved_offset];
    } else {
      selected.sprite = sprites[this.params.team_id][0 + moved_offset];
    }
    return selected;
    
  }
}

export class tank extends unit{
  sprite_url = "./sprites/tank.png";
  height = 0;
  width = 0;
  tags:Array<string>;
  state:tank_state;
  params:tank_parameters;
  speed = 5;
  move_range = 2;
  attack_range = 2;
  defense = 2;
  damage = 5;
  static default_params:tank_parameters = {
    team_id:0
  }
  constructor(state:obj_state,params:tank_parameters = copy(tank.default_params)){
    super(state,params);
    this.state.last_direction = 0;
    this.addItem(new tank_body(state,params));
  }
  statef(time_delta:number){
    super.statef(time_delta);
    if(this.pathfinder.state.velocity.x > 0)
      this.state.last_direction = 1;
    else if(this.pathfinder.state.velocity.x < 0)
      this.state.last_direction = 0;
  }
  renderf(time_delta:number){
   return super.renderf(time_delta)
  }
  register_animations(){
    
  }
  register_audio(){
    
  }
  register_controls(){
        
  }
}