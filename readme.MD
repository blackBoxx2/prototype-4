# Project Instructions

## How to use JQuery and the Database in TypeScript and compile to JavaScript

### Install JQuery types
`npm install --save-dev @types/jquery`

### In typescript reference "jquery" (No file path)
`import * as $ from "jquery";`

### Compile typescript, move the files to src
`tsc ./path/to/main.ts`<br>
`ts folder -> src folder` 

### Change jquery reference from "jquery" to "./jquery" (the one in src!)
`require("jquery") -> require("./jquery")`

### Webpack your file
`npx webpack ./path/to/any.js --output-path "dist" --output-filename "whatever.js"`

## How to add files to GitHub properly
1. `git fetch` to get the latest commits
1. `git status` to check if you are behind
1. `git pull` if necessary
1. Make your changes
1. `git add` specific files (``git add ./path/to/file``)
1. `git commit -m "message"` with a descriptive commit message
1. `git push` when your changes are in a good state

* Note: push minor changes such as small fixes or typo corrections right away! This helps other group members know that you've already fixed something. If you do it correctly, these changes should be able to merge seamlessly!


### By Michael A.