
interface prefabs {
  [index:string]:any
}
import {battalion} from "./battalion";
import {cursor} from "./cursor";
import {example} from "./example";
import {factory} from "./factory";
import {forest} from "./forest";
import {GameSpace} from "./GameSpace";
import {loader} from "./loader";
import {menu} from "./menu";
import {move_overlay} from "./move_overlay";
import {plains} from "./plains";
import {selected_cursor} from "./selected_cursor";
import {tank} from "./tank";
import {water} from "./water";
export let prefabs:prefabs = {
	battalion:battalion,
	cursor:cursor,
	example:example,
	factory:factory,
	forest:forest,
	GameSpace:GameSpace,
	loader:loader,
	menu:menu,
	move_overlay:move_overlay,
	plains:plains,
	selected_cursor:selected_cursor,
	tank:tank,
	water:water,
}