
Start-Process -Wait -NoNewWindow npx -ArgumentList "tsc ./ts/Database.ts"

Remove-Item -Path .\scripts\651.js -ErrorAction Ignore
Remove-Item -Path .\scripts\main.js -ErrorAction Ignore
Remove-Item -Path .\src\Database.js -ErrorAction Ignore
Remove-Item -Path .\src\DataLib.js -ErrorAction Ignore
Remove-Item -Path .\src\Helpers.js -ErrorAction Ignore
Remove-Item -Path .\src\Models.js -ErrorAction Ignore

Move-Item -Path ./ts/Database.js -Destination ./src/Database.js
Move-Item -Path ./ts/DataLib.js -Destination ./src/DataLib.js
Move-Item -Path ./ts/Helpers.js -Destination ./src/Helpers.js
Move-Item -Path ./ts/Models.js -Destination ./src/Models.js

Start-Process -Wait -NoNewWindow npx -ArgumentList 'webpack'

Move-Item -Path ./dist/651.js -Destination ./scripts/651.js
Move-Item -Path ./dist/main.js -Destination ./scripts/main.js
Remove-Item -Path .\src\Database.js -ErrorAction Ignore
Remove-Item -Path .\src\DataLib.js -ErrorAction Ignore
Remove-Item -Path .\src\Helpers.js -ErrorAction Ignore
Remove-Item -Path .\src\Models.js -ErrorAction Ignore