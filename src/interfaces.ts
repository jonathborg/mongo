import { MongoClientOptions, FilterQuery, UpdateQuery, UpdateOneOptions, MongoCountPreferences, CollectionAggregationOptions, CollectionInsertOneOptions, CollectionInsertManyOptions, CommonOptions, ClientSession, ReadPreference } from 'mongodb';

export interface ConnectionOptions extends MongoClientOptions {
    host: string,
    port?: number
}

export interface QueryParams {
    db: string,
    collection: string;
    find?: FilterQuery<Object>;
    findOne?: FilterQuery<Object>;
    updateOne?: [FilterQuery<Object>, UpdateQuery<any>, UpdateOneOptions?];
    countDocuments?: [FilterQuery<Object>, MongoCountPreferences] | null | undefined;
    aggregate?: [Object[], CollectionAggregationOptions?] | Object[];
    insertOne?: [Object, CollectionInsertOneOptions?] | Object;
    insertMany?: [Object, CollectionInsertManyOptions?] | Object;
    deleteOne?: [FilterQuery<Object>, (CommonOptions & { bypassDocumentValidation?: boolean })?] | FilterQuery<Object>;
    distinct?: [string, FilterQuery<Object>, ({ readPreference?: ReadPreference | string, maxTimeMS?: number, session?: ClientSession })?];
    toArray?: null | undefined;
}
