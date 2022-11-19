import { Injectable } from '@angular/core'
import { ElectronService } from 'ngx-electron'
import { AuthService } from 'src/app/auth.service'
import {OrderModule} from 'src/app/pages/apps/sell/sell.module'
import * as moment from 'moment'

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  printersettings: any
  loginfo: any
  constructor(private electronService: ElectronService,private Auth: AuthService) {}

  print(html, printers) {
    if (this.electronService.isElectronApp)
      this.electronService.remote.getGlobal('print')(1, printers, html)
  }
  printBarcode(options, data) {
    if (this.electronService.isElectronApp)
      this.electronService.remote.getGlobal('barcodePrint')(options, data)
  }

  getData() {
    this.Auth.getdbdata(['printersettings', 'loginfo']).subscribe(
      data => {
        this.printersettings = data['printersettings'][0]
        this.loginfo = data['loginfo'][0]
        console.log('FROM PRINT SERVICE')
        console.log(this.printersettings, this.loginfo)
      },
      error => {
        console.log(error)
      },
    )
  }
  silentPrint(commands, printers) {
    printers.forEach(printer => {
      this.electronService.remote.getGlobal('silentPrint')(commands, printer)
    })
  }
  getHighestItemPrice(items) {
    let highestPrice = 0
    for (let item of items) {
      if (item.TotalAmount > highestPrice) highestPrice = item.TotalAmount
      else continue
    }
    return highestPrice
  }
  paddingLeft(padStr, padLength) {
    return String('                                                ' + padStr).slice(
      -(padStr.length + padLength),
    )
  }
  getLargeItemCommand(
    item,
    itemsSecondColumn,
    itemsThirdColumn,
    highestItemPrice,
    cutIndex,
    currentIndex,
  ) {
    let command
    let name = item.showname //displayName ? item.displayName : item.name;
    if (currentIndex === 0)
      command =
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft(name.slice(0, cutIndex), 2) +
        this.paddingLeft(item.Quantity.toString(), itemsSecondColumn - cutIndex) +
        this.paddingLeft(
          item.TotalAmount.toFixed(2),
          itemsThirdColumn -
            item.Quantity.toString().length +
            highestItemPrice.toFixed(2).length -
            item.TotalAmount.toFixed(2).length,
        ) +
        '\u000A'
    else
      command =
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft(name.slice(currentIndex, currentIndex + cutIndex), 2) +
        '\u000A'
    currentIndex += cutIndex
    if (name.length - currentIndex > 0)
      return (
        command +
        this.getLargeItemCommand(
          item,
          itemsSecondColumn,
          itemsThirdColumn,
          highestItemPrice,
          cutIndex,
          currentIndex,
        )
      )
    else return command
  }

  silentPrintReceipt(receipt: OrderModule, printer) {
    let commands = this.getPOSReceiptCommands(receipt)
    console.log(commands)
    if (this.electronService.isElectronApp) this.silentPrint(commands, printer)
  }
  getPOSReceiptCommands(
    receipt: OrderModule,
    numberOfCharacters = 47,
    receiptPrinter = { size: '80mm' },
  ) {
    // console.log('numberOfCharacters: ', numberOfCharacters)
    let printBillDate = moment(new Date(receipt.OrderedDateTime)).format('LLL') //this.datepipe.transform(receipt.details.createdAt, 'MMM dd, y') + ' at ' + this.datepipe.transform(receipt.details.createdAt, 'hh:mm a');
    let highestItemPrice = this.getHighestItemPrice(receipt.Items)
    let total = receipt.BillAmount.toFixed(2)
    let itemsSecondColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 2.25 : 2)
    let itemsThirdColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 3.75 : 3.5)
    let paymentSectionColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 1.4 : 1.3)
    let cutIndex = receiptPrinter.size === '58mm' ? 10 : 20
    let lineBreak = '--------------------------------------------------------------'
    let command = '\u001B' + '@' + '\u001B' + 'E' + '\u0001' //Initialize
    command += '\u001B' + 'a' + '\u0001' + this.loginfo.Company + '\n' + '\u000A' //Company Name
    command +=
      '\u001B' +
      'a' +
      '\u0001' +
      `${this.loginfo.Store}, ${this.loginfo.Address}, ${this.loginfo.City}, \n${this.loginfo.ContactNo}\nGSTIN:${this.loginfo.GSTno}` +
      '\u000A' // Store Address //Bill Header
    command += '\u001B' + 'a' + '\u0001' + 'Receipt: ' + receipt.InvoiceNo + '\u000A' //InvoiceNo
    command += '\u001B' + 'a' + '\u0001' + printBillDate + '\u000A' // OrderedDate // BillDate
    if (receipt.CustomerDetails) {
      if (receipt.CustomerDetails.Name)
        command +=
          '\u001B' + 'a' + '\u0001' + 'Customer: ' + receipt.CustomerDetails.Name + '\u000A' // Customer Name
      if (receipt.CustomerDetails.PhoneNo)
        command +=
          '\u001B' +
          'a' +
          '\u0001' +
          'Customer Mobile: ' +
          receipt.CustomerDetails.PhoneNo +
          '\u000A' // CUstomer Phone
    }
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line

    command +=
      '\u001B' +
      'a' +
      '\u0000' +
      this.paddingLeft('ITEM', 2) +
      this.paddingLeft('QTY', itemsSecondColumn - 4) +
      this.paddingLeft('PRICE', itemsThirdColumn - 3) +
      '\u000A'
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    for (let item of receipt.Items) {
      let name = item.showname.toString() // ? item.displayName : item.name;
      if (name.length > cutIndex)
        //Larger item size
        command += this.getLargeItemCommand(
          item,
          itemsSecondColumn,
          itemsThirdColumn,
          highestItemPrice,
          cutIndex,
          0,
        )
      else
        command +=
          '\u001B' +
          'a' +
          '\u0000' +
          this.paddingLeft(name, 2) +
          this.paddingLeft(item.Quantity.toString(), itemsSecondColumn - name.length) +
          this.paddingLeft(
            item.TotalAmount.toFixed(2),
            itemsThirdColumn -
              item.Quantity.toString().length +
              highestItemPrice.toFixed(2).length -
              item.TotalAmount.toFixed(2).length,
          ) +
          '\u000A'
    }
    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A' //Break Line
    command +=
      '\u001B' +
      'a' +
      '\u0000' +
      this.paddingLeft('Subtotal', 2) +
      this.paddingLeft(
        receipt.subtotal.toFixed(2),
        paymentSectionColumn - 8 + (total.length - receipt.subtotal.toFixed(2).length),
      ) +
      '\u000A'
    if (receipt.OrderTotDisc + receipt.AllItemTotalDisc > 0)
      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft('Bulk Discount', 2) +
        this.paddingLeft(
          '-' + (receipt.OrderTotDisc + receipt.AllItemTotalDisc).toFixed(2),
          paymentSectionColumn -
            14 +
            (total.length - (receipt.OrderTotDisc + receipt.AllItemTotalDisc).toFixed(2).length),
        ) +
        '\u000A'
    let tax1_total = receipt.Tax1
    let tax2_total = receipt.Tax2
    if (tax1_total > 0)
      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft('CGST', 2) +
        this.paddingLeft(
          tax1_total.toFixed(2),
          paymentSectionColumn - 'CGST'.length + (total.length - tax1_total.toFixed(2).length),
        ) +
        '\u000A'
    if (tax2_total > 0)
      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft('SGST', 2) +
        this.paddingLeft(
          tax2_total.toFixed(2),
          paymentSectionColumn - 'SGST'.length + (total.length - tax2_total.toFixed(2).length),
        ) +
        '\u000A'

    command +=
      '\u001B' +
      'a' +
      '\u0000' +
      this.paddingLeft('Total', 2) +
      this.paddingLeft(receipt.BillAmount.toFixed(2), paymentSectionColumn - 5) +
      '\u000A'
    command +=
      '\u001B' +
      'a' +
      '\u0000' +
      this.paddingLeft('Paid', 2) +
      this.paddingLeft(receipt.PaidAmount.toFixed(2), paymentSectionColumn - 4) +
      '\u000A'

    let Balance = receipt.BillAmount - receipt.PaidAmount
    if (Balance > 0) {
      command +=
        '\u001B' +
        'a' +
        '\u0000' +
        this.paddingLeft('Balance', 2) +
        this.paddingLeft(Balance.toFixed(2), paymentSectionColumn - 7) +
        '\u000A'
    }

    command += '\u001B' + 'a' + '\u0000' + lineBreak.slice(0, numberOfCharacters) + '\u000A'
    command +=
      '\u001B' +
      'a' +
      '\u0001' +
      'Thank You. Visit Again.' +
      '\u000A' +
      '\u001B' +
      'a' +
      '\u0000' +
      lineBreak.slice(0, numberOfCharacters) +
      '\u000A'
    command += '\u001B' + 'a' + '\u0001' + 'Receipts by Biz1Book.com' + '\n' + '\u000A'
    command += '\u001D' + 'V' + '\u0042' + '\u0000' //Cut
    return command
  }
}
