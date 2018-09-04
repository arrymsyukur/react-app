// import Constants from './Constant';
import query from 'query-string';
import da01 from './DA01Signature';
var now = new Date();
var dateFormat = require('dateformat');
const axios = require('axios');

class Service {

    constructor() {
    }

    request = async (onSuccess, onFailure, params) => {
        var username = params.username;
        let dateNow = await dateFormat(now, "ddd, d mmm yyyy HH:mm:ss Z");
        let signature;
        var authorization;
        var headers;
        if (params.authType === 'DA01') {
            signature = await da01.generateSignature(params.method, params.data, params.contentType, dateNow, params.canonicalPath, params.password);
            console.log('Masuk DA01');
            authorization = await 'DA01' + ' ' + username + ':' + signature;
            headers = {
                'Authorization': authorization
            }
            console.log('DA01 : ', headers);
        } else if (params.authType === 'BASIC') {
            signature = await da01.generateSignature(params.method, params.data, params.contentType, dateNow, params.canonicalPath, params.password);
            authorization = await 'BASIC' + ' ' + username + ':' + signature;
            headers = {
                'Authorization': authorization
            }
            console.log('BASIC : ', headers);

        } else {
            headers = {
            };
        }

        var options = {
            timeout: 30 * 1000,
            method: params.method,
        };


        var path = params.canonicalPath
        if (params.method === 'POST' || params.method === 'PUT') {
            headers['Content-Type'] = params.contentType
            headers['Accept-Encoding'] = params.contentType
            options.body = params.data;
        } else {
            if (params.data != null) {
                console.log('masuk ke parameter')
                let json = JSON.parse(params.data)
                path = path + '?'
                path += query.stringify(json)
            }

            console.log("Path", path);
        }

        options.headers = headers;

        console.log(headers)
        let url = params.url;
        console.log("========================= REQUEST =========================");
        console.log("URL", url);
        console.log("Path", path);
        console.log("Method", options.method);
        // console.log("Content-Type", options.headers['Content-Type']);
        // console.log("Authorization", options.headers.Authorization);
        // console.log("Body", options.body)
        console.log("=====================END OF REQUEST =========================");

        let response = await this.sendRequest(url, options)

        try {
            console.log("========================= RESPONSE =========================");
            console.log(JSON.stringify(response));

            let status = response.status;
            console.log("Response Header Code", status);

            let headers = response.headers;
            console.log("Headers", JSON.stringify(headers));

            let map = headers.map;
            console.log("Map", JSON.stringify(map));

            let rCode = response.headers.get('rc');
            console.log("Response Code", rCode);

            let date = response.headers.get('date');
            console.log("Date", date);

            if (status === 200) {

                let content = await response.json();
                console.log("Body", content);
                console.log(response.json)
                return onSuccess(rCode, content)
            }
            else {
                let message = await response._bodyText
                console.log('message error: ', message);
                return onFailure(rCode, message)
            }
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

        var xhttp = new XMLHttpRequest();
        xhttp.open(options.method, url, true);
        for (var key in options.headers) {
            xhttp.setRequestHeader(key, options.headers[key]);
        }

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                console.log('Response : ', this.response);
                return (this.response);
            }
        }
        xhttp.send(options.body);
    }





}

export default new Service()