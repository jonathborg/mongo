import { MongoClient, } from 'mongodb'
import { QueryParams } from './interfaces'
var _conn

export default class Mongo {

    constructor(private config) {
        if (!config) {
            throw new Error('Config is required.')
        }
        this.config = config
    }

    public createConnInstance() {
        return new Promise((resolve, reject) => {

            if (_conn) {
                return resolve(_conn)
            }

            let uri = `mongodb://${this.config.host}/${this.config.port}`
            if (!('port' in this.config)) {
                this.config['port'] = 27017
            }
            this.config['useNewUrlParser'] = true

            let mongoClientOptions = {}
            let dontKeep = ['host', 'port', 'poolName']
            for (let c in this.config) {
                if (dontKeep.indexOf(c) === -1) {
                    mongoClientOptions[c] = this.config[c]
                }
            }

            MongoClient.connect(uri, mongoClientOptions, (err, client) => {
                if (err) {
                    return reject(err)
                }
                _conn = client
                return resolve(this)
            })
        })
    }

    async query(params: QueryParams) {
        let chain: any = _conn
        for (let key in params) {
            if (params.hasOwnProperty(key)) {
                if (!(key in chain))
                    throw new Error(`Method ${key} not found in mongo chain.`)

                let param = (Array.isArray(params[key])) ? params[key] : [params[key]]
                chain = chain[key].apply(chain, param)
            }
        }
        return await chain
    }

    async close(config) {
        if (_conn)
            await _conn[config].close()
    }

    async closeAll() {
        if (_conn) {
            for (let c in _conn)
                _conn[c].close()
        }
    }
}
