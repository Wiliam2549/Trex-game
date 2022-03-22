var gamestate = "start";
var ground, groundImage;
var trex ,trex_running, trex_jumping, trex_dead;
var gameState;
var cloud, cloudImage;
var cactus, cactusI1, cactusI2, cactusI3, cactusI4, cactusI5, cactusI6;
var score = 0;
var cloudGroup, cactusGroup;
var gameOver, restart;
var gameOverImage, restartImage;
var dieSound, checkpointSound, jumpSound;

function preload() {
  trex_jumping = loadAnimation("trex1.png");
  trex_running = loadAnimation("trex3.png", "trex4.png");
  trex_dead = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  cactusI1 = loadImage("obstacle1.png");
  cactusI2 = loadImage("obstacle2.png");
  cactusI3 = loadImage("obstacle3.png");
  cactusI4 = loadImage("obstacle4.png");
  cactusI5 = loadImage("obstacle5.png");
  cactusI6 = loadImage("obstacle6.png");
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  dieSound = loadSound("die.mp3");
  checkpointSound = loadSound("checkpoint.mp3");
  jumpSound = loadSound("jump.mp3");
}

function setup(){
  createCanvas(600,200)
  
  //create a trex sprite
  trex = createSprite(50, 160, 20, 50);
  trex.scale = 0.5;
  trex.addAnimation("jumping", trex_jumping)
  trex.addAnimation("run", trex_running);
  trex.addAnimation("dead", trex_dead);
  //making the collision radius visible fpr trex
  //trex.debug = true;
  //chaniging the shape and size of the collision radius
  trex.setCollider("circle", 0, 0, 45);
  //trex.setCollider("rectangle", 0, 0, 250, 50);

  //trex.changeAnimation("run");
  //creating the ground
  ground = createSprite(300, 180, 600, 5);
  ground.addImage(groundImage);
  
  box = createSprite(50, 190, 50, 5);
  box.visible = false;

  //var quote = Math.round(random(10, 30));
  //console.log(quote);

  //creating the groups
  cloudGroup = createGroup();
  cactusGroup = new Group();

  //creating the gameover and restart sprites
  gameOver = createSprite(300, 100);
  restart = createSprite(300, 140);
  gameOver.addImage(gameOverImage);
  restart.addImage(restartImage);
  gameOver.scale = 0.8;
  restart.scale = 0.5;
  restartButton = createGroup();
  restartButton.add(gameOver);
  restartButton.add(restart);
}

function draw(){
  background("steelBlue")

  //displaying th score
  textSize(15);
  fill("white");
  text("Score: " + score, 20, 20);

  //start block
  if(gamestate == "start") {
    trex.changeAnimation("jumping");

    if(keyDown("space")) {
      gamestate = "play";
    }
    
    restartButton.setVisibleEach(false);
  }

  //play block
  if(gamestate == "play") {
    //updating the score
    score = score + Math.round(getFrameRate()/30);

    //moving the ground to the left
    ground.velocityX = -8 - score/30;

    if(keyDown("space")  && trex.y >= 160) {
      trex.changeAnimation("jumping");
  
      trex.velocityY = -25;
      jumpSound.play();
    }

    //adding gravity
    trex.velocityY = trex.velocityY + 2.5;

    //making trex stand on ground
    if(trex.collide(box) && ground.velocityX != 0) {
      trex.changeAnimation("run");
    }

    //making the ground infinite by scrolling it
    if(ground.x <= 0) {
      ground.x = 300;
    }

    makeCloud();

    makeCactus();

    //checking collisions between trex and cactuses
    if(trex.isTouching(cactusGroup)) {
      //trex.velocityY = -25;
      //jumpSound.play();
      dieSound.play();
      gamestate = "stop";
    }

    //playing checkpoint sound after every 500 point milestone
    if(score % 500 == 0) {
      checkpointSound.play();
    }

    restartButton.setVisibleEach(false);
  }
  
  //stop block
  if(gamestate == "stop") {
    //making the trex die
    trex.changeAnimation("dead");

    //moving the ground to the left
    ground.velocityX = 0;

    //making trex stand on ground
    trex.collide(box);

    //freezing all game objects
    cloudGroup.setVelocityXEach(0);
    cactusGroup.setVelocityXEach(0);
    trex.velocityY = 0;

    //making all objects stay on the screen
    cloudGroup.setLifetimeEach(-1);
    cactusGroup.setLifetimeEach(-1);

    //making the restart button work
    if(mousePressedOver(restart)) {
      reset();
    }

    restartButton.setVisibleEach(true);
  }

  drawSprites();
}


//exspirement with animation speed

function makeCloud() {
  if(frameCount % 70 == 0) {
    cloud = createSprite(600, Math.round(random(10, 110)), 50, 10);
    cloud.velocityX = -3 - score/50;
    //fixing the depth problem for colud and trex
    cloud.depth = 0;
    cloud.scale = 0.5;
    cloud.addImage(cloudImage);
    //giving a lifetime to the clouds to fix memory leak
    cloud.lifetime = 230;
    //adding the clouds into the group
    cloudGroup.add(cloud);
  }
}

function makeCactus() {
  if(frameCount % 40 == 0) {
    var b = Math.round(random(1, 6));
    cactus = createSprite(600, 160, 30, 50);
    cactus.scale = 0.5;
    cactus.depth = 0;
    cactus.lifetime = 100;
    switch(b) {
      case 1: cactus.addImage(cactusI1);
      break;
      case 2: cactus.addImage(cactusI2);
      break;
      case 3: cactus.addImage(cactusI3);
      break;
      case 4: cactus.addImage(cactusI4);
      break;
      case 5: cactus.addImage(cactusI5);
      break;
      case 6: cactus.addImage(cactusI6);
      break;
      default: break;
    }
    cactus.velocityX = -8 - score/30;
    cactusGroup.add(cactus);
  }
}

function reset() {
  gamestate = "play";
  //destroying all obstacles and clouds
  cloudGroup.destroyEach();
  cactusGroup.destroyEach();
  score = 0;
}