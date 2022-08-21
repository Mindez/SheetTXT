import { GoogleSheet } from './GoogleSheet'
import * as credentials from '../credentials.json'
import * as params from '../params.json'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { dirname } from 'path'

const SYNC_INTERVAL = 10

const contentCache = {}

export class SheetTxt {
  private static sheets: Record<string, GoogleSheet> = {}

  public static async run (): Promise<void> {
    await this.init()

    const syncTick = async () => {
      await this.syncAll.call(this)
      setTimeout(syncTick, SYNC_INTERVAL * 1000)
    }

    await syncTick()
  }

  private static async init (): Promise<void> {
    await Promise.all(params.map(async sheetParams => {
      const sheet = new GoogleSheet(sheetParams.spreadsheetId)
      await sheet.authenticate(credentials.client_email, credentials.private_key)
      this.sheets[sheetParams.spreadsheetId] = sheet
      console.log(`Watching sheet "${sheetParams.sheetName}" in spreadsheet with ID ${sheetParams.spreadsheetId} (refreshing every ${SYNC_INTERVAL} seconds)`)
    }))
  }

  private static async syncAll (): Promise<void> {
    console.log(`# Syncing at ${new Date()}`)
    await Promise.all(params.map(async sheetParams => {
      const selectedSheet = sheetParams.sheetName
      const cellsRefs = sheetParams.cells.map(({ cell }) => cell)
      try {
        const cellsData = await this.sheets[sheetParams.spreadsheetId].getCells(selectedSheet, ...cellsRefs)
        sheetParams.cells.forEach((cellParams, cellIndex) => {
          const cellContents = cellsData[cellIndex]
          const dir = dirname(cellParams.path)
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
          if (contentCache[cellParams.path] !== cellContents) {
            console.log('Updated: ' + cellParams.path)
            contentCache[cellParams.path] = cellContents
            writeFileSync(cellParams.path, cellContents)
          }
        })
      } catch (e: any) {
        console.log(`*****ERROR DURING SYNC: ${e.message ?? e}*****`)
        try {
          await this.sheets[sheetParams.spreadsheetId].authenticate(credentials.client_email, credentials.private_key)
        } catch (e: any) {
          console.log(`*****ERROR DURING AUTH: ${e.message ?? e}*****`)
        }
      }
    }))
  }
}
