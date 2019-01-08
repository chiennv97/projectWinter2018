import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from '@angular/fire/database';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-history-order',
  templateUrl: './history-order.component.html',
  styleUrls: ['./history-order.component.css']
})
export class HistoryOrderComponent implements OnInit {
  orders$: AngularFireList<any>;
  items: Observable<any[]>;
  constructor(
    public db: AngularFireDatabase,
    public storage: AngularFireStorage
    ) {
    this.orders$ = this.db.list('/orders/' + this.getUserId());
    this.items = this.orders$.valueChanges();
  }

  ngOnInit() {
  }
  getUserId() {
    return localStorage.getItem('currentUserID');
  }
}
