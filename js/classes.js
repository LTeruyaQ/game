class Sprite {

  constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }) {
    this.position = position
    this.width = 50
    this.height = 150
    this.image = new Image()
    this.image.src = imageSrc
    this.scale = scale
    this.framesMax = framesMax
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 5
    this.offset = offset
  }

  Draw() {
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    )
  }

  AnimateFrames() {
    this.framesElapsed++

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++
      } else {
        this.framesCurrent = 0
      }
    }
  }

  Update() {
    this.Draw()
    this.AnimateFrames()
  }
}

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
    enemyPosition
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset
    });

    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset,
      width: 100,
      height: 50
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 5
    this.sprites = sprites
    this.enemyPosition = enemyPosition

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image()
      sprites[sprite].image.src = sprites[sprite].imageSrc
    }
  }

  Update(enemyPosition) {
    this.Draw();
    this.AnimateFrames();
    this.Position(enemyPosition);

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 90) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else this.velocity.y += gravity;

    if (this.position.x + this.width + this.velocity.x >= canvas.width) {
      this.velocity.x = 0;
    }
  }

  Attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false
    }, 100)
  }

  SwitchSprite(sprite) {
    switch (sprite) {
      
      case "idleRight":
        if (this.image !== this.sprites.idleRight.image) {
          this.image = this.sprites.idleRight.image;
          this.framesMax = this.sprites.idleRight.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case "idleLeft":
        if (this.image !== this.sprites.idleLeft.image) {
          this.image = this.sprites.idleLeft.image;
          this.framesMax = this.sprites.idleLeft.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case "runRight":
        if (this.image !== this.sprites.runRight.image) {
          this.image = this.sprites.runRight.image;
          this.framesMax = this.sprites.runRight.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case "runLeft":
        if (this.image !== this.sprites.runLeft.image) {
          this.image = this.sprites.runLeft.image;
          this.framesMax = this.sprites.runLeft.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case "jumpRight":
        if (this.image !== this.sprites.jumpRight.image) {
          this.image = this.sprites.jumpRight.image;
          this.framesMax = this.sprites.jumpRight.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case "jumpLeft":
        if (this.image !== this.sprites.jumpLeft.image) {
          this.image = this.sprites.jumpLeft.image;
          this.framesMax = this.sprites.jumpLeft.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case "fallRight":
        if (this.image !== this.sprites.fallRight.image) {
          this.image = this.sprites.fallRight.image;
          this.framesMax = this.sprites.fallRight.framesMax;
          this.framesCurrent = 0;

          console.log("?????????")
        }

      case "fallLeft":
        if (this.image !== this.sprites.fallLeft.image) {
          this.image = this.sprites.fallLeft.image;
          this.framesMax = this.sprites.fallLeft.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case "atack":
        break;
    }
  }

  Position(enemyPosition) {
    if (this.position.x > enemyPosition)
      this.enemyPosition = "Left";
    else if (this.position.x < enemyPosition)
      this.enemyPosition = "Right";
  }
}