import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
  private blocks?: Phaser.Physics.Arcade.StaticGroup;
  private player?: Phaser.Physics.Arcade.Sprite;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private beams?: Phaser.Physics.Arcade.Group;
  private computer?: Phaser.Physics.Arcade.Sprite;
  private finishedGame = false;
  private branks?: Phaser.Physics.Arcade.StaticGroup;

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
    //set com's course
    this.branks = this.physics.add.staticGroup();
    for (let i = 0; i < 20; i++) {
      this.branks
        .create(0, 0, "block", undefined, false, true)
        .setScale(1)
        .setRandomPosition()

        .refreshBody();
    }

    /******************** set player ********************/
    this.player = this.physics.add.sprite(100, 300, "dude");
    this.setAnims("dude");

    this.physics.add.collider(this.player, this.blocks);

    /******************** set computer ********************/
    this.computer = this.physics.add.sprite(700, 300, "dude");
    this.setAnims("dude");
    this.moveCom();
    this.physics.add.collider(
      this.computer,
      this.blocks,
      this.moveCom,
      undefined,
      this
    );
    this.physics.add.collider(
      this.computer,
      this.branks,
      this.moveCom,
      undefined,
      this
    );

    /******************** set cursors ********************/
    this.cursors = this.input.keyboard.createCursorKeys();

    /******************** set beams ********************/
    this.beams = this.physics.add.group();
    this.physics.add.collider(
      this.beams,
      this.blocks,
      this.countBounce,
      undefined,
      this
    );
    this.physics.add.collider(
      this.player,
      this.beams,
      this.handleHitbeamToPlayer,
      undefined,
      this
    );
    this.physics.add.collider(
      this.computer,
      this.beams,
      this.handleHitbeamToCom,
      undefined,
      this
    );
  }

  update() {
    this.handlePlayerDirection();
  }

  /******************** FUNCTIONS ********************/
  private com = {
    left: Math.PI,
    "left-up": (Math.PI * 3) / 4,
    "left-down": (Math.PI * 5) / 4,
    right: 0,
    "right-up": (Math.PI * 1) / 4,
    "right-down": (Math.PI * 7) / 4,
    up: (Math.PI * 2) / 4,
    down: (Math.PI * 6) / 4,
  };
  private moveCom() {
    if (!this.computer) return;
    let baseV: number = 100;

    let random = Math.floor(Math.random() * 8);
    this.computer?.setVelocity(
      baseV * Math.cos(this.com[Object.keys(this.com)[random]]),
      -1 * baseV * Math.sin(this.com[Object.keys(this.com)[random]])
    );
    this.computer?.anims.play(Object.keys(this.com)[random], true);
  }

  private countBounce(obj1, obj2) {
    let bounceCount: number = obj1.getData("bounce");
    if (bounceCount >= 1) {
      obj1.destroy();
    } else {
      obj1.setData("bounce", bounceCount + 1);
    }
  }

  private setAnims(name: string) {
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers(name, { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "left-up",
      frames: this.anims.generateFrameNumbers(name, { start: 2, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers(name, { start: 4, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "right-up",
      frames: this.anims.generateFrameNumbers(name, { start: 6, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers(name, { start: 8, end: 9 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "right-down",
      frames: this.anims.generateFrameNumbers(name, { start: 10, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers(name, { start: 12, end: 13 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "left-down",
      frames: this.anims.generateFrameNumbers(name, { start: 14, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });
  }
  private handleHitbeamToPlayer(
    player: Phaser.GameObjects.GameObject,
    b: Phaser.GameObjects.GameObject
  ) {
    this.physics.pause();
    this.player?.setTint(0x000000);
    this.player?.anims.play("down");
    this.finishedGame = true;
  }
  private handleHitbeamToCom(
    computer: Phaser.GameObjects.GameObject,
    b: Phaser.GameObjects.GameObject
  ) {
    this.physics.pause();
    this.computer?.setTint(0x000000);
    this.computer?.anims.play("down");
    this.finishedGame = true;
  }

  private previousDownTime: number = 0;

  private handleAttackBomb(angle: number) {
    if (this.cursors?.space && this.player) {
      let beam: Phaser.Physics.Arcade.Image = undefined;

      if (
        Phaser.Input.Keyboard.JustDown(this.cursors.space) &&
        this.cursors.space?.timeDown > this.previousDownTime + 1000
      ) {
        let offsetX: number = 30 * Math.cos(angle);
        let offsetY: number = -30 * Math.sin(angle);
        let vX: number = 400 * Math.cos(angle);
        let vY: number = -400 * Math.sin(angle);
        beam = this.beams?.create(
          this.player.x + offsetX,
          this.player.y + offsetY,
          "beam"
        );
        beam.setVelocity(vX, vY);

        if (beam !== undefined) {
          beam.setBounce(1);
          beam.setData("bounce", 0);
        }
        this.previousDownTime = this.cursors.space.timeDown;
      }
    }
  }

  private direction: string = "down";
  private angle: number = Math.PI;
  private handlePlayerDirection() {
    if (!this.cursors || !this.player) return;
    let baseV: number = 100;
    if (this.cursors.left?.isDown && this.cursors.up?.isDown) {
      this.direction = "left-up";
      this.angle = (Math.PI * 3) / 4;
    } else if (this.cursors.left?.isDown && this.cursors.down?.isDown) {
      this.direction = "left-down";
      this.angle = (Math.PI * 5) / 4;
    } else if (this.cursors.left?.isDown) {
      this.direction = "left";
      this.angle = Math.PI;
    } else if (this.cursors.right?.isDown && this.cursors.up?.isDown) {
      this.direction = "right-up";
      this.angle = (Math.PI * 1) / 4;
    } else if (this.cursors.right?.isDown && this.cursors.down?.isDown) {
      this.direction = "right-down";
      this.angle = (Math.PI * 7) / 4;
    } else if (this.cursors.right?.isDown) {
      this.direction = "right";
      this.angle = 0;
    } else if (this.cursors.up?.isDown) {
      this.direction = "up";
      this.angle = (Math.PI * 2) / 4;
    } else if (this.cursors.down?.isDown) {
      this.direction = "down";
      this.angle = (Math.PI * 6) / 4;
    } else {
      baseV = 0;
    }
    this.player?.setVelocity(
      baseV * Math.cos(this.angle),
      -1 * baseV * Math.sin(this.angle)
    );
    this.handleAttackBomb(this.angle);
    this.player?.anims.play(this.direction, true);
  }
}
