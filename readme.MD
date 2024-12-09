# Project Instructions

### NOTE: DO NOT `GIT ADD .`

## How to use JQuery and the Database in TypeScript and compile to JavaScript

1. ### Install pre-requisite dependencies
 _Note: You have to install Node.js LTS in order to run these commands_ <br>
`npm install -g typescript` <br>
`npm install -g webpack`

2. ### Install JQuery types for your machine
`npm install --save-dev @types/jquery`

3. ### In your typescript, reference "jquery" (No file path)
`import * as $ from "jquery";`

4. ### Compile typescript, move the new files to src
`tsc ./path/to/main.ts`<br>
`ts folder -> src folder` 

5. ### In the generated javascript, change jquery reference from "jquery" to "./jquery" (the one in src!)
`require("jquery")` -> `require("./jquery")`

6. ### Webpack your file
Run this command template after substituting filepaths with yours: <br>
`npx webpack ./path/to/any.js` <br>`--output-path "dist"`<br> `--output-filename "whatever.js"`

## How to add files to GitHub properly
1. `git fetch` to get the latest commits
1. `git status` to check if you are behind
1. `git pull` if necessary
1. Make your changes and save them to disk
1. `git add` specific files (``git add ./path/to/file``)
1. `git commit -m "message"` with a descriptive commit message
1. `git push` when your changes are in a good state



* Note: push minor changes such as small fixes or typo corrections right away! This helps other group members know that you've already fixed something. If you do it correctly, these changes should be able to merge seamlessly!


### By Michael A.