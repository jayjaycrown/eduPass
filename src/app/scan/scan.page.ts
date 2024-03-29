import { Component, OnInit } from "@angular/core";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";

import { ListService } from "../list/list.service";
import { Observable } from "rxjs";
import { Subscription } from "rxjs";
import { LoadingController } from "@ionic/angular";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-scan",
  templateUrl: "./scan.page.html",
  styleUrls: ["./scan.page.scss"],
})
export class ScanPage implements OnInit {
  data: any;
  message = "";
  item: any;
  nostudent;
  mainForm: FormGroup;
  listsItems: Observable<any[]>;
  private scanSub: Subscription;
  constructor(
    private list: ListService,
    private barcodeScanner: BarcodeScanner,
    private loadingCtrl: LoadingController,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.mainForm = new FormGroup({
      stid: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
    });
  }

  scan() {
    this.data = null;
    this.message = null;
    this.barcodeScanner
      .scan({
        showFlipCameraButton: true,
        showTorchButton: true,
      })
      .then((barcodeData: any) => {
        this.data = barcodeData.text;
        // alert(this.data);
        if (this.data) {
          this.loadingCtrl
            .create({
              keyboardClose: true,
              message: `
                <div class="custom-spinner-container">
                  <div class="custom-spinner-box"></div>
                </div>`,
            })
            .then((loadingEl) => {
              loadingEl.present();
              this.list
                .searchStudent(this.data)
                .then((doc) => {
                  loadingEl.dismiss();
                  // alert(doc);
                  this.item = doc;
                  console.log(doc);
                })
                .catch((err) => {
                  this.message = err;
                });
            })
            .catch();
        }
      })
      .catch((err) => {
        this.message = err;
      });
  }

  searchStudent(event) {
    this.loadingCtrl
      .create({
        message: `
                <div class="custom-spinner-container">
                  <div class="custom-spinner-box"></div>
                </div>`,
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.list
          .searchStudent(this.mainForm.value.stid)
          .then((doc) => {
            this.nostudent = false;
            loadingEl.dismiss();
            this.resetForm();
            // alert(doc);
            this.item = doc;
            // console.log(doc);
          })
          .catch((err) => {
            loadingEl.dismiss();
            alert(err);
          });
      });
  }

  resetForm() {
    this.mainForm.reset();
  }
}
