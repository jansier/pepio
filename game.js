var W = 800, H = 600;
var config = {
    type: Phaser.AUTO,
    width: W,
    height: H,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 650 },
            debug: false
        }
    },
};
var platforms;
var score = 0;
var scoreText;
var jumped = !true;
var cursors;
var gameOver = false;


function preload ()
{
    this.load.image('sky', 'assets/sky.jpg');
    this.load.image('ground', 'assets/plat1.png');
    this.load.image('ground2', 'assets/plat2.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/hulk.png', { frameWidth: 32, frameHeight: 38 });
    this.load.multiatlas('scene', 'assets/hulk.json', 'assets');
}


function create ()
{
    this.add.image(config.width/2, config.height/2, 'sky');
    
    platforms = this.physics.add.staticGroup();
    platforms.create(W/2, 650, 'ground').setScale(6).refreshBody();
    
    platforms.create(W/2, H/2, 'ground');
    platforms.create(W*5/6, H/3, 'ground');
    platforms.create(W/5, H/4, 'ground');
    platforms.create(W/3*2, H*2/3+10, 'ground2');
    platforms.create(W/20, H*5/7, 'ground2');
    
    
    player = this.physics.add.sprite(W/2, H/2, 'dude');

    player.setBounce(0.25);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNames('scene', {
                    start: 1, end: 6, zeroPad: 1,
                    prefix: 'walk/', suffix: '.png',
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ {key: "scene", frame: "walk/1.png"} ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNames('scene', {
                    start: 1, end: 6, zeroPad: 1,
                    prefix: 'walk/', suffix: '.png'
        }),
        frameRate: 10,
        repeat: -1
    });
    
    

    cursors = this.input.keyboard.createCursorKeys();
    
    stars = this.physics.add.group({
        key: 'star',
        repeat: 39,
        setXY: { x: 12, y: 0, stepX: 20 }
    });

    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.7));

    });
    
    bombs = this.physics.add.group();
    
    scoreText = this.add.text(16, 16, 'Punkty: 0', { fontSize: '32px', fill: '#FFF' });

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);

    this.physics.add.overlap(player, stars, collectStar, null, this);

    this.physics.add.collider(player, bombs, hitBomb, null, this);
}


function update ()
{
    if (gameOver)
    {
        return;
    }
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.flipX = true;
        player.anims.play('right', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.flipX = false;
        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }
    
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
        jumped = false;
    }
    else if (cursors.up.isDown && !jumped && Math.abs(player.body.velocity.y) < 100)
    {
        player.setVelocityY(-330);
        jumped = !false;
    }
}

 function collectStar (player, star)
{
    star.disableBody(true, true);
    
    score += 1;
    scoreText.setText('Punkty: ' + score)
    if (stars.countActive(true) === 0)
    {
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0,     400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = !false;

    }
}

function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}

var game = new Phaser.Game(config);