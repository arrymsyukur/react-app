// import Constants from './Constant';
import query from 'query-string';
import da01 from './DA01Signature';
var now = new Date();
var dateFormat = require('dateformat');

class Service {

    constructor() {
    }

    request = (onSuccess, onFailure, params) => {
        var username = params.username;
        let dateNow = dateFormat(now, "ddd, d mmm yyyy HH:mm:ss Z");
        let signature;
        var authorization;
        var headers = new Headers();
        if (params.authType === 'DA01') {
            signature = da01.generateSignature(params.method, params.data, params.contentType, null, params.canonicalPath, params.password);
            console.log('Masuk DA01');
            authorization = 'DA01' + ' ' + username + ':' + signature;
            headers = {
                'Authorization': authorization,
                'Date': dateNow
            }
            console.log('DA01 : ', headers);
        } else if (params.authType === 'BASIC') {
            signature = da01.generateSignature(params.method, params.data, params.contentType, null, params.canonicalPath, params.password);
            authorization = 'BASIC' + ' ' + username + ':' + signature;
            headers = {
                'Authorization': authorization,
                'Date': dateNow

            }
            console.log('BASIC : ', headers);

        } else {
            headers = {
                // 'Date': dateNow

            };
        }

        var options = {
            timeout: 30 * 1000,
            method: params.method,
        };


        var path = params.canonicalPath
        let url = params.url;
        if (params.method === 'POST' || params.method === 'PUT') {
            headers['Content-type'] = params.contentType
            if (params.data != null) {
                options.body = JSON.parse(params.data);
            }
        } else {
            if (params.urlParameters.length !== 0) {
                var urlParameters;
                console.log('masuk ke parameter')
                for (var i = 0; i < params.urlParameters.length; i++) {
                    if (i === 0) {
                        urlParameters = "?" + params.urlParameters[i].name + "=" + params.urlParameters[i].value;
                    } else {
                        urlParameters += "&" + params.urlParameters[i].name + "=" + params.urlParameters[i].value;
                    }
                }
                url += urlParameters;
            }

            console.log("Path", path);
        }

        options.headers = headers;

        console.log(headers)
        console.log("========================= REQUEST =========================");
        console.log("URL", url);
        console.log("Path", path);
        console.log("Method", options.method);
        // console.log("Content-Type", options.headers['Content-Type']);
        // console.log("Authorization", options.headers.Authorization);
        // console.log("Body", JSON.parse(options.body));
        console.log("=====================END OF REQUEST =========================");
        console.log("=====================SEND REQUEST =========================");
        try {
            let response;
            let status;
            var xhttp = new XMLHttpRequest();
            xhttp.open(options.method, url, true);
            for (var key in options.headers) {
                xhttp.setRequestHeader(key, options.headers[key]);
                console.log(key + " - " + options.headers[key]);
            }

            xhttp.onload = function () {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    console.log('Response : ', this.responseText);
                    console.log('Status : ', this.status);
                    response = this.responseText;

                    if (this.status === 200) {
                        let content = response;
                        console.log("Body", content);
                        console.log(response.json)
                        alert("Request Success")
                        return onSuccess(status, content)
                    }
                    else {
                        let message = response;
                        console.log('message error: ', message);
                        alert("Request Failed")
                        return onFailure(status, message)
                    }

                }
                let status = xhttp.statusText;
                let headers = xhttp.getAllResponseHeaders();
                console.log("========================= RESPONSE =========================");
                console.log("Response Header Code", status);
                console.log("Headers", headers);
            }

            xhttp.send(options.body);

            // let map = headers.map
            // console.log("Map", JSON.stringify('{' + map + '}'));

            // let rCode = status;
            // console.log("Response Code", rCode);

            // let date = response.headers.get('date');
            // console.log("Date", date);

        }
        catch (e) {
            console.log('error')
            console.log(e);
            return onFailure('06', e);
        }
    }


    sendRequest = async (url, options) => {
        // let response = await fetch(url, options)
        // console.log('Response ', response)
        // return response


    }





}

export default new Service()