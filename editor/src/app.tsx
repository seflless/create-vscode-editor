import * as React from 'react'
import { vscode } from './utils/vscode'
import { defaultDocument } from './utils/defaultDocument'
import { UI_EVENT } from './types'
import './styles.css'
import { EditorFile } from 'utils/editorfile'

// Will be placed in global scope by extension
declare let currentFile: EditorFile

export default function App(): JSX.Element {
  const rTLDrawState = React.useRef<any>()
  const rCanvas = React.useRef<any>(null)

  React.useEffect(()=>{
    // If no initial document content was set, initialize it to the default file content
    // The extension will set the initial currentFile to null if so
    currentFile = currentFile || defaultDocument

    const canvas = rCanvas.current;
    canvas.width = currentFile.width;
    canvas.height = currentFile.height;

    const ctx = canvas.getContext('2d');

    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width, canvas.height);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    alert('hi!');

    // Draw initial document strokes
    currentFile.strokes.forEach( stroke => {
      ctx.beginPath();
      ctx.moveTo( stroke[0].x, stroke[0].y );
      for(let i = 1; i<stroke.length-1; i++){
        ctx.lineTo(stroke[i].x, stroke[i].y)
      }
      ctx.stroke();
    })

    let lastPoint = null;
    let stroke = null;
    canvas.addEventListener('pointerdown', (e)=>{
      lastPoint = {
        x: e.clientX,
        y: e.clientY
      };
      stroke = [lastPoint];
    })

    canvas.addEventListener('pointermove', (e)=>{
      if( lastPoint !== null ){

        // Draw the latest line
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
        
        lastPoint = {
          x: e.clientX,
          y: e.clientY
        };

        stroke.push(lastPoint);
      }
    })

    canvas.addEventListener('pointerup', (e)=>{
      // Don't add a stroke if no pointermove occurred and therefore
      // no movement to cause a stroke occurred
      if(stroke.length>1){
        currentFile.strokes.push(stroke);
        // Synchronize the documents on finishing the drawing stroke
        sendDocumentChanges();
      }

      lastPoint = null;
      stroke = null;
    })

    // Note: We aren't cleaning up the event registrations as we don't
    // have HMR support so there won't be any triggering of this effect
    // after the first call
  },[])

  // When the editor's document changes, post the stringified document to the vscode extension.
  function sendDocumentChanges(){
    vscode.postMessage({
      type: UI_EVENT.EDITOR_UPDATED,
      text: JSON.stringify(currentFile)
    })
  }

  function resetFile(){
    currentFile = defaultDocument;
    
    const ctx = rCanvas.current.getContext('2d');
    ctx.fillRect(0,0,rCanvas.current.width, rCanvas.current.height );

    sendDocumentChanges();
  }

  return (
    <div className="editor">
      <button onPointerDown={resetFile} style={{position: "absolute"}}>Clear</button>
      <canvas ref={rCanvas}/>
    </div>
  )
}
