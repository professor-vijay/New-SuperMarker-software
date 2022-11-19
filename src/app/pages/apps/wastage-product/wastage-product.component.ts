import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service'

@Component({
  selector: 'app-wastage-product',
  templateUrl: './wastage-product.component.html',
  styleUrls: ['./wastage-product.component.scss']
})
export class WastageProductComponent implements OnInit {

  loginfo
  CompanyId: any
  StoreId: any
  wastage: any

  constructor(private Auth: AuthService) { }

  ngOnInit(): void {

    this.Auth.getdbdata(['loginfo']).subscribe(data => {
      this.loginfo = data['loginfo'][0]
      this.CompanyId = this.loginfo.companyId
      this.StoreId = this.loginfo.storeId
      console.log(this.loginfo)
      this.getwastages()
    })
  }

  expiaryprod: []

  getwastages() {
    this.Auth.getwastage(this.loginfo.companyId).subscribe(data => {
      this.wastage = data["wastage"]
      this.expiaryprod = this.wastage
      console.log(this.wastage)
    })
  }

  term: string = '';

  filteredvalues = [];
  filtersearch(): void {
    this.expiaryprod = this.term
      ? this.wastage.filter(x => x.name.toLowerCase().includes(this.term.toLowerCase()))
      : this.wastage;
    console.log(this.expiaryprod)
  }



}
