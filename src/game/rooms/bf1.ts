import { map_matrix, room } from "lib/room";
import { game } from "src/van";
import { state_config } from "lib/room";
import * as config from "./bf1.json";
import { battlefield } from "./abstract/battlefield";
let cfig = config as unknown as state_config;
interface bf1_state {

}

export class bf1 extends battlefield{
  background_url = "./sprites/Error.png";
  render = true;
  proximity_map = new map_matrix(1100, 220);
  constructor(game:game<unknown>){
    super(game,cfig);
  }
}