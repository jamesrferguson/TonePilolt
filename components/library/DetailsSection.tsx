// DetailsSection.tsx
import React, { useEffect, useRef } from 'react';
import { parseUserInput, notesFromScaleInterval, orderNotesForStartingNote, UserScaleOrChordInput } from './FretboardSection';
import { intervalsForChordType, MAP_STRINGS_TO_STRINGNUMBER, STRING_NOTES  } from './Constants';

interface DetailsSectionProps {
  activeChord: string;
}

const isRootNote = (note: string, rootNote: string) => {
    return note === rootNote;
}

const drawNotesForString = (ctx: CanvasRenderingContext2D, stringName: string, notes: string[], rootNote: string, fretboardParams: any, cagedPosition:string, startingFret: number, maxFret: number, oneNotePerStringOnly: boolean, drawFromRootNoteOnly: boolean ) => { 
  let stringNumber = MAP_STRINGS_TO_STRINGNUMBER[stringName] - 1;
  let notesForString = orderNotesForStartingNote(stringName);
  let drawNotesParamsList: [CanvasRenderingContext2D, number, number, string, boolean, any, number][] = [];

  let rootNoteFound = false;
  for (let i = startingFret; i <= startingFret + fretboardParams.numFrets - 1; i++) {
    let j = i % 12;
    if (notes.indexOf(notesForString[j]) > -1){
      if (drawFromRootNoteOnly && !rootNoteFound) {
        if (isRootNote(notesForString[j], rootNote)) {
          rootNoteFound = true;
        }
      } 
      if ((cagedPosition === 'G' || cagedPosition === 'E') && stringName === 'E_LOW') {
        if (rootNoteFound) {
            drawNotesParamsList.push([ctx, stringNumber, i, notesForString[j], notesForString[j] == rootNote, fretboardParams, startingFret]);
            break;
        }
      }

      if ((cagedPosition === 'C' || cagedPosition === 'A') && stringName === 'E_LOW') {
        break;
      }

      if ((cagedPosition === 'C' || cagedPosition === 'A') && stringName === 'A') {
        if (rootNoteFound) {
            drawNotesParamsList.push([ctx, stringNumber, i, notesForString[j], notesForString[j] == rootNote, fretboardParams, startingFret]);
            break;
        }
      }

      if (cagedPosition === 'D' && (stringName === 'E_LOW' || stringName === 'A')) {
        break;
      }

      if (cagedPosition === 'D' && stringName === 'D') {
        if (rootNoteFound) {
            drawNotesParamsList.push([ctx, stringNumber, i, notesForString[j], notesForString[j] == rootNote, fretboardParams, startingFret]);
            break;
        }
      }

      drawNotesParamsList.push([ctx, stringNumber, i, notesForString[j], notesForString[j] == rootNote, fretboardParams, startingFret]);
      
    }
    
    
  }
    if(drawNotesParamsList.length > 0) {
        if (cagedPosition === 'C' && stringName === 'E_HIGH' 
        || cagedPosition === 'G' && stringName === 'G' 
        || cagedPosition === 'E' && stringName === 'E_HIGH'
        || cagedPosition === 'G' && stringName === 'G') {
            drawNote(...drawNotesParamsList[0]);
        } 
        else {
            let lastDrawNoteParams = drawNotesParamsList[drawNotesParamsList.length - 1];
            drawNote(...lastDrawNoteParams);
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

const addNotesToNeck = (keyName: string, scaleInterval: string, ctx: CanvasRenderingContext2D, fretboardParams: any, cagedPosition:string, startFret: number = 0, maxFret: number, oneNotePerStringOnly: boolean, drawFromRootNoteOnly: boolean) => { 
    for (let i = 0; i < STRING_NOTES.length; i++){
        drawNotesForString(ctx, STRING_NOTES[i], notesFromScaleInterval(keyName, scaleInterval), keyName, fretboardParams, cagedPosition, startFret, maxFret, oneNotePerStringOnly, drawFromRootNoteOnly);
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
  
const addNotesToChordDiagram = (keyName: string, intervals: string, ctx: CanvasRenderingContext2D, fretboardParams: any, cagedPosition: string, startFret: number = 0, maxFret: number, oneNotePerStringOnly: boolean, drawFromRootNoteOnly: boolean) => {
    const { numFrets, numStrings, fretboardX, fretboardY, fretWidth, stringSpacing } = fretboardParams;
        for (let string = 0; string < numStrings; string++) {
            addNotesToNeck(keyName, intervals, ctx, fretboardParams, cagedPosition, startFret, maxFret, oneNotePerStringOnly, drawFromRootNoteOnly);
        }
};

const DetailsSection: React.FC<DetailsSectionProps> = ({ activeChord }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    let userInputValues: UserScaleOrChordInput = parseUserInput(activeChord);
    useEffect(() => {
        if (containerRef.current) {
            // Clear container
            containerRef.current.innerHTML = '';

            const dpr = window.devicePixelRatio || 1;
            //let startingFret = 0;

            type FretMap = {
                [key: string]: number;
              };

            type CagedStartingFrets = {
                [key: string]: FretMap;
              };

            const CAGED_STARTING_FRETS: CagedStartingFrets = {
                'C'  :{'C': 0, 'A': 3, 'G': 5, 'E': 8, 'D': 10},
                'C#' :{'C': 1, 'A': 4, 'G': 6, 'E': 9, 'D': 11},
                'D'  :{'C': 2, 'A': 5, 'G': 7, 'E': 10, 'D': 0},
                'Eb' :{'C': 3, 'A': 6, 'G': 8, 'E': 11, 'D': 1},
                'E'  :{'C': 4, 'A': 7, 'G': 9, 'E': 0, 'D': 2},
                'F'  :{'C': 5, 'A': 8, 'G': 10, 'E': 1, 'D': 3},
                'F#' :{'C': 6, 'A': 9, 'G': 11, 'E': 2, 'D': 4},
                'G'  :{'C': 7, 'A': 10, 'G': 0, 'E': 3, 'D': 5},
                'G#' :{'C': 8, 'A': 11, 'G': 1, 'E': 4, 'D': 6},
                'A'  :{'C': 9, 'A': 0, 'G': 2, 'E': 5, 'D': 7},
                'Bb' :{'C': 10, 'A': 1, 'G': 3, 'E': 6, 'D': 8},
                'B'  :{'C': 11, 'A': 2, 'G': 4, 'E': 7, 'D': 9}
            };

            // Draw 5 fretboards
            // Array.from({ length: 5 }).forEach((_, index) => {
            let selectedKey = userInputValues.keyName;
            let chordOrScaleType = userInputValues.chordOrScaleType;
            if (selectedKey && chordOrScaleType) {
                Object.entries(CAGED_STARTING_FRETS[selectedKey]).forEach(([cagedPosition, startingFret]) => {
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
                        let numFrets = 4;
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

                        const intervalsString = intervalsForChordType[chordOrScaleType];

                        // TODO this should be set for chord mode so that we only draw one note per string.
                        // For scale mode we want this to be false.
                        let oneNotePerStringOnly = true;
                        // TODO this should be set for chord mode so that we only draw chords from the root note.
                        // E.g. for a c major chord, if the root note is a c on the A string then don't draw notes on the low E string.
                        let drawFromRootNoteOnly = true;

                        addNotesToChordDiagram(selectedKey, intervalsString, ctx, fretboardParams, cagedPosition, startingFret, maxFret, oneNotePerStringOnly, drawFromRootNoteOnly);

                        // TODO generalise this so that numFrets can be numbers other than 5
                        //startingFret += 5;
                    }
                    
                });
                }
            }
    }, [activeChord]);

    return (
        <div className="details-section" ref={containerRef} />
    );
};

export default DetailsSection;