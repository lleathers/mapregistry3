import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable }  from 'rxjs';

import { GeoJson } from './map';
import * as mapboxgl from 'mapbox-gl';

import { firebase } from 'firebaseui-angular';



const fs = firebase.firestore();

var checkuserid: any = "";  

firebase.auth().onAuthStateChanged(function(checkuser) {
   checkuserid = checkuser.uid
   })    

@Injectable()
export class MapService {

    private markersCollection: AngularFirestoreCollection<GeoJson>;
    markers: Observable<GeoJson[]>;

    constructor(private db: AngularFirestore) {
        mapboxgl.accessToken = environment.mapbox.accessToken
        this.markersCollection = db.collection<GeoJson>('users')
        this.markers = this.markersCollection.valueChanges()
    }

    /// Add marker routine
    createMarker(data: GeoJson) {
        const id = checkuserid 
	const marker = Object.assign({}, data) 
	this.markersCollection.doc(id).set(marker)
	}

//  getMarkers(): FirebaseListObservable<any> {
//    return this.db.list('/markers')
//  }


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
    ///TESTING PURPOSES ONLY--ACHTUNG! WE ARE PRINTING ALL USERS!!!
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





    ///WE MUST FIX-- do not use geofirex to create markers anymore
    ///Use GeoFireX to generate geohashes ONLY!
    /// 
    getMarkers__(locale) {

      var documentRef = this.db.collection('places').doc(locale);
      /// Return document with all users who share your locale
      return documentRef;

    }

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

      firebase.auth().onAuthStateChanged(function(user) {
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
/*
      documentRef.get().subscribe((documentSnapshot) => {
        if (documentSnapshot.exists) {
          let field = documentSnapshot.get('Y3BA83d7AINX008RH0HcEDSVxpw2.geohash')
          console.log(`Retrieved field value: ${field}`);
        }
      });
*/

      ///Retrieving one field based upon one user
      ///We ultimately want to retrieve all fields for all users online

      const testid: string = "`" + eval('userid') + "`"
      console.log("With the EVAL:", testid);
      
/*
      const thelocale: string  = 
      " documentRef.get().subscribe((documentSnapshot) => {" + 
      "   if (documentSnapshot.exists) {" +
      "     let field = documentSnapshot.get('" + eval('testid.uid') + ".geohash');" +
      "     console.log(`Retrieved neighborhood value:`, field);" +
      "     console.log(`Retrieved the USERID:`, userid);" +
      "   }" +
      " });"
      console.log(thelocale);
      eval(thelocale);
*/

/*
      documentRef.get().subscribe((documentSnapshot) => {
        if (documentSnapshot.exists) {
          let field = documentSnapshot.get('Y3BA83d7AINX008RH0HcEDSVxpw2.geohash')
          console.log(`Data: ${JSON.stringify(documentSnapshot.data())}`);
        }
      });
*/

//    ( () => { return documentRef.get()}).subscribe(documentSnapshot => {
//           let field = documentSnapshot.get('Y3BA83d7AINX008RH0HcEDSVxpw2.geohash');
//           console.log(`Retrieved field value: ${field}`);
//           });


//      const documentSnapshot = documentRef.get('Y3BA83d7AINX008RH0HcEDSVxpw2');
//      console.log(`Data: ${JSON.stringify(documentSnapshot)}`);

    }
 

//      documentRef.get().then(documentSnapshot => {
//       let field = documentSnapshot.get('position.geohash');
//       console.log(`Retrieved 


//      var hashtodocument = collectionplaces.doc(locale).onSnapshot(function(doc) {
//                            console.log("Current data: ", doc.data());
//                          });


//      console.log("Current data: ", hashtodocument);
//      }

//        .then(function(doc) {
//           console.log("Current data: ", doc.data());
//      }); 
 

//  createMarker(data: GeoJson) {
//    return this.db.list('/markers')
//                  .push(data)
//  }


/*
   createMarker(data: GeoJson) {
      firebase.auth().onAuthStateChanged(function(checkuser) {
            var checkuserid = checkuser.uid 
            var jsonString = JSON.stringify(data);
            console.log('SHOW me STRINGIFIED data: ', jsonString);      
            console.log('SHOW me your id please: ', checkuserid);
            var toAssign = Object.assign({},data)
            console.log('SHOW Object.assign version: ', toAssign)
            fs.collection('users').doc(checkuserid).set(toAssign)
            return toAssign
            }) 
  }
*/

/*
   createMarker(data: GeoJson) {
      firebase.auth().onAuthStateChanged(function(checkuser) {
          if (checkuser) {
            var checkuserid = checkuser.uid 
            var jsonString = JSON.stringify(data);
            console.log('SHOW me STRINGIFIED data: ', jsonString);      
            console.log('SHOW me your id please: ', checkuserid);
            fs.collection('users').doc(checkuserid).set(jsonString) 
            } else {
            console.error("Error, no user: ", error)
            })
            .catch(function(error) {
               console.error("Error writing document: ", error);
           })
      }
   }
*/


/*
   createMarker(data: GeoJson) {
    async function retrieveField2() {
      firebase.auth().onAuthStateChanged(function(checkuser) {
          if (checkuser) {
            var checkuserid = checkuser.uid 
            console.log("from authentication checkuserid:", checkuserid) 
            return checkuserid;
            }
          });
    }
    //get Userid.
    retrieveField2().then(function(id)  {
       
      var jsonString = JSON.stringify(data);
      console.log('SHOW me STRINGIFIED data: ', jsonString);      
      console.log('SHOW me your id please: ', this.checkuserid);
      return fs.collection('users').doc(id).set(jsonString)
      })
      .catch(function(error) {
          console.error("Error writing document: ", error);
      });
    }
*/      
    


//  removeMarker($key: string) {
//    return this.db.object('/markers/' + $key).remove()
//  }

}
