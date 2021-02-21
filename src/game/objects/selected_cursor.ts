import { obj } from "lib/object";


export class selected_cursor extends obj {
  sprite_url = "./sprites/selected_cursor.png";
  height = 100;
  width = 100;
  collision = false;
  render = false;
  layer = 4;
  tags = ["selected_cursor"];
}
