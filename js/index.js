const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 570;

//Definição da posição inicial da tela 
c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7;

//Posições iniciais do BackGround
const background = new Sprite
({
    position: {
      x: 0,
      y: 0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite
({
    position: {
      x: 600,
      y: 128
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
})

//Posições iniciais dos playes
const player1 = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8
        }
    }
});

const player2 = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0
    },
    color: 'blue'
});

console.log(player1);
console.log(player2);

const keys = {
    a: {
        pressed: false
    },

    d: {
        pressed: false
    },


    ArrowLeft:{
        pressed: false
    },

    ArrowRight:{
        pressed: false
    }
}

function RetangularCollision({rectangel1, rectangel2})  {
    return(
        rectangel1.attackBox.position.x + rectangel1.attackBox.width >= rectangel2.position.x &&
        rectangel1.attackBox.position.x <= rectangel2.position.x + rectangel2.width &&
        rectangel1.attackBox.position.y + rectangel1.attackBox.height >= rectangel2.position.y &&
        rectangel1.attackBox.position.y <= rectangel2.position.y + rectangel2.height
    )
}

function DetermineWinner({player1, player2, timerId}){

    clearTimeout(timerId);

    document.querySelector('#displayText').style.display = 'flex';
    
    if(player1.health == player2.health){
        document.querySelector('#displayText').innerHTML = 'PORRRRRRA';
    } else if(player1.health > player2.health){
        document.querySelector('#displayText').innerHTML = 'PORRRRRRA1';
    } else if(player2.health > player1.health){
        document.querySelector('#displayText').innerHTML = 'PORRRRRRA2';
    }
}

let timer = 100;
let timerId

function DecreaseTimer(){
    
    timerId = setTimeout(DecreaseTimer, 1000)
    
    if(timer > 0){
        timer--
        document.querySelector('#timer').innerHTML = timer;
    }

    if(timer == 0)
        if(player1.health == player2.health){
            DetermineWinner({player1, player2, timerId})
        }
}

DecreaseTimer()

function Animate() {
    window.requestAnimationFrame(Animate);
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    player1.update();
    //player2.update();

    player1.velocity.x = 0;
    player2.velocity.x = 0;

    player1.image = player1.sprites.idle.image
    if (keys.a.pressed && player1.lastKey == 'a') {
        player1.velocity.x = -5
        player1.image = player1.sprites.run.image
    } else if (keys.d.pressed && player1.lastKey == 'd') {
        player1.velocity.x = 5
        player1.image = player1.sprites.run.image
    }

    if (keys.ArrowLeft.pressed && player2.lastKey == 'ArrowLeft') {
        player2.velocity.x = -5
    } else if (keys.ArrowRight.pressed && player2.lastKey == 'ArrowRight') {
        player2.velocity.x = 5
    }

    if(RetangularCollision({rectangel1: player1, rectangel2: player2}) && player1.isAttacking){
        player1.isAttacking = false;
        player2.health -= 20;

        console.log(player2.health)

        document.querySelector('#Player2Health').style.width = player2.health + '%';
    }
    else if(RetangularCollision({rectangel1: player2, rectangel2: player1}) && player2.isAttacking){
        player2.isAttacking = false;
        player1.health -= 20;

        console.log(player1.health)

        document.querySelector('#Player1Health').style.width = player1.health + '%';
    }

    if(player1.health <= 0 || player2.health <= 0){
        DetermineWinner({player1, player2, timerId});
    }
}

Animate()

window.addEventListener('keydown', (event) => {

    switch (event.key) {

        case 'q':
            player1.attack();
            break;

        case 'w':
            player1.velocity.y = -20
            player1.lastKey = 'w'
            break;

        case 'd':
            keys.d.pressed = true
            player1.lastKey = 'd'
            break;

        case 'a':
            keys.a.pressed = true
            player1.lastKey = 'a'
            break;

        case 'ArrowUp':
            player2.velocity.y = -20
            player2.lastKey = 'ArrowUp'
            break;

        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            player2.lastKey = 'ArrowLeft'
            break;

        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            player2.lastKey = 'ArrowRight'
            break;

        case '0':
            player2.attack();
            break;
    }
    console.log(event.key)
});

window.addEventListener('keyup', (event) => {

    switch (event.key) {

        case 'd':
            keys.d.pressed = false;
            break;

        case 'a':
            keys.a.pressed = false;
            break;

        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;

        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break;
    }

});