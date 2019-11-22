import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapBoxComponent } from './map-box/map-box.component';
import { MapService } from './map.service';

import { AngularFirestoreModule } from '@angular/fire/firestore';



import { AngularFireAuthModule } from '@angular/fire/auth';


// Added for firebaseui

// import {BrowserModule} from '@angular/platform-browser';
// import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
// import {AppComponent} from './app.component';
import {environment} from '../environments/environment';
// import {AppRoutingModule} from './app-routing.module';


import {FirebaseUIModule} from 'firebaseui-angular';
import * as firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
// currently there is a bug while building the app with --prod
// - https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/76
// the plugin exposes the two libraries as well. You can use those:
// import {FirebaseUIModule, firebase, firebaseui} from 'firebaseui-angular';


import {AngularFireModule} from '@angular/fire';
//import { FirebaseUiComponent } from './firebase-ui/firebase-ui.component';
//import { MainComponent } from './main/main.component';
//import { ResultPageComponent } from './result-page/result-page.component';
import { AppRoutingModule } from './app-routing.module';
// import {AngularFireAuthModule} from '@angular/fire/auth';



const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    //{
    //  scopes: [
    //    'public_profile',
    //    'email',
    //    'user_likes',
    //    'user_friends'
    //  ],
    //  customParameters: {
    //    'auth_type': 'reauthenticate'
    //  },
    //  provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID
    //},
    //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    //firebase.auth.GithubAuthProvider.PROVIDER_ID,
    //{
    //  requireDisplayName: false,
    //  provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
    //},
    //firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
  ],
  tosUrl: '<your-tos-link>',
  privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
  credentialHelper: firebaseui.auth.CredentialHelper.NONE
};



@NgModule({
  declarations: [
    AppComponent,
    MapBoxComponent,
    //FirebaseUiComponent,
    //MainComponent,
    //ResultPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    AngularFirestoreModule,
    AppRoutingModule
  ],
  providers: [MapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
