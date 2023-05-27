//velocidad de movimiento de paddle
const PADDLE_VELOCITY = 200;
const GLOBAL_CONFIG = {
    width: 800,
    height: 600,
  };

//configuración 
export default class MainScene extends Phaser.Scene{
    constructor (config) {
        super ("Main Scene");
        this.config = config;
        this.paddle = null;
        this.ball = null;
        this.ballCollision = null;
        this.blocks = null;
    }
    //cargar imágenes
    preload () {
        this.load.image("paddle", "assets/Arkanoid/rectangle.png");
        this.load.image("blocks", "assets/Arkanoid/rectangle.png");
        this.load.image("ball", "assets/Arkanoid/Circle-red.png");
        this.load.image('sky', 'assets/sky.png');
        this.load.image("pause_button", "assets/pause.png");
        
    }

    //genera la lógica de la escena
    create () {
        //agregar background
        this.add.image(0, 0, 'sky').setOrigin(0);

        this.pauseButton = this.add.image(this.game.config.width - 10, 10, "pause_button").setOrigin(1, 0).setScale(2).setInteractive();
        this.pauseButton.on("pointerup", this.pause, this);
  
        this.isPaused = false;

        //identifica el paddle y le pone sprite
        this.paddle = this.add.sprite(this.config.width/2, 550, "paddle").setScale(0.25, 0.1);

        //this.blocks = this.add.sprite(this.config.width/2, 200,"blocks").setScale(0.25, 0.1);
       
        this.blocks = this.physics.add.group();
        const blockPositions = [
            { x: 100, y: 100 },
            { x: 200, y: 100 },
            { x: 300, y: 100 },
            { x: 400, y: 100 },
            { x: 500, y: 100 },
            { x: 600, y: 100 },
            { x: 700, y: 100 },
            { x: 700, y: 150 },
            { x: 600, y: 150 },
            { x: 500, y: 150 },
            { x: 400, y: 150 },
            { x: 300, y: 150 },
            { x: 200, y: 150 },
            { x: 100, y: 150 },
            { x: 700, y: 200 },
            { x: 600, y: 200 },
            { x: 500, y: 200 },
            { x: 400, y: 200 },
            { x: 300, y: 200 },
            { x: 200, y: 200 },
            { x: 100, y: 200 },
            { x: 700, y: 50 },
            { x: 600, y: 50 },
            { x: 500, y: 50 },
            { x: 400, y: 50 },
            { x: 300, y: 50 },
            { x: 200, y: 50 },
            { x: 100, y: 50 },
            // Add more block positions as needed
          ];
          
          blockPositions.forEach((position) => {
            const block = this.blocks.create(position.x, position.y, "blocks").setScale(0.1,0.1);
            block.body.allowGravity = false;
            block.body.immovable = true;
          });
        


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
        this.physics.add.collider(this.ball,this.blocks,this.destroyBlocks,null,this);

        //hace que la bola rebote
        this.ball.body.setBounce(1);

        //poner paredes y techo y les da físicas y colliders
        this.ball.body.setCollideWorldBounds(true)
        this.paddle.body.setCollideWorldBounds(true)
        this.physics.world.setBoundsCollision(true, true, true, false);
        this.ball.body.onWorldBounds = true;
        this.ball.body.world.on("worldbounds", this.checkBounds, this);

    }

    pause() {
        this.physics.pause();
        this.isPaused = true;
        this.pauseButton.setVisible(false);
    
    
        const continueButtonCallbacks = {
          onClick: this.resume,
          onMouseEnter: text => text.setFill("#0F0"),
          onMouseExit: text => text.setFill("#FFF"),
        };
    
        const quitButtonCallbacks = {
          onClick: this.quitGame,
          onMouseEnter: text => text.setFill("#F00"),
          onMouseExit: text => text.setFill("#FFF"),
        };
    
        const pauseMenu = {
          items: [
            { label: "Continue", style: { fontSize: "32px", fill: "#FFF" }, ...continueButtonCallbacks },
            { label: "Quit", style: { fontSize: "32px", fill: "#FFF" }, ...quitButtonCallbacks },
          ],
    
          firstItemPosition: { x: GLOBAL_CONFIG.width / 2, y: GLOBAL_CONFIG.height / 2 },
          origin: { x: 0.5, y: 0.5 },
          spacing: 45
        };
    
        this.showMenu(pauseMenu);
      }

      showMenu(menu) {
        let yPos = menu.firstItemPosition.y;
        this.activeMenu = this.add.group();
    
        menu.items.forEach(item => {
          const textObject = this.add.text(menu.firstItemPosition.x, yPos, item.label, item.style)
            .setOrigin(menu.origin.x, menu.origin.y)
            .setInteractive();
          yPos += menu.spacing;
          textObject.on("pointerup", item.onClick, this);
          textObject.on("pointerover", () => { item.onMouseEnter(textObject) }, this);
          textObject.on("pointerover", () => { item.onMouseExit(textObject) }, this);
          this.activeMenu.add(textObject);
        });
      }

      hideMenu() {
        if (this.activeMenu) this.activeMenu.clear(true, true);
        this.activeMenu = null;
      }

      resume() {
        this.physics.resume();
        this.isPaused = false;
        this.pauseButton.setVisible(true);
        this.hideMenu();
    
      }
      

      quitGame() {
        this.score = 0;
        this.scene.restart();
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

    destroyBlocks(ball,blocks){
        blocks.destroy();
    }

    //mandar el gameOver y reiniciar la escena
   gameOver(){
    console.log("webos javascript");
    this.ball.body.setVelocity(0);
    this.scene.restart();
   }

}