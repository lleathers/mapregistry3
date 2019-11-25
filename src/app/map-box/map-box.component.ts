import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MapService } from '../map.service';
import { GeoJson, FeatureCollection } from '../map';
import { Observable, from } from 'rxjs';

import { Router } from '@angular/router';

import * as firebase from 'firebase/app';

// Init GeoFireX
import * as geofirex from 'geofirex';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';


@Component({
  selector: 'map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss']
})
export class MapBoxComponent implements OnInit{

  geo = geofirex.init(firebase)

  latlngtext: any;
  user: any;
  usr: any;
  markerpoint: any;
  hashpoint: any;
  neighborhood: any;
  initHash: any;
  thecoordinates: number[];

  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/outdoors-v9';
  //lat = 37.75;
  //lng = -122.41;
  

  lat = 40.62659207716757;
  lng = -73.96701867575564;
  x = 0;


 db = firebase.firestore();
 findUser = this.db.collection('users');

 arraytestmarker: any;

 //thecoordinates: number[]; 
  
 //dbuser = firebase.auth().user.uid;
 //dbuser = user.uid

 //userLastSeen = this.db.collection('users').doc('Y3BA83d7AINX008RH0HcEDSVxpw2');

 //userLastSeen = this.db.collection('users').doc(this.dbuser);

  //
  // from angularfirebase and geofirex tutorial
  //
  updateUserLocation(id) {
   var ourMapService = this.mapService;
   var ourcoordinates = this.thecoordinates;

   // We check last location of user.
   // If most significant six digits of geohash are 
   // different, we delete marker from former
   // neighborhood. 
 
   var ourneighborhood = this.neighborhood;
   var ourgeocollection = this.geo.collection('users');
   var ourmarkerpoint = this.markerpoint;

 
   //var userLastSeen = this.db.collection('users').doc('Y3BA83d7AINX008RH0HcEDSVxpw2');

   // We check last marker location saved in User account
   // to assess whether or not in same neighborhood defined by
   // geohash. If left neighborhood, we delete marker location in 'places'.

   var userLastSeen = this.db.collection('users').doc(this.user.uid);
   //var lastMarkerCollection = this.db.collection('places');

   const userRef = this.user.uid;
   const dbRef = this.db;
 
   // var lastMarkerDocument = this.db.collection('places').doc(this.user.uid);

   userLastSeen.get().then(function(collection2) {
       if (collection2.exists) {
          console.log("Document data:", collection2.data());

          // Get fields from firestore document 
          // through dot notation.
          var geohashlast = collection2.get('properties.geohash');
          console.log("Printing geohash:", geohashlast);

          // The most significant five digits from geohash
          // defines our neighborhood.
          var geohashlast_msd = geohashlast.substring(0, 5);


          console.log("Printing old hash from user", geohashlast_msd);
          console.log("Printing new neighborhood", ourneighborhood);

          // If new location is in a different geohash,
          // we delete old location from old neighborhood.
          if (geohashlast_msd != ourneighborhood) {
             // let's console log our results
             console.log('New neighborhood. Delete old location.'); 

             // Let's delete old location in 'places'
             // lastMarkerCollection.doc(geohashlast_msd) 
            
            var lastMarkerDocument = dbRef.collection('places').doc(geohashlast_msd);

/*
            var removePosition = lastMarkerDocument.update({
             Y3BA83d7AINX008RH0HcEDSVxpw2: firebase.firestore.FieldValue.delete()  
                 }).then(function() {
                     console.log("Document successfully deleted!");
                 }).catch(function(error) {
                     console.error("Error removing document: ", error);
                 });
*/


// THIS IS ROUTE TO THE SOLUTION
//
// LESSON TO BE LEARNED: use '[5lkrtkljelkrjt]' to refer to field names that begin with numbers!!!
//
/*
           var integrate =  lastMarkerDocument.update({ 
              ['5tfmcbY0EJg4o4vWzTEsWMPCyBU2'] : firebase.firestore.FieldValue.delete() 
             // tfmcb: firebase.firestore.FieldValue.delete() 
                }).then(function() { 
                   console.log(`Document successfully deleted!`); 
                }).catch(function(error) {  
                   console.error(`Error removing document: `, error); 
                });
           console.log(integrate);
*/



           const executeFirebase = firebase.firestore.FieldValue.delete()

           const integrate: string = 
               " lastMarkerDocument.update({ ['" + eval('userRef') + 
               "'] : executeFirebase" +  
               " }).then(function() { " +
               "    console.log(`Document successfully deleted!`);" +
               " }).catch(function(error) { " +
               "    console.error(`Error removing document: `, error);" +
               " });"

           console.log(integrate);
           eval(integrate);
       
       
           // The Javascript referred to a database field without using quotes. I wanted to refer
           // to Firestore field through a variable reference. That is why this eval scheme was hatched.

          }

        // Now update the user location data.
        const collection = ourgeocollection;
        const lastseen = ourmarkerpoint;

        // GeoJson mediates 'users' collection, now
        var newMarker1 = new GeoJson(ourcoordinates, { message: "hello, there", geohash: ourmarkerpoint.hash, 
                                presence: "available", username: "default" })



///TESTING to understand what form Firestore can understand
        console.log("PLEASE SHARE GEOJSON:", newMarker1)
        ourMapService.createMarker(newMarker1)
 
        //  collection.setDoc(id, {position: lastseen.data});
        console.log("Newest neighborhood", ourmarkerpoint.hash);

       } else {
        // doc.data() will be undefined in this case
        // We add new user to 'users' collection.
          console.log("No such document, so we welcome new user!");
  
        const collection = ourgeocollection;
        const lastseen = ourmarkerpoint;
 
        // GeoJson mediates 'users' collection, now
        var newMarker2 = new GeoJson(ourcoordinates, { message: "hello, there", geohash: ourmarkerpoint.hash })
        ourMapService.createMarker(newMarker2)

        //  collection.setDoc(id, {position: lastseen.data});
        console.log("Newest neighborhood", ourmarkerpoint.hash);

       }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

    // we always save last marker location with 
    // User account -- this.user.uid
    // to compare neighborhoods or most significant
    // five digits of geohash.
    // to compare neighborhoods or most significant
    // five digits of geohash.


  }


  // adds location to Firestore using GeoFireX
  addLocation() {

    // Our field name is the Firebase User ID.
    // Every time we click on map, we add new document or overwrite 
    // document based upon field.

    this.createPoint(this.markerpoint.coords[0], this.markerpoint.coords[1], this.user.uid)

  }


  createPoint(thelat, thelng, theuserid) {
    var collection = this.geo.collection('places');

    //const field = 'position'

    // Use the convenience method

   /*
     Rules for marker location changes:
     1) Go to User account to find recent location document
       in collection defined by most significant five digits of geohash.
       Least significant three digits determine unique ID of
       marker in local aggregate.
     2) Delete recent location document, by writing directly to its 
       field, which is the entire geohash.
     3) Store new location document geohash in user account.
  */

    collection.setPoint(this.neighborhood, theuserid, thelat, thelng);

    // Or be a little more explicit
    //const point = this.geo.point(lat, lng)
    //collection.setDoc('my-place', { position: point.data })
  }



  /// default settings

  /// upon login, the default lat/lng info can be drawn from account.
  /// Otherwise, there will be fake information for markers shown
  /// to demonstrate what the application can do


  // data
  source: any;
  markers: any;

  markermonster: any;


  constructor(private mapService: MapService, private router: Router) {
  }

  //markermonster = from(this.mapService.getMarkers);


  ngOnInit() {
   const toMapService = this.mapService  
   const toFindUser = this.findUser
   //toMarkers: Array<GeoJson>

   firebase.auth().onAuthStateChanged(function(user) {
      this.usr = user;
   })

// Notice that assignment to this.markers occurs before return from getMarkers!!!
// This is why you coerce assignment after return from getMarkers
//   console.log("FROM GETMARKERS:", this.markers = this.mapService.getMarkers())



   //We have the markers observable
   //Now everyone can subscribe to marker changes
   this.markers = toMapService.markers
   
 
/* 
   var initHash: string = "";
   var whatMapService = this.mapService
   var markersorigin = this.markers;
 
    firebase.auth().onAuthStateChanged(function(user) {
         this.usr = user;
         const hashRef: string = "";
         var tothemarkers: GeoJson[] 
         console.log("Who is currentUser? ", this.usr.uid);
         var locationRef = toFindUser.doc(this.usr.uid);
         this.markersorigin = tothemarkers;
         locationRef.get().then((documentSnapshot) => {
               if (documentSnapshot.exists) {
                 console.log(`Document found with name '${documentSnapshot.id}'`);
 
                 let fieldHash = documentSnapshot.get('properties.geohash');
                 console.log(`Retrieved field value: ${fieldHash}`);
                 let hiFieldHash = fieldHash.substring(0, 5);
                 this.hashRef = hiFieldHash;
                 console.log(`Retrieved HASH domain: ${this.hashRef}`);
                 this.tothemarkers = whatMapService.getMarkers(this.hashRef);
                 console.log("MARKERS PLEASE:", this.tothemarkers);
                 
               };
         }); 
         // this.markers = whatMapService.getMarkers(hashRef); 
         // this.initHash = hashRef;         
    });
 
    //this.markers = this.mapService.getMarkers(initHash);
 
    //var locationLast = this.db.collection('users').doc(this.usr.uid);
    //var lastHash = locationLast.get(position);
    //console.log("This is initial geohash: ", lastHash);
    // var hiLastHash = lastHash.substring(0, 5);
 */   
 
    this.initializeMap()
  }

  private initializeMap() {
    /// locate the user
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.map.flyTo({
          center: [this.lng, this.lat]
        })
      });
    }

    this.buildMap()

  }

  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 17,
      center: [this.lng, this.lat]
    });


    /// Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());


    //// Add Marker on Click
//    this.map.on('click', (event) => {
//      const coordinates = [event.lngLat.lng, event.lngLat.lat]
//      const newMarker   = new GeoJson(coordinates, { message: this.message })
//      this.mapService.createMarker(newMarker)
//    })

    this.map.on('click', (event) => {
      var coordinates = [event.lngLat.lng, event.lngLat.lat]
      this.thecoordinates = coordinates

      this.markerpoint = this.geo.point(event.lngLat.lat, event.lngLat.lng)
      
      // Now connecting from Firestore to markers!!

      //const newMarker   = new GeoJson(coordinates, { message: this.message })

      //TESTING -- WRITE TO FIRESTORE -- NOW WORKS SO COMMENT OUT...
      // updateUserLocation() is meant to manage all user feature data
      // via GeoJSON.
      //const newMarker   = new GeoJson(coordinates, { message: "hello, there", geohash: this.markerpoint.hash })
      //this.mapService.createMarker(newMarker)
      // ^^^^^^^ COMMENT OUT ^^^^^^^^

      // We need a geohash from user chosen point, markerpoint,
      // to locate neighborhood, called hashpoint. 

      this.hashpoint = this.markerpoint.hash      
      
      // We need to write documents based upon most significant five digits
      // of our hashpoint geohash, with name neighborhood.


      this.neighborhood = this.hashpoint.substring(0, 5) 
      console.log(this.neighborhood + ' this is our neighborhood')

      // login, if not authenticated and click on screen
      this.user = firebase.auth().currentUser
      if (!this.user || this.user.isAnonymous) {
         this.router.navigate([''])
      } else {
      console.log("We NOW have a logged in User!")
      this.latlngtext = JSON.stringify(event.lngLat.wrap())
      console.log(this.latlngtext)


      // Checks neighborhood of new marker.
      // If not in same neighborhood of geohash 
      // with most significant five digits, then
      // delete former location. Otherwise always
      // update User account with new marker
      // location.


      this.updateUserLocation(this.user.uid)


      // adds location to Firestore using GeoFireX
      this.addLocation()

      }
    })


    /// Add realtime firebase data on map load
    this.map.on('load', (event) => {

      /// register source
      this.map.addSource('firebase', {
         type: 'geojson',
         data: {
           type: 'FeatureCollection',
           features: []
         }
      });
      /// This JSON is preamble to JSON in features: array
      /// Contents are from database or whatever source.

      /// get source
      this.source = this.map.getSource('firebase')

      /// subscribe to realtime database and set data source

     // console.log("ARRAYTESTMARKER:", this.arraytestmarker)

//TESTING for interface with MapBox API
     var TESTMarker = new GeoJson([-73.9237405202382, 40.61766398344872], { message: "hello, there", geohash: "dr5rhg97w", 
                                presence: "available", username: "default" })

     var makeArray = [TESTMarker]



     this.markers.subscribe(markers => {
        console.log("MARKERS AGAIN PLEASE:", markers);
        let data = new FeatureCollection(markers)
        this.source.setData(data)
     })


      /// create map layers with realtime data
      this.map.addLayer({
        id: 'firebase',
        source: 'firebase',
        type: 'symbol',
        layout: {
          'text-field': '{message}',
          'text-size': 24,
          'text-transform': 'uppercase',
          'icon-image': 'rocket-15',
          'text-offset': [0, 1.5]
        },
        paint: {
          'text-color': '#f16624',
          'text-halo-color': '#fff',
          'text-halo-width': 2
        }
      })

    })

  }


  /// Helpers

//  removeMarker(marker) {
//    this.mapService.removeMarker(marker.$key)
//  }

  flyTo(data: GeoJson) {
    this.map.flyTo({
      center: data.geometry.coordinates
    })
  }
}
