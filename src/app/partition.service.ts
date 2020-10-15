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
    public domain: any;

    public dbafs: AngularFirestore;

    // domain is the most significant five digits of the neighborhood geohash


    constructor(public db: AngularFirestore, public afAuth: AngularFireAuth) {

        //this.domain = this.initPartitions()
        //this.createPartition()


        this.initPartitions(db)


        // this.partitionsCollection = db.collection<any>('neighborhoods/init/init')
        // this.partitions = this.partitionsCollection.valueChanges()
    };




    createPartition(objref, passtheafdbref: AngularFirestore): void {

        console.log("Just launched createPartition!!!")

        var theafref: AngularFirestore = passtheafdbref

        var datab = objref.db
        var dbfs = firebase.firestore()

        var nextPartition: string = "neighborhoods/" + objref.domain + "/" + objref.domain

        console.log("nextPartition is : ", nextPartition);
        console.log("this.domain is : ", objref.domain);
 
//        const source = "objref.partitionsCollection = datab.collection('" + nextPartition + "') as any"

        const source = "objref.partitionsCollection = theafref.collection('" + nextPartition + "') as GeoJson"

//        objref.partitionsCollection = dbfs.collection<GeoJson>('neighborhoods/dr5rq/dr5rq')


//        THIS IS THE LINE WE ARE ATTEMPTING TO EXECUTE through eval(result)
//        objref.partitionsCollection = passtheafdbref.collection<GeoJson>('neighborhoods/dr5rq/dr5rq')


        //Show us what you have for result
        let resulttest = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS }})
        console.log(JSON.stringify(resulttest))

        //Show us what we can use for result
        let result = ts.transpile(source)
        console.log("Print out result : ", result)
        eval(result)

        objref.partitions = objref.partitionsCollection.valueChanges()
        console.log("partitionsCollection assignment worked: ", objref.partitionsCollection)
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
  

    public initPartitions(passafdbref: AngularFirestore): string {
        var datab = this.db
        var dbfs = firebase.firestore()
        //domainRef = this.domain
        //let createPartRef = this.createPartition

        var domainRef = this.domain

        var foofoo = this.createPartition
 
        firebase.auth().onAuthStateChanged(function(checkuser) {

          var foo = this

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

                      foo.domain = geohashlast_msd

		      console.log("2nd time initPartition, is this.domain = null? ", foo.domain)
                      // createPartRef()

                      //return geohashlast_msd
                      //var obj = {
                      //  bar: function() {
                      //    var x = (() => this);
                      //    return x;
                      //  }
                      //};
 
                      foofoo(foo, passafdbref) 

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
