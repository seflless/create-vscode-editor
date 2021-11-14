export interface Point {
    x: number;
    y: number;
}

export interface EditorFile {
    width: number;
    height: number;
    strokes: [[Point]];
}