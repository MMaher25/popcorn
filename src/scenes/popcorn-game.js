import 'phaser';
import { gameConfig, gameState } from '../index'

console.dir(gameConfig);

let platforms;
let pig;
let cursors;
let failure;
let emitter;
let particles;

let texture;
let src;
let context;
let gradient;

let platformCount = 0;

export class PopcornGame extends Phaser.Scene {
  constructor() {
		super({ key: 'PopcornGame' })
	}

  preload () {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('platform', 'assets/log.png');
    this.load.image('failure', 'assets/failure.png');
    this.load.spritesheet('pig', 'assets/popcorn.png', {frameWidth: 72, frameHeight: 50});
  }

  create() {
    gameState.gameOver = false;
    texture = this.textures.createCanvas('gradient', gameConfig.width, gameConfig.height);
    src = texture.getSourceImage();
    context = src.getContext('2d');
    gradient = context.createLinearGradient(0, 0, 0, gameConfig.height);
    gradient.addColorStop(0, '#004cff');
    gradient.addColorStop(1, '#a7def8');
    context.fillStyle = gradient;
    context.fillRect(0, 0, gameConfig.width, gameConfig.height);
    texture.refresh();
    this.add.image(0, 0, 'gradient').setOrigin(0, 0)

    this.physics.world.setBounds(0, 0, gameConfig.width, gameConfig.height);

    gameState.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '15px', fill: '#ffffff' })

    platforms = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    for (let interval = 0; interval < Math.ceil(gameConfig.height / 85); interval++) {
      let randomX = Math.floor(Math.random() * (gameConfig.width - 50)) + 50;
      platforms.create(randomX, interval * 85, 'platform').setScale(.5);
    }

    failure = this.physics.add.sprite(gameConfig.width / 2, gameConfig.height, 'failure')
    failure.body.allowGravity = false;
    failure.body.immovable = true;
    
    pig = this.physics.add.sprite(gameConfig.width / 2, gameConfig.height - 150, 'pig');
    pig.setBounce(1);
    pig.setCollideWorldBounds(true);
    pig.body.checkCollision.up = false;
    pig.body.checkCollision.left = false;
    pig.body.checkCollision.right = false;

    this.physics.add.collider(pig, platforms);

    this.physics.add.collider(pig, failure, () => {
      if (platformCount > 1) {
        gameState.gameOver = true;
        this.physics.pause();
        pig.tint = 0x8B0000;
        this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY, 300, 180, 0xffffff)
        this.add.text(this.cameras.main.centerX - 70, this.cameras.main.centerY - 50, 'Game Over', { fontSize: '25px', fill: '#000000' });
        this.add.text(this.cameras.main.centerX - 120, this.cameras.main.centerY + 30, 'Click to Restart', { fontSize: '25px', fill: '#000000' });
        
        this.input.on('pointerup', () => {
          gameState.score = 0;
          platformCount = 0;
          this.scene.stop('PopcornGame');
          this.textures.removeKey('gradient');
          this.scene.start('StartScene');
        });
      }
    });

    cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('pig', { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1,
    });

  }

  update() {
    if (!gameState.gameOver) {
      pig.anims.play('jump', true);
    } else {
      pig.anims.pause();
    }

    if (cursors.left.isDown)
    {
      pig.flipX = true;
      pig.setVelocityX(-240);
    }
    else if (cursors.right.isDown)
    {
      pig.flipX = false;
      pig.setVelocityX(240);
    }
    else
    {   
      pig.setVelocityX(0);
    }

    if (pig.body.touching.down) {
      if (!gameState.gameOver) {
        this.cameras.main.shake(100, .004);
        pig.setVelocityY(-500);
      }
    }

    if (pig.body.y <  gameConfig.height / 2) {
      platforms.children.iterate(updateY, this);
    }
  }
}

function updateY(platform){
  let delta = Math.floor(gameConfig.height / 2) - pig.y;

  if(delta > 0){ 
    platform.y += delta/30;
  }

  if(platform.y > gameConfig.height){
    platform.y = -platform.height;
    platform.x = Math.floor(Math.random() * gameConfig.width - 50) + 24;
    platformCount += 1;
    gameState.score += 10;
    gameState.scoreText.setText(`Score: ${gameState.score}`);
  }
}
