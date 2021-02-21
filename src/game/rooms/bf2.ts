import { map_matrix, room } from "lib/room";
import { game } from "src/van";
import { state_config } from "lib/room";
import * as config from "./bf2.json";
import { battlefield } from "./abstract/battlefield";
import { plains } from "game/objects/plains";
import { Vec } from "lib/math";
let cfig = config as unknown as state_config;
interface bf2_state {

}

export class bf2 extends battlefield{
  background_url = "./sprites/Error.png";
  render = true;
  proximity_map = new map_matrix(4400,400);
  constructor(game: game<unknown>) {
    super(game, cfig);
    /*
    for(let a = -2000;a < 2000;a+=100){
      for(let b = -2000;b < 2000;b+=100){
        this.addItem(new plains({
          position:Vec.create(a,b),
          velocity:Vec.create(0,0),
          rotation:0,
          scaling:{width:1,height:1}
        }))
      }
    }
    */
  }
}