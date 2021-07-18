import { GoogleSheet } from './GoogleSheet'
import * as credentials from '../credentials.json'
import * as params from '../params.json'
import { writeFileSync } from 'fs'

const REFRESH_INTERVAL = 10

export class SheetTxt {
  private static sheets: Record<string, GoogleSheet> = {}

  public static async run (): Promise<void> {
    await this.init()

    const tick = async () => {
      await this.refreshAll.call(this)
      setTimeout(tick, REFRESH_INTERVAL * 1000)
    }

    tick()
  }

  private static async init (): Promise<void> {
    await Promise.all(params.map(async sheetParams => {
      const sheet = new GoogleSheet(sheetParams.spreadsheetId)
      await sheet.authenticate(credentials.client_email, credentials.private_key)
      this.sheets[sheetParams.spreadsheetId] = sheet
    }))
  }

  private static async refreshAll (): Promise<void> {
    await Promise.all(params.map(async sheetParams => {
      const selectedSheet = sheetParams.sheetName

      const cellsRefs = sheetParams.cells.map(({ cell }) => cell)
      const cellsData = await this.sheets[sheetParams.spreadsheetId].getCells(selectedSheet, ...cellsRefs)

      sheetParams.cells.forEach((cellParams, cellIndex) => {
        const cellContents = cellsData[cellIndex]

        writeFileSync(cellParams.path, cellContents)
      })
    }))
  }
}
