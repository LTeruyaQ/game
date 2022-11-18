const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 570;

//Definição da posição inicial da tela 
c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7;

class Sprite {
    constructor({ position, velocity, color = 'red', offset }) {
        this.position = position;
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
    }

    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.position.x,
                   this.position.y,
                   this.width,
                   this.height);

        //AttackBox
        if(this.isAttacking == true){
        c.fillStyle = 'green';
        c.fillRect(this.attackBox.position.x,
                  this.attackBox.position.y,
                  this.attackBox.width,
                  this.attackBox.height)
        }
    }

    update() {
        this.draw();

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;

        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        } else this.velocity.y += gravity;

        if (this.position.x + this.width + this.velocity.x >= canvas.width) {
            this.velocity.x = 0;
        }
    }

    attack(){
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }
}



//Posições iniciais dos playes
const player1 = new Sprite({
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
    }
});

const player2 = new Sprite({
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
    player1.update();
    player2.update();

    player1.velocity.x = 0;
    player2.velocity.x = 0;

    if (keys.a.pressed && player1.lastKey == 'a') {
        player1.velocity.x = -5
    } else if (keys.d.pressed && player1.lastKey == 'd') {
        player1.velocity.x = 5
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