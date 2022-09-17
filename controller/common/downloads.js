const _ = require("lodash");

const Controller = require("../base");
const json2csv = require('json2csv').parse;
const json2xls = require('json2xls');
const path = require('path');
const fs = require('fs');


class DownloadsController extends Controller {
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
/************* for downloading csv and excel files ***************/
downloadFiles(data) {
    return new Promise(async (resolve, reject) => {
        try {
            let model = data.model;
            let file = data.fileName;
            let query = data.query ? data.query : {}
            let projectData = data.projectData ? data.projectData : {}
            let type = data.type.toLowerCase();
            let stages = (data.stages) ? (data.stages) : []
            let ext = (type === 'csv') ? ('.csv') : (type === 'excel') ? ('.xlsx') : '';

            /*********  Data getting from database begins **********/
            const listing = await model.aggregate([
                { $match: query },
                ...stages, 
                ])
            /*********  Data getting from database ends **********/
            if (_.isEmpty(listing))
                return resolve({ status: 0, message: "Details not found" });

            /*********  code for csv and excel download begins **********/
            let fields = data.filteredFields;
            const opts = { fields };
            const filePathAndName = file + '-' + type + '-' + Date.now() + ext;
            const filePath = path.join(__dirname, `../../public/upload/${type}/`, filePathAndName);
            console.log(`filePath: ${filePath}`)
            if (type === 'csv') {
                const csv = json2csv(listing, opts);
                fs.writeFile(filePath, csv, function (err) {
                    if (err)
                        return resolve({ status: 0, message: "Internal server error" });
                })
                return resolve({ filePathAndName });
            }
            else if (type === 'excel') {
                var excel = json2xls(listing, opts);
                fs.writeFileSync(filePath, excel, 'binary')
                return resolve({ filePathAndName });
            }
            /*********  code for csv and excel download ends **********/

            else {
                return resolve({ status: 0, message: "Bad request" + ' of type value' });
            }
        }
        catch (error) {
            return reject(error)
        }
    })
}

async dateFilter({key, startDate, endDate}){
    let filter = []
    const newStartDate = new Date(startDate)
    const newEndDate = new Date(endDate)
    const date1 = new Date(newStartDate.setUTCHours(0, 0, 0, 0));
    const date2 = new Date(newEndDate.setUTCHours(23, 59, 59, 999));
    console.log(`date1: ${date1} and date2: ${date2}`)
    const fq = { [key]: { $gte: date1, $lte: date2 } }
    if (startDate && endDate) {filter.push(fq); }
    else if (startDate) { filter.push({ [key]: { $gte: date1 } }); }
    else if (endDate) { filter.push({ [key]: { $lte: date2 } }); }
    return filter;
}
}
module.exports = DownloadsController;