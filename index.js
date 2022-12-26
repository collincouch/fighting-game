const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 125,
  },
  imageSrc: "./img/shop.png",
  scale: 2.75,
  framesMax: 6,
});

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/samuraiMack/Idle.png",
  framesMax: 8, //8 frames in the image
  scale: 2.5,
  //offset the sprite to account for the padding around each frame
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imgSrc: "./img/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imgSrc: "./img/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imgSrc: "./img/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imgSrc: "./img/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imgSrc: "./img/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imgSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imgSrc: "./img/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",

  imageSrc: "./img/kenji/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imgSrc: "./img/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imgSrc: "./img/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imgSrc: "./img/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imgSrc: "./img/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imgSrc: "./img/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imgSrc: "./img/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imgSrc: "./img/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 170,
    height: 50,
  },
});

console.log(player);

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

decreaseTimer();

/**
 * animate
 * * This is the function that starts the infinate loop that detects player actions, animates the sprites and detects the winner
 */
function animate() {
  //make call to esentially start an infinite loop to do the animations
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  /**
   * *Draw the background sprites
   */
  background.update();
  shop.update();
  //lighten up the back ground so the kengi player stands out more in front of the shop
  c.fillStyle = "rgba(255,255,255,.15)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //detect left/right player movement
  if (keys.a.pressed && player.lastKey == "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey == "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  //detect jump player movement
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //detect enemy player movement
  if (keys.ArrowLeft.pressed && enemy.lastKey == "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey == "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  //detect jump enemy movement
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  //detect if player1 is attacking player 2
  if (
    rectangleAttacking({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;

    //use https://cdnjs.com/libraries/gsap to make the health animation better
    //document.querySelector("#enemyHealth").style.width = enemy.health + "%";
    gsap.to("#enemyHealth", { width: enemy.health + "%" });
  }

  //player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  //detect if player2 is attacking player1
  if (
    rectangleAttacking({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;

    //use https://cdnjs.com/libraries/gsap to make the health animation better
    //document.querySelector("#playerHealth").style.width = player.health + "%";
    gsap.to("#playerHealth", { width: player.health + "%" });
    console.log("enemy attacked player");
  }

  //enemy misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  //end game
  if (player.health <= 0 || enemy.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  //console.log(event.key);
  if (!player.dead) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        player.velocity.y = -20;
        break;
      case " ":
        player.attack();
        break;
    }
  }
  if (!enemy.dead) {
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        enemy.velocity.y = -20;
        break;
      case "ArrowDown":
        enemy.attack();
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }

  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
