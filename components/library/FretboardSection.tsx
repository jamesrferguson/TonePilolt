import React, { useRef, useEffect, useCallback  } from 'react';

interface Note {
    string: number;
    fret: number;
    label: string;
}
  
interface FretboardParams {
    width: number;
    height: number;
    fretboardX: number;
    fretboardY: number;
    fretboardWidth: number;
    fretboardHeight: number;
    numFrets: number;
    numStrings: number;
    stringSpacing: number;
    fretWidth: number;
    nutWidth: number;
}

const NUMBER_OF_FRETS = 22;
const FLAT_SYMBOL = String.fromCharCode(9837);
const STRING_NOTES = [ 'E_LOW', 'A', 'D', 'G', 'B', 'E_HIGH' ];
const ALL_NOTES = [ 'A', 'B' + FLAT_SYMBOL, 'B', 'C', 'C#', 'D', 'E' + FLAT_SYMBOL, 'E', 'F', 'F#', 'G', 'G#' ];
const MAP_STRINGS_TO_STRINGNUMBER: {[index: string]: number} = {
        E_LOW: 6, A: 5, D: 4, G: 3, B: 2, E_HIGH: 1
};
const intervalForScaleType: {[index: string]: string} = {
    major: '0,2,4,5,7,9,11', minor: '0,2,3,5,7,8,10', pentatonic: '0,3,5,7,10',
    harmonicMinor: '0,2,3,5,7,8,11'
};

const orderNotesForStartingNote = (startingNote: string) => {
    if (startingNote == 'E_LOW' || startingNote == 'E_HIGH') { // TODO: move this check
        startingNote = 'E';
    }
    let reorderedNotes = [...ALL_NOTES];
    return [...reorderedNotes.splice(ALL_NOTES.indexOf(startingNote)), ...reorderedNotes];
}

const drawNotesForString = (ctx: CanvasRenderingContext2D, stringName: string, notes: string[], rootNote: string, fretboardParams: FretboardParams)  => {
    let stringNumber = MAP_STRINGS_TO_STRINGNUMBER[stringName];
        let notesForString = orderNotesForStartingNote(stringName);
        for (let i = 0; i <= NUMBER_OF_FRETS; i++) {
            let j = i % 12;
            if (notes.indexOf(notesForString[j]) > -1){
                // drawNoteOnString(i, stringNumber, notesForString[j], notesForString[j] == rootNote);
                drawNote(ctx, stringNumber, i, notesForString[j], notesForString[j] == rootNote, fretboardParams);
            }
        }
}

const notesFromScaleInterval = (keyName: string, intervals: string) => {
    let allNotes: string[] = orderNotesForStartingNote(keyName);
        let intervalValues: number[] = intervals.split(',').map(x => parseInt(x));
        let scaleNotes: string[] = [];
        for (let i = 0; i < allNotes.length; i++) {
            if (intervalValues.indexOf(i) > -1) {
                scaleNotes.push(allNotes[i]);
            }
        }
        return scaleNotes;
}

const addNotesToNeck = (selectedKey: string, scaleInterval: string, ctx: CanvasRenderingContext2D, fretboardParams: FretboardParams) => {
    for (let i = 0; i < STRING_NOTES.length; i++){
        drawNotesForString(ctx, STRING_NOTES[i], notesFromScaleInterval(selectedKey, scaleInterval), selectedKey, fretboardParams);
    }
}

const drawFretboardElements = (
  ctx: CanvasRenderingContext2D,
  fretboardParams: FretboardParams
) => {
  const { width, height, fretboardX, fretboardY, fretboardWidth, fretboardHeight, numFrets, numStrings, stringSpacing, fretWidth, nutWidth } = fretboardParams;

  // Define the color of the fretboard
  const fretboardColor = '#8B4513'; // SaddleBrown

  // Define the color of the frets and strings
  const fretColor = '#A9A9A9'; // DarkGray
  const stringColor = '#000000'; // Black

  // Define the color of the fret markings
  const fretMarkingColor = 'green';

  // Draw fretboard
  ctx.fillStyle = fretboardColor;
  ctx.fillRect(fretboardX, fretboardY, fretboardWidth, fretboardHeight);

  // Draw frets
  for (let i = 1; i < numFrets; i++) {
    ctx.fillStyle = fretColor;
    ctx.fillRect(fretboardX + i * fretWidth, fretboardY, 2, fretboardHeight);
  }

  // Draw strings
  for (let i = 0; i < numStrings; i++) {
    ctx.fillStyle = stringColor;
    ctx.fillRect(fretboardX, fretboardY + i * stringSpacing, fretboardWidth, 2);
  }

  // Draw fret markings
  const fretMarkings = [3, 5, 7, 9, 12, 15, 17, 19, 21];
  const fretMarkingRadius = width * 0.007;
  fretMarkings.forEach(fret => {
    const markingY = fretboardY + fretboardHeight / 2;
    const markingX = fretboardX + fret * fretWidth - fretWidth / 2;
    if (fret === 12) {
      ctx.beginPath();
      ctx.arc(markingX, markingY - fretMarkingRadius * 4, fretMarkingRadius, 0, 2 * Math.PI);
      ctx.arc(markingX, markingY + fretMarkingRadius * 4, fretMarkingRadius, 0, 2 * Math.PI);
      ctx.fillStyle = fretMarkingColor;
      ctx.fill();
      ctx.closePath();
    } else {
      ctx.beginPath();
      ctx.arc(markingX, markingY, fretMarkingRadius, 0, 2 * Math.PI);
      ctx.fillStyle = fretMarkingColor;
      ctx.fill();
      ctx.closePath();
    }
  });

  // Draw guitar nut
  ctx.fillStyle = fretColor;
  ctx.fillRect(fretboardX - nutWidth, fretboardY, nutWidth, fretboardHeight);
};

const drawNote = (
  ctx: CanvasRenderingContext2D,
  string: number,
  fret: number,
  label: string,
  isRoot: boolean,
  fretboardParams: FretboardParams
) => {
  const { fretboardX, fretboardY, numStrings, stringSpacing, fretWidth, nutWidth } = fretboardParams;
  const noteRadius = fretboardParams.width * 0.007;

  let noteX;
  let noteY = fretboardY + (numStrings - string) * stringSpacing;

  if (fret === 0) {
    noteX = fretboardX - nutWidth / 2; // Position for open string note
  } else {
    noteX = fretboardX + fret * fretWidth - fretWidth / 2;
  }

  ctx.beginPath();
  ctx.arc(noteX, noteY, noteRadius, 0, 2 * Math.PI);
  ctx.fillStyle = isRoot ? 'blue' : 'red';
  ctx.fill();
  ctx.closePath();

  ctx.fillStyle = 'white';
  ctx.font = `${noteRadius * 1.5}px Arial`;
  ctx.fillText(label, noteX - noteRadius / 2, noteY + noteRadius / 2);
};

const useCanvasResize = (drawFretboard: (ctx: CanvasRenderingContext2D) => void, containerRef: React.RefObject<HTMLDivElement>) => {
    const resizeCanvas = useCallback(() => {
      if (containerRef.current && containerRef.current.children[0]) {
        const canvas = containerRef.current.children[0] as HTMLCanvasElement;
        const width = containerRef.current.offsetWidth;
        const height = width / 4.3333;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          drawFretboard(ctx);
        }
      }
    }, [containerRef, drawFretboard]);
  
    useEffect(() => {
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }, [resizeCanvas]);
  }
  
export default function FretboardSection() {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const drawFretboard = (ctx: CanvasRenderingContext2D) => {
        if (containerRef.current) {
            const width = containerRef.current.offsetWidth;
            const height = width / 4.3333;
            const fretboardWidth = width * 0.95;
            const fretboardHeight = height * 0.6;
            const fretboardX = (width - fretboardWidth) / 2;
            const fretboardY = (height - fretboardHeight) / 2;
            const numFrets = NUMBER_OF_FRETS;
            const numStrings = 6;
            const stringSpacing = fretboardHeight / (numStrings - 1);
            const fretWidth = fretboardWidth / numFrets;
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
                nutWidth,
            };

            drawFretboardElements(ctx, fretboardParams);

            // Example notes - draw c major scale
            addNotesToNeck('C', intervalForScaleType['major'], ctx, fretboardParams);
    }
};

useCanvasResize(drawFretboard, containerRef);

return (
    <div className="fretboard-section" ref={containerRef}>
    <canvas style={{ width: '100%', height: 'auto' }} />
    </div>
);
}
