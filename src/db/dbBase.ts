import * as promise from "bluebird"
import { IMain, IDatabase, IOptions } from 'pg-promise'

import match = require('./repos/match');
import season = require('./repos/season');

//TODO: install diff repoes
interface IExtensions {
    match: match.Repository
    season: season.Repository
}

var options: IOptions<IExtensions> = {
    promiseLib: promise,
    extend: (obj: IExtensions) => {
        obj.match = new match.Repository(obj, pgp),
        obj.season = new season.Repository(obj, pgp)
    }
}

var config = {
    user: 'esa', //env var: PGUSER
    database: 'Badminton', //env var: PGDATABASE
    password: 'test1', //env var: PGPASSWORD
    host: 'localhost', // Server hosting the postgres database
    port: 5432, //env var: PGPORT
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

import * as pgPromise from "pg-promise"

var pgp: IMain = pgPromise(options);

// Create the database instance with extensions:
var db = <IDatabase<IExtensions> & IExtensions>pgp(config);

// Load and initialize optional diagnostics:
import diag = require('./diagnostics');
diag.init(options);

// If you ever need to change the default pool size, here's an example:
// pgp.pg.defaults.poolSize = 20;

// Database object is all that's needed.
// And if you even need access to the library's root (pgp object),
// you can do it via db.$config.pgp
// See: http://vitaly-t.github.io/pg-promise/Database.html#.$config
export = db;