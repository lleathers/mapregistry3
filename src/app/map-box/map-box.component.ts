import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MapService } from '../map.service';
import { PartitionService } from '../partition.service';
import { GeoJson, FeatureCollection } from '../map';
import { Observable, from } from 'rxjs';

import { Router } from '@angular/router';

import * as firebase from 'firebase/app';

// Init GeoFireX
import * as geofirex from 'geofirex';
const geo = geofirex.init(firebase);

import { get } from 'geofirex';

import { GeoFireClient } from 'geofirex';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';


@Component({
  selector: 'map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss']
})
export class MapBoxComponent implements OnInit{

    constructor(private afs: AngularFirestore, private mapService: MapService, public partitionService: PartitionService, private router: Router) {
    }


  latlngtext: any;
  user: any;
  markerpoint: any;
  hashpoint: any;
  neighborhood: any;
  initHash: any;
  thecoordinates: number[];
  timeNow: any;

  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/outdoors-v9';
  //lat = 37.75;
  //lng = -122.41;
  

  //lat = 40.62659207716757;
  //lng = -73.96701867575564;
  lat = 40.60659207716757;
  lng = -73.84701867575564;

  x = 0;


  db = firebase.firestore();

  thesepart: any;

  //
  // from angularfirebase and geofirex tutorial
  //
  updateUserLocation(id) {
   var ourMapService = this.mapService;
   var ourPartitionService = this.partitionService;
   var ourcoordinates = this.thecoordinates;


   // We check last location of user.
   // If most significant six digits of geohash are 
   // different, we delete marker from former
   // neighborhood. 
 
   var ourneighborhood = this.neighborhood;
   var ourgeocollection = geo.collection('users');
   var ourmarkerpoint = this.markerpoint;



  // print out everything in neighborhood.

   //const query = this.db.collection('places').doc('dr5rj');
   //this.points = query.pipe( toGeoJSON() );

   //console.log("PRINT out geoRef", geoRef);

 
   // We check last marker location saved in User account
   // to assess whether or not in same neighborhood defined by
   // geohash. If left neighborhood, we delete marker location in 'places'.

   var userLastSeen = this.db.collection('users').doc(this.user.uid);

   const theafs = this.afs;

   const userRef = this.user.uid;
   const dbRef = this.db;
   var timeRef = this.timeNow;

   const mapRef = this.map;
 
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
             var lastMarkerDocument = dbRef.collection('places').doc(geohashlast_msd);
             var lastMarkerDocument0 = theafs.collection('neighborhoods').doc(geohashlast_msd).collection(geohashlast_msd).doc(userRef);

// THIS IS ROUTE TO THE SOLUTION
//
// LESSON TO BE LEARNED: use '[5lkrtkljelkrjt]' to refer to field names that begin with numbers!!!
//

           const executeFirebase = firebase.firestore.FieldValue.delete()

           const integrate: string = 
               " lastMarkerDocument.update({ ['" + eval('userRef') + 
               "'] : executeFirebase" +  
               " }).then(function() { " +
               "    console.log(`Document successfully deleted from places!`);" +
               " }).catch(function(error) { " +
               "    console.error(`Error removing document from places: `, error);" +
               " });"

           console.log(integrate);
           eval(integrate);


           // Delete from neighborhoods
           lastMarkerDocument0.delete().then(function() {
               console.log("Document successfully deleted from neighborhoods!");
           }).catch(function(error) {
               console.error("Error removing document from neighborhoods: ", error);
           });

 
           // The Javascript referred to a database field without using quotes. I wanted to refer
           // to Firestore field through a variable reference. That is why this eval scheme was hatched.

// NOW UNSUBSCRIBE to geohashlast and SUBSCRIBE to ourneighborhood         
//
//
//
           // Simply update subscription to new restricted domain required for map-box 
           // to plot markers
           // updatesubscription(geohashlast_msd, ourneighborhood);       



          // we can now define the newest geohash neighborhood called "domain" in PartitionService
          ourPartitionService.domain = ourneighborhood;

          ourPartitionService.createPartition(ourPartitionService, ourPartitionService.db);
          // createPartition is being sent the necessary reference object, "ourPartitionService"
          // because we could not adequately define initPartition and createPartition without
          // executing these processes as methods from the constructor. There must be a better
          // way, but I am not yet aware, so please forgive. --Larry Leathers, Oct 16, 2020 


          var thepartitions = ourPartitionService.partitions

          // Now update the marker subscription to the new partition 
          // OK. Use this because we are calling a function from inside another, and both functions are in same class.
          // And this is strict mode! Whew!
          // () => this.updateSubscription();



         //UPDATE MARKER NEIGHBORHOOD SUBSCRIPTION!!!
         //Must update marker subscriptions because partitions change
         //Call this updateSubscription, because that is what this does
         //IMPORTANT!!!
         //THIS IS THE CODE THAT ENABLES US TO LIMIT OR RESTRICT QUERY ACTIVITY TO THE NEIGHBORHOOD OF USER PUBLISHED MARKER.
         //WITHOUT THIS, PERFORMANCE WILL DEGRADE AS USERS LOAD THE APPLICATION.


         // We ensure that when partitionService.domain is not init, the database addressing is consistent.
         // The database addressing would look like 'neighborhood/domain/domain'. 
         var colRef = theafs.collection('neighborhoods/init/init')
         
             if ((colRef.get()) && (ourPartitionService.domain != "init")) {
                 ourPartitionService.createPartition(ourPartitionService, ourPartitionService.db)
                 console.log("Did we fix partitionService, at subscription site?")
              }


         thepartitions.subscribe(thepartitions => {
           console.log("MARKERS AGAIN PLEASE:", thepartitions);
           let source = mapRef.getSource('firebase');
           let data = new FeatureCollection(thepartitions);
           source.setData(data);
           })
 

          console.log("partitions assignment worked");

          }

        // Now update the user location data.
        const collection = ourgeocollection;
        const lastseen = ourmarkerpoint;
 
        // Fortunately, Timestamp does not need to be converted. Firebase recognizes and stores it accordingly.
        timeRef = firebase.firestore.Timestamp.now();

        // GeoJson mediates 'users' collection, now
        var newMarker1 = new GeoJson(ourcoordinates, { message: "You're Here", geohash: ourmarkerpoint.hash, 
                                presence: "available", username: "default", timestamp: timeRef, userid: userRef })



///TESTING to understand what form Firestore can understand
        console.log("PLEASE SHARE GEOJSON:", newMarker1)
        ourMapService.createMarker(newMarker1)
        ourPartitionService.createMarker(newMarker1, ourPartitionService)
        
 
        //  collection.setDoc(id, {position: lastseen.data});
        console.log("Newest neighborhood", ourmarkerpoint.hash);

       } else {
        // doc.data() will be undefined in this case
        // We add new user to 'users' collection.
          console.log("No such document, so we welcome new user!");
  
        const collection = ourgeocollection;
        const lastseen = ourmarkerpoint;

        // Fortunately, Timestamp does not need to be converted. Firebase recognizes and stores it accordingly.
        timeRef = firebase.firestore.Timestamp.now();
 
        // GeoJson mediates 'users' collection, now
        var newMarker2 = new GeoJson(ourcoordinates, { message: "You're Here", geohash: ourmarkerpoint.hash,
                                presence: "available", username: "default", timestamp: timeRef, userid: userRef })
                                
        ourMapService.createMarker(newMarker2)
        ourPartitionService.createMarker(newMarker2, ourPartitionService)  

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
    var collection = geo.collection('places');

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
  partitions: any;


  ngOnInit() {
     const toMapService = this.mapService  
     var toPartitionService = this.partitionService

     //We have the markers observable
     //Now everyone can subscribe to marker changes
     this.markers = toMapService.markers
     this.partitions = toPartitionService.partitions
 
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
      zoom: 15,
      center: [this.lng, this.lat]
    });


    /// Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());


    //// Add Marker on Click
    this.map.on('click', (event) => {
      var coordinates = [event.lngLat.lng, event.lngLat.lat]
      this.thecoordinates = coordinates

      this.markerpoint = geo.point(event.lngLat.lat, event.lngLat.lng)
     
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

/*
         // We ensure that when partitionService.domain is not init, the database addressing is consistent.
         // The database addressing would look like 'neighborhood/domain/domain'. 
         var theafs = this.afs
         var colRef = theafs.collection('neighborhoods/init/init')


             if ((colRef.get()) && (this.partitionService.domain != "init")) {
                 this.partitionService.createPartition()
                 console.log("Did we fix partitionService, at MapOn?")
              }
*/

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


/*
//TESTING for interface with MapBox API
     var TESTMarker = new GeoJson([-73.9237405202382, 40.61766398344872], { message: "hello, there", geohash: "dr5rhg97w", 
                                presence: "available", username: "default" })

     var makeArray = [TESTMarker]
*/

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

  flyTo(data: GeoJson) {
    this.map.flyTo({
      center: data.geometry.coordinates
    })
  }
}
