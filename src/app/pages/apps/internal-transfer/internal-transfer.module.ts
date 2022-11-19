import { ɵSafeHtml } from '@angular/core'
import { SafeHtml } from '@angular/platform-browser'
import moment from 'moment'
export class OrderModule {
    Id: number
    Updated: boolean = false;
    OrderNo: number;
    InvoiceNo: number;
    AggregatorOrderId: string;
    StoreId: number;
    OrderStatusId: number;
    PreviousStatusId: number;
    BillAmount: number;
    RefundAmount: number;
    Source: string;
    Tax1: number;
    Tax2: number;
    Tax3: number;
    BillStatusId: number;
    DiscPercent: number;
    DiscAmount: number;
    IsAdvanceOrder: boolean = false;
    CustomerData: string;
    OrderedDateTime: string;
    OrderedDate: string;
    OrderId: number
    DeliveryDateTime: string;
    BillDateTime: string;
    BillDate: string;
    OrderStatusDetails: OrderstatusDetails;
    RiderStatusDetails: string;
    Closed: boolean = false;
    OrderJson: string;
    ItemJson: string;
    ChargeJson: string;
    ModifiedDate: string;
    CompanyId: number;
    OrderType: number;
    CreatedDate: string;
    SuppliedById: number;
    OrderedById: number;
    SpecialOrder: boolean = false;
    WipStatus: string;
    ProdStatus: string;
    Items: Array<OrderItemModule>;
    OrderDetail: Array<OrderItemDetailModule>;
    Subtotal: number
    TaxAmount: number
    BatchNo: number
    OrderStatus: number
    constructor(ordertype) {
        this.Items = [];
        this.OrderDetail = [];
        this.Updated = false;
        this.OrderNo = 0;
        this.InvoiceNo = 0;
        this.AggregatorOrderId = '';
        this.StoreId = 0;
        this.OrderStatusId = 0;
        this.PreviousStatusId = 0;
        this.BillAmount = 0;
        this.RefundAmount = 0;
        this.Source = "";
        this.Tax1 = 0;
        this.Tax2 = 0;
        this.Tax3 = 0;
        this.BillStatusId = 0;
        this.DiscPercent = 0;
        this.DiscAmount = 0;
        this.IsAdvanceOrder = false;
        this.CustomerData = '';
        this.OrderedDateTime = '';
        this.OrderedDate = '';
        this.DeliveryDateTime = '';
        this.BillDateTime = '';
        this.BillDate = '';
        this.OrderStatusDetails = new OrderstatusDetails();
        this.RiderStatusDetails = '';
        this.Closed = false;
        this.OrderJson = '';
        this.ItemJson = '';
        this.ChargeJson = '';
        this.ModifiedDate = '';
        this.CompanyId = 0;
        this.OrderType = ordertype;
        this.CreatedDate = '';
        this.SuppliedById = 0;
        this.OrderedById = 0;
        this.OrderId = 0
        this.OrderStatus = 1;
        this.SpecialOrder = false;
        this.WipStatus = '';
        this.ProdStatus = '';

    }
    addproduct(product) {
        console.log(product)
        this.Items.push(new OrderItemModule(product))
        this.OrderDetail.push(new OrderItemDetailModule(product))
        this.setbillamount()
    }
    setbillamount() {
        this.BillAmount = 0;
        this.DiscAmount = 0;
        this.Subtotal = 0
        this.TaxAmount = 0
        this.Tax1 = 0
        this.Tax2 = 0
        this.Tax3 = 0
        console.log(this.Items)
        this.Items.forEach(item => {
            item.TotalAmount = item.Price * item.OrderQuantity
            if (item.IsInclusive) {
                item.TotalAmount = item.TotalAmount - item.TotalAmount * (item.Tax1 + item.Tax2 + item.Tax3) / 100
            }
            item.TaxAmount1 = item.Tax1 * item.TotalAmount / 100
            item.TaxAmount2 = item.Tax2 * item.TotalAmount / 100
            item.TaxAmount3 = item.Tax3 * item.TotalAmount / 100
            item.TaxAmount = item.TaxAmount1 + item.TaxAmount2 + item.TaxAmount3
            this.Subtotal += item.TotalAmount
            this.Tax1 += item.TaxAmount1
            this.Tax2 += item.TaxAmount2
            this.Tax3 += item.TaxAmount3
            this.TaxAmount += item.TaxAmount
            this.DiscAmount += item.DiscAmount
        })
        this.BillAmount = this.Subtotal + this.Tax1 + this.Tax2 + this.Tax3 - this.DiscAmount
        this.BillAmount = +this.BillAmount.toFixed(2)
    }
}

export class OrderItemModule {
    Id: number
    ProductName: string
    Updated: boolean = false;
    DiscPercent: number;
    DiscAmount: number;
    Status: number;
    StatusId: number;
    Note: string;
    Message: string;
    TotalAmount: number;
    OptionJson: string;
    OrderItemId: number;
    OrderId: number;
    ProductId: number;
    OrderQuantity: number;
    DispatchedQuantity: number;
    ReceivedQuantity: number;
    Price: number;
    TaxAmount: number;
    Tax1: number;
    Tax2: number
    Tax3: number;
    Tax4: number;
    Amount: number;
    CreatedDate: string;
    BillId: number;
    OldStock: number;
    CompanyId: number;
    VarianceReasonStr: string
    VarianceReasonDesc: string;
    BarcodeId: number;
    TaxAmount1: number;
    TaxAmount2: number;
    TaxAmount3: number;
    IsInclusive: boolean;
    RefId: string;
    constructor(product) {
        console.log(product)
        this.Id = 0;
        this.Updated = false;
        this.DiscPercent = 0;
        this.Status = 0;
        this.StatusId = 0;
        this.Note = '';
        this.Message = '';
        this.TotalAmount = 0;
        this.OptionJson = '';
        this.OrderItemId = 0;
        this.OrderId = 0;
        this.DispatchedQuantity = product.quantity;
        this.ReceivedQuantity = 0;
        this.TaxAmount = 0;
        this.Amount = 0;
        this.BillId = 0;
        this.OldStock = 0;
        this.CompanyId = 0;
        this.BarcodeId = product.barcodeId;
        this.DiscAmount = product.DiscAmount;
        this.ProductName = product.product
        this.ProductId = product.productId;
        this.OrderQuantity = product.Quantity;
        this.DispatchedQuantity = product.Quantity;
        this.ReceivedQuantity = product.Quantity;
        this.Price = product.price;
        this.Tax1 = product.tax1;
        this.Tax2 = product.tax2;
        this.Tax3 = product.tax3;
        this.Tax4 = 0;
        this.IsInclusive = product.isInclusive;
        this.RefId = product.productId + moment().format('YYYY-MM-DD HH:MM A');
    }
}
export class OrderItemDetailModule {
    OrderItemDetailId: number;
    Id: number;
    ActualProdId: number;
    BatchId: number;
    StockBatchId: number;
    OrdProdType: number;
    StorageStoreId: number;
    ContatinerId: number;
    Quantity: number;
    UnitPrice: number;
    Tax1: number;
    Tax2: number;
    Amount: number;
    TaxAmount: number;
    Date: string;
    DateTime: string;
    RelatedOrderId: string;
    CreatedDate: string;
    DiscAmount: number;
    DiscPercent: number;
    DiscPerQty: number;
    CompanyId: number;
    OrderItemRefId: string;
    constructor(product) {
        this.StockBatchId = product.stockBatchId
        this.OrderItemDetailId = 0;
        this.Id = 0;
        this.ActualProdId = 0;
        this.BatchId = 0;
        this.OrdProdType = 0;
        this.StorageStoreId = 0;
        this.Quantity = product.Quantity;
        this.UnitPrice = product.price;
        this.Tax1 = product.tax1;
        this.Tax2 = product.tax2;
        this.Amount = 0;
        this.TaxAmount = 0;
        this.Date = '';
        this.DateTime = '';
        this.RelatedOrderId = '';
        this.CreatedDate = '';
        this.BatchId = 0;
        this.DiscAmount = 0;
        this.DiscPercent = 0;
        this.DiscPerQty = 0;
        this.ActualProdId = product.productId;
        this.CompanyId = 0;
        this.OrderItemRefId = product.productId + moment().format('YYYY-MM-DD HH:MM A');
    }
}
export class CustomerModule {
    Id: number;
    Name: string;
    Email: string;
    PhoneNo: string;
    Address: string;
    City: string;
    PostalCode: number;
    googlemapurl: string;
    CompanyId: number;
    StoreId: number;
    Sync: number;
    val: number;
    constructor() {
        this.Id = null;
        this.Name = "";
        this.Email = "";
        this.PhoneNo = "";
        this.Address = "";
        this.City = "";
        this.PostalCode = null;
        this.googlemapurl = "";
        this.CompanyId = 0;
        this.StoreId = 0;
        this.Sync = 0;
    }
}

export class OrdModule {
    SuppliedById: number;
    OrderedById: number;
    DelivDateTime: string;
    OrderedDateTime: string;
    OrderType: number;
    OrderStatus: number;
    DispatchStatus: number;
    ReceiveStatus: number;
    CompanyId: number;
    CancelStatus: number;
    OrderedDate: string;
    createdBy: number;
    refId: number;
    constructor() {
        this.OrderedById = null;
        this.SuppliedById = null;
        this.DelivDateTime = "";
        this.OrderedDateTime = "";
        this.OrderType = null;
        this.OrderStatus = null;
        this.DispatchStatus = null;
        this.ReceiveStatus = null;
        this.CompanyId = 0;
        this.CancelStatus = 0;
        this.OrderedDate = "";
        this.refId = 0;
    }
}


export class DelModule {
    compId: number;
    Items: [];
    draft: string;
    orderJson: [];
    Id: number;
    ordItemId: number;
    ItemDetail: [];
    constructor(compId, finArr, date, data, OrdDetail) {
        this.compId = compId;
        this.Items = finArr;
        this.draft = date;
        this.orderJson = data;
        this.Id = 0;
        this.ItemDetail = OrdDetail;
        this.ordItemId = 0;
    }
}

export class OrderstatusDetails {

    previousstatusid: number;
    orderstatusid: number;

    constructor() {
        this.previousstatusid = 0
        this.orderstatusid = 1

    }
}
