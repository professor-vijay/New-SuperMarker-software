import { Component, OnInit, TemplateRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import * as moment from 'moment'
import { FormControl, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal'
import { NgbModal, ModalDismissReasons, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap'
import { AuthService } from 'src/app/auth.service';
import { NzNotificationService } from 'ng-zorro-antd'
import { merge, Observable, Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { OrderItemModule, OrderModule, DispatchModule } from './dispatch-item.module';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Location } from '@angular/common';


@Component({
  selector: 'app-dispatch-items',
  templateUrl: './dispatch-items.component.html',
  styles: [
    `
      button {
        margin-bottom: 16px;
      }

      .editable-cell {
        position: relative;
      }

      .editable-cell-value-wrap {
        padding: 5px 12px;
        cursor: pointer;
      }

      .editable-row:hover .editable-cell-value-wrap {
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        padding: 4px 11px;
      }
    `,
  ],
})
export class DispatchItemsComponent implements OnInit {
  @ViewChild('instance', { static: true }) instance: NgbTypeahead
  @ViewChild('quantityel', { static: false }) public quantityel: TemplateRef<any>;//productinput
  @ViewChild('discper', { static: false }) public discperel: TemplateRef<any>;
  @ViewChild('disc', { static: false }) public discel: TemplateRef<any>;
  // @ViewChild('instance2', { static: true }) instance2: NgbTypeahead
  @ViewChild('productautocomplete', { static: false }) public productinput: TemplateRef<any>;
  @ViewChild('scrollframe', { static: false }) scrollFrame: ElementRef;

  isShown = true;
  isDisp = false;
  popupData: any = [];
  StoreId: any
  CompanyId:any
  supplier: any
  receiver: any
  loginfo
  OrdDispData:any
  tabledata: []
  stores: any = [];

  constructor(
    private modalService: NgbModal,
    private Auth: AuthService,
    private notification: NzNotificationService,
    private router: Router,
    private _avRoute: ActivatedRoute,
    public location: Location) {

    // this.OrdId = this._avRoute.snapshot.params["id"];

  }





  formatterreceiver = (x: { name: string }) => x.name;


  ngOnInit(): void {

    this.Auth.getdbdata(['loginfo']).subscribe(data => {
      this.loginfo = data['loginfo'][0]
      this.StoreId = this.loginfo.storeId
      this.CompanyId = this.loginfo.companyId
      console.log(this.loginfo)
      
      this.getdispatch()
    })


  }
  
  getdispatch() {
    this.Auth.getdispatchedorder(this.StoreId, this.loginfo.companyId).subscribe(data => {
      this.OrdDispData = data["order"];
      this.tabledata = this.OrdDispData
      console.log(this.OrdDispData)
      // this.StoreByidInternal(0)
    })
  }

  // StoreByidInternal(storeId) {
  //   this.Auth.getstoreIdInternal(this.loginfo.companyId, storeId).subscribe(data => {
  //     const stores = data['storeList']
  //     console.log(stores)
  //     this.OrdDispData.forEach(order => {
  //       order.supplier = stores.filter(x => x.id == order.suppliedById)[0]?.name
  //       order.receiver = stores.filter(x => x.id == order.orderedById)[0]?.name
  //     })
  //     console.log(this.OrdDispData)
  //   })
  // }

  // getStoreList() {
  //   this.Auth.getstores(this.CompanyId).subscribe(data => {
  //     this.stores = data
  //     console.log(this.stores)
  //   })
  // }


  orders: any = null

  parseOrder(json_string, modalRef) {
    this.orders = JSON.parse(json_string)
    console.log(this.orders)
    this.openDetailpopup(modalRef)
  }

  openDetailpopup(contentdetail) {
    const modalRef = this.modalService
      .open(contentdetail, {
        ariaLabelledBy: "modal-basic-title",
        centered: true
      })
      .result.then(
        result => {
        },
        reason => {
        }
      );
  }

  OredId: number = 0
  OrderDetail: any = null
  getorderid(OredId, modalRef) {
    this.Auth.getreceivebyid(OredId).subscribe(data => {
      this.popupData = data
      this.popupData.receipts.forEach(rec => {
        rec.itemDetails = JSON.parse(rec.itemJson)
        console.log(JSON.parse(rec.itemJson))
      });
      this.OrderDetail = this.popupData.receipts[0]
      console.log(this.popupData)
      this.openDetailpopup(modalRef)
    })
  }




}
