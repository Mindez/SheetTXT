# SheetTXT

A small Typescript application to sync cells from Google Sheets to txt files.

Useful, for example, when dealing with OBS Text Sources to allow data to be modified in one Google Sheet rather than having to alter multiple text files.

Currently polls the sheet for updates every 10 seconds.

## Quick Start Guide (for developers)

- Clone the repository
- `npm install`
- Create a Google IAM Service Account at https://console.developers.google.com/iam-admin/serviceaccounts/
- Create and download a key for the Service Account in JSON format and put them in the root directory as `credentials.json`
- Share the spreadsheet with the Service Account by the email address to ensure that it has permission to view the sheet
- Modify `params.json` with the worksheets, sheets, cells and txt files that you want to set up
- `npm start`

If the structure of the sheet changes (eg. worksheet names change), you may need to restart the app.

## Params

The Params object allows you to define which worksheets, sheets and cells you want to use, as well as which txt file you'd like to update. You can define multiple sheets, and for each sheet you can define multiple cells to watch.

The structure of params.json is as follows:

```
[
  {
    "spreadsheetId": "ID in the sheet URL",
    "sheetName": "Name of the sheet (defaults to first sheet if left blank)",
    "cells": [
      {
        "cell": "Cell Reference eg. A1",
        "path": "Filepath relative to the root folder eg. txt/description.txt"
      }
      ...Add more cells for the same workspace here
    ]
  }
  ...Add more spreadsheets here
]
```

## Building an Executable

For convenience, you can build an executable that allows you to package the app for distribution with a portable restreamer package. The executable just needs a valid params.json and credentials.json in the same folder in order to work. See the quick start guide above for instructions on generating valid credentials.

Our build process is in three phases: One step to build the typescript in the `dist` folder, one step to remove non-production dependencies, and one step to use pkg to build the compiled `dist` folder into an exe for distribution.

To run the build process:-

```
npm run build
npm run prune
npm run compile
```

The distributable exe will then be placed in the `builds` folder with the name `sheettxt-[timestamp].exe`. Note that all text files will be created relative to where the exe is run from. This is currently designed to work for Windows - distributable packages for other operating systems can be created by changing the config for `pkg`.

## Future Feature List

Keeping a note here of future extensibility features that it would be nice to add. If you want to contribute, consider building one of the features on this list. These features are very high level and have not undergone any analysis, so some may not be possible.

- Authentication frontend
  - Rather than bundling credentials, allow users to use oauth to sign in with their own google accounts

- Externally configurable params.json - **DONE**
  - Allow the params.json to be controlled from outside of the built distributable executable, so that a new build doesn't have to be done to change hardcoded values

- Configuration Dashboard
  - Configure the params.json from a frontend, allowing changes to be saved and reloaded when a change is made

- Param/Credential Validation
  - Better error messages rather than the app just not starting if param files are not present or are malformed

- Params Profiles
  - Allow params.json to be saved, loaded, exported and easily enabled/disabled

- Push Notifications
  - Update the text files not on a 10 second timer, but when things actually change, if possible

- Image Sync
  - Sync images or other binary data as well as text

- OBS Plugin
  - A SheetTXT source built into OBS that uses SheetTXT to sync a cell directly with a text field in the scene

- Stream Deck Plugin
  - Start/stop syncing and switch between profiles, all from the comfort of your own Stream Deck
