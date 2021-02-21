import { room ,map_matrix} from "lib/room";
import { game } from "src/van";
import { state_config } from "lib/room";
import * as config from "./example.json";
import { tile } from "game/objects/abstract/tile";
import { Vec } from "lib/math";
import { plains } from "game/objects/plains";
let cfig = config as unknown as state_config;
interface example_state {

}

export class example extends room<example_state>{
  background_url = "./sprites/Error.png";
  render = false;
  proximity_map:map_matrix = new map_matrix(10000,500);
  constructor(game: game<unknown>) {
    
    super(game, cfig);
    for(let a = 0;a < 80; a++){
      for(let b = 0; b < 80;b++){
        this.addItem(new plains({
          position:Vec.create(a * 100 -5000, b * 100 - 5000),
          velocity:Vec.create(0,0),
          rotation:0,
          scaling:{width:1,height:1}
        }))
      }
    }
  }
  registerControls() {

  }
  registerParticles() {

  }
  statef(delta_time: number) {
    super.statef(delta_time);
  }

}

