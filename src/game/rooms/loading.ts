import { room } from "lib/room";
import { game, viewport } from "src/van";
import { state_config } from "lib/room";
import * as config from "./loading.json";
import { Camera } from "lib/render";
import { HUD,Text } from "lib/hud";
import { Vec } from "lib/math";
import {loader} from "game/objects/loader";
import {obj} from "lib/object";
let cfig = config as unknown as state_config;
interface loading_state {

}

class loading_hud extends HUD{
  setTextElements():Text[]{
    return [
      new Text({
        position:Vec.create(19 * viewport.width/20, viewport.height/20),
        size:130,
        scaling:1,
        font:"VT323",
        color:"white",
        align:"right"
      },()=>"LOADING")
    ]
  }
}

export class loading extends room<loading_state>{
  background_url = "./sprites/Error.png";
  render = false;
  constructor(game: game<unknown>) {
    super(game, cfig);
    game.state.cameras.push(new Camera({
      x:0,
      y:0,
      dimensions:viewport,
      scaling:1,
      debug:false
    },{
      x:0,
      y:0,
      width:1,
      height:1
    },new loading_hud()));
    this.addItem(new loader({
      position:Vec.create(0, 0),
      velocity:Vec.create(0,0),
      scaling:{height:1,width:1},
      rotation:0
    }));
  }
  registerControls() {

  }
  registerParticles() {

  }
  statef(delta_time: number) {
    super.statef(delta_time);
  }

}