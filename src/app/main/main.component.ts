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

  ngOnInit(): void {

      var uiConfig = {
        credentialHelper: firebaseui.auth.CredentialHelper.NONE,
        // Query parameter name for mode.
        queryParameterForWidgetMode: 'mode',
        // Query parameter name for sign in success url.
        queryParameterForSignInSuccessUrl: 'signInSuccessUrl',
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        signInFlow: 'popup',
        autoUpgradeAnonymousUsers: true,
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



/*

  // Temp variable to hold the anonymous user data if needed.
  var data = null;
  // Hold a reference to the anonymous current user.
  var anonymousUser = firebase.auth().currentUser;

  var dbRef = this.afs.collection('users')

      var uiConfig: any = {
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
            //console.log('successCallback', authResult);
            //this.router.navigate(['page']);
            //successCallback(authResult);
            return true;
          },
          signInFailure: function(error) {
            // Some unrecoverable error occurred during sign-in.
            // Return a promise when error handling is completed and FirebaseUI
            // will reset, clearing any UI. This commonly occurs for error code
            // 'firebaseui/anonymous-upgrade-merge-conflict' when merge conflict
            // occurs. Check below for more details on this.
            //return handleUIError(error);
            console.log("Sign in error", error);

            if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
            return Promise.resolve();
            }
            // The credential the user tried to sign in with.
            var cred = error.credential;
            // If using Firebase Realtime Database. The anonymous user data has to be
            // copied to the non-anonymous user.
            // var app = firebase.app();
            // Save anonymous user data first.
            // return app.database().ref('users/' + firebase.auth().currentUser.uid)
            // let dbRef = this.db.collection('users')

            //const witnessUser = dbRef.doc(firebase.auth().currentUser.uid)
            //const userRef = witnessUser.subscribe(d => console.log(d))

                 let x: any = null;
                 let y: any = null;
                 let z: any = null;

            //var userRef = dbRef.doc<GeoJson>(firebase.auth().currentUser.uid).
            dbRef.doc(firebase.auth().currentUser.uid).get()
              .subscribe( 
                  (w => {
                  setTimeout(() => {
                    this.data = w;
                    // This will trigger onAuthStateChanged listener which
                    // could trigger a redirect to another page.
                    // Ensure the upgrade flow is not interrupted by that callback
                    // and that this is given enough time to complete before
                    // redirection.
                    this.x = firebase.auth().signInWithCredential(cred);
                    }, 0);
                  })   
                  setTimeout(() => {
                    // Original Anonymous Auth instance now has the new user.
                    this.y = dbRef.doc(this.x.uid).set(this.data);
                    }, 10); 
                  setTimeout(() => {
                    // Delete anonymous user.
                    this.z = this.y.delete();
                    }, 20);
                  setTimeout(() => {
                    // Clear data in case a new user signs in, and the state change
                    // triggers.
                    this.data = null;
                    // FirebaseUI will reset and the UI cleared when this promise
                    // resolves.
                    // signInSuccessWithAuthResult will not run. Successful sign-in
                    // logic has to be run explicitly.
                    window.location.assign('https://deliverhealthy.com');
                    }, 30);
               );
         },
        },
        credentialHelper: firebaseui.auth.CredentialHelper.NONE,
        // Query parameter name for mode.
        queryParameterForWidgetMode: 'mode',
        // Query parameter name for sign in success url.
        queryParameterForSignInSuccessUrl: 'signInSuccessUrl',
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        signInFlow: 'popup',
        autoUpgradeAnonymousUsers: true,
        signInSuccessUrl: 'https://deliverhealthy.com',
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          auth.GoogleAuthProvider.PROVIDER_ID,
          firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
        ],
        // Set to true if you only have a single federated provider like
        // firebase.auth.GoogleAuthProvider.PROVIDER_ID and you would like to
        // immediately redirect to the provider's site instead of showing a
        // 'Sign in with Provider' button first. In order for this to take
        // effect, the signInFlow option must also be set to 'redirect'.
        immediateFederatedRedirect: false,
        // tosUrl and privacyPolicyUrl accept either url string or a callback
        // function.
        // Terms of service url/callback.
        tosUrl: '<your-tos-url>',
        // Privacy policy url/callback.
        privacyPolicyUrl: function() {
          window.location.assign('<your-privacy-policy-url>');
        }
      };

      var ui = new firebaseui.auth.AuthUI(firebase.auth());
      console.log("WHERE IS MY UI?", ui)

      // The start method will wait until the DOM is loaded.
      ui.start('#firebaseui-auth-container', uiConfig);

      this.afAuth.authState.subscribe(d => console.log(d));

*/

  }

  logout() {
    this.afAuth.auth.signOut();
  }

  successCallback(data: any) {
    console.log('successCallback', data);
    //MapBoxComponent.markers = MapService.markers
    this.router.navigate(['page']);
  }

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




/*
            return dbRef.doc(firebase.auth().currentUser.uid)
                .once('value')
                .then(function(snapshot) {
                  this.data = snapshot.val();
                  // This will trigger onAuthStateChanged listener which
                  // could trigger a redirect to another page.
                  // Ensure the upgrade flow is not interrupted by that callback
                  // and that this is given enough time to complete before
                  // redirection.
                  return firebase.auth().signInWithCredential(cred);
                })
                .then(function(user) {
                  // Original Anonymous Auth instance now has the new user.
                  return dbRef.doc(user.uid).set(this.data);
                })
                .then(function() {
                  // Delete anonymnous user.
                  return anonymousUser.delete();
                }).then(function() {
                  // Clear data in case a new user signs in, and the state change
                  // triggers.
                  this.data = null;
                  // FirebaseUI will reset and the UI cleared when this promise
                  // resolves.
                  // signInSuccessWithAuthResult will not run. Successful sign-in
                  // logic has to be run explicitly.
                  window.location.assign('https://deliverhealthy.com');
                });
*/
