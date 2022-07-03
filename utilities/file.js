/****************************
 FILE HANDLING OPERATIONS
 ****************************/
 let fs = require('fs');
 let path = require('path');
 const _ = require("lodash");
 const mv = require('mv');
 
 
 class File {
 
     constructor(file, location) {
         this.file = file;
         this.location = location;
     }
 
     store() {
         return new Promise(async (resolve, reject) => {
             // Setting the path
             if (_.isEmpty(this.file.file)){
                return resolve({ status: 0, message: "Please send a file" });
             }
             const fileName = this.file.file[0].originalFilename;
             const filePath = path.join(__dirname, '..', 'public', 'upload', fileName);
             const uploadedFilePath = process.env.IMAGE_PATH + filePath;
             const fileObject = { "originalFilename": fileName, filePath: uploadedFilePath, filePartialPath: fileName}
             await mv(this.file.file[0].path, filePath, { mkdirp: true }, async (err, data) => {
                 if (err){
                    return resolve({ status: 0, message: "Internal server error" });
                 }
                 else { resolve(fileObject); }
             })
         });
     }
 
     readFile(filepath) {
         return new Promise((resolve, reject) => {
             fs.readFile(filepath, 'utf-8', (err, html) => {
                 if (err) { return reject({ message: err, status: 0 }); }
 
                 return resolve(html);
 
             });
         });
     }
 
 }
 
 module.exports = File;