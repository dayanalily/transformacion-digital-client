import { Component, OnInit } from '@angular/core';
import { HistoryService } from './history.service';
import { AdressService } from '../adress/adress.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  listAddressTransfers: any = [];
  constructor(private historyService: HistoryService, private addressService: AdressService) { }

  ngOnInit(): void {
    this.getHistory();
  }
  getHistory() {
    this.historyService.searchTransferHistory().subscribe(data => {
      data.forEach(element => {
        this.getAddres(element)
      });
    })
  }

  async getAddres(rowHistory) {
    await this.addressService.searchAdressById(rowHistory.idAddressee).subscribe(data => {

      const returnedTarget = Object.assign(rowHistory, data);
      this.listAddressTransfers.push(returnedTarget)

      return
    })
  }
}
