import { room } from "lib/room";
import { game } from "src/van";
import { state_config } from "lib/room";
import * as config from "./bf3.json";
import { battlefield } from "./abstract/battlefield";
let cfig = config as unknown as state_config;
interface bf3_state {

}

export class bf3 extends battlefield{
  background_url = "./sprites/Error.png";
  render = true;
  constructor(game: game<unknown>) {
    super(game, cfig);
  }
  statef(delta_time: number) {
    super.statef(delta_time);
  }

}