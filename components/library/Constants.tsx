import { Major_Mono_Display } from "next/font/google";
import { before } from "node:test";

export const CIRCLE_OF_FIFTHS = ["C", "G", "D", "A", "E", "B", "F#", "C#", "G#", "Eb", "Bb", "F"];
export const NUMBER_OF_FRETS = 22;
export const FLAT_SYMBOL = String.fromCharCode(9837);
export const STRING_NOTES = [ 'E_LOW', 'A', 'D', 'G', 'B', 'E_HIGH' ];
export const STRING_LABELS = [ 'E', 'B', 'G', 'D', 'A', 'E' ];
export const ALL_NOTES = [ 'A', 'Bb', 'B', 'C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#' ];
export const MAP_STRINGS_TO_STRINGNUMBER: {[index: string]: number} = {
        E_HIGH: 6, B: 5, G: 4, D: 3, A: 2, E_LOW: 1
};
export const SCALE_TYPES = ['major', 'minor', 'pentatonic', 'harmonic minor', 'melodic minor'];
export const CHORD_TYPES = ['major', 'minor', 'dominant 7th', 'major 7th', 'minor 7th', 'half diminished', 'diminished', 'augmented', 'sus2', 'sus4'];
export const intervalForScaleType: {[index: string]: string} = {
    major: '0,2,4,5,7,9,11', minor: '0,2,3,5,7,8,10', pentatonic: '0,3,5,7,10',
    harmonicMinor: '0,2,3,5,7,8,11', melodicMinor: '0,2,3,5,7,9,11'
};
export const intervalsForChordType: {[index: string]: string} = {
  major: '0,4,7', minor: '0,3,7', dominant7th: '0,4,7,10', major7th: '0,4,7,11',
  minor7th: '0,3,7,10',  halfDiminished: '0,3,6,10', diminished: '0,3,6', augmented: '0,4,8', sus2: '0,2,7', sus4: '0,5,7'
}

