import * as bodyParser from "body-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");
import { IndexRoute } from "./routes/index";

import db = require('./db/dbBase');

/**
 * The server.
 *
 * @class Server
 */
export class Server {

    public app: express.Application;

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    public static bootstrap(): Server {
        return new Server();
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        //create expressjs application
        this.app = express();

        //configure application
        this.config();

        //add routes
        this.routes();

        //add api
        this.api();
    }

    /**
     * Create REST API routes
     *
     * @class Server
     * @method api
     */
    public api() {
        this.GET('/test', db.match.total);

        this.app.post("/season/insert", (req, res) => {

            if (!req.body || !req.body.year || !req.body.quarter || req.body.quarter > 3)
                res.send(404, "missing member");

            if (!req.body.description)
                res.send(404, 'Description missing');

            db.season.insert(req.body.year, req.body.quarter, req.body.description)
                .then((data: any) => {
                    console.log('inserted succesfully', data);
                    res.json({
                        success: true,
                        inserted_id: data
                    });
                });
        });
    }

    /**
     * Configure application
     *
     * @class Server
     * @method config
     */
    public config() {
        //add static paths
        this.app.use(express.static(path.join(__dirname, "public")));

        //configure pug
        this.app.set("views", path.join(__dirname, "views"));
        this.app.set("view engine", "pug");

        //use logger middlware
        this.app.use(logger("dev"));

        //use json form parser middlware
        this.app.use(bodyParser.json());

        //use query string parser middlware
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));

        //use cookie parker middleware middlware
        //this.app.use(cookieParser("SECRET_GOES_HERE"));

        //use override middlware
        this.app.use(methodOverride());

        //catch 404 and forward to error handler
        this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            err.status = 404;
            next(err);
        });

        //error handling
        this.app.use(errorHandler());
    }

    /**
     * Create router
     *
     * @class Server
     * @method api
     */
    public routes() {
        //empty for now
        let router: express.Router;
        router = express.Router();

        //IndexRoute
        //IndexRoute.create(router);

        //use router middleware
        this.app.use(router);
    }
    public GET(url: string, handler: (req: any) => any) {
        this.app.get(url, (req, res) => {
            handler(req)
                .then((data: any) => {
                    res.json({
                        success: true,
                        data
                    });
                })
                .catch((error: any) => {
                    res.json({
                        success: false,
                        error: error.message || error
                    });
                });
        });
    }
}