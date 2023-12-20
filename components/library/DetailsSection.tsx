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



// const drawVerticalFretboard = (ctx: CanvasRenderingContext2D, fretboardParams: any) => {
//   const { numFrets, numStrings, fretboardX, fretboardY, fretWidth, stringSpacing } = fretboardParams;

//   // Fill fretboard area with the same color as in FretboardSection
//   ctx.fillStyle = '#8B4513'; // replace 'desired color' with the color used in FretboardSection
//   ctx.fillRect(fretboardX, fretboardY, numStrings * stringSpacing, numFrets * fretWidth);

//   // Draw strings
//   for (let string = 0; string < numStrings; string++) {
//     const x = fretboardX + string * stringSpacing;
//     ctx.beginPath();
//     ctx.moveTo(x, fretboardY);
//     ctx.lineTo(x, fretboardY + numFrets * fretWidth);
//     ctx.stroke();
//   }

//   // Draw frets
//   for (let fret = 0; fret <= numFrets; fret++) {
//     const y = fretboardY + fret * fretWidth;
//     ctx.beginPath();
//     ctx.moveTo(fretboardX, y);
//     ctx.lineTo(fretboardX + (numStrings - 1) * stringSpacing, y);
//     ctx.stroke();
//   }
// }

    const drawFretboard = (ctx: CanvasRenderingContext2D, fretboardParams: any, startingFret: number) => { 
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
        for (let i = 1; i < numFrets; i++) {
            ctx.fillStyle = fretColor;
            ctx.fillRect(fretboardX, fretboardY + i * fretWidth, fretboardWidth, 2);
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
            const numFrets = 5;
            const numStrings = 6;
            const stringSpacing = fretboardWidth / (numStrings - 1);
            const fretWidth = fretboardHeight / numFrets;
            const nutWidth = fretboardWidth * 0.02;

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


            drawFretboard(ctx, fretboardParams, startingFret);
  
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