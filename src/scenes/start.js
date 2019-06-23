import 'phaser';

export class StartScene extends Phaser.Scene {
	constructor() {
		super({ key: 'StartScene' })
	}

	create() {
		this.add.text(this.cameras.main.centerX - 90, this.cameras.main.centerY, 'Click to start!', {fill: '#000000', fontSize: '20px'})
		this.input.on('pointerup', () => {
			this.scene.stop('StartScene')
			this.scene.start('PopcornGame')
		})
	}
}