/****************************
 COMMON MODEL
 ****************************/
 let _ = require("lodash");

 class Model {
 
     constructor(collection) {
         this.collection = collection;
     }
 
     // Store Data
     store(data, options = {}) {
         return new Promise((resolve, reject) => {
             const collectionObject = new this.collection(data)
             collectionObject.save((err, createdObject) => {
                 if (err) {
                     return reject({ message: err, status: 0 });
                 }
                 return resolve(createdObject);
             });
         });
     }
 
     bulkInsert(data) {
         return new Promise((resolve, reject) => {
             this.collection.collection.insert(data, (err, result) => {
                 if (err) {
                     reject("Find duplicate Users");
                 }
                 else {
                     resolve(result);
                 }
             });
         });
     }
 }
 
 module.exports = Model;