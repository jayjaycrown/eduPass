import { Component, OnInit } from '@angular/core';

import { PDFGenerator } from '@ionic-native/pdf-generator';

import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {

  items = [
    { sn: '1', id: '1', content: 'qeqewrwr' },
    { sn: '2', id: '2', content: 'qeqewrwrads' },
    { sn: '3', id: '2', content: 'qeqewrwraasd' }
  ];
  constructor() { }

  // createPdf() {
  //   const options = {
  //     type: 'share',
  //     fileName: 'v8-tutorial.pdf'
  //   };

  //   const data = `<html>
  //     <h1>  {{ list.title }}  </h1>
  //     <h4>  {{ list.description }} </h4>
  //     <br/>
  //     <table>
  //       <thead>
  //         <tr>
  //           <td>S/N</td>
  //           <td>Student Details</td>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         <tr *ngFor="let item of items; let i=index">
  //           <td> {{i + 1 }} </td>
  //           <td> {{item.content}} </td>
  //         </tr>
  //       </tbody>
  //     </table>
  //   </html>
  //   `;
  //   // this.pdfGen.fromURL(url, options).then(base64String => console.log(base64String));
  // //   PDFGenerator.fromData(data, options).then(status => {
  // //     alert(status);
  // //   }).catch(error => {
  // //     alert(error);
  // //   });
  // // }


  createPdf() {
    // const element = document.getElementById('convert');
    // html2canvas(element).then((canvas) => {
    //   const imgData = canvas.toDataURL('image/png');
    //   const doc = jsPDF();
    //   const imageHeight = canvas.height * 208 / canvas.width;
    //   doc.addImage(imgData, 0, 0, 208, imageHeight);
    //   doc.save('image.pdf');
    // });
  }
  ngOnInit() {
  }

}
