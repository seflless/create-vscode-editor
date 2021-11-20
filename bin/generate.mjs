#!/usr/bin/env node

import { fileURLToPath } from 'url';
import fs from "fs-extra"
import path from "path"
import chalk from "chalk"

const moduleRoot = path.resolve( fileURLToPath(import.meta.url), "../..");

// Ensure an directory path was provided
if( process.argv.length < 3 ) {
    logError(`Error: Missing 'path' argument. Should look more like 'yarn create vscode-editor <path>'`)
    process.exit(0);
}

const appFolderPath = process.argv[2];

// Make sure there isn't already a directory with the same filepath
if( fs.existsSync(appFolderPath) ){
    logError(`A directory named '${appFolderPath}' already exists.`);
    process.exit(0);
}

// Create the directory and copy the template files over
await fs.mkdir(appFolderPath);

const copyList = [
    ".vscode",
    "editor",
    "examples",
    "extension",
    "scripts",
    // I'm not sure why, but some people (well Idan Gazit so far) are having an issue where .npmignore doesn't exist
    // Rather than look into why there might be a difference in maybe yarn version behavior around if .npmignore
    // gets included or not on publish, I'm just going to have a different named file that gets turned into an
    // .npmignore on generation locally
    [".NPMIGNORE-TEMPLATE", ".npmignore"],
    ".gitignore",
    "package.json",
    "yarn.lock",
    "node_modules"
]

console.log("Generating VS Code editor project...")

// Use a regular for loop instead of forEach so we can logically 
// block on async functions
for( let i = 0; i<copyList.length; i++){
    if(Array.isArray(copyList[i])){
        copyFileOrFolder(copyList[i][0], copyList[i][1]);
    } else {
        copyFileOrFolder(copyList[i]);    
    }
}

await copyFileOrFolder( "README-TEMPLATE.md", "README.md" );

// Use chalk to display messages with distinct colors
function logError(message){
    console.log(chalk.red(message));
}

async function copyFileOrFolder(srcName, dstName) {
    // Providing a dstName is optional. If it's provided,
    // use it to rename the files/folders otherwise
    // keep the same name
    dstName = dstName || srcName;

    const src = path.resolve(moduleRoot, srcName);
    const dst = path.resolve(appFolderPath, dstName);
    
    await fs.copy( src, dst );
}

async function sleepNow(duration){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
}