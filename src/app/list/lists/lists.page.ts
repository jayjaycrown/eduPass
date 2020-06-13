import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.page.html',
  styleUrls: ['./lists.page.scss'],
})
export class ListsPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  delete(){}

  addList() {
    this.router.navigateByUrl('/new');
  }
}
