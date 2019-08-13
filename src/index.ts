import Mongo from './mongo-interface'

export function createConnection(config) {
    return new Mongo(config).createConnInstance()
}
