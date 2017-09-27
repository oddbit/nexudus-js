import {CookieJar, Cookie} from "request";
import * as rp from "request-promise";
import * as tough from "tough-cookie";
import * as cookieParser from "set-cookie-parser"; 

export class PublicClient {

    private _cookieJar : CookieJar;

    constructor() {
        this._cookieJar = rp.jar();
    }
}