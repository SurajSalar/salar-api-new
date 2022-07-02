/****************************
 PROCESS REQUEST BODY
 ****************************/
 const _ = require("lodash");

 class RequestBody {
     constructor() {
     }
     processRequestBody(body, fieldsArray) {
         return new Promise(async (resolve, reject) => {
             try {
                 let data = {};
                 fieldsArray.forEach(field => {
                     field in body && typeof body[field] != "undefined" ? data[field] = typeof body[field] === 'string' ? body[field].trim() : body[field] : delete data[field]
                 });
                 return resolve(data);
             } catch (error) {
                 return reject({ status: 0, message: error });
             }
         });
     }
     checkEmptyWithFields(body, fieldsArray) {
         return new Promise(async (resolve, reject) => {
             try {
                 var requiredFields = [];
                 fieldsArray.forEach(element => {
                     if (!(element in body) || body[element] === "" || typeof body[element] === "undefined") {
                         requiredFields.push(element);
                     }
                 });
                 resolve(requiredFields);
             } catch (error) {
                 reject(error);
             }
         });
 
     }
 }
 
 module.exports = RequestBody;