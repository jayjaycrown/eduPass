import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListItemPageRoutingModule } from './list-item-routing.module';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClientModule } from '@angular/common/http';
import { ListItemPage } from './list-item.page';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListItemPageRoutingModule,
    HttpClientModule,
  ],
  providers: [
    SQLite,
    SQLitePorter,
    BarcodeScanner
  ],
  declarations: [ListItemPage]
})
export class ListItemPageModule {}
