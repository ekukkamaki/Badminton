import { IDatabase, IMain } from 'pg-promise';

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

    insert = (date: Date, quarter: number, desc: string) =>
        this.db.one('INSERT INTO season (year, quarter, description) values ($1, $2, $3) returning id', [date, quarter, desc], event => event.id);
}