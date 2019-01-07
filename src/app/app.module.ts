import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { rootRouterConfig } from './app.routes';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {OrderComponent} from './order/order.component';
import {RegisterComponent} from './register/register.component';
import {AuthService} from './core/auth.service';
import {UserService} from './core/user.service';
import {UserResolver} from './order/user.resolver';
import {AuthGuard} from './core/auth.guard';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import {OverlayModule} from '@angular/cdk/overlay';
import { HomeComponent } from './home/home.component';
import {UserIdService} from './core/userId.service';
import { FileSizePipe } from './pipe/file-size.pipe';
import { AngularFireStorageModule } from 'angularfire2/storage';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OrderComponent,
    RegisterComponent,
    HomeComponent,
    FileSizePipe
  ],
  imports: [
    BrowserModule,
    // AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: false }),
    DragDropModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AngularFireDatabaseModule,
    OverlayModule,
    AngularFireStorageModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [AuthService, UserService, UserResolver, AuthGuard, UserIdService],
  bootstrap: [AppComponent]
})
export class AppModule { }
