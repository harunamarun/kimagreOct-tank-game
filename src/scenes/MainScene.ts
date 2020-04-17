import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
  private blocks?: Phaser.Physics.Arcade.StaticGroup;
  private player?: Phaser.Physics.Arcade.Sprite;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private beams?: Phaser.Physics.Arcade.Group;

  constructor() {
    super({
      key: "MainScene",
    });
  }

  preload() {
    this.load.image("ground", "assets/ground.png");
    this.load.image("block", "assets/block.png");
    this.load.spritesheet("dude", "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.image("beam", "assets/bomb.png");
  }
  create() {
    /******************** set course ********************/
    this.add.image(400, 300, "ground");
    //set blocks
    this.blocks = this.physics.add.staticGroup();
    this.blocks.create(200, 120, "block").setScale(2).refreshBody();
    this.blocks.create(600, 120, "block").setScale(2).refreshBody();
    this.blocks.create(200, 480, "block").setScale(2).refreshBody();
    this.blocks.create(600, 480, "block").setScale(2).refreshBody();
    for (let i = 0; i < 5; i++) {
      this.blocks
        .create(0, 0, "block")
        .setScale(1)
        .setRandomPosition(200, 150, 400, 300)
        .refreshBody();
    }
    let x: number = 0;
    let y: number = 0;
    for (let i = 0; i < 25; i++) {
      this.blocks.create(x + 16, 16, "block");
      this.blocks.create(x + 16, 600 - 16, "block");
      x += 32;
    }
    for (let i = 0; i < 18; i++) {
      this.blocks.create(16, y + 16, "block");
      this.blocks.create(800 - 16, y + 16, "block");
      y += 32;
    }
    x = 0;
    y = 0;
    for (let i = 0; i < 8; i++) {
      this.blocks.create(x + 300, 120, "block");
      this.blocks.create(x + 280, 600 - 120, "block");
      x += 32;
    }

    /******************** set player ********************/
    this.player = this.physics.add.sprite(100, 300, "dude");

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "left-up",
      frames: this.anims.generateFrameNumbers("dude", { start: 2, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers("dude", { start: 4, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "right-up",
      frames: this.anims.generateFrameNumbers("dude", { start: 6, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 8, end: 9 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "right-down",
      frames: this.anims.generateFrameNumbers("dude", { start: 10, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("dude", { start: 12, end: 13 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "left-down",
      frames: this.anims.generateFrameNumbers("dude", { start: 14, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });

    this.physics.add.collider(this.player, this.blocks);

    /******************** set cursors ********************/
    this.cursors = this.input.keyboard.createCursorKeys();

    /******************** set beams ********************/
    this.beams = this.physics.add.group();
    this.physics.add.collider(this.beams, this.blocks);
    this.physics.add.collider(
      this.player,
      this.beams,
      this.handleHitbeam,
      undefined,
      this
    );
  }

  private previousDownTime: number = 0;

  update() {
    this.handlePlayerDirection();
  }

  /******************** FUNCTIONS ********************/
  private handleHitbeam(
    player: Phaser.GameObjects.GameObject,
    b: Phaser.GameObjects.GameObject
  ) {
    this.physics.pause();
    this.player?.setTint(0x000000);
    this.player?.anims.play("turn");
    //    this.gameOver = true;
  }

  private handleAttackBomb(
    direction: string,
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys,
    player?: Phaser.Physics.Arcade.Sprite
  ) {
    if (cursors?.space && player) {
      let beam: Phaser.Physics.Arcade.Image = undefined;

      if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
        if (cursors.space?.timeDown > this.previousDownTime + 1000) {
          if (direction === "left") {
            beam = this.beams?.create(player.x - 30, player.y, "beam");
            beam.setVelocity(-400, 0);
          }
          if (direction === "left-up") {
            beam = this.beams?.create(player.x - 30, player.y - 30, "beam");
            beam.setVelocity(-400, -400);
          }
          if (direction === "left-down") {
            beam = this.beams?.create(player.x - 30, player.y + 30, "beam");
            beam.setVelocity(-400, 400);
          }
          if (direction === "right") {
            beam = this.beams?.create(player.x + 30, player.y, "beam");
            beam.setVelocity(400, 0);
          }
          if (direction === "right-up") {
            beam = this.beams?.create(player.x + 30, player.y - 30, "beam");
            beam.setVelocity(400, -400);
          }
          if (direction === "right-down") {
            beam = this.beams?.create(player.x + 30, player.y + 30, "beam");
            beam.setVelocity(400, 400);
          }
          if (direction === "up") {
            beam = this.beams?.create(player.x, player.y - 30, "beam");
            beam.setVelocity(0, -400);
          }
          if (direction === "down") {
            beam = this.beams?.create(player.x, player.y + 30, "beam");
            beam.setVelocity(0, 400);
          }
          if (beam !== undefined) {
            beam.setBounce(1);
          }
          this.previousDownTime = cursors.space.timeDown;
        }
      }
    }
  }

  private handlePlayerDirection() {
    if (!this.cursors || !this.player) return;
    if (this.cursors.left?.isDown && this.cursors.up?.isDown) {
      this.player?.setVelocity(-150, -150);
      this.player?.anims.play("left-up", true);
      this.handleAttackBomb("left-up", this.cursors, this.player);
    } else if (this.cursors.left?.isDown && this.cursors.down?.isDown) {
      this.player?.setVelocity(-150, 150);
      this.player?.anims.play("left-down", true);
      this.handleAttackBomb("left-down", this.cursors, this.player);
    } else if (this.cursors.left?.isDown) {
      this.player?.setVelocity(-100, 0);
      this.player?.anims.play("left", true);
      this.handleAttackBomb("left", this.cursors, this.player);
    } else if (this.cursors.right?.isDown && this.cursors.up?.isDown) {
      this.player?.setVelocity(100, -100);
      this.player?.anims.play("right-up", true);
      this.handleAttackBomb("right-up", this.cursors, this.player);
    } else if (this.cursors.right?.isDown && this.cursors.down?.isDown) {
      this.player?.setVelocity(100, 100);
      this.player?.anims.play("right-down", true);
      this.handleAttackBomb("right-down", this.cursors, this.player);
    } else if (this.cursors.right?.isDown) {
      this.player?.setVelocity(100, 0);
      this.player?.anims.play("right", true);
      this.handleAttackBomb("right", this.cursors, this.player);
    } else if (this.cursors.up?.isDown) {
      this.player?.setVelocityY(-100);
      this.player?.anims.play("up");
      this.handleAttackBomb("up", this.cursors, this.player);
    } else if (this.cursors.down?.isDown) {
      this.player?.setVelocityY(100);
      this.player?.anims.play("down");
      this.handleAttackBomb("down", this.cursors, this.player);
    } else {
      this.player?.setVelocityX(0);
      this.player?.setVelocityY(0);
      this.player?.anims.play("down");
    }
  }
}
