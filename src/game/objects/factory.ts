import {obj} from "lib/object";
import { obj_state, Vector } from "lib/state";
import { building,building_state,producer_building } from "./abstract/building";
import {battalion} from "game/objects/battalion";
import {tank} from "game/objects/tank";
import {Vec} from "lib/math";
export interface factory_state extends building_state{
    
}
    
export interface factory_parameters{
    
}
    
export class factory extends producer_building{
  sprite_url = "./sprites/factory.png";
  height = 100;
  width = 100;
  tags:Array<string>;
  collision = false;
  render = true;
  can_build = ["battilion","tank"];
  state:factory_state;
  params:factory_parameters;
  static default_params:factory_parameters = {}
  constructor(state:obj_state,params:factory_parameters = factory.default_params){
    super(state,params);
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
  build(type:string){
    switch(type){
      case "battilion":
        return new battalion({
          position: this.state.position,
          velocity: Vec.create(0, 0),
          rotation: 0,
          scaling: { width: 1, height: 1 }
        }, { size: 4, team_id: this.state.owner });
      case "tank": 
        return new tank({
        position: this.state.position,
        velocity: Vec.create(0, 0),
        rotation: 0,
        scaling: { width: 1, height: 1 }
      }, { team_id: this.state.owner });
    }
  }
}