/**
 * Sprite
 * *Responsible for rendering an image
 * {*Param}
 */
class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;

    this.height = 150;
    this.width = 50;
    this.offset = offset;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    //control the speed of the animiation
    this.framesElapsed = 0; //How many frames have elapsed during the while animation.  Control the speed of the animation
    this.framesHold = 5; // How many frames should we go through before we change framesCurrent
  }

  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }

  draw() {
    //console.log(this.image);
    c.drawImage(
      this.image,
      //begin crop
      this.framesCurrent * (this.image.width / this.framesMax), //x location of current frame
      0,
      this.image.width / this.framesMax, //crop to width of the frame
      this.image.height,
      //end crop
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );

    // c.drawImage(
    //   this.image,
    //   //begin crop
    //   this.framesCurrent * (this.image.width / this.framesMax),
    //   0,
    //   this.image.width / this.framesMax,
    //   this.image.height,
    //   //end crop
    //   this.position.x,
    //   this.position.y,
    //   (this.image.width / this.framesMax) * this.scale,
    //   this.image.height * this.scale
    // );
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

/**
 * Fighter
 * *Responsible for renderning fighter object.  This extends the Sprite class
 */
class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined },
    dead = false,
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    });

    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.isAttacking;
    this.health = 40;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.sprites = sprites;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = this.sprites[sprite].imgSrc;
    }

    //console.log(this.sprites);
  }

  update() {
    this.draw();
    if (!this.dead) this.animateFrames();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    //uncomment to see rectangular attack box.  Usefull for attackbox offset
    // c.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // );

    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    //gravity function
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else {
      this.velocity.y += gravity;
    }

    //console.log(this.position.y);
  }

  switchSprite(sprite) {
    //override if death
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.framesMax - 1) {
        this.dead = true;
      }
      return;
    }

    //override if attack
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.framesMax - 1
    )
      return;

    //override if take hit
    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.framesMax - 1
    )
      return;

    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          //console.log("attack1");
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "takeHit":
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "death":
        if (this.image !== this.sprites.death.image) {
          console.log("death");
          this.image = this.sprites.death.image;
          this.framesMax = this.sprites.death.framesMax;
          this.framesCurrent = 0;
        }
        break;
    }
  }

  takeHit() {
    this.health -= 20;
    if (this.health <= 0) {
      this.switchSprite("death");
    } else this.switchSprite("takeHit");
  }
  attack() {
    this.switchSprite("attack1");
    this.isAttacking = true;
  }
}
