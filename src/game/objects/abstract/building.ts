import { obj } from "lib/object";
import { sprite_gen, positioned_sprite } from "lib/sprite";
import { obj_state, Vector } from "lib/state";
import { tile, tile_state, tile_parameters } from "./tile";
import { unit } from "game/objects/abstract/unit";
import { battalion } from "../battalion";
import { Vec } from "lib/math";
import { tank } from "../tank";
import { menu } from "../menu";
import {battlefield} from "game/rooms/abstract/battlefield";

export interface building_state extends tile_state {
  owner: number,
  capture_percent: number
}

export interface building_parameters extends tile_parameters {

}

export class building extends tile {
  sprite_url = "./sprites/Error.png";
  height = 100;
  width = 100;
  tags: Array<string>;
  collision = true;
  render = true;
  static = false;
  defense = 4;
  state: building_state;
  params: building_parameters;
  static default_params: building_parameters = {}
  constructor(state: obj_state, params: building_parameters = building.default_params) {
    super(state, params);
    Object.assign(this.state, {
      owner: -1,
      capture_percent: 1
    })
    this.tags.push("capturable")
  }
  statef(time_delta: number) {
    super.statef(time_delta);
  }
  renderf(time_delta: number) {
    let sprites = sprite_gen(this.sprite_sheet, this.width, this.height);
    let selected = super.renderf(time_delta) as positioned_sprite;
    selected.sprite = sprites[0][this.state.owner + 1];
    return selected;
  }
  register_animations() {

  }
  register_audio() {

  }
  register_controls() {

  }
}

export class producer_building extends building {
  can_build:string[] = [];
  constructor(state: obj_state, params: building_parameters = building.default_params) {
    super(state, params);
    this.tags.push("can_build");
  }
  getMenu(pos:Vector){
    let m = new menu({
      position:pos,
      velocity:Vec.create(0,0),
      rotation:0,
      scaling:{width:1,height:1}
    },
    {
      item_width:120,
      items:this.can_build.map((s)=>{
        return {
          on_click:()=>{
            let room = this.game.getRoom() as battlefield;
            let unit = this.build(s);
            unit.state.has_moved = true;
            this.state.current_unit = unit;
            room.addItem(unit);
            room.state.menu_open = false;
            room.finishBuilding();
          },
          text:s
        }
      })
    })
    return m;
  }
  build(type: string): unit {
    return undefined;
  }
}   