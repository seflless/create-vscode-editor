import * as React from 'react'
import { vscode } from './utils/vscode'
import { defaultDocument } from './utils/defaultDocument'
import { UI_EVENT } from './types'
import './styles.css'
import { EditorFile } from 'utils/editorfile'
import clone from 'rfdc/default'

// Will be placed in global scope by extension
declare let currentFile: EditorFile

export default function App(): JSX.Element {
  const canvas = React.useRef<any>(null)
  const ctx = React.useRef<any>(null)
  const lastPoint = React.useRef<any>(null)
  const activeStroke = React.useRef<any>(null)

  React.useEffect(()=>{
    // If no initial document content was set, initialize it to the default file content
    // The extension will set the initial currentFile to null if so
    currentFile = currentFile || clone(defaultDocument);

    // Set the canvas to be as big as the file's dimension, for now we can't edit
    // the file's dimensions, it's just being set in the default initial document
    canvas.current.width = currentFile.width;
    canvas.current.height = currentFile.height;

    // Setup the draw context
    ctx.current = canvas.current.getContext('2d');

    ctx.current.strokeStyle = "white";
    ctx.current.lineWidth = 10;
    ctx.current.lineCap = "round";
    ctx.current.lineJoin = "round";

    // Draw initial state of the document
    syncVisualsToState();

    const handleExtensionMessage = (message) => {
      switch(message.data.eventType){
        case "FILE_UNDO": 
        case "FILE_REDO": 
          currentFile = message.data.text === "" ? clone(defaultDocument): JSON.parse(message.data.text);
          syncVisualsToState();
          break;
      }
    }
    window.addEventListener('message', handleExtensionMessage)

    // Note: We aren't cleaning up the event registrations as we don't
    // have HMR support so there won't be any triggering of this effect
    // after the first call
  },[])

  // We are typically incrementally drawing, not redrawing all strokes
  // every time there is a change. This function is used to initially 
  // sync the canvas pixels to the underlying file. But it is also used
  // when a wholesale state replacement occurs like an undo/redo
  function syncVisualsToState(){
    ctx.current.fillStyle = "black";
    ctx.current.fillRect(0,0,canvas.current.width, canvas.current.height);
    currentFile.strokes.forEach( stroke => {
      ctx.current.beginPath();
      ctx.current.moveTo( stroke[0].x, stroke[0].y );
      for(let i = 1; i<stroke.length-1; i++){
        ctx.current.lineTo(stroke[i].x, stroke[i].y)
      }
      ctx.current.stroke();
    })
  }

  // When the editor's document changes, post the stringified document to the vscode extension.
  const sendDocumentChanges = () => {
    vscode.postMessage({
      type: UI_EVENT.EDITOR_UPDATED,
      text: JSON.stringify(currentFile)
    })
  }

  const resetFile = () => {
    currentFile = defaultDocument;
    
    ctx.current.fillRect(0,0,canvas.current.width, canvas.current.height );

    sendDocumentChanges();
  }

  const onPointerDown = (e) => {
    lastPoint.current = {
      x: e.clientX,
      y: e.clientY
    };
    activeStroke.current = [lastPoint.current];
  }

  const onPointerMove = (e) => {
    if( lastPoint.current !== null ){

      // Draw the latest line
      ctx.current.beginPath();
      ctx.current.moveTo(lastPoint.current.x, lastPoint.current.y);
      ctx.current.lineTo(e.clientX, e.clientY);
      ctx.current.stroke();
      
      lastPoint.current = {
        x: e.clientX,
        y: e.clientY
      };

      activeStroke.current.push(lastPoint.current);
    }
  }

  const onPointerUp = (e) => {
    // Don't add a stroke if no pointermove occurred and therefore
    // no movement to cause a stroke occurred
    if(activeStroke.current.length>1){
      currentFile.strokes.push(activeStroke.current);
      // Synchronize the documents on finishing the drawing stroke
      sendDocumentChanges();
    }

    lastPoint.current = null;
    activeStroke.current = null;
  }

  return (
    <div className="editor">
        {/* Trash icon from Radix UI icon set*/}
        <svg id="clear-all" onPointerDown={resetFile} width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
        </svg>
      <canvas onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} ref={canvas}/>
    </div>
  )
}