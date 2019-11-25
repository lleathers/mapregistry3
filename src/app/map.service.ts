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
    }

    /// Add marker routine
    createMarker(data: GeoJson) {
        var id = this.afAuth.auth.currentUser.uid
	const marker = Object.assign({}, data) 
	this.markersCollection.doc(id).set(marker)
	}


    ///TESTING PURPOSES ONLY--ACHTUNG! WE ARE PRINTING ALL USERS!!!

/*
    getMarkers() {
      let usersRef = this.db.collection('users');
      let allUsers = usersRef.get() 
                        .subscribe(query => {
                           let response: GeoJson[] = []
                           let geoObject: GeoJson 
                           query.forEach(docQuery => {
                              var geoCoords: [] = docQuery.data().geometry.coordinates 
                              var geoMessge: string = docQuery.data().properties.message
                              geoObject = new GeoJson(geoCoords, { message: geoMessge })
                              response.push(geoObject)
                              console.log(docQuery.id, " => ", docQuery.data());
                           });
                        console.log("WHAT IS RESPONSE:", response)
                        return response
                        });
    }
*/

/*
    getMarkers_(locale) {
      var documentRef = this.db.collection('places').doc(locale);


     //We are to recover fields from locale neighborhood
     //by querying collection "places".

     var userid: string = "amazing";
     // this.theuserid2 = userid;


     documentRef.get().subscribe((docSnap) => {
              console.log("PRINT ALL FIELDS: ", docSnap.data());
     });

    async function retrieveField() {

      this.afAuth.auth.currentUser(function(user) {
      //firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            userid = user.uid 
            console.log("from authentication user.uid:", userid) 
            }
          });
    }

    retrieveField().then(() => {

      const thelocale: string  = 
      " documentRef.get().subscribe((documentSnapshot) => {" + 
      "   if (documentSnapshot.exists) {" +
      "     let field = documentSnapshot.get('" + eval('userid') + ".geohash');" +
      "     console.log(`Retrieved neighborhood value:`, field);" +
      "     console.log(`Retrieved the USERID:`, userid);" +
      "   }" +
      " });";

      console.log(thelocale);
      eval(thelocale);
    });

     console.log("LETS TEST UseerID:", userid);

      ///Retrieving one field based upon one user
      ///We ultimately want to retrieve all fields for all users online

      const testid: string = "`" + eval('userid') + "`"
      console.log("With the EVAL:", testid);
    }
*/ 


//  removeMarker($key: string) {
//    return this.db.object('/markers/' + $key).remove()
//  }

}
