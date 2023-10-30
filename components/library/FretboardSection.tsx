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
      ctx.arc(markingX, markingY - fretMarkingRadius * 3, fretMarkingRadius, 0, 2 * Math.PI);
      ctx.arc(markingX, markingY + fretMarkingRadius * 3, fretMarkingRadius, 0, 2 * Math.PI);
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
  ctx.fillStyle = 'red';
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
            const numFrets = 22;
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

            // Example notes
            const notes: Note[] = [
                { string: 3, fret: 2, label: 'A' },
                { string: 1, fret: 3, label: 'G' },
                { string: 4, fret: 7, label: 'D' },
                { string: 6, fret: 0, label: 'E' }, // Open string note
            ];

            notes.forEach(note => drawNote(ctx, note.string, note.fret, note.label, fretboardParams));
    }
};

useCanvasResize(drawFretboard, containerRef);

return (
    <div className="fretboard-section" ref={containerRef}>
    <canvas style={{ width: '100%', height: 'auto' }} />
    </div>
);
}
