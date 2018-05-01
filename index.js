/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Contributors:
 *     William Bathurst
 *     Louis Lamoureux
 *     Geoffrey Barnard
 */

const https = require("https");
const crypto = require('crypto');
const fs = require('fs');
const hash = crypto.createHash('sha256');
let path = require('path');
let cert = path.resolve('./', 'cert.pem');
let privKey = path.resolve('./', 'privKey.pem');
let authPayload = {"type": "device", protocol: "M2MI_AUTH_V1"};
let publishPayload = {"ItemUniversallyUniqueID": "1024241260","BagPosition": {"PointElevationNumber": "0.000000","PointLatitudeNumber": "0.000000","PointLongitudeNumber": "0.000000"},"BagTag": {"TagID": "020406080013"},"BagPhysicalProperty": {"MeasurementUniversallyUniqueID": "kilograms","WeightMeasure": "55"},"BagSegment": {"FlightID": "UA666","DepStation": {"IATALocationCode": "AAA"},"ArrivalStation": {"IATALocationCode": "AAA"}},"BagActivity": {"ActivityCode": "Move","ActualDateTime": "2018-01-17T09:30:47Z","PointLongitudeNumber": {"IATALocationCode": "AAA"}}}
let accessToken = null;

const certInput = fs.createReadStream(cert);
certInput.on('readable', () => {
    const certData = certInput.read();
    if (certData)
        hash.update(certData);
    else {
        authPayload["id"] = hash.digest('base64');

        let pem = fs.readFileSync(privKey);
        let key = pem.toString('ascii');
        let sign = crypto.createSign('RSA-SHA256');
        sign.update(fs.readFileSync(cert).toString('ascii'));
        authPayload["secret"] = sign.sign(key, 'base64');

        let authOptions = {
            hostname: 'portal.m2mi.net',
            port: 8181,
            path: '/m2mi/v2/auth/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': 798
            }
        };

        let authReq = https.request(authOptions, (res) => {
            res.on('data', (d) => {
                if (res.statusCode === 200) {
                    accessToken = JSON.parse(d).access

                    let nodeOptions = {
                        hostname: 'track.m2mi.net',
                        port: 8181,
                        path: '/node/v2/rs/node/data',
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + accessToken,
                            'Content-Type': 'application/json'
                        }
                    };

                    let nodeReq = https.request(nodeOptions, (res) => {
                        res.on('data', (d) => {
                            if (res.statusCode === 200) {
                                console.log(JSON.parse(d))
                            }
                        })
                    })

                    nodeReq.on('error', (e) => {
                        console.error(e);
                    });

                    nodeReq.write(JSON.stringify(publishPayload));
                    nodeReq.end();
                }
            });
        });

        authReq.on('error', (e) => {
            console.error(e);
        });

        authReq.write(JSON.stringify(authPayload));
        authReq.end();
    }

});
