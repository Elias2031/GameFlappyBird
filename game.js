console.log('Flappy Bird')

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const soundHIT = new Audio();
soundHIT.src= './soundEfects/hit.wav'


const floor = {
    spriteX : 0,
    spriteY : 610,
    width : 224,
    heigth : 112,
    x : 0,
    y : canvas.height - 112,
    draw() {
        context.drawImage(
            sprites, 
            floor.spriteX, floor.spriteY,
            floor.width, floor.heigth,
            floor.x, floor.y,
            floor.width, floor.heigth,
        );

        context.drawImage(
            sprites, 
            floor.spriteX, floor.spriteY,
            floor.width, floor.heigth,
            floor.x + floor.width, floor.y,
            floor.width, floor.heigth,
        );
    }
};

const background = {
    spriteX : 390,
    spriteY : 0,
    width : 275,
    heigth : 204,
    x : 0,
    y : canvas.height - 215,
    draw() {
        context.fillStyle = '#70c5ce'
        context.fillRect(0, 0, canvas.width, canvas.height)

        context.drawImage(
            sprites, 
            background.spriteX, background.spriteY,
            background.width, background.heigth,
            background.x, background.y,
            background.width, background.heigth,
        );

        context.drawImage(
            sprites, 
            background.spriteX, background.spriteY,
            background.width, background.heigth,
            background.x + background.width, background.y,
            background.width, background.heigth,
        );
    }
};

const getReady = {
    spriteX : 134,
    spriteY : 0,
    width : 174,
    heigth : 152,
    x : canvas.width / 2 - 174 / 2,
    y : 58,
    draw() {

        context.drawImage(
            sprites, 
            getReady.spriteX, getReady.spriteY,
            getReady.width, getReady.heigth,
            getReady.x, getReady.y,
            getReady.width, getReady.heigth,
        );
    }
};

function touchInTheFloor() {
    const flappyBirdY = globais.flappyBird.y + globais.flappyBird.heigth;
    const floorY = floor.y

    if(flappyBirdY >= floorY){
        return true;
    }else{
        return false;
    }
};

function createFlappyBird() {
    const flappyBird = {
        spriteX : 0,
        spriteY : 0,
        width : 33,
        heigth : 24,
        x : 10,
        y : 50,
        gravity : 0.20,
        velocity : 0,
        jump : 5,
    
        toUp(){
            flappyBird.velocity = - flappyBird.jump;
        },
    
        update() {
            if(touchInTheFloor(flappyBird, floor)){
                soundHIT.play();

                setTimeout(() => {
                    changeScreen(screens.start)
                }, 350)
                
                return;
            }
    
            flappyBird.velocity = flappyBird.velocity + flappyBird.gravity;
            flappyBird.y = flappyBird.y + flappyBird.velocity;
        },
    
        draw() {
            context.drawImage(
                sprites, 
                flappyBird.spriteX, flappyBird.spriteY,
                flappyBird.width, flappyBird.heigth,
                flappyBird.x, flappyBird.y,
                flappyBird.width, flappyBird.heigth,
            );
        }
    };

    return flappyBird;
}


 const globais = {};

let activeScreen = {};

function changeScreen(newScreen){
    activeScreen = newScreen

    if(activeScreen.incialize){
        activeScreen.incialize();
    }
};


const screens = {
    start : {
        incialize() {
            globais.flappyBird = createFlappyBird();
        },

        draw() {
            background.draw();

            floor.draw();

            getReady.draw();

            globais.flappyBird.draw();
        },

        click(){
            changeScreen(screens.game)
        },

        update() {

        }
    },

    game : {
        draw(){
            background.draw();

            floor.draw();
        
            globais.flappyBird.draw();
        },

        click(){
            globais.flappyBird.toUp();
        },

        update() {
            globais.flappyBird.update();
        }
    },
};

function app(){

    activeScreen.draw();
    activeScreen.update();

    requestAnimationFrame(app);
};

window.addEventListener('click', function() {
    if(activeScreen.click){
        activeScreen.click()
    }
});




changeScreen(screens.start);
app();
  