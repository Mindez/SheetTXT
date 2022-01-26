import { GoogleSpreadsheet } from 'google-spreadsheet'

export class GoogleSheet {
  private sheetId: string
  private api: GoogleSpreadsheet

  public get title(): string {
    return this.api.title
  }

  public async getCells(sheetName: string, ...refs: string[]): Promise<string[]> {
    let sheet = this.api.sheetsByIndex[0]
    if (sheetName !== '') {
      sheet = this.api.sheetsByTitle[sheetName]
    }

    await sheet.loadCells(refs.map(ref => `${ref}:${ref}`))
    const values = refs.map(ref => sheet.getCellByA1(ref).value)
    const strings = values.map(s => typeof s === 'object' ? '' : s)
    return strings.map(s => s.toString())
  }

  public async authenticate(email: string, privateKey: string): Promise<void> {
    console.log('Authenticating...')
    await this.api.useServiceAccountAuth({
      client_email: email,
      private_key: privateKey
    })
    await this.api.loadInfo()
    console.log('Authentication successful')
  }

  constructor(sheetId: string) {
    this.sheetId = sheetId
    this.api = new GoogleSpreadsheet(this.sheetId)
  }
}
