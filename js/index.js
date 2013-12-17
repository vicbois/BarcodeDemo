/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById('scan').addEventListener('click', this.scan, false);
        document.getElementById('sendBarcode').addEventListener('click', this.sendBarcode, false);
        document.getElementById('sendCount').addEventListener('click', this.sendCount, false);
        document.getElementById('encode').addEventListener('click', this.encode, false);
    },

    // deviceready Event Handler
    //
    // The scope of `this` is the event. In order to call the `receivedEvent`
    // function, we must explicity call `app.receivedEvent(...);`
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    scan: function () {
        console.log('scanning');

        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan(function (result) {

            document.getElementById("barcode").value = result.text;

            console.log("Scanner result: \n" +
                "text: " + result.text + "\n" +
                "format: " + result.format + "\n" +
                "cancelled: " + result.cancelled + "\n");

            console.log(result);


        }, function (error) {
            console.log("Scanning failed: ", error);
        });
    },

    sendBarcode: function () {

        if (document.getElementById("barcode").value == '') {
            alert("Enter a barcode!");

        } else $.soap({
            url: 'http://www.merchantsoftware.biz:8082',
            method: 'goPOS_CountItemLookUp',

            data: {
                LPOSSerial: '8501204',
                barcode: document.getElementById("barcode").value
            },

            enableLogging: true,
            appendMethodToURL: false,

            success: function (soapResponse) {
                // do stuff with soapResponse
                // if you want to have the response as JSON use soapResponse.toJSON();
                // or soapResponse.toString() to get XML string
                // or soapResponse.toXML() to get XML DOM

                if (soapResponse.toXML().getElementsByTagName("FoundItem")[0].childNodes[0].nodeValue == "YES") {

                    document.getElementById("message").innerHTML = "Found Item!";
                    document.getElementById("brand").innerHTML += soapResponse.toXML().getElementsByTagName("brand")[0].childNodes[0].nodeValue;
                    document.getElementById("description").innerHTML += soapResponse.toXML().getElementsByTagName("description")[0].childNodes[0].nodeValue;
                    document.getElementById("size").innerHTML += soapResponse.toXML().getElementsByTagName("size")[0].childNodes[0].nodeValue;
                    document.getElementById("QOH").innerHTML += soapResponse.toXML().getElementsByTagName("QOH")[0].childNodes[0].nodeValue;

                } else document.getElementById("message").innerHTML = "Item not found!";
            },
            error: function (SOAPResponse) {
                document.getElementById("message").innerHTML = "Error";
            }
        });

    },

    sendCount: function() {

        var replace = "REPLACE";
        if(document.getElementById("add").checked) replace = "ADD";

        if (document.getElementById("count").value == '') {
            alert("Enter a count!");

        } else $.soap({
            url: 'http://www.merchantsoftware.biz:8082',
            method: 'goPOS_PostCount',

            data: {
                LPOSSerial: '8501204',
                barcode: document.getElementById("barcode").value,
                countQOH: document.getElementById("count").value,
                countAction: replace
            },

            enableLogging: true,
            appendMethodToURL: false,

            success: function (soapResponse) {
                // do stuff with soapResponse
                // if you want to have the response as JSON use soapResponse.toJSON();
                // or soapResponse.toString() to get XML string
                // or soapResponse.toXML() to get XML DOM

                if (soapResponse.toXML().getElementsByTagName("success")[0].childNodes[0].nodeValue == "SUCCESS") {

                    alert("Item updated successfully!\n Old Quantity: " + soapResponse.toXML().getElementsByTagName("oldQOH")[0].childNodes[0].nodeValue
                        + "\nNew Quantity: " + soapResponse.toXML().getElementsByTagName("newQOH")[0].childNodes[0].nodeValue);

                } else document.getElementById("message").innerHTML = "Failed to update Count";
            },
            error: function (SOAPResponse) {
                document.getElementById("message").innerHTML = "Error";
            }
        });
    },

    encode: function () {
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.encode(scanner.Encode.TEXT_TYPE, "http://www.nhl.com", function (success) {
            alert("encode success: " + success);
        }, function (fail) {
            alert("encoding failed: " + fail);
        }
        );

    }

};
