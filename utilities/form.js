/****************************
 FORM HANDLING OPERATIONS
 ****************************/
 let multiparty = require('multiparty');

 class Form {
 
     constructor(request) {
         this.request = request;
     }
 
     // Method to send otp by email
     parse() {
         return new Promise(async (resolve, reject) => {
             let form = new multiparty.Form();
 
             // Parsing the form
             form.parse(this.request, (err, fields, files) => {
 
                 let formParseObject = {};
                 formParseObject.fields = fields;
                 formParseObject.files = files;
 
                 return resolve(formParseObject);
             });
         });
     }
 
 }
 
 module.exports = Form;
 
 