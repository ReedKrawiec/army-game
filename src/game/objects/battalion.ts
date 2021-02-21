import {composite_obj, obj} from "lib/object";
import { sprite_gen,positioned_sprite } from "lib/sprite";
import { obj_state, Vector } from "lib/state";
import { unit,unit_state, unit_parameters} from "./abstract/unit";
import {Vec} from "lib/math";
import {copy} from "src/van";
interface soldier_state extends obj_state{
    
}
    
interface soldier_parameters{
  offset:Vector;    
}

interface battalion_params extends unit_parameters{
  size:number;
}

interface battalion_state extends unit_state{
  aim_position:Vector;
}

export class battalion extends unit{
  params:battalion_params;
  state:battalion_state;
  render = true;
  collision = false;
  move_range = 2;
  speed = 5;
  damage = 3;
  defense = 1;
  static default_params:battalion_params = {
    size:4,
    team_id:0
  }
  attack(passed_unit:unit){
    this.state.aim_position = passed_unit.state.position;
    super.attack(passed_unit);
  }
  constructor(state:obj_state,params:battalion_params = copy(battalion.default_params)){
    super(state,params);
    this.state.aim_position = Vec.create(0,0);
    let offsets:Vector[] = [{x:-18,y:15},{x:22,y:23},{x:-16,y:-22},{x:16,y:-26}]
    this.tags.push("can_capture");
    for(let a = 0; a < this.params.size; a++){

      this.addItem(new soldier(state,{
        offset:offsets[a]
      }));
    }
  }
  statef(time_delta:number){
    super.statef(time_delta);
    if(this.pathfinder.currentPath && this.pathfinder.currentPath.length > 0){
      this.state.aim_position = this.pathfinder.currentPath[this.pathfinder.currentPath.length - 1];
    }
    let guns = this.getItemsByTag("soldier_gun") as soldier_gun[];
    for(let gun of guns){
      if(this.state.aim_position){
        gun.state.rotation = 90 + gun.angleTowardsPoint(this.state.aim_position); 
      }
      else{
        gun.state.rotation = 0;
      }
    }
    
  }

}

export class soldier extends composite_obj{
  params:soldier_parameters;
  constructor(state:obj_state,params:soldier_parameters){
    super(state,params);

    this.addItem(new soldier_body(state,params));
    this.addItem(new soldier_gun(state,params));
  }
  statef(time_delta:number){
    this.state.position.x = this.parent.state.position.x + this.params.offset.x;
    this.state.position.y = this.parent.state.position.y + this.params.offset.y;
  }
}

class soldier_gun extends obj{
  sprite_url = "./sprites/soldier_gun.png";
  height = 7;
  width = 30;
  layer = 4;
  params:soldier_parameters;
  constructor(state:obj_state,params:soldier_parameters){
    super(state,params);
    this.tags.push("soldier_gun");
  }
  statef(time_delta:number){
    super.statef(time_delta);
    this.state.position.x = this.parent.state.position.x;
    this.state.position.y = this.parent.state.position.y;
  }
  renderf(time_delta:number){
    let sprites = sprite_gen(this.sprite_sheet,this.width,this.height);
    let selected = super.renderf(time_delta) as positioned_sprite;
    let bat = this.parent.parent as battalion;
    let moved_offset = bat.state.has_moved ? 2 : 0;
    if(this.state.rotation >= 90 && this.state.rotation <= 270){
      selected.sprite = sprites[bat.params.team_id][1 + moved_offset];
    }
    else{
      selected.sprite = sprites[bat.params.team_id][0 + moved_offset];
    }
    return selected;
  }
}

class soldier_body extends obj{
  sprite_url = "./sprites/soldier_body.png";
  height = 32;
  width = 32;
  tags:Array<string>;
  collision = false;
  layer = 4;
  render = true;
  state:soldier_state;
  params:soldier_parameters;
  static default_params:soldier_parameters = {
    offset:{
      x:0,
      y:0
    }
  }
  constructor(state:obj_state,params:soldier_parameters = soldier_body.default_params){
    super(state,params);
    

  }
  statef(time_delta:number){
    super.statef(time_delta);
    this.state.position.x = this.parent.state.position.x;
    this.state.position.y = this.parent.state.position.y;
  }
  renderf(time_delta:number){
    let selected = super.renderf(time_delta) as positioned_sprite;
    let sprites = sprite_gen(this.sprite_sheet,this.width,this.height);
    let battalion = this.parent.parent as battalion; 
    let moved_offset = battalion.state.has_moved ? 2 : 0;
    if(battalion.state.aim_position){
      let angle = 90 + this.angleTowardsPoint(battalion.state.aim_position);
      if(angle >= 90 && angle <= 270){
        selected.sprite = sprites[battalion.params.team_id][1 + moved_offset];
      }
      else{
        selected.sprite = sprites[battalion.params.team_id][0 + moved_offset];
      }
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