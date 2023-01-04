const _ = require("lodash");

const Controller = require("../base");

const Form = require("../../utilities/form");
const File = require("../../utilities/file");



class FileUploadController extends Controller {
    constructor() {
        super();
    }


      /********************************************************
        Purpose: Single File uploading
        Parameter:
        {
            "file":
        }
        Return: JSON String
    ********************************************************/
        async fileUpload() {
            return new Promise(async (resolve, reject) => {
                try {
                    let form = new Form(this.req);
                    let formObject = await form.parse();
                    if (_.isEmpty(formObject.files))
                        return this.res.send({ status: 0, message: "Please send a file" });
                    // let filePath;
                    let file = new File(formObject.files);
                    let fileObject = await file.store();
                    let filepath = fileObject.filePartialPath;
                    let data = { filepath }
                    this.res.send({ status: 1, message: "File uploaded successfully", data });
                }
                catch (error) {
                    console.log("error- ", error);
                    this.res.send({ status: 0, message: error });
                }
            });
        }
}
module.exports = FileUploadController;