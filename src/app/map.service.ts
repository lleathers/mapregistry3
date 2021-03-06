import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable }  from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import * as firebase from 'firebase/app';

import { GeoJson } from './map';
import * as mapboxgl from 'mapbox-gl';


@Injectable()
export class MapService {

    private markersCollection: AngularFirestoreCollection<GeoJson>;
    markers: Observable<GeoJson[]>;


    constructor(private db: AngularFirestore, public afAuth: AngularFireAuth) {
        mapboxgl.accessToken = environment.mapbox.accessToken
        this.markersCollection = db.collection<GeoJson>('users')
        this.markers = this.markersCollection.valueChanges()
    };


    /// Add or change marker routine
    /// Each user is authorized to manage the location of only one marker.

    createMarker(data: GeoJson) {
        const theMarkers = this.markersCollection
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
