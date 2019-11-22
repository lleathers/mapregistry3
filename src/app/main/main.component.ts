// import { Component, OnInit } from '@angular/core';

// Added from Raphael Jenni-FirebaseUI-Angular

import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {FirebaseUISignInSuccessWithAuthResult, FirebaseUISignInFailure} from 'firebaseui-angular';
import {Router} from '@angular/router';
import { firebase } from 'firebaseui-angular';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

// copy from Raphael Jenni-FirebaseUI-Angular
// This code is our authentication procedure.

export class MainComponent implements OnInit {


  constructor(private afAuth: AngularFireAuth, private router: Router) {
  }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(d => console.log(d));
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  successCallback(data: FirebaseUISignInSuccessWithAuthResult) {
    console.log('successCallback', data);
    this.router.navigate(['page']);
  }

  errorCallback(data: FirebaseUISignInFailure) {
    console.warn('errorCallback', data);
  }

  // Logic for dismissing and recovering form for map interaction
  dismissDialogToIcon: boolean = false;
  dismissDialog() { this.dismissDialogToIcon = true; }
  dismissRecoverTab() { this.dismissDialogToIcon = false; }

}
