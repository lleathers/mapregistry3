import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapBoxComponent } from './map-box/map-box.component';
import { MapService } from './map.service';

import { AngularFirestoreModule } from '@angular/fire/firestore';




@NgModule({
  declarations: [
    AppComponent,
    MapBoxComponent
  ],
  imports: [
    BrowserModule,
    AngularFirestoreModule
  ],
  providers: [MapService],
  //providers: [],
  //bootstrap: [AppComponent, MapBoxComponent]
  bootstrap: [AppComponent]
})
export class AppModule { }
