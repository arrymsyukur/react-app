/**
 * Created by Iwan Supratman on 20/10/2017.
 */

var md5 = require('js-md5');
var CryptoJS = require("crypto-js");
// import Constants from './Constant'

class DA01Signature {

    getString(method, data, contentType, date, canonicalPath) {
        var dataPlain = method;
        dataPlain += "\n";

        if (method == "POST" || method == "PUT") {

            if (data != "") {
                var hex_md5v = md5.hex(data);
                dataPlain += hex_md5v;
                dataPlain += "\n";
            }
            if (contentType != "") {
                dataPlain += contentType;
                dataPlain += "\n";

            }
        }
        dataPlain += date;
        dataPlain += "\n";
        dataPlain += canonicalPath;

        return dataPlain;
    }

    async generateSignature(method, data, contentType, date, canonicalPath, password) {
        /*console.log("method", method);
        console.log("data", data);
        console.log("contentType", contentType);
        console.log("date", date);
        console.log("canonicalPath", canonicalPath);*/

        var string_to_sign = this.getString(method, data, contentType, date, canonicalPath);
        console.log("contenttttt", string_to_sign);
        let hash = CryptoJS.HmacSHA1(string_to_sign, password);
        // console.log("hash = ", hash.toString());        
        // console.log(hash.toString(CryptoJS.enc.Base64));
        let result = CryptoJS.enc.Base64.stringify(hash);
        // console.log('RESULT ', result);

        return result;
    }

}
export default new DA01Signature()