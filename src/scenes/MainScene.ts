import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
  private blocks?: Phaser.Physics.Arcade.StaticGroup;
  private player?: Phaser.Physics.Arcade.Sprite;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("main");
  }

  preload() {
    this.load.image("ground", "assets/ground.png");
    this.load.image("block", "assets/block.png");
    this.load.spritesheet("dude", "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
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
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.physics.add.collider(this.player, this.blocks);

    /******************** set cursors ********************/
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (!this.cursors) return;
    if (this.cursors.left?.isDown) {
      this.player?.setVelocityX(-180);
      this.player?.anims.play("left", true);
    } else if (this.cursors.right?.isDown) {
      this.player?.setVelocityX(180);
      this.player?.anims.play("right", true);
    } else if (this.cursors.up?.isDown) {
      this.player?.setVelocityY(-180);
      this.player?.anims.play("turn");
    } else if (this.cursors.down?.isDown) {
      this.player?.setVelocityY(180);
      this.player?.anims.play("turn");
    } else {
      this.player?.setVelocityX(0);
      this.player?.setVelocityY(0);
      this.player?.anims.play("turn");
    }
  }
}
