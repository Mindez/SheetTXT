import { GoogleSheet } from './GoogleSheet'
import * as credentials from '../credentials.json'
import * as params from '../params.json'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { dirname } from 'path'

const REFRESH_INTERVAL = 10

export class SheetTxt {
  private static sheets = {}

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
      await Promise.all(sheetParams.cells.map(async cellParams => {
        const cellContents = await this.sheets[sheetParams.spreadsheetId].getSingleCell(selectedSheet, cellParams.cell)

        const dir = dirname(cellParams.path)
        if (!existsSync(dir)) mkdirSync(dir)

        await writeFileSync(cellParams.path, cellContents)
      }))
    }))
  }
}
