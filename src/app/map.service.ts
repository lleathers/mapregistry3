//import { Injectable } from '@angular/core';

//@Injectable({
//  providedIn: 'root'
//})
//export class MapService {

//  constructor() { }
//}


import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { Observable }  from 'rxjs';

import { GeoJson } from './map';
import * as mapboxgl from 'mapbox-gl';

@Injectable()
export class MapService {

  constructor(private db: AngularFirestoreModule) {
    mapboxgl.accessToken = environment.mapbox.accessToken
  }


//  getMarkers(): FirebaseListObservable<any> {
//    return this.db.list('/markers')
//  }

//  createMarker(data: GeoJson) {
//    return this.db.list('/markers')
//                  .push(data)
//  }

//  removeMarker($key: string) {
//    return this.db.object('/markers/' + $key).remove()
//  }

}
