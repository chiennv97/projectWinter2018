import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/user.service';
import { AuthService } from '../core/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseUserModel } from '../core/user.model';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import {UserIdService} from '../core/userId.service';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'page-user',
  templateUrl: 'order.component.html',
  styleUrls: ['order.css']
})
export class OrderComponent {

  user: FirebaseUserModel = new FirebaseUserModel();
  profileForm: FormGroup;
  numberOfPrint = 1;
  file;
  name = '';
  page;
  price = 100;
  customerName = '';
  numberPhone = '';
  address = '';
  customers: AngularFireObject<any>;
  currentUser: Observable<any>;
  users$: AngularFireList<any>;
  orders$: AngularFireList<any>;
  event;

  task: AngularFireUploadTask;
  taskCover: AngularFireUploadTask;

  // Progress monitoring
  percentage: Observable<number>;
  percentageCover: Observable<number>;

  snapshot: Observable<any>;
  snapshotCover: Observable<any>;

  // Download URL
  downloadURL: Observable<string>;
  downloadURLCover: Observable<string>;

  // State for dropzone CSS toggling
  isHovering: boolean;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    public db: AngularFireDatabase,
    public userIdService: UserIdService,
    private storage: AngularFireStorage
  ) {
    this.userService.getCurrentUser()
      .then(res => {
        if (res.providerData[0].providerId === 'password') {
          this.user.image = 'http://dsi-vd.github.io/patternlab-vd/images/fpo_avatar.png';
          this.user.name = res.displayName;
          this.user.provider = res.providerData[0].providerId;
        } else {
          // console.log(order);
          this.user.image = res.photoURL;
          this.user.name = res.displayName;
          this.user.provider = res.providerData[0].providerId;
        }
      }, err => {
        // this.router.navigate(['/login']);
      });
    console.log(this.getUserId());
    this.customers = this.db.object('users/' + this.getUserId());
    this.customers.snapshotChanges().subscribe(action => {
      console.log(action.payload.val());
      this.customerName = action.payload.val().customerName;
      this.numberPhone = action.payload.val().numberPhone;
      this.address = action.payload.val().address;
    });
    this.users$ = this.db.list('/users');
    this.orders$ = this.db.list('/orders/' + this.getUserId());
    // this.currentUser = this.customers.object('lCot8XRm2jNCYchutulTYL7ANIq2').valueChanges();

  }
  onSubmit(formFile) {
    console.log(formFile);
  }
  logNumberOfPrint() {
    console.log(this.numberOfPrint);
  }
  chooseFile(event) {
    console.log(event);
    this.event = event;
    this.name = event.target.files[0].name;
    console.log(this.user);
    const reader = new FileReader();
    reader.readAsBinaryString(event.target.files[0]);
    // comment when run
    const seft = this;
    reader.onloadend = function() {
      const count = reader.result.match(/\/Type[\s]*\/Page[^s]/g).length;
      seft.page = count;
    };
    // this.startUpload(event.target.files);
  }
  createForm(name) {
    this.profileForm = this.fb.group({
      name: [name, Validators.required ]
    });
  }

  save(value) {
    this.userService.updateCurrentUser(value)
    .then(res => {
      console.log(res);
    }, err => console.log(err));
  }

  logout() {
    this.authService.doLogout()
    .then((res) => {
      this.location.back();
    }, (error) => {
      console.log('Logout error', error);
    });
  }
  updateCustomerAddress() {
    this.customers.update({
      customerName: this.customerName,
      numberPhone: this.numberPhone,
      address: this.address
    });
    // this.users$.remove(this.userIdService.getUserId());
    // this.authService.updateCustomerAddress(this.userIdService.getUserId(), this.customerName, this.numberPhone, this.address);
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }


  startUpload(event: FileList) {
    // The File object
    const file = event.item(0)

    // The storage path
    const path = `test/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'My AngularFire-powered PWA!' };

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });
    const fileRef = this.storage.ref(path);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    this.snapshot   = this.task.snapshotChanges();

    // The file's download URL
    // this.downloadURL = this.task.downloadURL();
    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = fileRef.getDownloadURL();
        const timeCreate = new Date().getTime();
        this.downloadURL.subscribe(url => {
          this.orders$.update(timeCreate.toString(), {
            name: this.name,
            numberOfPrint: this.numberOfPrint,
            page: this.page,
            docurl: url,
            coverurl: url,
            price: this.price,
            timeUpload: timeCreate,
            timeFinish: timeCreate + 86400,
            customerName: this.customerName,
            numberPhone: this.numberPhone,
            address: this.address,
            status: 'wait'
          });
          console.log('cap nhat thanh cong');
        });
      })
    )
      .subscribe();
  }

  startUploadCover(event: FileList) {
    // The File object
    const file = event.item(0)

    // Client-side validation example
    // if (file.type.split('/')[0] !== 'image') {
    //   console.error('unsupported file type :( ')
    //   return;
    // }

    // The storage path
    const path = `cover/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'My AngularFire-powered PWA!' };

    // The main task
    this.taskCover = this.storage.upload(path, file, { customMetadata });
    const fileRef = this.storage.ref(path);

    // Progress monitoring
    this.percentageCover = this.taskCover.percentageChanges();
    this.snapshotCover   = this.taskCover.snapshotChanges();

    // The file's download URL
    // this.downloadURL = this.task.downloadURL();
    this.taskCover.snapshotChanges().pipe(
      finalize(() => this.downloadURLCover = fileRef.getDownloadURL() )
    )
      .subscribe();
  }
  // Determines if the upload task is active
  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

  orderPrint() {
    this.startUpload(this.event.target.files);
    // console.log(this.getUserId());
  }
  getUserId() {
    return localStorage.getItem('currentUserID');
  }
}
