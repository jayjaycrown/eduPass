import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController, NavController, LoadingController, Platform } from '@ionic/angular';

import { ListService } from '../list.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';

import pdfmake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfmake.vfs = pdfFonts.pdfMake.vfs;



@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.page.html',
  styleUrls: ['./list-item.page.scss'],
})
export class ListItemPage implements OnInit {
  id: any;
  list: any;
  items: any;
  data: any;
  pdfMaker: any;
  itemRef: any;

  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private listService: ListService,
    private toast: ToastController,
    private barcodeScanner: BarcodeScanner,
    private plt: Platform,
    private file: File,
    private fileOpener: FileOpener
    ) {


  }

  autoRefresh() {
    this.ngOnInit();
  }
  doRefresh(event) {
    console.log('Begin async operation');
    this.ngOnInit();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  async getItems(id) {
    (await this.listService.getItemUnderList(id)).subscribe(res => {
      this.items = res;
    });
  }

  async getItemss(id) {
    (await this.listService.getItemUnderLists(id)).subscribe(res => {
      this.itemRef = res;
    });
  }

  getListDetail(id) {
    this.listService.getList(id).then(data => {
      this.list = data;
    });
  }
  addItem(data, id) {
    this.listService.addItem(data, id).then(_ => {
      // alert(JSON.stringify(res));
      this.autoRefresh();
    }).catch(err => {
      alert(err);
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (!params.has('listId')) {
        this.navCtrl.navigateBack('/home/tabs/lists');
      }
      this.id = params.get('listId');
      // alert('id: ' + this.id);
      this.loadingCtrl.create({
        keyboardClose: true,
        message: `
                <div class="custom-spinner-container">
                  <div class="custom-spinner-box"></div>
                </div>`
      }).then(loadingEl => {
        loadingEl.present();
        this.getListDetail(this.id);
        this.getItems(this.id);
        this.getItemss(this.id);
        loadingEl.dismiss();
      });
    });
  }
  scan() {
    this.data = null;
    this.barcodeScanner.scan(
      {
        showFlipCameraButton: true,
        showTorchButton: true,
      }
    ).then(barcodeData => {
       this.data = barcodeData.text;
       if (this.data) {
        this.route.paramMap.subscribe(res => {
          this.id = res.get('listId');
        });
        this.loadingCtrl.create({
          message: `
                <div class="custom-spinner-container">
                  <div class="custom-spinner-box"></div>
                </div>`
        }).then(loadingEl => {
          loadingEl.present();
          this.addItem(this.data, this.id);
          loadingEl.dismiss();
        });
      }

    }).catch(err => {
      console.log('Error', err);
    });
  }


delete(id) {
  this.listService.deleteItem(id).then(async (res) => {
    this.autoRefresh();
    const toast = await this.toast.create({
      message: 'List deleted',
      duration: 2500
    });
    toast.present();
  }).catch(err => {
    alert(err);
  });
  }

  createPdf() {

    function buildTableBody(data, columns) {
      const body = [];

      body.push(columns);

      data.forEach((row) => {
        const dataRow = [];

        columns.forEach((column) => {
          dataRow.push(row[column].toString());
        });

        body.push(dataRow);
      });

      return body;
    }

    function table(data, columns) {
      return {
        style: 'tableExample',
        table: {
          widths: [100, 300],
          headerRows: 1,
          body: buildTableBody(data, columns),
        }
      };
    }

    const docDefinition = {
      content: [
        { text: this.list.title, style: 'header' },
        { text: this.list.description, style: 'subheader' },

        table(this.itemRef, ['S/N', 'Content'])
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      },
    };

    this.pdfMaker = pdfmake.createPdf(docDefinition);

  }
  downloadPdf() {
    if (this.plt.is('capacitor') || this.plt.is('cordova')) {
      this.pdfMaker.getBuffer((buffer) => {
        const utf8 = new Uint8Array(buffer);
        const binaryArray = utf8.buffer;
        const blob = new Blob([binaryArray], { type: 'application/pdf' });

        this.file.writeFile(this.file.dataDirectory, 'ScannedList.pdf', blob, { replace: true }).then(fileEntry => {
          this.fileOpener.open(this.file.dataDirectory + 'ScannedList.pdf', 'application/pdf');
        });
      });
    }
    else {
      this.pdfMaker.download();
    }
  }

}
