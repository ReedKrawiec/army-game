import { map_matrix, room } from "lib/room";
import { game, PAUSED, viewport, render_collision_box, render_line } from "src/van";
import { state_config } from "lib/room";
import { Pathing_Room } from "./Pathing_Room";
import { Camera, line_renderer } from "lib/render";
import { exec_type, Poll_Mouse, held_keys } from "lib/controls";
import { unit } from "game/objects/abstract/unit";
import { tile } from "game/objects/abstract/tile";
import { cursor } from "game/objects/cursor";
import { selected_cursor } from "game/objects/selected_cursor";
import { plains } from "game/objects/plains";
import { Vec } from "lib/math";
import { collision_box } from "lib/collision";
import { move_overlay } from "game/objects/move_overlay";
import { HUD, Text } from "lib/hud";
import { g } from "game/main";
import { menu } from "game/objects/menu";
import { building, producer_building } from "game/objects/abstract/building";
import { water } from "game/objects/water";
import { Vector } from "lib/state";
export enum turn_phase {
  start,
  moving,
  attack
}
interface battlefield_state {
  selected_unit: unit,
  current_turn: number,
  current_phase: number,
  menu_open: boolean
}

interface bfield_hud_state {
  tile: tile
}

class bfield_hud extends HUD {
  state: bfield_hud_state;
  constructor() {
    super();
    this.state = { tile: undefined };
  }
  setTextElements(): Text[] {
    return [
      new Text({
        position: Vec.create(49 * viewport.width / 50, 2 * viewport.height / 20),
        size: 40,
        scaling: 1,
        font: "VT323",
        color: "white",
        align: "right"
      }, () => this.state.tile ? this.state.tile.constructor.name.toUpperCase() : ""),
      new Text({
        position: Vec.create(49 * viewport.width / 50, viewport.height / 20),
        size: 30,
        scaling: 1,
        font: "VT323",
        color: "white",
        align: "right"
      }, () => this.state.tile ? "DEFENSE: " + this.state.tile.defense : ""),
      new Text({
        position: Vec.create(49 * viewport.width / 50, 4 * viewport.height / 20),
        size: 40,
        scaling: 1,
        font: "VT323",
        color: "white",
        align: "right"
      }, () => this.state.tile && this.state.tile.state.current_unit ? this.state.tile.state.current_unit.constructor.name.toUpperCase() : ""),
      new Text({
        position: Vec.create(49 * viewport.width / 50, 3 * viewport.height / 20),
        size: 30,
        scaling: 1,
        font: "VT323",
        color: "white",
        align: "right"
      }, () => this.state.tile && this.state.tile.state.current_unit ? "ATTACK: " + this.state.tile.state.current_unit.damage + " DEFENSE: " + this.state.tile.state.current_unit.defense : "")
    ]
  }
  tile_text() {

  }
  statef(delta_time: number) {
    let mouse = Poll_Mouse(g.state.current_room.cameras[0]);
    if (mouse) {
      let tile = g.getRoom().checkObjectsPointInclusive(mouse, ["tile"]) as tile[];
      if (tile.length > 0) {
        this.state.tile = tile[0];
      }
      else {
        this.state.tile = undefined;
      }
    }
    super.statef(delta_time);
  }
}

export class battlefield extends Pathing_Room<battlefield_state>{
  background_url = "./sprites/Error.png";
  render = false;
  nav_node_diameter = 20;
  proximity_map = new map_matrix(2200, 440);
  floor_tag = "floor";
  number_of_teams = 2;
  constructor(game: game<unknown>, fig: state_config) {
    super(game, fig);
    this.state = {
      selected_unit: undefined,
      current_turn: 0,
      current_phase: turn_phase.start,
      menu_open: false
    }

    this.cameras.push(new Camera({
      x: 0,
      y: 0,
      dimensions: viewport,
      scaling: 0.3,
      debug: false
    },
      {
        x: 0,
        y: 0,
        height: 1,
        width: 1
      }, new bfield_hud()))
  }
  initialize() {
    let units = this.getObjByTag("unit") as unit[];
    for (let u of units) {
      let tile = this.checkObjectsPointInclusive(u.state.position, ["tile"])[0] as tile;
      u.state.position = Vec.from(tile.state.position);
      tile.state.current_unit = u;
    }
  }
  man_distance(v1:Vector,v2:Vector){
    let delta = Vec.func(Vec.sub(v1,v2),(a)=>Math.abs(a))
    return delta.x + delta.y;
  }
  showRange(unit: unit, radius: number) {
    let col_box: collision_box = {
      x: unit.state.position.x,
      y: unit.state.position.y,
      width: (1 + radius * 2) * 100,
      height: (1 + radius * 2) * 100
    }
    let radius_tiles = this.checkObjectsInclusive(col_box, ["tile"]);
    let selected =this.state.selected_unit;
    let path_finder = this.state.selected_unit.pathfinder;
    radius_tiles = (radius_tiles.filter((o) => {
      let dist = this.man_distance(o.state.position,selected.state.position);
      return dist <= radius * 100;
    })) as tile[];
    radius_tiles = radius_tiles.filter((o)=>path_finder.pathExists(selected.state.position,o.state.position));
    let overlays = [];
    for (let t of radius_tiles) {
      if (!(t as tile).state.current_unit) {
        overlays.push(new move_overlay({
          position: Vec.create(t.state.position.x, t.state.position.y),
          velocity: Vec.create(0, 0),
          rotation: 0,
          scaling: { width: 1, height: 1 }
        }));
      }
    }
    this.addItems(overlays);
  }
  advanceTurn() {
    this.state.current_turn = this.state.current_turn + 1;
    if (this.state.current_turn > this.number_of_teams - 1) {
      this.state.current_turn = 0;
    }
    let units = (<unit[]>this.getObjByTag("unit"));
    units.forEach((u) => {
      u.state.has_moved = false;
    })
    let t_ele = this.cameras[0].hud.text_elements;
    let turn_node = new Text({
      position: Vec.create(viewport.width / 2, viewport.height / 2),
      size: 90,
      scaling: 1,
      font: "VT323",
      color: "white"
    }, () => "END OF TURN");
    t_ele.push(turn_node);
    let transition_interval: NodeJS.Timeout;
    setTimeout(() => {
      transition_interval = setInterval(() => {
        turn_node.state.size -= 1;
        turn_node.state.position.y -= 10;
      }, 20)
    }, 1000)
    setTimeout(() => {
      clearTimeout(transition_interval);
      t_ele.splice(t_ele.indexOf(turn_node), 1);
    }, 2000)
  }
  selectUnit(u: unit) {
    this.state.selected_unit = u;
    let selected = this.state.selected_unit;
    let tiles = (<tile[]>this.getObjByTag("tile")).filter(t=>{
      return this.man_distance(t.state.position,selected.state.position) > selected.getMoveDistance() || (t.state.current_unit && this.state.current_turn != t.state.current_unit.params.team_id);
    });
    for(let obj of tiles){
      obj.collision = true;
    }
    this.showRange(u, u.move_range);
  }
  registerControls() {
    this.bindControl("KeyA", exec_type.repeat, () => {
      if (!this.state.menu_open && this.state.current_phase != turn_phase.moving) {
        let shift_held = held_keys["ShiftLeft"] ? 1 : 0;
        let cam = this.cameras[0];
        cam.state.position.x = cam.state.position.x - ((5 + shift_held * 5) * (1 / cam.state.scaling));
        if (cam.state.position.x < -this.proximity_map.length / 2) {
          cam.state.position.x = -this.proximity_map.length / 2
        }
      }
    });
    this.bindControl("KeyD", exec_type.repeat, () => {
      if (!this.state.menu_open && this.state.current_phase != turn_phase.moving) {
        let shift_held = held_keys["ShiftLeft"] ? 1 : 0;
        let cam = this.cameras[0];
        cam.state.position.x = cam.state.position.x + ((5 + shift_held * 5) * (1 / cam.state.scaling));
        if (cam.state.position.x > this.proximity_map.length / 2) {
          cam.state.position.x = this.proximity_map.length / 2
        }
      }
    });
    this.bindControl("KeyW", exec_type.repeat, () => {
      if (!this.state.menu_open && this.state.current_phase != turn_phase.moving) {
        let shift_held = held_keys["ShiftLeft"] ? 1 : 0;
        let cam = this.cameras[0];

        cam.state.position.y = cam.state.position.y + ((5 + shift_held * 5) * (1 / cam.state.scaling));
        if (cam.state.position.y > this.proximity_map.length / 2) {
          cam.state.position.y = this.proximity_map.length / 2
        }
      }
    });
    this.bindControl("KeyS", exec_type.repeat, () => {
      if (!this.state.menu_open && this.state.current_phase != turn_phase.moving) {
        let shift_held = held_keys["ShiftLeft"] ? 1 : 0;
        let cam = this.cameras[0];
        cam.state.position.y = cam.state.position.y - ((5 + shift_held * 5) * (1 / cam.state.scaling));
        if (cam.state.position.y < -this.proximity_map.length / 2) {
          cam.state.position.y = -this.proximity_map.length / 2
        }
      }
    });
    this.bindControl("scrollup", exec_type.once, () => {
      if (!this.state.menu_open && this.state.current_phase != turn_phase.moving) {
        let cam = this.cameras[0] as Camera;
        cam.state.scaling += 0.05;
        if (cam.state.scaling > 1) cam.state.scaling = 1;
      }
    })
    this.bindControl("scrolldown", exec_type.once, () => {
      if (!this.state.menu_open && this.state.current_phase != turn_phase.moving) {
        let cam = this.cameras[0] as Camera;
        if (cam.state.scaling > 0.5) {
          cam.state.scaling -= 0.05;
        }
      }
    })
    this.bindControl("Space", exec_type.once, () => {
      if (!this.state.selected_unit) {
        let units = this.getObjByTag("unit") as unit[];

        let filtered = units.filter(u => u.params.team_id == this.state.current_turn && !u.state.has_moved);
        let first = filtered[0];
        if (first) {
          this.selectUnit(first);
          this.cameras[0].moveTo(first.state.position, 200);
        }
        else {
          let producers = this.getObjByTag("can_build") as producer_building[];
          let unused_buildings = producers.filter((p) => !p.state.current_unit && p.state.owner == this.state.current_turn);
          let first = unused_buildings[0];
          if (first) {
            this.cameras[0].moveTo(first.state.position, 200);
            this.state.menu_open = true;
            this.addItem(new menu({
              position: first.state.position,
              velocity: Vec.create(0, 0),
              rotation: 0,
              scaling: { width: 1, height: 1 }
            }, {
              item_width: 100,
              items: [
                {
                  on_click: () => {
                    this.state.menu_open = false;
                  },
                  text: "cancel"
                },
                {
                  on_click: () => {
                    this.addItem(first.getMenu(first.state.position));
                  },
                  text: "build"
                }
              ]
            }))
          }
        }

      }
    })
    this.bindControl("mouse0down", exec_type.once, () => {
      let mouse = Poll_Mouse(this.cameras[0]);

      if (mouse) {
        let tile = this.checkObjectsPointInclusive(mouse, ["tile"])[0] as tile;
        if (tile) {
          switch (this.state.current_phase) {
            case turn_phase.start:
              if (!this.state.selected_unit) {
                  let unit = this.checkObjectsInclusive(tile.getFullCollisionBox(), ["unit"]) as unit[];
                  let u = unit.filter((u) => u.params.team_id == this.state.current_turn && !u.state.has_moved)[0] as unit;
                  if (u && !this.state.menu_open) {
                    this.selectUnit(u);
                  } else {
                    if (tile.tags.includes("can_build") && !this.state.menu_open) {
                      let producer = tile as producer_building;
                      if (producer.state.owner == this.state.current_turn && !producer.state.current_unit) {
                        this.state.menu_open = true;
                        this.addItem(new menu({
                          position: mouse,
                          velocity: Vec.create(0, 0),
                          rotation: 0,
                          scaling: { width: 1, height: 1 }
                        }, {
                          item_width: 100,
                          items: [
                            {
                              on_click: () => {
                                this.state.menu_open = false;
                              },
                              text: "cancel"
                            },
                            {
                              on_click: () => {
                                this.addItem(producer.getMenu(mouse));
                              },
                              text: "build"
                            }
                          ]
                        }))
                      }
                    }
                    else if (!this.state.menu_open) {
                      this.state.menu_open = true;
                      this.addItem(new menu({
                        position: mouse,
                        velocity: Vec.create(0, 0),
                        rotation: 0,
                        scaling: { width: 1, height: 1 }
                      },
                        {
                          item_width: 110,
                          items: [
                            {
                              on_click: () => {
                                this.state.menu_open = false;
                              },
                              text: "continue"
                            },
                            {
                              on_click: () => {
                                this.advanceTurn();
                                this.state.menu_open = false;
                              },
                              text: "end turn"
                            }
                          ]
                        }))
                    }
                  }
                
              }
              else {
                let radius_tiles = this.getObjByTag("move_overlay");
                if (!tile.state.current_unit || tile.state.current_unit == this.state.selected_unit) {
                  let old_tile = this.checkObjectsInclusive(this.state.selected_unit.getFullCollisionBox(), ["tile"])[0] as tile;
                  let pathfinder = this.state.selected_unit.pathfinder;
                  let dist = this.man_distance(this.state.selected_unit.state.position,tile.state.position)
                  if (dist <= this.state.selected_unit.getMoveDistance() && pathfinder.pathExists(this.state.selected_unit.state.position,tile.state.position)) {
                    old_tile.state.current_unit = undefined;
                    this.state.selected_unit.setGoal(tile.state.position);
                    this.state.current_phase = turn_phase.moving;
                    tile.state.current_unit = this.state.selected_unit;
                  }
                  else {
                    for(let obj of this.objects){
                      obj.collision = false;
                    }
                    this.state.selected_unit = undefined;
                  }
                  for (let r of radius_tiles) {
                    r.delete();
                  }
                }

              }
              break;
            case turn_phase.attack:
              if (!this.state.menu_open) {
                let unit = this.checkObjectsInclusive(tile.getFullCollisionBox(), ["unit"])[0] as unit;
                let dist = this.man_distance(unit.state.position,this.state.selected_unit.state.position)
                if (unit && dist <= this.state.selected_unit.getAttackDistance() && unit.params.team_id != this.state.selected_unit.params.team_id) {
                  this.state.selected_unit.attack(unit);
                  this.state.current_phase = turn_phase.start;
                  this.finishAction();
                }
              }
              break;
          }
        }
      }
    })

  }
  registerParticles() {

  }
  valid_moves_exist() {
    let unmoved_units = (<unit[]>this.getObjByTag("unit")).filter(u => u.params.team_id == this.state.current_turn && !u.state.has_moved);
    let unused_buildings = (<building[]>this.getObjByTag("can_build")).filter(b => b.state.owner == this.state.current_turn && !b.state.current_unit);
    if (unmoved_units.length == 0 && unused_buildings.length == 0) {
      return false;
    }
    return true;
  }
  finishBuilding() {
    if (!this.valid_moves_exist()) {
      this.advanceTurn();
    }
  }
  finishAction() {
    this.state.selected_unit.state.has_moved = true;
    this.state.selected_unit = undefined;
    if (!this.valid_moves_exist()) {
      this.advanceTurn();
    }
    let radius_tiles = this.getObjByTag("move_overlay");
    for (let r of radius_tiles) {
      r.delete();
    }
  }
  statef(delta_time: number) {
    super.statef(delta_time);
    let mouse = Poll_Mouse(this.cameras[0]);
    if (mouse) {
      let cursor = this.getObjByTag("cursor")[0] as cursor;
      if (cursor) {
        cursor.render = true;
        cursor.state.position.x = Math.floor((mouse.x + 50) / 100) * 100;
        cursor.state.position.y = Math.floor((mouse.y + 50) / 100) * 100;
      }
      else {
        cursor.render = false;
      }
    }
    let selected_cursor = this.getObjByTag("selected_cursor")[0] as selected_cursor;
    if (this.state.selected_unit) {
      selected_cursor.render = true;
      selected_cursor.state.position.x = this.state.selected_unit.state.position.x;
      selected_cursor.state.position.y = this.state.selected_unit.state.position.y;
    }
    else {
      selected_cursor.render = false;
    }
    if (this.state.current_phase == turn_phase.moving) {
      if (!this.state.selected_unit.pathfinder.hasGoal) {
        for(let obj of this.objects){
          obj.collision = false;
        }
        this.state.current_phase = turn_phase.attack;
        let tile = this.checkObjectsPointInclusive(this.state.selected_unit.state.position, ["tile"])[0] as tile;
        let col_box = this.state.selected_unit.getFullCollisionBox();
        col_box.width = 2 * this.state.selected_unit.getAttackDistance() + 100;
        col_box.height = 2 * this.state.selected_unit.getAttackDistance() + 100;
        let units = this.checkObjectsInclusive(col_box, ["unit"]) as unit[];
        units = units.filter(u => u.id != this.state.selected_unit.id && u.params.team_id != this.state.selected_unit.params.team_id);
        units = units.filter((u)=>{
          return this.man_distance(this.state.selected_unit.state.position,u.state.position) <= this.state.selected_unit.getAttackDistance()
        });
        let menu_items = [{
          on_click: () => {
            this.state.current_phase = turn_phase.start;
            this.finishAction();
            this.state.menu_open = false;
          },
          text: "finish"
        }]
        if (units.length > 0) {
          menu_items.push({
            on_click: () => {
              let attack_overlays: move_overlay[] = [];
              for (let u of units) {
                  attack_overlays.push(new move_overlay({
                    position: Vec.create(u.state.position.x, u.state.position.y),
                    velocity: Vec.create(0, 0),
                    rotation: 0,
                    scaling: { width: 1, height: 1 }
                  }))
              }
              this.addItems(attack_overlays);
              this.state.menu_open = false;
            },
            text: "attack"
          })
        }
        if (this.state.selected_unit.tags.includes("can_capture") && tile.tags.includes("capturable")) {
          let building = tile as building;
          if (building.state.owner != this.state.selected_unit.params.team_id) {
            menu_items.push({
              on_click: () => {

                if (building.state.capture_percent == 1) {
                  building.state.capture_percent = 0;
                }
                building.state.capture_percent += this.state.selected_unit.height/20;
                if (building.state.capture_percent == 1) {
                  building.state.owner = this.state.selected_unit.params.team_id;
                }
                this.state.menu_open = false;
                this.state.current_phase = turn_phase.start;
                this.finishAction();
              },
              text: "capture"
            })
          }
        }

        this.state.menu_open = true;
        this.addItem(new menu({
          position: this.state.selected_unit.state.position,
          velocity: Vec.create(0, 0),
          rotation: 0,
          scaling: { width: 1, height: 1 }
        }, {
          items: menu_items,
          item_width: 100
        }))
      }
    }
    
  }
}