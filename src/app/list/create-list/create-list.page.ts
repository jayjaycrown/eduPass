import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

import { ListService } from '../list.service';

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.page.html',
  styleUrls: ['./create-list.page.scss'],
})
export class CreateListPage implements OnInit {

  mainForm: FormGroup;
  constructor(private listService: ListService,
              private formBuilder: FormBuilder,
              private toast: ToastController,
              private router: Router) { }



  addList() {
    this.listService.addList(
      this.mainForm.value.title,
      this.mainForm.value.description
    ).then(_ => {
      this.mainForm.reset();
    });
  }

  ngOnInit() {
    this.mainForm = this.formBuilder.group({
      title: [''],
      description: ['']
    });
  }

}
