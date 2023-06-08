import * as PIXI from 'pixi.js';
import {AsciiFilter} from '@pixi/filter-ascii';

const globalVariables = {
    speed: 1,
    turningSpeed: 1,
    density: 90,
    size: 35,
    color: '#efce7c',
}



const app = new PIXI.Application({width: 400 , height: 400 });
let circles = [];
app.renderer.background.color = 0x020305;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.top = 0;
app.renderer.view.style.left = 0;
// z_index
app.renderer.view.style.zIndex = -1;
app.resizeTo = window;
const blurFilter = new PIXI.BlurFilter(20);
const Asciifilter = new AsciiFilter(15);
app.stage.filters = [
    blurFilter,
    Asciifilter,
];



let density = globalVariables.density; // circles per 1000 pixels

// get total ammount of cirlces based on the density and the size of the screen
let totalCircles = density * (app.screen.width * app.screen.height) / 1000000;



createCircles(totalCircles);


// create a bounding box for the circles

const circleBoundsPadding = 100 ;
const circleBounds = new PIXI.Rectangle(-circleBoundsPadding,
    -circleBoundsPadding,
    app.screen.width + circleBoundsPadding * 2,
    app.screen.height + circleBoundsPadding * 2);


let dialingTimer;  
let doneDialingInterval = 300; 

// Wall paper engine properties
window.wallpaperPropertyListener = {
    applyUserProperties: function(properties) {
        if (properties.speed) {
            globalVariables.speed = properties.speed.value;
        }
        if (properties.turningspeed) {
            globalVariables.turningSpeed = properties.turningspeed.value;
        }
        if (properties.color) {
            var color = properties.color.value.split(' '); // ["1.0", "0.4", "0.2"]
            color = color.map(function(c) {
                return Math.ceil(c * 255);
            });
            globalVariables.color = 'rgb(' + color + ')';
            Restart();
        }
        if (properties.size) {
            globalVariables.size = properties.size.value;
        }
        if (properties.density) {
            globalVariables.density = properties.density.value;
            density = globalVariables.density; // circles per 1000 pixels
            totalCircles = density * (app.screen.width * app.screen.height) / 1000000;
            clearTimeout(dialingTimer);
            dialingTimer = setTimeout(Restart, doneDialingInterval);
        }
    },
};

function Restart() {
    app.stage.removeChildren();
    circles = [];
    createCircles();
}



app.ticker.add((delta) => {
    // iterate through the dudes and update their position
    for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];
        circle.direction += circle.turningSpeed * 0.01 * globalVariables.turningSpeed;
        circle.x += Math.sin(circle.direction) * circle.speed * delta * globalVariables.speed;
        circle.y += Math.cos(circle.direction) * circle.speed * delta * globalVariables.speed;
        circle.rotation = -circle.direction - Math.PI / 2;

        // wrap the circles by testing their bounds...
        if (circle.x < circleBounds.x) {
            circle.x += circleBounds.width;
        } else if (circle.x > circleBounds.x + circleBounds.width) {
            circle.x -= circleBounds.width;
        }

        if (circle.y < circleBounds.y) {
            circle.y += circleBounds.height;
        } else if (circle.y > circleBounds.y + circleBounds.height) {
            circle.y -= circleBounds.height;
        }
        circle.scale.set(globalVariables.size/20, globalVariables.size/20)
        blurFilter.blur = globalVariables.size;
    }
});
document.body.appendChild(app.view);

function createCircles() {
    for (let i = 0; i < totalCircles; i++) {
        const circle = new PIXI.Graphics();
        circle.beginFill(globalVariables.color);
        const radious = 20 + Math.random() * 5;
        // const radious = globalVariables.size + Math.random() * 5;
        circle.drawCircle(0, 0, radious + Math.random() * 5);
        circle.endFill();

        // circle.pivot.x = radious / 2;
        // circle.pivot.y = radious / 2;

        // finally lets set the circle to be at a random position..
        circle.x = Math.random() * app.screen.width;
        circle.y = Math.random() * app.screen.height;

        // create some extra properties that will control movement :
        // create a random direction in radians. This is a number between 0 and PI*2 which is the equivalent of 0 - 360 degrees
        circle.direction = Math.random() * Math.PI * 2;

        // this number will be used to modify the direction of the circle over time
        circle.turningSpeed = (1 - Math.random() * 2) * 2;
        // circle.turningSpeed = (1 - Math.random() * 2) * globalVariables.turningSpeed * 2;

        // create a random speed for the circle between 2 - 4
        circle.speed = 1 + 0.5 + Math.random() * 0.5;
        // circle.speed = (1 + 0.5 + Math.random() * 0.5) * globalVariables.speed;

        // finally we push the circle into the cirlces array so it it can be easily accessed later
        circles.push(circle);

        app.stage.addChild(circle);
    }
}

document.body.style.margin = 0;

window.addEventListener('resize', () => {
    app.resizeTo = window;
    Restart();
});

