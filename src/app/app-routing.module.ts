// from Raphael Jenni -- FirebaseUI-Angular

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'page', loadChildren: './result-page/result.module#ResultModule'},
  {path: '', loadChildren: './main/main.module#MainModule'},
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
