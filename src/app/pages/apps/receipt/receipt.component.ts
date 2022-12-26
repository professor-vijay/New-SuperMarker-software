import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap'
import { AuthService } from 'src/app/auth.service'
import {
  NgbDate,
  NgbDateStruct,
  NgbCalendar,
  NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap'
import * as moment from 'moment'

import { PrintService } from 'src/app/services/print/print.service'
@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss'],
})
export class ReceiptComponent implements OnInit {
  @ViewChild('items_modal', { static: false }) private items_modal: ElementRef

  loginfo: any = {}
  roleid: number = 0
  preferences: any = {}
  printersettings: any = {}
  invoices: any = []
  model: NgbDateStruct
  hoveredDate: NgbDate | null = null
  CompanyId: number = 0
  StoreId: number = 0
  invoiceid: string = ''
  fromDate: NgbDate
  toDate: NgbDate | null = null
  strdate: string
  enddate: string
  startid: number = 0
  endid: number = 0
  firstid: number = 0
  lastid: number = 0
  dateRange = []
  total: number = 0
  paid: number = 0
  paymenttypes
  mode: string = 'VIEW_LIST'
  invoice: any

  orderstatus = {
    '-1': { name: 'Cancelled', class: 'danger' },
    '0': { name: 'Placed', class: 'warning' },
    '1': { name: 'Accepted', class: 'warning' },
    '2': { name: 'Preparing', class: 'warning' },
    '3': { name: 'FoodReady', class: 'warning' },
    '4': { name: 'Dispatched', class: 'dark' },
    '5': { name: 'Delivered', class: 'success' },
  }
  constructor(
    private auth: AuthService,
    private modalService: NgbModal,
    private calendar: NgbCalendar,
    private printservice: PrintService,
    public formatter: NgbDateParserFormatter,
  ) {
    // var loginfo = JSON.parse(localStorage.getItem('logInfo'))
    // this.roleid = loginfo.RoleId
    this.fromDate = calendar.getToday()
    this.toDate = calendar.getToday()
  }

  ngOnInit(): void {
    this.getData()
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

      this.strdate = this.formatter.format(this.fromDate)
      this.strdate = this.formatter.format(this.toDate)
      this.startid = 0
      this.endid = 0
      this.invoiceid = ''
      this.getInvoices()
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
  getData() {

    this.auth.getdbdata(['loginfo', 'printersettings', 'paymenttypes']).subscribe(
      data => {
        this.preferences = data['preferences']
        this.loginfo = data['loginfo'][0]
        this.printersettings = data['printersettings'][0]
        this.CompanyId = this.loginfo.companyId
        this.StoreId = this.loginfo.storeId
        this.paymenttypes = data['paymenttypes']
        console.log(this.paymenttypes)
        this.strdate = moment().format('YYYY-MM-DD')
        this.enddate = moment().format('YYYY-MM-DD')
        this.startid = 0
        this.endid = 0
        this.invoiceid = ''
        this.getInvoices()

      })

    // this.auth.getdbdata([ 'loginfo', 'printersettings', 'paymenttypes'])
    //   .subscribe(data => {
    //     console.log(data)      
    //     this.logInfo = data['loginfo'][0]
    //     this.printersettings = data['printersettings'][0]
    //     this.companyId = this.logInfo.companyId
    //     this.storeId = this.logInfo.storeId
    //     this.strdate = moment().format('YYYY-MM-DD')
    //     this.enddate = moment().format('YYYY-MM-DD')
    //     this.startid = 0
    //     this.endid = 0
    //     this.invoiceid = ''
    //     this.getInvoices()
    //   })
    this.preferences = JSON.parse(localStorage.getItem('preferences'))
    this.printservice.getData()
  }

  selectInvoice(invoice) {
    this.invoice = invoice
    this.mode = 'VIEW_INVOICE'
    console.log(this.invoice)
  }

  getbyInvoice(invoice) {
    this.strdate = this.formatter.format(this.fromDate)
    this.strdate = this.formatter.format(this.toDate)
    this.startid = 0
    this.endid = 0
    this.invoiceid = invoice
    console.log(this.invoiceid)
    this.getInvoices()
  }


  KOT = null
  viewItems(kot) {
    this.KOT = kot
    this.modalService.open(this.items_modal)
  }

  // print(invoice) {
  //   if (invoice.Source == 'POS') {
  //     this.printservice.posReceipt(invoice, [this.printersettings.receiptprinter])
  //   } else if (invoice.Source == 'UP') {
  //     this.printservice.upReceipt(invoice, [this.printersettings.receiptprinter])
  //   }
  // }

  clear() {
    this.invoiceid = ''
    this.getInvoices()
  }

  cancelorder(invoice) {
    invoice.OrderStatusId = -1
    this.auth.cancelorder(invoice.Id, invoice).subscribe(data => {
      console.log(data)
      this.getInvoices()
    })
  }

  next() {
    this.startid = this.invoices.length > 0 ? this.invoices[this.invoices.length - 1].Id : 0
    this.endid = 0
    if (this.startid > this.firstid) {
      this.getInvoices()
    }
  }

  previous() {
    this.startid = 0
    this.endid = this.invoices.length > 0 ? this.invoices[0].Id : 0
    if (this.endid < this.lastid) {
      this.getInvoices()
    }
  }



  onChange(result: Date): void {
    console.log('onChange: ', result)
    this.strdate = moment(result[0]).format('YYYY-MM-DD')
    this.enddate = moment(result[1]).format('YYYY-MM-DD')
    this.getInvoices()
    // this.gettrans()
  }

  timeout: any = null
  term
  onKeySearch() {
    clearTimeout(this.timeout)
    var $this = this
    this.timeout = setTimeout(function () {
      $this.search()
    }, 500)
  }
  search() {
    if (this.term == '' || this.term == null) {
      this.invoices = this.receipt
    } else {
      this.invoices = this.receipt.filter(x =>
        x.InvoiceNo.toLowerCase().includes(this.term.toLowerCase()),
        console.log(this.invoices)
      )
    }
  }
  receipt = []
  getInvoices() {
    this.auth
      .GetReceipts(
        this.loginfo.companyId,
        this.loginfo.storeId,
        this.strdate,
        this.enddate,
        this.startid,
        this.endid,
        this.invoiceid,
      )
      .subscribe(data => {
        console.log(data)
        const pos_icon = './assets/images/favicon.png'
        const swi_icon = './assets/images/swiggy.svg'
        const zom_icon = './assets/images/zomato.svg'

        this.total = 0
        this.paid = 0
        if (data['invoices'].length) {
          console.log(data)
          this.firstid = data['invoices'][0].firstid
          this.lastid = data['invoices'][0].lastid
        }
        this.invoices = this.receipt
        this.invoices = data['invoices'].map(x => {
          console.log(x.invoiceNo, x.orderStatusId)
          // this.total += x.BillAmount
          // this.paid += x.PaidAmount

          let obj = {
            BillAmount: x.billAmount,
            Id: x.id,
            InvoiceNo: x.invoiceNo,
            OrderNo: x.orderNo,
            OrderedDateTime: x.orderedDateTime,
            OrderStatusId: x.orderStatusId,
            PaidAmount: x.paidAmount,
            Source:
              x.Source == null
                ? 'POS'
                : x.Source == 'zomato'
                  ? 'UP'
                  : x.Source == 'swiggy'
                    ? 'UP'
                    : 'FB',
            SourceId: x.sourceId,
            transactions: JSON.parse(x.transactions),
            icon:
              x.Source == null
                ? pos_icon
                : x.Source == 'zomato'
                  ? zom_icon
                  : x.Source == 'swiggy'
                    ? swi_icon
                    : null,
            statusname: this.orderstatus[x.orderStatusId.toString()].name,
            statusclass: this.orderstatus[x.orderStatusId.toString()].class,
            payment_status:
              x.billAmount == x.paidAmount
                ? 'Paid'
                : x.billAmount > x.paidAmount
                  ? 'Pending'
                  : 'Refundable',
            payment_class:
              x.billAmount == x.paidAmount
                ? 'success'
                : x.billAmount > x.paidAmount
                  ? 'warning'
                  : 'danger',
          }
          console.log(this.orderstatus, this.orderstatus[x.orderStatusId.toString()].name)
          try{
            obj = { ...JSON.parse(x.orderJson), ...obj }
          } catch(error) {}
          obj.OrderStatusId = x.orderStatusId
          obj.payment_status = obj.OrderStatusId == -1 ? 'Refunded' : obj.payment_status
          obj.payment_class = obj.OrderStatusId == -1 ? 'danger' : obj.payment_class
          console.log(obj)
          return obj
        })
        this.total = data['tot_sales'][0]['tot_sales']
        this.paid = data['tot_sales'][0]['tot_pays']
        this.total = +this.total.toFixed(2)
        this.paid = +this.paid.toFixed(2)
        this.mode = 'VIEW_LIST'
        console.log(this.invoices)
      })
  }
}
