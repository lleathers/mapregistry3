import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapBoxComponent } from './map-box/map-box.component';
import { MapService } from './map.service';

import { AngularFirestoreModule } from '@angular/fire/firestore';


import { AngularFireAuthModule } from '@angular/fire/auth';


// Added for firebaseui

import {FormsModule} from '@angular/forms';
import {environment} from '../environments/environment';


import * as firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';

// currently there is a bug while building the app with --prod
// - https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/76
// the plugin exposes the two libraries as well. You can use those:
// import {FirebaseUIModule, firebase, firebaseui} from 'firebaseui-angular';


import {AngularFireModule} from '@angular/fire';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    MapBoxComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AppRoutingModule
  ],
  providers: [MapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
