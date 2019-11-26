import {Component, OnInit} from '@angular/core';

import {AngularFireAuth} from '@angular/fire/auth';
import { auth } from 'firebase/app'

import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

import * as firebaseui from 'firebaseui';
import * as firebase from 'firebase/app';
import { GeoJson } from '../map';

//import { MapBoxComponent.markers } from '../map-box/map-box.component';
//import { MapService.markers } from '../map.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

// This code is our authentication procedure.

export class MainComponent implements OnInit {


  constructor(private afAuth: AngularFireAuth, private router: Router, 
                    private afs: AngularFirestore) {
  } 
  

  ngOnInit() {

   let therouter = this.router;
   //let theafs = this.afs;

   var uiConfig = {
        callbacks: {
          signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            var user = authResult.user;
            var credential = authResult.credential;
            var isNewUser = authResult.additionalUserInfo.isNewUser;
            var providerId = authResult.additionalUserInfo.providerId;
            var operationType = authResult.operationType;
            // Do something with the returned AuthResult.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            console.log('successCallback', authResult);
            //this.router.navigate(['page']);
            successCallback(authResult);
            return true;
          },           
    // signInFailure callback must be provided to handle merge conflicts which
    // occur when an existing credential is linked to an anonymous user.
         signInFailure: function(error) {
          this.afs = firebase.firestore 
          // For merge conflicts, the error.code will be
          // 'firebaseui/anonymous-upgrade-merge-conflict'.
          if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
            return Promise.resolve();
          }
          // The credential the user tried to sign in with.
          var cred = error.credential;
          // If using Firebase Realtime Database. The anonymous user data has to be
          // copied to the non-anonymous user.
          var fs = firebase.firestore;
          // Save anonymous user data first.
          let data = null;
          return this.afs.doc('users/' + firebase.auth().currentUser.uid)
              .onSnapshot(function(value) { return value })
              .next((snapshot) => {
                this.data = snapshot;
                // This will trigger onAuthStateChanged listener which
                // could trigger a redirect to another page.
                // Ensure the upgrade flow is not interrupted by that callback
                // and that this is given enough time to complete before
                // redirection.
                return firebase.auth().signInWithCredential(cred);
              })
              .next(function(user) {
                // Original Anonymous Auth instance now has the new user.
                return this.afs.doc('users/' + user.uid).set(this.data);
              })
              .next((anonymousUser) => {
                // Delete anonymnous user.
                return anonymousUser.delete();
              }).then(function() {
                // Clear data in case a new user signs in, and the state change
                // triggers.
                data = null;
                // FirebaseUI will reset and the UI cleared when this promise
                // resolves.
                // signInSuccessWithAuthResult will not run. Successful sign-in
                // logic has to be run explicitly.
                window.location.assign('<url-to-redirect-to-on-success>');
               });
           }
        },
        credentialHelper: firebaseui.auth.CredentialHelper.NONE,
        // Query parameter name for mode.
        queryParameterForWidgetMode: 'mode',
        // Query parameter name for sign in success url.
        queryParameterForSignInSuccessUrl: 'signInSuccessUrl',
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        signInFlow: 'popup',
        autoUpgradeAnonymousUsers: true,
        //signInSuccessUrl: 'https://neighbors.deliverhealthy.com',
        signInSuccessUrl: 'http://localhost:4201/page',
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
        ],
        // tosUrl and privacyPolicyUrl accept either url string or a callback
        // function.
        // Terms of service url/callback.
        tosUrl: '<your-tos-url>',
        // Privacy policy url/callback.
        privacyPolicyUrl: function() {
          window.location.assign('<your-privacy-policy-url>');
        }
      };

      // Initialize the FirebaseUI Widget using Firebase.
      var ui = new firebaseui.auth.AuthUI(firebase.auth());
      // The start method will wait until the DOM is loaded.
      ui.start('#firebaseui-auth-container', uiConfig);


      function successCallback(data: any) {
        console.log('successCallback', data);
        therouter.navigate(['page']);
      }


  };

  logout() {
    this.afAuth.auth.signOut();
    location.reload(true);
  };

  successCallback(data: any) {
    console.log('successCallback', data);
    this.router.navigate(['page']);
  };

/*
  errorCallback(data: FirebaseUISignInFailure) {
    console.warn('errorCallback', data);
  }
*/

  // Logic for dismissing and recovering form for map interaction
  dismissDialogToIcon: boolean = false;
  dismissDialog() { this.dismissDialogToIcon = true; }
  dismissRecoverTab() { this.dismissDialogToIcon = false; }


}




