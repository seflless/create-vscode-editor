## Create VS Code Editors
Easily create custom VS Code editors, using React for the UI.

While working on the Tldraw extension I couldn't find any projects that uses React for the editor UI. Also none of the example editors supported web VS Code like GitHub.dev, vscode.dev, and GitHub Codespaces. This project generated an app that has all of these types of things working out of the box. Also a better dev workflow than the VS Code team's example code.

https://github.com/microsoft/vscode-extension-samples/tree/main/custom-editor-sample


Like create-react-app, this is a project generator that is very opinionated in order work out of the box.

Checkout the [Tldraw VS Code editor](https://marketplace.visualstudio.com/items?itemName=tldraw-org.tldraw-vscode), that this module was spun out from.

### Todos
 - Register create-vscode-editor. Running it would be
  - `yarn create vscode-editor my-editor`
 - Make it follow the `yarn create` / create-react-app approach for easily quickly creating a new project
  - https://classic.yarnpkg.com/en/docs/cli/create
  - https://classic.yarnpkg.com/blog/2017/05/12/introducing-yarn/
 - Switch out Tldraw for a much simpler editor example. Make sure it's somewhat compelling and matches the vision of the project.
 - Make `yarn start` work. Currently you need to have two windows running
   - auto open VS Code to project root
 - Remove need to have a VS Code window to debug/run the extension
 - Get installer building working 
 - Make sure setup instructions are accurate
 - Add npm publish script

### Future Work
 - Add tests
   - For the generator
   - To the template to provide ready to go VS Code extension testing for editors
 - Add instructions and scripts for publishing automatically to the Marketplace
 - Add hot reloading to both the extension and editor app. Switch from esbuild to Vite (uses esbuild anyway)
 - Optimize editor instance launch times. Feels like >1sec right now on github.dev, vscode.dev, Codespaces
   - It's much faster on desktop but still not code editor level fast. Tldraw itself might need some optimizing for initialization speed.
   - Can we PWA functionality to cache the frontend?
 - Make bidirectional document syncing patch based. This is important for github.dev, vscode.dev, and Codespaces as it reduces network traffic between the extension host and extension browser clientxw.
 - Make patching underlying model patch based
 - Make the project evolvable. Currently users would have to generate fresh project to get the latest. Instead they should just be able to update the dependency via yarn/npm.
 - Provide some optional useful editor building infrastructure 
  - An undo/redo manager
  - An app data model
  - Multiplayer framework or Live Share integration
  - Utilities for maintaining file formats with best practices for being easily evolvable/serializable.
 - Add CLI support for flags for language `ts`/`js` and UI frameworks other than `react` like `vue`
 - Use a proper CLI framework for the generator

This folder contains the source for the tldraw VS Code extension.

## Developing

## 1. Install dependencies

- Run `yarn` from the root folder

## 2. Build @tldraw/tldraw

- Run `yarn start` from the root folder.

## 3. Start the editor

In the root folder:

- Run `yarn start:vscode`.

This will start the development server for the `vscode/editor` project and open the `vscode/extension` folder in a new window.

In the `vscode/extension` window, open the terminal and run:

- Install dependencies (`yarn`)
- Start the VS Code debugger (Menu > Run > Start Debugging)

Open a `.tldr` file or create a new `.tldr` file from the command palette.

## Publishing

To publish, chat with the team on the [Discord channel](https://discord.gg/s4FXZ6fppJ).

- Install `vsce` globally
- Run `vsce login tldraw-org` and sign in

In the `vscode/extension` folder:

- Run `yarn vscode:publish`

#### References

- [yarn create](https://classic.yarnpkg.com/en/docs/cli/create)
 - [Yarn Create & Yarn 1.0](https://classic.yarnpkg.com/blog/2017/05/12/introducing-yarn/)
- [VS Code Marketplace Manager](https://marketplace.visualstudio.com/manage/)
- [Web Extensions Guide](https://code.visualstudio.com/api/extension-guides/web-extensions)
  - [Test Your Web Extension](https://code.visualstudio.com/api/extension-guides/web-extensions#test-your-web-extension)
  - [Web Extension Testing](https://code.visualstudio.com/api/extension-guides/web-extensions#web-extension-tests)
  - An example custom editor that does work as a Web Extension
    - https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio
    - https://github.com/hediet/vscode-drawio
- [VS Code Extension API/Landing Page](https://code.visualstudio.com/api)
- [Getting Started](https://code.visualstudio.com/api/get-started/your-first-extension)
- [Custom Editor API](https://code.visualstudio.com/api/extension-guides/custom-editors)
- [github.com/microsoft/vscode-extension-samples](https://github.com/microsoft/vscode-extension-samples)
- [Extensions Guide -> Webviews](https://code.visualstudio.com/api/extension-guides/webview)
- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

