import * as p5 from 'p5';
import * as sound from 'p5/lib/addons/p5.sound';
import './style.css';
import { Drop } from './drop.js';
import rainWave from './401276__inspectorj__rain-moderate-b.wav';
import '../node_modules/github-fork-ribbon-css/gh-fork-ribbon.css';
import { saveAs } from 'file-saver';


new p5((sketch) => {

    const drops = [];

    let rainSound;
    let frameRateVisible = true;
    let playSound = true;

    sketch.keyPressed = () => {
        if (sketch.keyCode === 70) frameRateVisible = !frameRateVisible; //F
        if (sketch.keyCode === 83) playSound = !playSound; //S
        if (sketch.keyCode === 73) { //I
            var canvas = document.getElementsByTagName('canvas')[0];
            canvas.toBlob(function(blob) {
                saveAs(blob, "sketch.png");
            });
        }
    }

    sketch.preload = () => {
        rainSound = sketch.loadSound(rainWave);
    }

    let printFrameRate = ({ isVisible, posX, deltaPosY, fill }) => {
        const doPrintFrameRate = isVisible ? isVisible() : true;
        const x = posX ? posX() : 10;
        const deltaY = deltaPosY ? deltaPosY() : 10;
        const fillValue = fill ? fill() : 0;
        if (doPrintFrameRate) {
            let fps = sketch.frameRate();
            sketch.fill(fillValue);
            sketch.textSize(10);
            sketch.noStroke();
            sketch.text("FPS: " + fps.toFixed(2), x, sketch.height - deltaY);
        }
    }

    sketch.setup = () => {
        let canvas = sketch.createCanvas(window.innerWidth - 8, window.innerHeight - 8);
        canvas.parent('sketch-holder');

        for (let i = 0; i < 1000; i++) {
            drops.push(new Drop(sketch));
        }

        rainSound.loop();
    };

    sketch.draw = () => {
        if (rainSound.isPlaying()) {
            if (!playSound) rainSound.stop();
        } else {
            if (playSound) rainSound.play();
        }

        //reset
        sketch.background(sketch.color(230, 230, 250));

        //show
        drops.forEach((drop) => {
            drop.fall();
            drop.show();
        });

        printFrameRate({ isVisible : () => frameRateVisible});
    };
});

