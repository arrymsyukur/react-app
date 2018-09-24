/**
 * Created by Iwan Supratman on 20/10/2017.
 */

var md5 = require('js-md5');
var CryptoJS = require("crypto-js");

class DA01Signature {

    getString(method, data, contentType, date, canonicalPath) {
        var dataPlain = method;
        dataPlain += "\n";

        if (method === "POST" || method === "PUT") {

            if (data !== "" && data !== undefined) {
                var hex_md5v = md5.hex(JSON.parse(data));
                dataPlain += hex_md5v;
                dataPlain += "\n";
            }
            if (contentType !== "") {
                dataPlain += contentType;
                dataPlain += "\n";

            }
        }
        dataPlain += date;
        dataPlain += "\n";
        dataPlain += canonicalPath;

        return dataPlain;
    }

    generateSignature(method, data, contentType, date, canonicalPath, password) {

        var string_to_sign = this.getString(method, data, contentType, date, canonicalPath);
        console.log("contenttttt", string_to_sign);
        let hash = CryptoJS.HmacSHA1(string_to_sign, password);
        let result = CryptoJS.enc.Base64.stringify(hash);
        return result;
    }

}
export default new DA01Signature()