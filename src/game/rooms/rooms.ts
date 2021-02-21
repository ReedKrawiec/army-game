
interface room_dir {
  [index:string]:any
}
import {bf1} from "./bf1";
import {bf2} from "./bf2";
import {bf3} from "./bf3";
import {example} from "./example";
import {loading} from "./loading";
export let rooms:room_dir = {
	bf1:bf1,
	bf2:bf2,
	bf3:bf3,
	example:example,
	loading:loading,
}