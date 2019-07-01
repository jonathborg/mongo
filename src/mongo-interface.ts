import { MongoClient, } from 'mongodb'
import { QueryParams } from './interfaces'

export default class Mongo {

    _conn

    constructor(private config) {
        if (!config) {
            throw new Error('Config is required.')
        }
        this.config = config
    }

    public createConnInstance() {
        return new Promise((resolve, reject) => {

            if (this._conn) {
                return resolve(this._conn)
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
                this._conn = client
                return resolve(this)
            })
        })
    }

    async query(params: QueryParams) {
        let chain: any = this._conn
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
        if (this._conn)
            await this._conn[config].close()
    }

    async closeAll() {
        if (this._conn) {
            for (let c in this._conn)
                this._conn[c].close()
        }
    }
}
