import type { UI_EVENT } from '../types'

const urlParams = new URLSearchParams(window.location.search);
if(urlParams.has('currentFile')){
  try{
    currentFile = JSON.parse(
      decodeURIComponent(urlParams.get('currentFile'))
    );
  } catch(error) {
    currentFile = null;
  }
}

// Will be placed in global scope by extension
declare function acquireVsCodeApi(): {
  postMessage(options: { type: UI_EVENT; text?: string }): void
}

let api;

if(window.acquireVsCodeApi !== undefined){
  api = acquireVsCodeApi()
} 
// If acquireVsCodeApi isn't available we're in dev mode and in an iframe.
// We use an iframe so we can use vite and hot module reload within an iframe
// within the extension webview.
//
// Here we mockup the vscode/vscode.postMessage object   
else {
  api = {
    postMessage: (options: { type: UI_EVENT; text?: string }) => {
      window.parent.postMessage(options, '*' );
    } 
  };
}

export let vscode = api;