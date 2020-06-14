import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';


import { ListService } from '../list/list.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnInit {
  data: any;
  listsItems;
  constructor(private list: ListService, private barcodeScanner: BarcodeScanner) { }
  scan() {
    this.data = null;
    this.barcodeScanner.scan(
      {
        showFlipCameraButton: true, // iOS and Android
        showTorchButton: true, // iOS and Android
        saveHistory: true, // Android, save scan history (default false)
      }
    ).then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.data = barcodeData;
      alert(this.data);
    }).catch(err => {
      console.log('Error', err);
    });
  }

  ngOnInit() {
    // this.list.getDatabaseState().subscribe(ready => {
    //   if (ready) {
    //     this.list.getItems().subscribe(items => {
    //       this.listsItems = items;
    //     });
    //   }
    // });
  }
  addToList() {
   // this.list.addItem().then()
  }
  delete(){}

}
