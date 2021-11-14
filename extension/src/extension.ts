import * as vscode from 'vscode'
import { EditorProvider } from './EditorProvider'

// This is the extension entry point. This is called once on the first
// time a .editor extension is opened/created.
export function activate(context: vscode.ExtensionContext) {
  // Register our custom editor providers
  context.subscriptions.push(EditorProvider.register(context))
}
