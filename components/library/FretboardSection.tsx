import React, { useRef, useEffect, useCallback  } from 'react';
import { ALL_NOTES, MAP_STRINGS_TO_STRINGNUMBER, NUMBER_OF_FRETS,
   STRING_NOTES, STRING_LABELS, intervalsForChordType, intervalForScaleType } from "@/components/library/Constants";

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
                drawNote(ctx, stringNumber, i, notesForString[j], notesForString[j] == rootNote, fretboardParams);
            }
        }
}

const notesFromScaleInterval = (keyName: string, intervals: string) => {
  if(keyName && intervals){
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
  return [];
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

  // Label the guitar string above the nut
  STRING_LABELS.forEach((stringNote, idx) => {
    const stringLabelY = fretboardY + idx * stringSpacing;  // adjusted for better alignment
    ctx.fillStyle = 'black';
    ctx.textBaseline = 'middle';  // this sets the vertical alignment to the middle
    ctx.font = `${width * 0.01}px Arial`;
    ctx.fillText(stringNote, fretboardX - nutWidth - (width * 0.03), stringLabelY);  // adjust the value 0.04 as needed
});

  // Print the fret numbers along the bottom edge of the fretboard
  for (let i = 1; i <= numFrets; i++) {
    ctx.fillStyle = 'black';
    ctx.font = `${width * 0.015}px Arial`;
    ctx.fillText(i.toString(), fretboardX + i * fretWidth - fretWidth / 2 - (width * 0.005), fretboardY + fretboardHeight + (width * 0.025)); // adjust the value 0.005 and 0.025 as needed
  }
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
  const noteRadius = fretboardParams.width * 0.009;

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
  ctx.font = `${noteRadius * 1.15}px Arial`;
  ctx.fillText(label, noteX - noteRadius / 2, noteY + noteRadius / 5);
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

type FretboardProps = {
  chordMode: boolean;
  activeScale: string;
  activeChord: string;
}

function toCamelCase(words: string[]): string {
  return words
    .map((word, index) =>
      index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
}

interface UserScaleOrChordInput {
  keyName: string;
  chordOrScaleType: string;
}

function parseUserInput(input: string | undefined): UserScaleOrChordInput {
  let keyName = "";
  let chordOrScaleType = "";

  if (input) {
    const words = input.split(' ');
    keyName = words[0];
    chordOrScaleType = toCamelCase(words.slice(1));
    
  }

  return { keyName, chordOrScaleType };
}

export default function FretboardSection({chordMode, activeScale, activeChord}:FretboardProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const drawFretboard = (ctx: CanvasRenderingContext2D) => {
        if (containerRef.current) {
            const width = containerRef.current.offsetWidth;
            const height = width / 4.3333;
            const fretboardWidth = width * 0.85;
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
            const userInputValues: UserScaleOrChordInput = parseUserInput(chordMode? activeChord : activeScale);
            const intervals = chordMode ? intervalsForChordType[userInputValues.chordOrScaleType]: intervalForScaleType[userInputValues.chordOrScaleType];
            addNotesToNeck(userInputValues.keyName, intervals, ctx, fretboardParams);
    }
    };

    useCanvasResize(drawFretboard, containerRef);

    return (
        <div className="fretboard-section" ref={containerRef}>
        <canvas style={{ width: '100%', height: 'auto' }} />
        </div>
    );
  };