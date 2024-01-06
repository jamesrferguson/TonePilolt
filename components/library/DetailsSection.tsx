// DetailsSection.tsx
import React, { useEffect, useRef } from 'react';
import { parseUserInput, notesFromScaleInterval, orderNotesForStartingNote } from './FretboardSection';
import { intervalsForChordType, MAP_STRINGS_TO_STRINGNUMBER, STRING_NOTES  } from './Constants';

interface DetailsSectionProps {
  activeChord: string;
}

const drawNotesForString = (ctx: CanvasRenderingContext2D, stringName: string, notes: string[], rootNote: string, fretboardParams: any, startingFret: number)  => { 
    let stringNumber = MAP_STRINGS_TO_STRINGNUMBER[stringName] - 1;
    let notesForString = orderNotesForStartingNote(stringName);

    console.log('stringNumber', stringNumber);
    console.log('stringName', stringName);
    console.log('notesForString', notesForString);

    for (let i = startingFret; i <= fretboardParams.numFrets; i++) {
        let j = i % 12;
        if (notes.indexOf(notesForString[j]) > -1){
            drawNote(ctx, stringNumber, i, notesForString[j], notesForString[j] == rootNote, fretboardParams, startingFret);
        }
    }
};

const drawNote = (ctx: CanvasRenderingContext2D, stringNumber: number, fretNumber: number, noteName: string, isRootNote: boolean, fretboardParams: any, startingFret: number) => { 
    const { fretboardX, fretboardY, fretWidth, stringSpacing } = fretboardParams;
    const x = fretboardX + stringNumber * stringSpacing;
    let y;
    if (fretNumber === 0) {
        y = fretboardY + fretWidth / 2;
    } else {
        y = fretboardY + (fretNumber - startingFret) * fretWidth + fretWidth / 2;

    }
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
    ctx.fillText(noteName, x - fretWidth / 8, y + fretWidth / 8);
};

const addNotesToNeck = (keyName: string, scaleInterval: string, ctx: CanvasRenderingContext2D, fretboardParams: any, startFret: number = 0) => { 
    for (let i = 0; i < STRING_NOTES.length; i++){
        drawNotesForString(ctx, STRING_NOTES[i], notesFromScaleInterval(keyName, scaleInterval), keyName, fretboardParams, startFret);
    }
};

const drawFretboard = (ctx: CanvasRenderingContext2D, fretboardParams: any, startingFret: number, maxFret: number) => { 
    let { width, height, fretboardX, fretboardY, fretboardWidth, fretboardHeight, numFrets, numStrings, stringSpacing, fretWidth, nutWidth } = fretboardParams;

    // Define the color of the fretboard
    const fretboardColor = '#8B4513'; // SaddleBrown

    // Define the color of the frets and strings
    const fretColor = '#A9A9A9'; // DarkGray
    const stringColor = '#000000'; // Black

    // Define the color of the fret markings
    const fretMarkingColor = 'green';

    // Define the color and height of the nut
    const nutColor = '#A9A9A9'; // White
    const nutHeight = 0.25 * fretWidth; // adjust this value as needed

    const fretNumCount = numFrets;;

    if (startingFret === 0) {
        numFrets -= 1;

        // Adjust the fretboardY and fretboardHeight if startingFret is 
        fretboardY += fretWidth;
        fretboardHeight -= fretWidth;

        // Draw nut at the top of the fretboard if startingFret is 1
        ctx.fillStyle = nutColor;
        ctx.fillRect(fretboardX, fretboardY - nutHeight, fretboardWidth, nutHeight);
    }

    // Draw fretboard
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
    for (let i = 0; i < fretNumCount; i++) {
        // ctx.fillText((startingFret + i).toString(), fretboardX - 15, fretboardY + i * fretWidth + fretWidth / 2);
        let yPos = startingFret === 0 ? fretboardY + i * fretWidth - fretWidth / 2 : fretboardY + i * fretWidth + fretWidth / 2;
        // Skip the label for the 0th fret
        if (i + startingFret === 0) continue;

        // Draw the fret number
        ctx.fillText((i + startingFret).toString(), fretboardX - 15, yPos);
    }
}
  
const addNotesToChordDiagram = (keyName: string, intervals: string, ctx: CanvasRenderingContext2D, fretboardParams: any, startFret: number = 0) => {
    const { numFrets, numStrings, fretboardX, fretboardY, fretWidth, stringSpacing } = fretboardParams;
        for (let string = 0; string < numStrings; string++) {
            addNotesToNeck('C', intervals, ctx, fretboardParams, startFret);
        }
    };

    const DetailsSection: React.FC<DetailsSectionProps> = ({ activeChord }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        console.log('activeChord changed', activeChord);
        if (containerRef.current) {
        // Clear container
        containerRef.current.innerHTML = '';

        const dpr = window.devicePixelRatio || 1;
        let startingFret = 0;

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
                console.log('calling add notes to chord diagram')
                addNotesToChordDiagram('C', intervalsString, ctx, fretboardParams, startingFret);

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