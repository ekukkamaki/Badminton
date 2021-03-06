﻿import { IDatabase, IMain } from 'pg-promise';
import sqlProvider = require('../sql');

var sql = sqlProvider.match;

/*
 This repository mixes hard-coded and dynamic SQL,
 primarily to show a diverse example of using both.
 */

export class Repository {

    constructor(db: any, pgp: IMain) {
        this.db = db;
        this.pgp = pgp; // library's root, if ever needed;
    }

    // if you need to access other repositories from here,
    // you will have to replace 'IDatabase<any>' with 'any':
    private db: IDatabase<any>;

    private pgp: IMain;

    // Creates the table;
    create = () =>
        this.db.none(sql.create);

    // Initializes the table with some user records, and return their id-s;
    init = () =>
        this.db.map(sql.init, [], (row: any) => row.id);

    // Tries to delete a match by id, and returns the number of records deleted;
    remove = (id: number) =>
        this.db.result('DELETE FROM Match WHERE id = $1', id, (r: any) => r.rowCount);

    // Tries to find a match from id;
    find = (id: number) =>
        this.db.oneOrNone('SELECT * FROM Match WHERE id = $1', id);

    // Returns all user records;
    all = () =>
        this.db.any('SELECT * FROM Match');

    // Returns the total number of users;
    total = () =>
        this.db.one('SELECT count(*) FROM Match', [], (a: any) => +a.count);   
}