import {composite_obj, obj} from "lib/object";
import { obj_state, Vector } from "lib/state";
import { Pathing_Object } from "./Pathing_Object";
import {tile} from "game/objects/abstract/tile";
import {Text} from "lib/hud";
import {Vec} from "lib/math";
import { PAUSED,copy } from "src/van";

export interface unit_state extends obj_state{
  health:number,
  has_moved:boolean
}
    
export interface unit_parameters{
  team_id:number
}

class PathFinder extends Pathing_Object{
  render = false;
  tags = ["pathfinder"];
  path_recalc_interval = 5000;
  statef(delta_time:number){
    super.statef(delta_time);
  }
}

export class unit extends composite_obj{
  sprite_url = "./sprites/Error.png";
  height = 0;
  width = 0;
  tags:Array<string> = ["unit"];
  collision = false;
  render = true;
  state:unit_state;
  params:unit_parameters;
  layer = 6;
  pathfinder:PathFinder;
  health_node:Text;
  attack_range = 1;
  defense = 0;
  move_range = 3;
  speed = 5;
  damage = 1;
  static default_params:unit_parameters = {
    team_id:0
  }
  x_proxy(n:number){
    if(PAUSED){
      this.pathfinder.state.position.x = n;
      this.pathfinder.state.last_pos.x = n;
    }
    
    return super.x_proxy(n);
  }
  y_proxy(n:number){
    if(PAUSED){
      this.pathfinder.state.position.y = n;
      this.pathfinder.state.last_pos.y = n;
    }
    
    return super.y_proxy(n);
  }
  constructor(state:obj_state,params:unit_parameters = copy(unit.default_params)){
    super(state,params);
    this.state.health = 10;
    let pf = new PathFinder(state,params)
    this.addItem(pf);
    this.pathfinder = pf;
    pf.speed = this.speed;
    let bottom_right = Vec.add(this.state.position,Vec.create(25,-50))
    this.health_node = new Text({
      position:bottom_right,
      size:50,
      scaling:1,
      font:"VT323",
      color:"white"
    },()=>""+this.state.health);
    this.text_nodes.push(this.health_node);
  }
  delete(){
    let t_nodes = this.game.getRoom().text_nodes;
    t_nodes.splice(t_nodes.indexOf(this.health_node),1);
    super.delete();
  }
  getAttackDistance(){
    return this.attack_range * 100;
  }
  getMoveDistance(){
    return this.move_range * 100;
  }
  attack(passed_unit:unit){
    let t = this.game.getRoom().checkObjectsPointInclusive(passed_unit.state.position,["tile"])[0] as tile;
    passed_unit.state.health -= Math.max(this.damage - passed_unit.defense - t.defense,1);
    if(passed_unit.state.health <= 0){
      passed_unit.delete();
    }
  }
  statef(time_delta:number){
    super.statef(time_delta);
    let bounds = this.getBoundingBox();
    let bottom_right = Vec.add(this.state.position,Vec.create(25,-50))
    this.health_node.state.position = bottom_right;
    this.state.position.x = this.pathfinder.state.position.x;
    this.state.position.y = this.pathfinder.state.position.y;
  }
  setGoal(pos:Vector){
    this.pathfinder.setGoal(pos);
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