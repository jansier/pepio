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
    parent: 'game',
};
var platforms;
var scorep1 = 0;
var scorep2 = 0;
var scoreTextp1;
var scoreTextp2;
var jumped = !true;
var cursors;
var gameOver = false;
var p1LastHit = new Date();
var p2LastHit = new Date();
var p1Alive = true;
var p2Alive = true;

var createConfig = {
    'rengar' : {
        name: 'rengar',
        flip: 1,
        hitFramesCount: 4,
        speed: 300,
        hitBombs: false,
        jump: 400
    },
    'hulk' : {
        name: 'hulk',
        flip: 0,
        hitFramesCount: 1,
        speed: 150,
        hitBombs: true,
        jump: 330
    }

}


function preload ()
{
    this.load.multiatlas('scene', 'assets/scene.json', 'assets');
}

let player, player2;
let p1 = 'rengar';
let p2 = 'hulk';

function create ()
{
    this.add.image(config.width/2, config.height/2, key='scene', frame='sky.png');
    
    platforms = this.physics.add.staticGroup();
    platforms.create(W/2, 650, key='scene', frame='plat1.png').setScale(6).refreshBody();
    
    platforms.create(W/2, H/2, key='scene', frame='plat1.png');
    platforms.create(W*5/6, H/3, key='scene', frame='plat1.png');
    platforms.create(W/5, H/4, key='scene', frame='plat1.png');
    platforms.create(W/3*2, H*2/3+10, key='scene', frame='plat2.png');
    platforms.create(W/20, H*5/7, key='scene', frame='plat2.png');
    
    player = generatePlayer(this, {w : W/4*3, h : H/2}, p2);
    player2 = generatePlayer(this, {w : W/4, h : H/2}, p1);

    cursors = this.input.keyboard.addKeys({
        p1up: 'up',
        p1left: 'left',
        p1right: 'right',
        p1attack: 'enter',
        p2up: 'w',
        p2left: 'a',
        p2right: 'd',
        p2attack: 'space',
        restart: 'tab'
    });
    
    
    stars = this.physics.add.group({
        key: 'scene',
        frame: 'star.png',
        repeat: 39,
        setXY: { x: 12, y: 0, stepX: 20 }
    });

    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.7));
    });
    
    bombs = this.physics.add.group();
    createBomb();
    
    scoreTextp1 = this.add.text(16, 16, 'Gracz 1: 0', { fontSize: '32px', fill: '#FFF' });
    scoreTextp2 = this.add.text(600, 16, 'Gracz 2: 0', { fontSize: '32px', fill: '#FFF' });

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player2, platforms);
    this.physics.add.collider(player2, player);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);
    

    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
    this.physics.add.overlap(player2, stars, collectStar, null, this);
    this.physics.add.collider(player2, bombs, hitBomb, null, this);
}


function update ()
{
    if(cursors.restart.isDown) {
       this.scene.restart();
    }

    if(p1Alive)
    {
        handleEvents(player, createConfig[p1], cursors.p1left.isDown, cursors.p1right.isDown, cursors.p1up.isDown, cursors.p1attack.isDown)
    }

    if(p2Alive)
    {
        handleEvents(player2, createConfig[p2], cursors.p2left.isDown, cursors.p2right.isDown, cursors.p2up.isDown, cursors.p2attack.isDown)
    }
}

 function collectStar (p, star)
{
    star.disableBody(true, true);
    
    if (p == player){
        scorep1 += 1;
        scoreTextp1.setText('Gracz 1: ' + scorep1)
    } 
    else {
        scorep2 += 1;
        scoreTextp2.setText('Gracz 2: ' + scorep2)
    }
    
    if (stars.countActive(true) === 0)
    {
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        p1Alive = true;
        p2Alive = true;
        player.setTint(0xffffff);
        player2.setTint(0xffffff);

        createBomb();
    }
}

function hitBomb (p, bomb)
{
    p.setTint(0xff0000);

    p.anims.play('turn');

    if(p == player)
    {
        p1Alive = false;
    }
    else {
        p2Alive = false;
    }

    if(!p1Alive && p2Alive) {
        this.physics.pause();
    }
}

function generatePlayer(g, pos, creatureName){

    let creature = g.physics.add.sprite(pos.w, pos.h, key= "scene", frame= creatureName+"/walk/1.png");

    creature.setBounce(0.25);
    creature.setCollideWorldBounds(true);

    g.anims.create({
        key: creatureName+ 'turn',
        frames: [ {key: "scene", frame: creatureName+"/walk/1.png"} ],
        frameRate: 20
    });

    g.anims.create({
        key: creatureName+ 'walk',
        frames: g.anims.generateFrameNames('scene', {
                    start: 1, end: 4, zeroPad: 1,
                    prefix: creatureName+'/walk/', suffix: '.png'
        }),
        frameRate: 10,
        repeat: -1
    });
    g.anims.create({
        key: creatureName+ 'up',
        frames: [ {key: "scene", frame: creatureName+"/jump/up.png"} ],
        frameRate: 20,
    });
    g.anims.create({
        key: creatureName+ 'down',
        frames: [ {key: "scene", frame: creatureName+"/jump/down.png"} ],
        frameRate: 20,
    });
    g.anims.create({
        key: creatureName+ 'attack',
        frames: g.anims.generateFrameNames('scene', {
            start: 1, end: createConfig[creatureName].hitFramesCount, zeroPad: 1,
            prefix: creatureName+'/attack/', suffix: '.png'
        }),
            frameRate: 10,
            repeat: -1
        
    });

    return creature;

}

function handleEvents (p, creatureConfig, left, right, up, attack){

    if (left)
    {
        p.setVelocityX(-creatureConfig.speed);
        p.flipX = !creatureConfig.flip;
    }
    else if (right)
    {
        p.setVelocityX(creatureConfig.speed);
        p.flipX = creatureConfig.flip;
    }
    else
    {
        p.setVelocityX(0);
    }

    if (attack){
        p.anims.play(creatureConfig.name + 'attack', true);
        if(p == player) {
            if(p.y <= (player2.y+30) && p.y >= (player2.y-30))
            {
                if(p.x <= player2.x + 60)
                {
                    if(scorep2 > 0 && (new Date() - p2LastHit) > 1000)
                    {
                        p2LastHit = new Date();
                        scorep2 -= 1;
                        scoreTextp2.setText('Gracz 2: ' + scorep2)
                    }
                } 
            }
        } else {
            if(p.y <= (player.y+30) && p.y >= (player.y-30))
            {
                if(p.x <= player.x + 60)
                {
                    if(scorep1 > 0 && (new Date() - p1LastHit) > 1000)
                    {
                        p1LastHit = new Date();
                        scorep1 -= 1;
                        scoreTextp1.setText('Gracz 1: ' + scorep1)
                    }
                }
            } 
        }

        if(creatureConfig.hitBombs)
        {
            for(let i in bombs.children.entries)
            {
                let bomb = bombs.children.entries[i];
                if(inHitArea(p, bomb))
                {
                    bomb.disableBody(true, true);
                }
            }
        }


    } else if (Math.abs(p.body.velocity.y) < 5 && p.body.velocity.x == 0){
        p.anims.play(creatureConfig.name + 'turn', true);
    } else if (p.body.velocity.y < -100)
        p.anims.play(creatureConfig.name + 'up', true);
    else if(p.body.velocity.y > 100)
        p.anims.play(creatureConfig.name + 'down', true);
    else
        p.anims.play(creatureConfig.name + 'walk', true);
    
    if (up && p.body.touching.down)
    {
        p.setVelocityY(-creatureConfig.jump);
        jumped = false;
    }
    else if (up && !jumped && Math.abs(p.body.velocity.y) < 100)
    {
        p.setVelocityY(-creatureConfig.jump);
        jumped = !false;
    }
}

function inHitArea(creature, target)
{
    if(creature.y <= (target.y+30) && creature.y >= (target.y-30))
    {
        if(creature.x <= target.x + 90)
        {
            return true;
        }
    }
    return false;
}

function createBomb()
{
    var bomb = bombs.create(400, 16, key= 'scene',frame= 'bomb.png');

    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = !false;
}

function runGame() {
    var game = new Phaser.Game(config);
}
