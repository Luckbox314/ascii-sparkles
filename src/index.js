import * as PIXI from 'pixi.js';
import {AsciiFilter} from '@pixi/filter-ascii';

const DEFAULT_CONFIGURATION = {
    speed: 1,
    turningSpeed: 1,
    density: 20,
    size: 50,
    blur: 50,
    color: '#efce7c',
    backgroundColor: '#020305',
    fontSize: 15,
}

const configuration = {...DEFAULT_CONFIGURATION}

const app = new PIXI.Application();
app.renderer.background.color = configuration.backgroundColor;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.zIndex = -1;
app.resizeTo = window;
document.body.style.margin = 0;
let resizingTimer;
let doneResizingInterval = 300; 
window.addEventListener('resize', () => {
    app.resizeTo = window;
    clearTimeout(resizingTimer);
    resizingTimer = setTimeout(() => {
        Restart();
    }, doneResizingInterval);
});
document.body.appendChild(app.view);

// -- Filters --
const blurFilter = new PIXI.BlurFilter(configuration.blur);
const asciiFilter = new AsciiFilter(configuration.fontSize);
app.stage.filters = [
    blurFilter,
    asciiFilter,
];
    
let circles = [];
const circleBounds = new PIXI.Rectangle(
    0,
    0,
    app.screen.width,
    app.screen.height
);
createCircles(configuration.density);

function Restart() {
    app.stage.removeChildren();
    circles = [];
    createCircles(configuration.density);
}

app.ticker.add((delta) => {
    // iterate through the dudes and update their position
    blurFilter.blur = configuration.blur;
    asciiFilter.size = configuration.fontSize;
    for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];
        circle.direction += circle.turningSpeed * 0.01 * configuration.turningSpeed;
        circle.x += Math.sin(circle.direction) * circle.speed * delta * configuration.speed;
        circle.y += Math.cos(circle.direction) * circle.speed * delta * configuration.speed;
        circle.rotation = -circle.direction - Math.PI / 2;

        // wrap the circles by testing their bounds...
        const radious = circle.width / 2;

        if (circle.x < circleBounds.x - radious) {
            circle.x = circleBounds.x + circleBounds.width + radious;
        } else if (circle.x > circleBounds.x + circleBounds.width + radious) {
            circle.x = circleBounds.x - radious;
        }

        if (circle.y < circleBounds.y - radious) {
            circle.y = circleBounds.y + circleBounds.height + radious;
        } else if (circle.y > circleBounds.y + circleBounds.height + radious) {
            circle.y = circleBounds.y - radious;
        }
    }
});


function createCircles(density) {
    const totalCircles = density * (app.screen.width * app.screen.height) / 1000000;
    for (let i = 0; i < totalCircles; i++) {
        const circle = new PIXI.Graphics();
        
        circle.beginFill(configuration.color);
        circle.drawCircle(0, 0, configuration.size);
        circle.endFill();

        circle.x = Math.random() * circleBounds.width + circleBounds.x;
        circle.y = Math.random() * circleBounds.height + circleBounds.y;

        circle.direction = Math.random() * Math.PI * 2;   
        
        circle.turningSpeed = (1 - Math.random() * 2) * 2;

        circle.speed = 1 + 0.5 + Math.random() * 0.5;

        circles.push(circle);

        app.stage.addChild(circle);
    }
}

// Wallpaper engine
let dialingTimer;  
let doneDialingInterval = 300; 

window.wallpaperPropertyListener = {
    applyUserProperties: function(properties) {
        if (properties.speed) {
            configuration.speed = properties.speed.value;
        }
        if (properties.turningspeed) {
            configuration.turningSpeed = properties.turningspeed.value;
        }
        if (properties.color) {
            var color = properties.color.value.split(' '); // ["1.0", "0.4", "0.2"]
            color = color.map(function(c) {
                return Math.ceil(c * 255);
            });
            configuration.color = 'rgb(' + color + ')';
            Restart();
        }
        if (properties.size) {
            configuration.size = properties.size.value;
        }
        if (properties.density) {
            configuration.density = properties.density.value;
            density = configuration.density; // circles per 1000 pixels
            totalCircles = density * (app.screen.width * app.screen.height) / 1000000;
            clearTimeout(dialingTimer);
            dialingTimer = setTimeout(Restart, doneDialingInterval);
        }
    },
};


