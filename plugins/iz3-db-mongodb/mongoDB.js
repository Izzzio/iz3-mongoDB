/**
 iZ³ | Izzzio blockchain - https://izzz.io

 Copyright 2018 Izio LLC (OOO "Изио")

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

const MongoClient = require('mongodb').MongoClient;
const logger = new (require(global.PATH.mainDir + '/modules/logger'))("MongoDB");

const collectionName = 'main';

class MongoDB {
    constructor(connectionString, workDir) {
        this.connectionString = 'mongodb://' + connectionString;
        this.workDir = workDir;
        this._initialized = false;
        this.db = '';
    }

    _init() {
        let self = this;
        return new Promise((resolve, reject) => {
            MongoClient.connect(
                this.connectionString,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                },
                (err, client) => {
                    if (err) {
                        logger.fatalFall('Connection error: '+ err);
                    } else {
                        logger.info('Connected correctly to DB');
                        this._initialized = true;
                        self.db = client.db("accountByPlugin");
                        resolve();
                    }
                });
        });
    }

    async put(key, value, options, callback) {
        if (!this._initialized) {
            await this._init();
        }
        await this.db.collection(collectionName).insertOne({[key]: value}, (err, result) => {
            if (callback) {
                callback(err);
            }
        });
    }

    async get(key, options, callback) {
        if (!this._initialized) {
            await this._init();
        }
        this.db.collection(collectionName).find({[key]: {$exists: true}}, (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback('', result);
        });
    }

    /*
    del(key, options, callback) {
        this.levelup.del(key, options, callback);
    }

    close(callback) {
        this.levelup.close(callback);
    }

    clear(callback) {
        let that = this;
        try {
            this.levelup.close(function () {
                fs.removeSync(that.workDir + '/' + that.name);
                that.levelup = levelup(leveldown(that.workDir + '/' + that.name));
                if(typeof callback !== 'undefined') {
                    callback();
                }
            });
        } catch (e) {
            if(typeof callback !== 'undefined') {
                callback();
            }
        }
    }

    save(callback) {
        if(typeof callback !== 'undefined') {
            callback();
        }
    }
    */
}

exports.init = (connectionString, workDir) => {
    return new MongoDB(connectionString, workDir);
};