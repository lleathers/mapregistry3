import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable }  from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import * as firebase from 'firebase/app';

//import { MapBoxComponent } from './map-box/map-box.component';

import { GeoJson } from './map';
import * as mapboxgl from 'mapbox-gl';


@Injectable()
export class PartitionService {

    public partitionsCollection: AngularFirestoreCollection<GeoJson>;
    partitions: Observable<GeoJson[]>;

    constructor(private db: AngularFirestore, public afAuth: AngularFireAuth) {
        mapboxgl.accessToken = environment.mapbox.accessToken
        this.partitionsCollection = db.collection<any>('neighborhoods/init/init')
        this.partitions = this.partitionsCollection.valueChanges()
    };


    /// Add or change marker routine
    /// Each user is authorized to manage the location of only one marker.

    createMarker(data: GeoJson) {
        var theMarkers = this.partitionsCollection
        firebase.auth().onAuthStateChanged(function(checkuser) {
          if (checkuser) {
            var isAnonymous = checkuser.isAnonymous
              if (!isAnonymous) {
                var id = checkuser.uid
	        const marker = Object.assign({}, data) 
	        theMarkers.doc(id).set(marker)
	        } else {
                  console.log("User is Anonymous")
                }
            }
       })
     } 

}
