import { Component, ViewChildren, QueryList, OnInit } from '@angular/core';
import { Platform, IonRouterOutlet, AlertController } from '@ionic/angular';
const { App } = Plugins;

import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
const { Toast } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  subscription: any;
  backButtonSubscription;
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  constructor(
    private platform: Platform,
    private routerOutlet: IonRouterOutlet,
    public router: Router,
    public alertController: AlertController) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      }
      else if (this.router.url === '/home/tab/scan') {
        this.presentAlertConfirm();
      }
      else {
        this.routerOutlet.pop();
        this.presentAlertConfirm();
      }
    });
  }
  // ionViewDidEnter() {
  //   this.subscription = this.platform.backButton.subscribe(() => {
  //     // tslint:disable-next-line: no-string-literal
  //     navigator['app'].exitApp();
  //   });
  // }

  // ionViewWillLeave() {
  //   this.subscription.unsubscribe();
  // }

  backButtonEvent() {
    this.backButtonSubscription = this.platform.backButton.subscribe(async () => {
      this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
        if (outlet && outlet.canGoBack()) {
          outlet.pop();
        } else if (this.router.url === '/home') {
          // this.presentAlertConfirm();
          if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
            // tslint:disable-next-line: no-string-literal
            navigator['app'].exitApp();
          } else {
            this.showToast('Press back again to exit App.');
            this.lastTimeBackPress = new Date().getTime();
          }
        }
      });
    });
  }
  ngOnInit(): void {
    // this.backButtonEvent();
  }

  async showToast(msg) {
    await Toast.show({
      text: msg
    });
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Confirm to Exit App !!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Exit',
          handler: () => {
            console.log('Confirm Okay');
            App.exitApp();
          }
        }
      ]
    });
    await alert.present();
  }

}
