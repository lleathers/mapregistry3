import { Injectable, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, from }  from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import * as firebase from 'firebase/app';

//import { MapBoxComponent } from './map-box/map-box.component';

import { GeoJson } from './map';
import * as mapboxgl from 'mapbox-gl';

import * as ts from "typescript";

@Injectable()
export class PartitionService {

    public partitionsCollection: AngularFirestoreCollection<GeoJson>;
    public partitions: Observable<GeoJson[]>;
    public domain: string;
    // domain is the most significant five digits of the neighborhood geohash


    constructor(private db: AngularFirestore, public afAuth: AngularFireAuth) {
        mapboxgl.accessToken = environment.mapbox.accessToken
        //this.domain = this.initPartitions()
        //this.createPartition()
        this.domain = this.initPartitions()
        this.createPartition()
        // this.partitionsCollection = db.collection<any>('neighborhoods/init/init')
        // this.partitions = this.partitionsCollection.valueChanges()
    };




    createPartition() {

        console.log("Just launched createPartition!!!")

        var datab = this.db
        //var nextPartition: string = this.domain + "/" + this.domain
        var nextPartition: string = "neighborhoods/" + this.domain + "/" + this.domain

        console.log("nextPartition is : ", nextPartition);
        console.log("this.domain is : ", this.domain);
 
        const source = "this.partitionsCollection = datab.collection('" + nextPartition + "') as any"

        //Show us what you have for result
        let resulttest = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS }})
        console.log(JSON.stringify(resulttest))

        //Show us what we can use for result
        let result = ts.transpile(source)
        console.log("Print out result : ", result)
        eval(result)

        this.partitions = this.partitionsCollection.valueChanges()
        console.log("partitionsCollection assignment worked: ", this.partitionsCollection)
    }

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
  

    initPartitions(): string {
        var datab = this.db
        var dbfs = firebase.firestore()
        //domainRef = this.domain
        //let createPartRef = this.createPartition

        var domainRef = this.domain.bind

        // var partitionRef: void = this.createPartition()
 
        firebase.auth().onAuthStateChanged(function(checkuser) {
          if (checkuser) {
            var isAnonymous = checkuser.isAnonymous
              if (!isAnonymous) {
                var id = checkuser.uid
                var userLastSeen = dbfs.collection('users').doc(id)
                userLastSeen.get().then(function(response) {
                   console.log("-----I am a returning guest!!!-----")
                   if (response.exists) {
                      var geohashlast = response.get('properties.geohash')
                      var geohashlast_msd = geohashlast.substring(0, 5)

                      // we're going to be hyper conservative and define partitionsCollection here
                      console.log("This is geohashlast_msd : ", geohashlast_msd)

                      domainRef = geohashlast_msd

		      console.log("2nd time initPartition, is this.domain = null? ", domainRef)
                      // createPartRef()

                      return geohashlast_msd

                      //console.log("We supposedly instantiated a partition")
                      } 
                   }) 
	        } else {
                  Error("User is Anonymous")
                }
            }
       })
     console.log("For some reason, our init partition is NULL!!!")
     return null
     // We will either create the bridge to firestore if a domain exists, or we won't. 
     } 
         

}
