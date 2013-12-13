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
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById('scan').addEventListener('click', this.scan, false);
        document.getElementById('send').addEventListener('click', this.send, false);
    },

    // deviceready Event Handler
    //
    // The scope of `this` is the event. In order to call the `receivedEvent`
    // function, we must explicity call `app.receivedEvent(...);`
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    scan: function() {
        console.log('scanning');
        
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan( function (result) { 

            document.getElementById("barcode").value = result.text;

            console.log("Scanner result: \n" +
                "text: " + result.text + "\n" +
                "format: " + result.format + "\n" +
                "cancelled: " + result.cancelled + "\n");
           
            console.log(result);


        }, function (error) { 
            console.log("Scanning failed: ", error); 
        } );
    },

    send: function() {

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

                document.getElementById("debug").innerHTML = SOAPResponse.toString();

                if (SOAPResponse.toXML().getElementsByTagName("license")[0].childNodes[0].nodeValue == "YES") {
                    document.getElementById("message").innterHTML = "License verified";
                }
            },
            error: function (SOAPResponse) {
                document.getElementById("debug").innerHTML = SOAPResponse.toString();
            }
        }); 

    }

};