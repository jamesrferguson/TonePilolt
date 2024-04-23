// DetailsSection.tsx
import React, { useEffect, useRef } from 'react';
import { parseUserInput, notesFromScaleInterval, orderNotesForStartingNote, UserScaleOrChordInput } from './FretboardSection';
import { intervalsForChordType, intervalForScaleType, MAP_STRINGS_TO_STRINGNUMBER, STRING_NOTES  } from './Constants';

interface DetailsSectionProps {
  chordMode: boolean;
  activeChord: string;
  activeScale: string;
}

const isRootNote = (note: string, rootNote: string) => {
    return note === rootNote;
}

type FretboardParameters = {
    numFrets: number;
    scaleNoteCountBack: number;
};

const drawNotesForString = (ctx: CanvasRenderingContext2D, stringName: string, notes: string[], rootNote: string, fretboardParams: any, cagedPosition:string, startingFret: number, maxFret: number, chordMode: boolean, scaleNotesPerString: number, lastNotesDrawn: string[]): string[] => { 
    let stringNumber = MAP_STRINGS_TO_STRINGNUMBER[stringName] - 1;
    let notesForString = orderNotesForStartingNote(stringName);
    let drawNotesParamsList: [CanvasRenderingContext2D, number, number, string, boolean, any, number][] = [];
    let stringNotes: string[] = [];
    let rootNoteFound = false;
    for (let i = startingFret; i <= startingFret + fretboardParams.numFrets - 1; i++) {
      let j = i % 12;
      if (notes.indexOf(notesForString[j]) > -1){
        if (!chordMode) {
          if (!lastNotesDrawn.includes(notesForString[j]) && stringNotes.length < scaleNotesPerString) {
              drawNotesParamsList.push([ctx, stringNumber, i, notesForString[j], notesForString[j] == rootNote, fretboardParams, startingFret]);
              stringNotes.push(notesForString[j]);
          }
          
        } else {
          if (!rootNoteFound) {
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
      
      
    }
      if(drawNotesParamsList.length > 0 && chordMode) {
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
      if (!chordMode){
          if (drawNotesParamsList.length > 0){
              for (let i = 0; i < drawNotesParamsList.length; i++) {
                  const item = drawNotesParamsList[i];
                  drawNote(...item);
              }
          }
          
      }
      return stringNotes;
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
    ctx.fillStyle = isRootNote ? 'blue' : 'red';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#003300';
    ctx.stroke();

    // Draw note name
    ctx.fillStyle = 'white';
    ctx.font = `${fretWidth / 4}px Arial`;
    ctx.fillText(noteName, x - fretWidth / 8, y + fretWidth / 8);
};

const addNotesToNeck = (keyName: string, scaleInterval: string, ctx: CanvasRenderingContext2D, fretboardParams: any, cagedPosition:string, startFret: number = 0, maxFret: number, chordMode: boolean, scaleNoteCountBack: number) => { 
    let lastNoteDrawn: string[] = [];
    for (let i = 0; i < STRING_NOTES.length; i++){
        lastNoteDrawn = drawNotesForString(ctx, STRING_NOTES[i], notesFromScaleInterval(keyName, scaleInterval), keyName, fretboardParams, cagedPosition, startFret, maxFret, chordMode, scaleNoteCountBack, lastNoteDrawn);
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
    ctx.fillStyle = '#000000'; 
    ctx.font = '10px Arial'; 
    for (let i = 0; i < fretNumCount; i++) {
        // ctx.fillText((startingFret + i).toString(), fretboardX - 15, fretboardY + i * fretWidth + fretWidth / 2);
        let yPos = startingFret === 0 ? fretboardY + i * fretWidth - fretWidth / 2 : fretboardY + i * fretWidth + fretWidth / 2;
        // Skip the label for the 0th fret
        if (i + startingFret === 0) continue;

        // Draw the fret number
        ctx.fillText((i + startingFret).toString(), fretboardX - 15, yPos);
    }
}
  
const addNotesToChordDiagram = (keyName: string, intervals: string, ctx: CanvasRenderingContext2D, fretboardParams: any, cagedPosition: string, startFret: number = 0, maxFret: number, chordMode: boolean, scaleNoteCountBack: number) => {
    const { numFrets, numStrings, fretboardX, fretboardY, fretWidth, stringSpacing } = fretboardParams;
        for (let string = 0; string < numStrings; string++) {
            addNotesToNeck(keyName, intervals, ctx, fretboardParams, cagedPosition, startFret, maxFret, chordMode, scaleNoteCountBack);
        }
};

const generateFretboardParameters = (chordMode: boolean, scaleType: string): FretboardParameters  => {
    if (chordMode) {
        return {
            numFrets: 4,
            scaleNoteCountBack: 1
        };
    } else {
        let countBack = 3;
        let fretCount = 7;
        if (scaleType === 'pentatonic') {
            countBack = 2;
            fretCount = 5;
        };

        return {
            numFrets: fretCount,
            scaleNoteCountBack: countBack
        };
    }
};

const DetailsSection: React.FC<DetailsSectionProps> = ({ chordMode, activeChord, activeScale }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    let userInputValues: UserScaleOrChordInput = parseUserInput(chordMode ? activeChord : activeScale);
    useEffect(() => {
        if (containerRef.current) {
            // Clear container
            containerRef.current.innerHTML = '';
            const dpr = window.devicePixelRatio || 1;

            type FretMap = {
                [key: string]: number;
              };

            type CagedStartingFrets = {
                [key: string]: FretMap;
              };

            const CAGED_STARTING_FRETS_CHORDS: CagedStartingFrets =  {
                'C'  :{'C': 0, 'A': 3, 'G': 5, 'E': 8, 'D': 10},
                'C#' :{'C': 1, 'A': 4, 'G': 6, 'E': 9, 'D': 11},
                'D'  :{'D': 0, 'C': 2, 'A': 5, 'G': 7, 'E': 10},
                'Eb' :{'D': 1, 'C': 3, 'A': 6, 'G': 8, 'E': 11},
                'E'  :{'E': 0, 'D': 2, 'C': 4, 'A': 7, 'G': 9},
                'F'  :{'E': 1, 'D': 3, 'C': 5, 'A': 8, 'G': 10},
                'F#' :{'E': 2, 'D': 4, 'C': 6, 'A': 9, 'G': 11},
                'G'  :{'G': 0, 'E': 3, 'D': 5, 'C': 7, 'A': 10},
                'G#' :{'G': 1, 'E': 4, 'D': 6,'C': 8, 'A': 11},
                'A'  :{'A': 0, 'G': 2, 'E': 5, 'D': 7, 'C': 9},
                'Bb' :{'A': 1, 'G': 3, 'E': 6, 'D': 8, 'C': 10},
                'B'  :{'A': 2, 'G': 4, 'E': 7, 'D': 9, 'C': 11}
            };
            const CAGED_STARTING_FRETS_MODES =  {
                'C'  :{'I': 8, 'D': 10, 'P': 11, 'L': 1, 'M': 3, 'A': 5, 'Lo': 7},
                'C#' :{'I': 9, 'D': 11, 'P': 0, 'L': 2, 'M': 4, 'A': 6, 'Lo': 8},
                'D'  :{'I': 10, 'D': 0, 'P': 1, 'L': 3, 'M': 5, 'A': 7, 'Lo': 9},
                'Eb' :{'I': 11, 'D': 1, 'P': 2, 'L': 4, 'M': 6, 'A': 8, 'Lo': 10},
                'E'  :{'I': 0, 'D': 2, 'P': 3, 'L': 5, 'M': 7, 'A': 9, 'Lo': 11},
                'F'  :{'I': 1, 'D': 3, 'P': 4, 'L': 6, 'M': 8, 'A': 10, 'Lo': 0},
                'F#' :{'I': 2, 'D': 4, 'P': 5, 'L': 7, 'M': 9, 'A': 11, 'Lo': 1},
                'G'  :{'I': 3, 'D': 5, 'P': 6, 'L': 8, 'M': 10, 'A': 0, 'Lo': 2},
                'G#' :{'I': 4, 'D': 6, 'P': 7, 'L': 9, 'M': 11, 'A': 1, 'Lo': 3},
                'A'  :{'I': 5, 'D': 7, 'P': 8, 'L': 10, 'M': 0, 'A': 2, 'Lo': 4},
                'Bb' :{'I': 6, 'D': 8, 'P': 9, 'L': 11, 'M': 1, 'A': 3, 'Lo': 5},
                'B'  :{'I': 7, 'D': 9, 'P': 10, 'L': 0, 'M': 2, 'A': 4, 'Lo': 6}
            };
            let selectedKey = userInputValues.keyName;
            let chordOrScaleType = userInputValues.chordOrScaleType;
            let CAGED_STARTING_FRETS = CAGED_STARTING_FRETS_CHORDS;
            if (!chordMode && chordOrScaleType !== 'pentatonic') { 
                CAGED_STARTING_FRETS = CAGED_STARTING_FRETS_MODES;
            }
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
                        let fretboardParameters = generateFretboardParameters(chordMode, chordOrScaleType);
                        let numFrets = fretboardParameters.numFrets;
                        let scaleNoteCountBack = fretboardParameters.scaleNoteCountBack;
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

                        const intervalsString = chordMode ? intervalsForChordType[chordOrScaleType] : intervalForScaleType[chordOrScaleType];

                        addNotesToChordDiagram(selectedKey, intervalsString, ctx, fretboardParams, cagedPosition, startingFret, maxFret, chordMode, scaleNoteCountBack);
                    }
                    
                });
                }
            }
    }, [activeChord, activeScale, chordMode]);

    return (
        <div className="details-section" ref={containerRef} />
    );
};

export default DetailsSection;