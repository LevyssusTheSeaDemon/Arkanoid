//velocidad de movimiento de paddle
const PADDLE_VELOCITY = 200;

//configuración 
export default class MainScene extends Phaser.Scene{
    constructor (config) {
        super ("Main Scene");
        this.config = config;
        this.paddle = null;
        this.ball = null;
        this.ballCollision = null;
    }
    //cargar imágenes
    preload () {
        this.load.image("paddle", "assets/Arkanoid/rectangle.png");
        this.load.image("blocks", "assets/Arkanoid/rectangle.png");
        this.load.image("ball", "assets/Arkanoid/Circle-red.png");
        this.load.image('sky', 'assets/sky.png');
        
    }

    //genera la lógica de la escena
    create () {
        //agregar background
        this.add.image(0, 0, 'sky').setOrigin(0);

        //identifica el paddle y le pone sprite
        this.paddle = this.add.sprite(this.config.width/2, 550, "paddle").setScale(0.25, 0.1);

        //agrega físicas al paddle
        this.physics.add.existing(this.paddle);

        //hacer que el paddle no se caiga
        this.paddle.body.allowGravity = false;
        this.paddle.body.immovable = true;

        //identifica el ball y le pone sprite
        this.ball = this.add.sprite(this.config.width/2, this.config.height/2, "ball").setScale(0.02);

        //le da físicas a la bola
        this.physics.add.existing(this.ball);

        //agrega collider a la bola
        this.physics.add.collider(this.ball, this.config.height, this.gameOver, null, this);

        //le da movimiento al paddle con su respectivo input
        this.input.keyboard.on("keydown-A", this.moveLeft, this);
        this.input.keyboard.on("keydown-D", this.moveRight, this);
        this.input.keyboard.on("keyup-A", this.stop, this);
        this.input.keyboard.on("keyup-D", this.stop, this);

        //le da la velocidad de movimiento a la bola
        this.ball.body.setVelocity(150,150);

        //agrega física entre el paddle y la bola
        this.physics.add.collider(this.paddle, this.ball);

        //hace que la bola rebote
        this.ball.body.setBounce(1);

        //poner paredes y techo y les da físicas y colliders
        this.ball.body.setCollideWorldBounds(true)
        this.paddle.body.setCollideWorldBounds(true)
        this.physics.world.setBoundsCollision(true, true, true, false);
        this.ball.body.onWorldBounds = true;
        this.ball.body.world.on("worldbounds", this.checkBounds, this);

    }

    //checar donde esta la bola
    update(){
        if(this.ball.y > this.config.height){
            //trigger a función gameOver
            this.gameOver();
        }
    }

    //checa si la bola esta atravesando abajo
    checkBounds(body, up, down, left, right) {
        if (down) {
          body.velocity.set(0);
          this.gameOver();
        }
      }
   
   //mover el paddle a la derecha
      moveRight(){
        this.paddle.body.setVelocityX(PADDLE_VELOCITY);
    }

    //mover el paddle a la izquierda
    moveLeft(){
        this.paddle.body.setVelocityX(-PADDLE_VELOCITY);
    }

    //detener el paddle cuando se deja de presionar la tecla
    stop(){
        this.paddle.body.setVelocityX(0);
    }

    //mandar el gameOver y reiniciar la escena
   gameOver(){
    console.log("webos javascript");
    this.ball.body.setVelocity(0);
    this.scene.restart();
   }

}