// DetailsSection.tsx
import React, { useEffect, useRef } from 'react';
import { parseUserInput, addNotesToNeck, drawFretboardElements } from './FretboardSection';
import { intervalsForChordType } from './Constants';

interface DetailsSectionProps {
  activeChord: string;
}

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const calculateNote = (keyName: string, intervals: number[], string: number, fret: number) => {
  const keyIndex = notes.indexOf(keyName);
  const interval = intervals[string];
  const noteIndex = (keyIndex + interval + fret) % notes.length;
  return notes[noteIndex];
};

const drawFretboard = (ctx: CanvasRenderingContext2D, fretboardParams: any, startingFret: number, maxFret: number) => { 
    const { width, height, fretboardX, fretboardY, fretboardWidth, fretboardHeight, numFrets, numStrings, stringSpacing, fretWidth, nutWidth } = fretboardParams;

    // Define the color of the fretboard
    const fretboardColor = '#8B4513'; // SaddleBrown

    // Define the color of the frets and strings
    const fretColor = '#A9A9A9'; // DarkGray
    const stringColor = '#000000'; // Black

    // Define the color of the fret markings
    const fretMarkingColor = 'green';

    //Draw fretboard
    ctx.fillStyle = fretboardColor;
    ctx.fillRect(fretboardX, fretboardY, fretboardWidth, fretboardHeight);

    // Draw frets
    const fretMarkings = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
    const fretMarkingRadius = width * 0.007;
    for (let i = 0; i < numFrets; i++) {
        ctx.fillStyle = fretColor;
        ctx.fillRect(fretboardX, fretboardY + i * fretWidth, fretboardWidth, 2);
        if (fretMarkings.includes(i + startingFret)) {
            if (i + startingFret === 12 || i + startingFret === 24) {
                const markingY = fretboardY + i * fretWidth + fretWidth / 2;
                ctx.beginPath();
                ctx.arc(fretboardX - 30 + fretboardWidth / 2, markingY, fretMarkingRadius, 0, 2 * Math.PI);
                ctx.arc(fretboardX + 30 + fretboardWidth / 2, markingY, fretMarkingRadius, 0, 2 * Math.PI);
                ctx.fillStyle = fretMarkingColor;
                ctx.fill();
                ctx.closePath();
            } else {
                const markingY = fretboardY + i * fretWidth + fretWidth / 2;
                ctx.beginPath();
                ctx.arc(fretboardX + fretboardWidth / 2, markingY, fretMarkingRadius, 0, 2 * Math.PI);
                ctx.fillStyle = fretMarkingColor;
                ctx.fill();
                ctx.closePath();
            }
        }
    }

    // Draw strings
    for (let i = 0; i < numStrings; i++) {
        ctx.fillStyle = stringColor;
        ctx.fillRect(fretboardX + i * stringSpacing, fretboardY, 2, fretboardHeight);
    }

    // Draw fret numbers
    ctx.fillStyle = '#000000'; // Black
    ctx.font = '12px Arial'; // Adjust as needed
    for (let i = 0; i < numFrets; i++) {
        ctx.fillText((startingFret + i).toString(), fretboardX - 15, fretboardY + i * fretWidth + fretWidth / 2);
    }

}
  
const addNotesToChordDiagram = (keyName: string, intervals: number[], ctx: CanvasRenderingContext2D, fretboardParams: any, startFret: number = 0) => {
const { numFrets, numStrings, fretboardX, fretboardY, fretWidth, stringSpacing } = fretboardParams;

for (let string = 0; string < numStrings; string++) {
    for (let fret = 0; fret < numFrets; fret++) {
    const note = calculateNote(keyName, intervals, string, fret);
    const x = fretboardX + string * stringSpacing;
    const y = fretboardY + fret * fretWidth + fretWidth / 2;

    // Draw note circle
    ctx.beginPath();
    ctx.arc(x, y, fretWidth / 4, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#003300';
    ctx.stroke();

    // Draw note name
    ctx.fillStyle = 'black';
    ctx.font = `${fretWidth / 4}px Arial`;
    ctx.fillText(note, x - fretWidth / 8, y + fretWidth / 8);
    }
}
};

const DetailsSection: React.FC<DetailsSectionProps> = ({ activeChord }) => {
const containerRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
    if (containerRef.current) {
    // Clear container
    containerRef.current.innerHTML = '';

    const dpr = window.devicePixelRatio || 1;
    let startingFret = 1;

    Array.from({ length: 5 }).forEach((_, index) => {
        const canvas = document.createElement('canvas');
        canvas.style.width = '200px';
        canvas.style.height = 'auto';
        canvas.style.boxSizing = 'border-box';

        if (containerRef.current) {            
        containerRef.current.appendChild(canvas);
        }

        const ctx = canvas.getContext('2d');

        if (ctx) {
        canvas.width = canvas.offsetWidth * dpr;
        canvas.height = canvas.offsetHeight * dpr;
        ctx.scale(dpr, dpr);

        const width = canvas.width;
        const height = canvas.height;
        const fretboardWidth = width * 0.85;
        const fretboardHeight = height;
        const fretboardX = (width - fretboardWidth) / 2;
        const fretboardY = (height - fretboardHeight) / 2;
        let numFrets = 5;
        const numStrings = 6;
        const stringSpacing = fretboardWidth / (numStrings - 1);
        const fretWidth = fretboardHeight / numFrets;
        const nutWidth = fretboardWidth * 0.02;
        const maxFret = 24;

        const fretboardParams = {
            width,
            height,
            fretboardX,
            fretboardY,
            fretboardWidth,
            fretboardHeight,
            numFrets,
            numStrings,
            stringSpacing,
            fretWidth,
            nutWidth
            };


        drawFretboard(ctx, fretboardParams, startingFret, maxFret);

        const userInputValues = parseUserInput(activeChord);
        // const intervalsString = intervalsForChordType[userInputValues.chordOrScaleType];
        const intervalsString = intervalsForChordType['major'];
        let intervals: number[] = [];
        if (intervalsString) {
            intervals = intervalsString.split(',').map(Number);
        }
        // addNotesToChordDiagram(userInputValues.keyName, intervals, ctx, fretboardParams);

        console.log('Key name:', userInputValues.keyName);
        console.log('Intervals:', intervals);

        startingFret += 5;
        }

        
    });
    }
}, [activeChord]);

return (
    <div className="details-section" ref={containerRef} />
);
};

export default DetailsSection;