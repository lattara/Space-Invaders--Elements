import { Injectable } from '@angular/core';
import { Ammo } from './ammo';
import { Ship } from './ship';
import { Enemy} from 'src/app/shared/enemy';
import { Game } from './game';

@Injectable({
  providedIn: 'root'
})
export class GameService {
 
  enemies : Set<Enemy> = new Set<Enemy>();
  ammos : Set<Ammo> = new Set<Ammo>();
  types : string[] = ['fire','water','air','earth'];
  isShoot: boolean = false;
  mvLeft: boolean = false;
  mvRight: boolean = false;
  mvUp: boolean = false;
  mvDown: boolean = false;
  mvUpRight: boolean = false;
  mvUpLeft: boolean = false;
  mvDownRight: boolean = false;
  mvDownLeft: boolean = false;


  ship : Ship = {
    id : 0,
    url : '',
    posX: 0,
    posY: 880,
    height : 60,
    width : 40,
    size : 0,
    HP: 100,
    backgroundColor:"red",
  };
  game : Game = new Game;

  
  constructor() {
    // multi actions
    setInterval(() => {
      if (this.isShoot) {
        this.addAmmo();
      }
    }, 120);

    // mouvement
    setInterval(() => {
      if (this.mvRight && this.ship.posX < this.game.maxX - this.ship.width/2 - 10 ) {
        this.ship.posX = this.ship.posX + 10;
      }
      if (this.mvLeft && this.ship.posX > this.game.minX + 10) {
        this.ship.posX = this.ship.posX - 10;
      }
      if (this.mvUp && this.ship.posY > 0) {
        this.ship.posY = this.ship.posY - 10;
      }
      if (this.mvDown && this.ship.posY < this.game.maxY - this.ship.height) {
        this.ship.posY = this.ship.posY + 10;
      }
    }, 50);

    // Ammo moving and killing enemy
    setInterval(() => {
      for (let ammo of this.ammos) {
            this.moveAmmo(ammo);
        for (let enemy of this.enemies){
          if((ammo.posX > enemy.posX) && (ammo.posX < enemy.posX + enemy.width)){
            if(ammo.posY < enemy.posY + enemy.height){       
              this.enemies.delete(enemy);
              this.ammos.delete(ammo);
            }
          }
          if(ammo.posX + ammo.width > enemy.posX && ammo.posX + ammo.width < enemy.posX + enemy.width){
            if(ammo.posY < enemy.posY + enemy.height){       
              this.enemies.delete(enemy);
              this.ammos.delete(ammo);
            }
          }        

        }
      }
    }, 100);

    // Enemy moving down and colision of the ship with enemy
    setInterval(() => {
      for (let enemy of this.enemies) {
        this.moveEnemy(enemy);
          if ( this.ship.posX < enemy.posX + enemy.width && this.ship.posX > enemy.posX){
            if ( this.ship.posY < enemy.posY + enemy.height && this.ship.posY > enemy.posY){
              this.enemies.delete(enemy);
            }  
          }
          if ( this.ship.posX + this.ship.width < enemy.posX + enemy.width && this.ship.posX + this.ship.width> enemy.posX){
            if ( this.ship.posY < enemy.posY + enemy.height && this.ship.posY > enemy.posY){
              this.enemies.delete(enemy);
            }  
          }
          if ( this.ship.posY + this.ship.height < enemy.posY + enemy.height && this.ship.posY + this.ship.height > enemy.posY ){
            if ( this.ship.posX < enemy.posX + enemy.width && this.ship.posX > enemy.posX){
              this.enemies.delete(enemy);
            }
          }
          if ( this.ship.posY + this.ship.height < enemy.posY + enemy.height && this.ship.posY + this.ship.height > enemy.posY ){
            if ( this.ship.posX + this.ship.width < enemy.posX + enemy.width && this.ship.posX  + this.ship.width > enemy.posX){
              this.enemies.delete(enemy);
            }
          }    
      }
    }, 200);

  }

  //Function random
  randomNumber(min : number, max : number) {  
    return Math.floor(Math.random() * (max - min)+min);
  }

  
  //Functions to define the container size
  setMaxX(widthTotal, sizeGameContainer){
    this.game.maxX = (widthTotal*0.1) + sizeGameContainer;
    return this.game.maxX;
  }
  setMinX(widthTotal){
    this.game.minX = (widthTotal*0.1);
    return this.game.minX;
  }
  setMaxY(heightTotal){
    this.game.maxY = (heightTotal);
    return this.game.maxY;
  }
  setMinY(){
    this.game.minY = 0;
    return this.game.minY;
  }

  //Position of the ship
  setShipX(widthTotal){
    this.ship.posX = widthTotal/2;
  }
  setShipY(heightTotal){
    this.ship.posY = heightTotal - this.ship.height;
  }

  //Ammo addition and move
  addAmmo() {
    let ammo = new Ammo('fire', this.ship.posX + 18, this.ship.posY - 10);
    return this.ammos.add(ammo);
  }
  
  moveAmmo(ammo: Ammo) : void {
    ammo.posY = ammo.posY - 15;
    if (ammo) {
      if (ammo.posY < 0) {
        this.ammos.delete(ammo);
      }
      else {
        ammo.posY = ammo.posY - 5;
      }
    }
  }

  
  //Enemy addition and move
  addEnemy(){
   
    let enemyX = this.randomNumber(this.game.minX+15, this.game.maxX)
  
    let enemy = new Enemy(this.types[this.randomNumber(0,3)], enemyX-30 , -30)
    this.enemies.add(enemy);
    
  }

  moveEnemy(enemy:Enemy){
    if (enemy) {
      if (enemy.posY>this.game.maxY-32) {
        this.enemies.delete(enemy);
      }
      else {
        enemy.posY = enemy.posY + 5;
      }
    }
  }
}


