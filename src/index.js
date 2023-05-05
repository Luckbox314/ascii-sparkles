import * as PIXI from 'pixi.js';
import {AsciiFilter} from '@pixi/filter-ascii';

const app = new PIXI.Application({width: 400 , height: 400 });
let circles = [];
const globalVariables = {
    speed: 1,
    turningSpeed: 1,
    density: 90,
    size: 35,
    color: '#efce7c',
}
// const globalVariables = {
//     speed: 1,
//     turningSpeed: 1,
//     density: 8,
//     size: 200,
//     color: '#fff',
// }
// const app = new PIXI.Application({width: window.innerWidth , height: window.innerHeight * 2 });
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


function createOptions() {
    const centerer = document.createElement('div');
    centerer.style.display = 'flex';
    centerer.style.justifyContent = 'center';
    centerer.style.alignItems = 'center';
    centerer.style.width = '100vw';
    centerer.style.height = '100vh';
    centerer.style.position = 'absolute';
    centerer.style.margin = 0;
    centerer.style.boxSizing = 'border-box';

    const div = document.createElement('div');
    div.style.background = '#769AB1cf';
    div.style.borderRadius = '5px';
    div.style.padding = '10px';
    // set roboto font
    div.style.fontFamily = 'Roboto, sans-serif';   
    div.style.color = 'white';	
    div.innerHTML = `
        <div>
            <label>Speed: </label> 
            <input type="number" id="speed" value="${globalVariables.speed}" step="0.1"/>
        </div>
        <div>
            <label>Turning Speed: </label>
            <input type="number" id="turningSpeed" value="${globalVariables.turningSpeed}" step="0.1"/>
        </div>
        <div>
            <label>Density: </label>
            <input type="number" id="density" value="${globalVariables.density}" />
        </div>
        <div>
            <label>Size: </label>
            <input type="number" id="size" value="${globalVariables.size}" />
        </div>
        <div>
            <label>Color: </label>
            <input type="string" id="color" value="${globalVariables.color}" />
        </div>
    `

    // style the options so all the inputs are the same width
    const inputs = div.querySelectorAll('input');
    inputs.forEach(input => {
        input.style.width = '60px';
    });

    const inputContainers = div.querySelectorAll('div');
    inputContainers.forEach(container => {
        container.style.display = 'flex';
        container.style.justifyContent = 'space-between';
        container.style.margin = '5px';
    });

    const labels = div.querySelectorAll('label');
    labels.forEach(label => {
        label.style.marginRight = '5px';
    });

    // update the global variables when the inputs change
    const speedInput = div.querySelector('#speed');
    speedInput.addEventListener('change', () => {
        globalVariables.speed = Number(speedInput.value);
    });
    const turningSpeedInput = div.querySelector('#turningSpeed');
    turningSpeedInput.addEventListener('change', () => {
        globalVariables.turningSpeed = Number(turningSpeedInput.value);
    });
    const sizeInput = div.querySelector('#size');
    sizeInput.addEventListener('change', () => {
        globalVariables.size = Number(sizeInput.value);
    });
    const densityInput = div.querySelector('#density');
    densityInput.addEventListener('change', () => {
        globalVariables.density = Number(densityInput.value);
        // re create the circles
        app.stage.removeChildren();
        circles = [];
        density = globalVariables.density; // circles per 1000 pixels
        totalCircles = density * (app.screen.width * app.screen.height) / 1000000;
        createCircles();
    });
    const colorInput = div.querySelector('#color');
    colorInput.addEventListener('change', () => {
        var reg=/^#([0-9a-f]{3}){1,2}$/i;
        if (reg.test(colorInput.value)) {
            globalVariables.color = colorInput.value;
            app.stage.removeChildren();
            circles = [];
            createCircles();
        }
    });



    centerer.appendChild(div);

    
    centerer.style.display = 'none';
    document.body.appendChild(centerer)
    return centerer;
}



function showOptions(component, state) {
    if (state[0]) {
        console.log("hiding options");
        component.style.display = 'none';
        state[0] = false;
    }
    else {
        console.log("showing options");
        component.style.display = 'flex';
        state[0] = true;
    }
}

document.body.style.margin = 0;


const options = createOptions();
// show the options if the windows is clicked, hide them if it's clicked again
let state = [false];
window.addEventListener('click', () => {
    showOptions(options, state);
    }
);

window.addEventListener('touchstart', () => {
    showOptions(options, state);
    }
);

window.addEventListener('resize', () => {
    app.resizeTo = window;
    app.stage.removeChildren();
    circles = [];
    createCircles();
});

// add event listenet when clicking on the options to prevent the window from closing
options.children[0].addEventListener('click', (e) => {
    e.stopPropagation();
});

options.children[0].addEventListener('touchstart', (e) => {
    e.stopPropagation();
}
);

