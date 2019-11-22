import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ResultPageComponent} from './result-page.component';
import {RouterModule, Routes} from '@angular/router';
import {firebase, FirebaseUIModule} from 'firebaseui-angular';

const routes: Routes = [
  {path: '', component: ResultPageComponent},
];


@NgModule({
  imports: [
    CommonModule,
    FirebaseUIModule.forFeature({
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID]
    }),
    RouterModule.forChild(routes)
  ],
  declarations: [ResultPageComponent]
})
export class ResultModule {
}
