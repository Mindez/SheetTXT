# SheetTXT

A small Typescript application to sync cells from Google Sheets to txt files.

Useful, for example, when dealing with OBS Text Sources to allow data to be modified in one Google Sheet rather than having to alter multiple text files.

Currently polls the sheet for updates every 10 seconds.

## Quick Start Guide

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