import { Component, OnInit } from '@angular/core'
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap'
import { AuthService } from 'src/app/auth.service'
import { DomSanitizer } from '@angular/platform-browser'
import { ElectronService } from 'ngx-electron'

import { en_US, zh_CN, NzI18nService } from 'ng-zorro-antd/i18n'
import { getISOWeek } from 'date-fns'
import {
  NgbDate,
  NgbDateStruct,
  NgbCalendar,
  NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap'
import * as moment from 'moment'
import {
  NzPlacementType,
  NzContextMenuService,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown'
// import { OrderModule } from '../sale/sale.module'
import { OrderModule } from '../sell/sell.module'
import { PrintService } from 'src/app/services/print/print.service'
import { SafeHtml } from '@angular/platform-browser'
@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss'],
})
export class ReceiptComponent implements OnInit {
  model: NgbDateStruct
  date: { year: number; month: number }
  public buttonName: any = 'Back'
  value: string
  dateRange = []
  selectedValue = 'All'
  receipts: any
  show: number = 0
  orderitem: any
  orderno: any
  Subtotal: number = 0
  CGST: number = 0
  SGST: number = 0
  IGST: number = 0
  Total: number = 0
  additionalCharge: number = 0
  element: any
  KOTs: any
  html: SafeHtml
  KOTItems: any = {}
  CompanyId: any
  StoreId: any
  UserId: number
  OrderStauts: number
  AdditionalCharges: any = []
  FirstId: boolean
  LastId: boolean
  systemPrinters: any
  address: any
  city: any
  phone: any
  orderedDate: any
  Company: any
  ContactNo: any
  strdate: string
  enddate: string
  user: any
  id = 1
  loginfo
  showcalendar = false
  orderjson: string = ''
  printhtmlstyle = `
  <style>
    #printelement {
      width: 270px;
    }
    .header {
        text-align: center;
    }
    .item-table {
        width: 100%;
    }
    .text-right {
      text-align: right!important;
    }
    .text-left {
      text-align: left!important;
    }
    .text-center {
      text-align: center!important;
    }
    tr.nb, thead.nb {
        border-top: 0px;
        border-bottom: 0px;
    }
    table, p, h3 {
      empty-cells: inherit;
      font-family: Helvetica;
      font-size: small;
      width: 290px;
      padding-left: 0px;
      border-collapse: collapse;
    }
    table, tr, td {
      border-bottom: 0;
    }
    hr {
      border-top: 1px dashed black;
    }
    tr.bt {
      border-top: 1px dashed black;
      border-bottom: 0px;
    }
    tr {
      padding-top: -5px;
    }
  </style>`
  roleid
  hoveredDate: NgbDate | null = null

  fromDate: NgbDate
  toDate: NgbDate | null = null
  constructor(
    private Auth: AuthService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private electron: ElectronService,
    private calendar: NgbCalendar,
    private printservice: PrintService,
    public formatter: NgbDateParserFormatter,
  ) {
    this.UserId = null
    this.transaction = {
      Amount: 0,
      OrderId: 0,
      CompanyId: this.CompanyId,
      StoreId: this.StoreId,
      PaymentTypeId: 0,
      CustomerId: 0,
      UserId: this.UserId,
    }
    var loginfo = JSON.parse(localStorage.getItem('logInfo'))
    // this.roleid = loginfo.RoleId

  }

  //OLD POS MAster
  ordData: any
  pending: any
  PaidAmount: any
  transaction: {
    Amount: number
    OrderId: number
    CompanyId: number
    StoreId: number
    PaymentTypeId: number
    CustomerId: number
    UserId: number
  }
  transactions: any
  receipt:any
  customer: any
  cash: number
  card: number
  paymentid: number
  price: number
  remaining: number
  online$: boolean = navigator.onLine
  Discount: number
  invoice
  OrderSts = {}
  PaymentSts = {}
  exclude1 = {}
  exclude2 = {}
  ordSts = 'All'
  pmtSts = 'All'
  ngforLen
  totalsales: number = 0
  totalpayments: number = 0
  paymentpercent
  ordertypes = ''
  orderlogs: any = []
  show_carousel = false
  ranges: any = {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [
      moment()
        .subtract(1, 'month')
        .startOf('month'),
      moment()
        .subtract(1, 'month')
        .endOf('month'),
    ],
  }
  invalidDates: moment.Moment[] = [
    moment().add(2, 'days'),
    moment().add(3, 'days'),
    moment().add(5, 'days'),
  ]
  selected: any = { startDate: moment(), endDate: moment() }
  isInvalidDate = (m: moment.Moment) => {
    return this.invalidDates.some(d => d.isSame(m, 'day'))
  }
  today: string = moment().format('YYYY-MM-DD')
  preferences = { ShowTaxonBill: true }
  carouseldata = [
    { id: 1, name: 'DineIn', count: 0, sales: 0, paid: 0, cancellcount: 0 },
    { id: 2, name: 'TakeAway', count: 0, sales: 0, paid: 0, cancellcount: 0 },
    { id: 3, name: 'Delivery', count: 0, sales: 0, paid: 0, cancellcount: 0 },
    { id: 4, name: 'Pickup', count: 0, sales: 0, paid: 0, cancellcount: 0 },
    { id: 5, name: 'Counter', count: 0, sales: 0, paid: 0, cancellcount: 0 },
    { id: 6, name: 'Partner', count: 0, sales: 0, paid: 0, cancellcount: 0 },
  ]
  printersettings = { receiptprinter: '', kotprinter: '' }
  paymenttypes = []


  onChange(result: Date): void {
    console.log('onChange: ', result)
    this.strdate = moment(result[0]).format('YYYY-MM-DD')
    this.enddate = moment(result[1]).format('YYYY-MM-DD')
    this.getReceipt(0, 'next', 'all', this.strdate, this.enddate, null)
    // this.gettrans()
  }
  getWeek(result: Date): void {
    console.log('week: ', getISOWeek(result))
  }

  ngOnInit(): void {
    this.Auth.getdbdata(['loginfo', 'printersettings', 'paymenttypes']).subscribe(
      data => {
        this.preferences = data['preferences']
        this.loginfo = data['loginfo'][0]
        this.printersettings = data['printersettings'][0]
        this.CompanyId = this.loginfo.companyId
        this.StoreId = this.loginfo.storeId
        this.paymenttypes = data['paymenttypes']
        console.log(this.paymenttypes)
        this.getReceipt(
          0,
          'next',
          'all',
          moment().format('YYYY-MM-DD'),
          moment().format('YYYY-MM-DD'),
          null,
        )
      }
    )
    // 
    this.strdate = moment().format('YYYY-MM-DD')
    this.enddate = moment().format('YYYY-MM-DD')
    this.getReceipt(0, 'next', 'all', this.strdate, this.enddate, null);

    this.preferences = JSON.parse(localStorage.getItem('preferences'))
    // setHeightWidth();
    // this.strdate = moment().format('YYYY-MM-DD')
    // this.enddate = moment().format('YYYY-MM-DD')
    // console.log(this.strdate, this.enddate)
    this.html = this.sanitizer.bypassSecurityTrustHtml(`<h1>qwerty</h1>`)
    this.printservice.getData()
  }

  toggle() {
    if (this.show) this.buttonName = 'Back'
    else this.buttonName = 'Back'
  }

  nextRecipts(type) {
    if (type == 'next') {
      this.getReceipt(
        this.receipts.receipts[this.receipts.receipts.length - 1].id,
        'next',
        'all',
        this.strdate,
        this.enddate,
        null,
      )
    } else if (type == 'prev') {
      this.getReceipt(this.receipts.receipts[0].id, 'prev', 'all', this.strdate, this.enddate, null)
    }
  }

  getorderlogs() {
    this.Auth.getorderlogs(this.StoreId, this.CompanyId).subscribe(data => {
      this.orderlogs = data
    })
  }
  i = 63
  retry(order) {
    this.Auth.saveorder({ ordData: JSON.stringify([order]) }).subscribe(data => {
      console.log(data)
    })
  }
  filterorderlogs() {
    return this.orderlogs.filter(x => !x.hide)
  }
  print1() {
    var PrintCommandObject = null
    PrintCommandObject.ExecWB(6, 2)
    function printPage() {
      // console.log(PrintCommandObject)
      if (PrintCommandObject) {
        try {
          PrintCommandObject.ExecWB(6, 2)
          PrintCommandObject.outerHTML = ''
        } catch (e) {
          alert(e)
          window.print()
        }
      } else {
        window.print()
      }
    }
  }
  transactionpayment = 0
  getReceipt(startId, type, datatype, fromdate, todate, invoice) {
    this.OrderSts = {}
    this.PaymentSts = {}
    this.exclude1 = {}
    this.exclude2 = {}
    this.ordSts = 'All'
    this.pmtSts = 'All'
    this.invoice = ''
    this.FirstId = false
    this.LastId = false
    this.Auth.GetReceipts(
      this.StoreId,
      this.CompanyId,
      startId,
      type,
      datatype,
      fromdate,
      todate,
      invoice,
    ).subscribe(data => {

      console.log(data)
      this.transactionpayment = 0
      this.totalsales = 0
      this.totalpayments = 0
      this.receipts = data
      if (this.receipts.transactionPayments.length)
        this.transactionpayment = +this.receipts.transactionPayments[0]?.amount.toFixed(2)
      if (this.receipts.receipts.some(x => x.id === this.receipts.firstOrderId[0].Id)) {
        this.FirstId = true
      }
      if (this.receipts.receipts.some(x => x.id === this.receipts.lastOrderId[0].Id)) {
        this.LastId = true
      }
      this.receipts.paymentType.forEach(x => {
        x.Price = 0
      })
      this.receipts.receipts.forEach(element => {
        console.log(element)
        if (element.billAmount > element.paidAmount && element.orderStatusId != -1) {
          element.PaymentStatusId = 1
        } else if (element.billAmount == element.paidAmount) {
          element.PaymentStatusId = 2
        } else if (element.orderStatusId == -1) {
          element.PaymentStatusId = 3
        }
        element.orderedDateTime = moment(element.orderedDateTime).format('lll')
        if (element.Source == 'swiggy') {
          element.logo = './assets/images/swiggy.svg'
        } else if (element.Source == 'zomato') {
          element.logo = './assets/images/zomato.svg'
        } else {
          element.logo = './assets/images/favicon.png'
        }
      })
      this.totalsales = +this.receipts.totalPayments[0].totalSales.toFixed(0)
      this.totalpayments = +this.receipts.totalPayments[0].totalPayment.toFixed(0)
      this.paymentpercent = +((this.totalpayments / this.totalsales) * 100).toFixed(0)
      // console.log(this.carouseldata)
      this.show_carousel = true
      console.log(data)
      this.masterdata = this.receipts.receipts
      data['orderItems'].forEach(item => {
        // console.log(item)
        // console.log(item.description, item.unitPrice, item.orderQuantity, item.totalAmount)
      })
    })
  }
  term
  masterdata = []
  timeout: any = null
  onKeySearch() {
    clearTimeout(this.timeout)
    var $this = this
    this.timeout = setTimeout(function () {
      $this.search()
    }, 500)
  }
  search() {
    if (this.term == '' || this.term == null) {
      this.receipts.receipts = this.masterdata
    } else {
      this.receipts.receipts = this.masterdata.filter(x =>
        x.invoiceNo.toLowerCase().includes(this.term.toLowerCase()),
      )
    }
  }

  setdate(e) {
    if (e.startDate != (null || undefined) && e.endDate != (null || undefined)) {
      this.strdate = moment(e.startDate).format('YYYY-MM-DD')
      this.enddate = moment(e.endDate).format('YYYY-MM-DD')
      console.log(this.strdate, this.enddate)
      this.getReceipt(0, 'next', 'all', this.strdate, this.enddate, null)
    }
  }
  getbyInvoice(e) {
    this.getReceipt(0, 'next', 'byinvoiceno', null, null, e)
  }
  payment(Id) {
    this.transaction.PaymentTypeId = Id
    this.receipts.paymentType.forEach(element => {
      if (element.Id == Id) {
        element.Price = this.Total - this.PaidAmount
        this.transaction.Amount = element.Price
        this.remaining = this.transaction.Amount - element.Price
      } else {
        element.Price = 0
      }
    })
  }
  setPrice() {
    this.transaction.Amount = 0
    let count = 0
    let Id
    this.receipts.paymentType.forEach(element => {
      if (element.Price > 0) {
        count++
        Id = element.Id
      }
      this.transaction.Amount = this.transaction.Amount + element.Price
    })
    if (count == 1) {
      this.transaction.PaymentTypeId = Id
    }
  }
  sum() {
    this.price = 0
    this.receipts.paymentType.forEach(element => {
      this.price = this.price + element.Price
    })
    this.remaining = this.Total - this.PaidAmount - this.price
  }
  order: OrderModule = null
  filter(id, additionalCharge, PaidAmount) {
    console.log(id, additionalCharge, PaidAmount)
    console.log(this.order)
    this.PaidAmount = PaidAmount
    this.Subtotal = 0
    this.CGST = +this.receipts.receipts.filter(x => x.id == id)[0].tax1.toFixed(2)
    this.SGST = +this.receipts.receipts.filter(x => x.id == id)[0].tax2.toFixed(2)
    this.IGST = this.receipts.receipts.filter(x => x.id == id)[0].tax3
    this.address = this.receipts.receipts.filter(x => x.id == id)[0].address
    this.city = this.receipts.receipts.filter(x => x.id == id)[0].city
    this.phone = this.receipts.receipts.filter(x => x.id == id)[0].phoneNo
    this.orderedDate = this.receipts.receipts.filter(x => x.id == id)[0].orderedDateTime
    this.Total = 0
    this.Discount = this.receipts.receipts.filter(x => x.id == id)[0].discAmount
    this.orderno = this.receipts.receipts.filter(x => x.id == id)[0].invoiceNo
    this.orderjson = this.receipts.receipts.filter(x => x.id == id)[0].orderJson
    this.ordertypes = this.receipts.receipts.filter(x => x.id == id)[0].orderType
    this.AdditionalCharges = this.receipts.additionalCharges.filter(x => x.orderId == id)
    if (additionalCharge != null) {
      this.additionalCharge = additionalCharge
    } else {
      this.additionalCharge = 0
    }
    this.KOTs = this.receipts.koTs.filter(x => x.OrderId == id)
    var ordItemArr = JSON.parse(
      JSON.stringify(this.receipts.orderItems.filter(x => x.orderId == id)),
    )
    this.orderitem = []
    console.log(ordItemArr)
    ordItemArr.forEach(element => {
      console.log(element)
      if (this.orderitem.some(x => x.description === element.description)) {
        if (element.StatusId == -1) {
          this.orderitem.filter(x => x.description === element.description)[0].orderQuantity =
            this.orderitem.filter(x => x.description === element.description)[0].orderQuantity +
            element.orderQuantity

          this.orderitem.filter(x => x.description === element.description)[0].complementryQty =
            this.orderitem.filter(x => x.description === element.description)[0].complementryQty +
            element.complementryQty

          this.orderitem.filter(x => x.description === element.description)[0].price =
            this.orderitem.filter(x => x.description === element.description)[0].price -
            element.price
        } else {
          this.orderitem.filter(x => x.description === element.description)[0].orderQuantity =
            this.orderitem.filter(x => x.description === element.description)[0].orderQuantity +
            element.orderQuantity

          this.orderitem.filter(x => x.description === element.description)[0].complementryQty =
            this.orderitem.filter(x => x.description === element.description)[0].complementryQty +
            element.complementryQty

          this.orderitem.filter(x => x.description === element.description)[0].price =
            this.orderitem.filter(x => x.description === element.description)[0].price +
            element.price
        }
      } else {
        this.orderitem.push(element)
      }
    })
    this.orderitem = this.orderitem.filter(x => x.orderQuantity + x.complementryQty > 0)

    this.transactions = this.receipts.transaction.filter(x => x.orderId == id)
    this.receipt = this.receipts.receipts.filter(x => x.id == id)
    console.log(this.transactions)
    if (this.receipt[0] != undefined) {
      this.customer = this.receipts.customers.filter(        
        x => x.id == this.receipt[0].customerId,
      )[0]
      console.log(this.customer)
    }
    if (this.customer == undefined) {
      this.customer = { name: '-', phoneNo: '-', address: '-' }
    }
    for (let i = 0; i < this.transactions.length; i++) {
      this.transactions[i].TransDateTime = moment(this.transactions[i].TransDateTime).format('LLL')
    }
    var st = 0
    for (let i = 0; i < this.orderitem.length; i++) {
      this.Subtotal += this.orderitem[i].orderQuantity > 0 ? this.orderitem[i].totalAmount : 0
      st += this.orderitem[i].orderQuantity > 0 ? this.orderitem[i].totalAmount : 0
      console.log(this.orderitem[i].orderQuantity, this.orderitem[i].totalAmount, st, this.Subtotal)
    }
    this.additionalCharge = 0
    this.AdditionalCharges.forEach(element => {
      this.additionalCharge = this.additionalCharge + element.ChargeAmount
    })
    this.Total =
      this.CGST + this.SGST + this.IGST + this.Subtotal + this.additionalCharge - this.Discount
    this.Total = +this.Total.toFixed(0)
    this.transaction.Amount = this.Total - this.PaidAmount
    this.remaining = this.Total - this.PaidAmount
    this.element = document.getElementById('qqq') as HTMLElement
  }
  Pay() {
    this.transaction.OrderId = this.orderitem[0].OrderId
    this.transaction.CustomerId = this.customer.Id
    if (this.transaction.PaymentTypeId == 5) {
      let tempArray = this.receipts.paymentType.filter(x => x.Price > 0)
      tempArray.forEach(element => {
        if (element.Price > 0) {
          this.transaction.PaymentTypeId = element.Id
          this.transaction.Amount = element.Price
          var postdata = { value: JSON.stringify(this.transaction) }
          this.Auth.transact(postdata).subscribe(data => {
            var preorders = JSON.parse(localStorage.getItem('preOrders'))
            preorders.forEach(element1 => {
              console.log(element1)
              if (element1.OrderId == this.orderitem[0].OrderId) {
                element1.PaidAmount = element1.PaidAmount + element.Price
                localStorage.setItem('preOrders', JSON.stringify(preorders))
              }
            })
            this.getReceipt(0, 'next', 'all', null, null, null)
            this.show = 0
          })
        }
      })
    } else {
      var postdata = { value: JSON.stringify(this.transaction) }
      this.Auth.transact(postdata).subscribe(data => {
        var preorders = JSON.parse(localStorage.getItem('preOrders'))
        preorders.forEach(element1 => {
          if (element1.OrderId == this.orderitem[0].OrderId) {
            element1.PaidAmount = element1.PaidAmount + this.transaction.Amount
            localStorage.setItem('preOrders', JSON.stringify(preorders))
          }
        })
        this.getReceipt(0, 'next', 'all', null, null, null)
        this.show = 0
      })
    }
  }
  cancel(amount) {
    this.transaction.Amount = -amount
    this.transaction.OrderId = this.orderitem[0].OrderId
    this.transaction.CompanyId = this.CompanyId
    this.transaction.CustomerId = this.customer.Id
    var postdata = { value: JSON.stringify(this.transaction) }
    this.Auth.transact(postdata).subscribe(data => {
      console.log(data)
      this.getReceipt(0, 'next', 'all', null, null, null)
      this.show = 0
    })
  }
  openOrderpopup(orderDetail) {
    const modalRef = this.modalService
      .open(orderDetail, {
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
      })
      .result.then(
        result => { },
        reason => { },
      )
  }
  KOTFilter(id) {
    this.KOTItems.AddedItems = this.receipts.orderItems.filter(
      x => x.KOTId == id && x.StatusId != -1,
    )
    this.KOTItems.RemovedItems = this.receipts.orderItems.filter(
      x => x.KOTId == id && x.StatusId == -1,
    )
  }
  print(): void {
    let printContents, popupWin
    printContents = document.getElementById('demo').innerHTML
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto')
    popupWin.document.open()
    popupWin.document.write(`
    <html>
      <head>
        <title>Print tab</title>
        <style>
        @media print {
          app-root > * { display: none; }
          app-root app-print-layout { display: block; }
          .header{
            text-align: center;
          }
          th{
            text-align: left 
        }
          body   { font-family: 'Courier New', Courier, monospace; width: 300px }
          br {
            display: block; /* makes it have a width */
            content: ""; /* clears default height */
            margin-top: 0; /* change this to whatever height you want it */
          }
          hr.print{
            display: block;
            height: 1px;
            background: transparent;
            width: 100%;
            border: none;
            border-top: dashed 1px #aaa;
        } 
        tr.print
          {
            border-bottom: 1px solid #000;;
          }
        }
        </style>
      </head>
  <body onload="window.print();window.close()">${printContents}</body>
    </html>`)
    popupWin.document.close()
  }
  electronPrint() {
    console.log(this.orderitem, this.Discount)
    var element = `<div class="header">
    <p style="text-align: center;font-family: Helvetica;font-size: medium;"><strong>${this.Company
      }</strong></p>
    <p style="text-align: center;font-family: Helvetica;font-size: small;">
    ${this.address}, ${this.city},  ${this.ContactNo}<br>
    GSTIN:${localStorage.getItem('GSTno')}<br>
    Receipt: ${this.orderno}<br>
    ${this.orderedDate}</p>
    <hr>
    </div>
    <table>
        <thead>
            <tr>
                <th style="width: 100px;"><strong>ITEM</strong></th>
                <th><strong>PRICE</strong></th>
                <th><strong>QTY</strong></th>
                <th style="text-align: right;padding-right:20px"><strong>AMOUNT</strong></th>
            </tr>
        </thead>
        <tbody>`
    var Subtotal = 0
    var disc_tax = 0
    this.orderitem.forEach(item => {
      element =
        element +
        `<tr>
      <td style="width: 100px;">${item.description}</td>
      <td>${item.UnitPrice}</td>
      <td>${item.Quantity}${item.ComplementryQty > 0 ? '+' + item.ComplementryQty : ''}</td>
      <td style="text-align: right;padding-right:20px">${this.preferences.ShowTaxonBill
          ? (item.UnitPrice * item.Quantity).toFixed(2)
          : (
            item.UnitPrice *
            item.Quantity *
            (1 + (item.Tax1 + item.Tax2 + item.Tax3) / 100)
          ).toFixed(2)
        }</td>
      </tr>`
      if (!this.preferences.ShowTaxonBill) {
        Subtotal =
          Subtotal +
          item.UnitPrice * item.Quantity * (1 + (item.Tax1 + item.Tax2 + item.Tax3) / 100)
        disc_tax = disc_tax + (this.Discount * (item.Tax1 + item.Tax2 + item.Tax3)) / 100
      }
    })
    element =
      element +
      `
    </tbody>
    </table>
    <hr>
    <table>
        <tbody>
            <tr>
                <td style="width: 100px;"><strong>Subtotal</strong></td>
                <td></td>
                <td></td>
                <td style="text-align: right;padding-right:20px">${this.preferences.ShowTaxonBill ? this.Subtotal.toFixed(2) : Subtotal.toFixed(2)
      }</td>
            </tr>`
    this.AdditionalCharges.forEach(item => {
      element =
        element +
        `<tr">
                                <td style="width: 100px;"><strong>${item.Description}</strong></td>
                                <td></td>
                                <td></td>
                                <td style="text-align: right;padding-right:20px">${item.ChargeAmount.toFixed(
          2,
        )}</td>
                            </tr>`
    })
    if (this.Discount > 0) {
      element =
        element +
        `<tr>
      <td style="width: 100px;"><strong>Discount</strong></td>
      <td></td>
      <td></td>
      <td style="text-align: right;padding-right:20px">${(this.Discount + disc_tax).toFixed(2)}</td>
      </tr>`
    }
    if (this.CGST > 0 && this.preferences.ShowTaxonBill) {
      element =
        element +
        `<tr>
      <td style="width: 100px;"><strong>CGST</strong></td>
      <td></td>
      <td></td>
      <td style="text-align: right;padding-right:20px">${this.CGST.toFixed(2)}</td>
  </tr>`
    }
    if (this.SGST > 0 && this.preferences.ShowTaxonBill) {
      element =
        element +
        `<tr>
      <td style="width: 100px;"><strong>SGST</strong></td>
      <td></td>
      <td></td>
      <td style="text-align: right;padding-right:20px">${this.SGST.toFixed(2)}</td>
  </tr>`
    }

    element =
      element +
      `
            <tr>
                <td style="width: 100px;">Paid</td>
                <td></td>
                <td></td>
                <td style="text-align: right;padding-right:20px"><strong>${(+this.PaidAmount.toFixed(
        0,
      )).toFixed(2)}</strong></td>
            </tr>
            <tr>
                <td style="width: 100px;">Total</td>
                <td></td>
                <td></td>
                <td style="text-align: right;padding-right:20px"><strong>${(+this.Total.toFixed(
        0,
      )).toFixed(2)}</strong></td>
            </tr>
            <tr ${+(this.Total - this.PaidAmount).toFixed(0) == 0 ? 'hidden' : ''}>
                <td style="width: 100px;">Balance</td>
                <td></td>
                <td></td>
                <td style="text-align: right;padding-right:20px"><strong>${(+(
        this.Total - this.PaidAmount
      ).toFixed(0)).toFixed(2)}</strong></td>
            </tr>
        </tbody>
    </table>
    <hr>
    <p style="text-align: center;font-family: Helvetica;">Thankyou. Visit again.</p>
</div>
<style>
  table{
    empty-cells: inherit;
    font-family: Helvetica;
    font-size: small;
    width: 290px;
    padding-left: 0px;
  }
  th{
    text-align: left 
  }
  hr{
    border-top: 1px dashed black
  }
  tr.bordered {
    border-top: 100px solid #000;
    border-top-color: black;
  }
</style>`
    // this.printreceipt()
    this.silentPrint()
  }
  printreceipt() {
    var printtemplate = `
    <div id="printelement">
    <div class="header">
    <h3>${this.loginfo.Company}</h3>
    <p>
        ${this.loginfo.Store}, ${this.loginfo.Address}<br>
        ${this.loginfo.City}, ${this.loginfo.ContactNo}
        GSTIN:${this.loginfo.GSTno}<br>
        Receipt: ${this.orderno}<br>
        ${this.orderedDate}
        </p>
    </div>
    <hr>
    <table class="item-table">
        <thead class="nb">
            <th class="text-left" style="width: 100px;">ITEM</th>
            <th>PRICE</th>
            <th>QTY</th>
            <th class="text-right">AMOUNT</th>
        </thead>
        <tbody>`
    var extra = 0
    this.orderitem.forEach(item => {
      printtemplate += `
      <tr class="nb">
          <td class="text-left">${item.Description}</td>
          <td>${item.UnitPrice}</td>
          <td>${item.Quantity}${item.ComplementryQty > 0 ? '(' + item.ComplementryQty + ')' : ''
        }</td>
          <td class="text-right">${item.Quantity > 0 ? item.TotalAmount.toFixed(2) : 0}</td>
      </tr>`
      extra += item.Extra
    })
    printtemplate += `
    <tr class="bt">
        <td class="text-left"><strong>Sub Total</strong></td>
        <td colspan="2"></td>
        <td class="text-right">${this.Subtotal}</td>
    </tr>
    <tr class="nb" ${this.Discount == 0 ? 'hidden' : ''}>
        <td class="text-left"><strong>Discount</strong></td>
        <td colspan="2"></td>
        <td class="text-right">${this.Discount.toFixed(2)}</td>
    </tr>
    <tr class="nb" ${this.CGST == 0 ? 'hidden' : ''}>
        <td class="text-left"><strong>CGST</strong></td>
        <td colspan="2"></td>
        <td class="text-right">${this.CGST.toFixed(2)}</td>
    </tr>
    <tr class="nb" ${this.SGST == 0 ? 'hidden' : ''}>
        <td class="text-left"><strong>SGST</strong></td>
        <td colspan="2"></td>
        <td class="text-right">${this.SGST.toFixed(2)}</td>
    </tr>`
    this.AdditionalCharges.forEach(charge => {
      printtemplate += `
          <tr class="nb">
              <td class="text-left"><strong>${charge.Description}</strong></td>
              <td colspan="2"></td>
              <td class="text-right">${charge.ChargeAmount.toFixed(2)}</td>
          </tr>`
    })
    printtemplate += `
          <tr class="nb" ${extra > 0 ? '' : 'hidden'}>
              <td class="text-left"><strong>Extra</strong></td>
              <td colspan="2"></td>
              <td class="text-right">${(+extra.toFixed(0)).toFixed(2)}</td>
          </tr>
          <tr class="nb">
              <td class="text-left"><strong>Paid</strong></td>
              <td colspan="2"></td>
              <td class="text-right">${(+this.PaidAmount.toFixed(0)).toFixed(2)}</td>
          </tr>
          <tr class="nb">
              <td class="text-left"><strong>Total</strong></td>
              <td colspan="2"></td>
              <td class="text-right">${(+(this.Total + extra).toFixed(0)).toFixed(2)}</td>
          </tr>
          <tr class="nb" ${this.Total + extra - this.PaidAmount > 0 ? '' : 'hidden'}>
              <td class="text-left"><strong>Balance</strong></td>
              <td colspan="2"></td>
              <td class="text-right">${(+(this.Total + extra - this.PaidAmount).toFixed(0)).toFixed(
      2,
    )}</td>
          </tr>
        </tbody>
      </table>
      <hr>
      <div class="text-center">
        <p>Powered By Biz1Book.</p>
      </div>
    </div>`

    printtemplate += this.printhtmlstyle
    console.log(printtemplate)
    if (this.printersettings)
      this.printservice.print(printtemplate, [this.printersettings.receiptprinter])
  }
  silentPrint() {
    let printer
    let silent_printer = {
      id: 'ddfcabca-acbc-4617-8c55-0b1646d03d57',
      name: 'EPSON TM-T82 ReceiptSA4',
      type: 'silentPrint',
      size: '80mm',
      config: {
        bluetoothPrint: {},
        networkPrint: {
          port: 9100,
          noOfCharactersInLine: 47,
          ip: '192.168.1.253',
        },
        silentPrint: {
          connectedPrinterName: 'EPSON TM-T82 ReceiptSA4',
        },
        airPrint: {},
      },
    }
    // // if (this.electron.isElectronApp) {
    // //   printer = this.electron.remote.require('./assets/printer_helper/printer')
    // // }
    // this.electron.remote.getGlobal('fastPrint')(
    //   this.getReceiptCommands(JSON.parse(this.orderjson), 47, {}),
    // )
    // let connectedPrinter = {
    //   data: this.getReceiptCommands(JSON.parse(this.orderjson), 47, printer),
    //   printer: silent_printer.config.silentPrint.connectedPrinterName, // uniquePrinter.config.silentPrint.connectedPrinterName, // printer name, if missing then will print to default printer
    //   type: 'RAW', // type: RAW, TEXT, PDF, JPEG, .. depends on platform,
    //   success: function(jobID) {
    //     console.log('sent to printer with ID: ' + jobID)
    //     // resolve('Successfully printed the receipt details');
    //   },
    //   error: function(err) {
    //     console.log(err)
    //   },
    // }

    this.printservice.silentPrintReceipt(JSON.parse(this.orderjson), [
      this.printersettings.receiptprinter,
    ])
  }
  // @ViewChild('editcustomer', { static: false }) public editcustomer: TemplateRef<any>

  savetransaction(payload) {
    this.Auth.edittransaction(payload).subscribe(data => {
      console.log(data)
    })
  }

  selectToday() {
    this.model = this.calendar.getToday()
  }
  onDateSelection(date: NgbDate, datepicker) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date
      this.strdate = this.formatter.format(this.fromDate)
    } else if (
      this.fromDate &&
      !this.toDate &&
      (date.after(this.fromDate) || date.equals(this.fromDate))
    ) {
      this.toDate = date
      this.enddate = this.formatter.format(this.toDate)
    } else {
      this.toDate = null
      this.fromDate = date
      this.strdate = this.formatter.format(this.fromDate)
    }
    if (this.fromDate && this.toDate) {
      this.strdate = this.formatter.format(this.fromDate)
      this.enddate = this.formatter.format(this.toDate)
      datepicker.toggle()
      this.getReceipt(
        0,
        'next',
        'all',
        this.formatter.format(this.fromDate),
        this.formatter.format(this.toDate),
        null,
      )
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    )
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate)
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    )
  }

  getReceiptCommands(receipt, numberOfCharacters, receiptPrinter) {
    console.log('numberOfCharacters: ', numberOfCharacters)
    let printBillDate = moment(receipt.OrderedDateTime).format('LLL') //this.datepipe.transform(receipt.details.createdAt, 'MMM dd, y') + ' at ' + this.datepipe.transform(receipt.details.createdAt, 'hh:mm a');
    let highestItemPrice = this.getHighestItemPrice(receipt.Items)
    let total = receipt.BillAmount.toFixed(2)
    let itemsSecondColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 2.25 : 2)
    let itemsThirdColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 3.75 : 3.5)
    let paymentSectionColumn = numberOfCharacters / (receiptPrinter.size === '58mm' ? 1.4 : 1.3)
    let cutIndex = receiptPrinter.size === '58mm' ? 10 : 20
    let lineBreak = '--------------------------------------------------------------'
    let command = '\u001B' + '@' + '\u001B' + 'E' + '\u0001' //Initialize
    command += '\u001B' + 'a' + '\u0001' + 'FB Cakes n Sweets' + '\n' + '\u000A' //Company Name
    command +=
      '\u001B' +
      'a' +
      '\u0001' +
      'Karapakkam, OMR Road, Chennai, \n9600888834\nGSTIN:Q4A5D8W6AS' +
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
      let name = item.showname // ? item.displayName : item.name;
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
}
