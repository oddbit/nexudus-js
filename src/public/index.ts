import {CookieJar, Cookie} from "request";
import * as rp from "request-promise";
import * as tough from "tough-cookie";
import * as Promise from "bluebird";
import * as nxTypes from "./types";

export interface ClientOpts {
    email?: string,
    password?: string 
}

export class PublicApiClient {

    private _cookieJar: CookieJar;
    private _spaceUrl: string;
    private _credentials: string;

    constructor(spaceName: string, email: string, password: string) {
        this._cookieJar = rp.jar();

        this._spaceUrl = `https://${spaceName}.spaces.nexudus.com/en`;
        this._credentials = new Buffer(`${email}:${password}`).toString("base64");;

        console.log("CREATED PublicApiClient: " + JSON.stringify(this, null, 2));
    }

    getProfile(): Promise<nxTypes.Profile> {
        return this.request("GET", "/profile");
    }

    getCoworker(): Promise<nxTypes.Coworker> {
        return this.request("GET", "/profile?_resource=Coworker");
    }

    getUser(): Promise<nxTypes.User> {
        return this.request("GET", "/profile?_resource=User");
    }

    getInvoices(): Promise<nxTypes.InvoiceData> {
        return this.request("GET", "/invoices");        
    }

    // ------------------------------------------------------------------------

    private request(method: string, uri:string, body?: any): Promise<any> {
        const opts = {
            method: method,
            uri: this._spaceUrl + uri,
            headers: {
                "Authorization": this._credentials,
                "Content-Type": "application/json"
            },
            resolveWithFullResponse: true,
            jar: this._cookieJar,
            json: true,
            body: body
        };

        return rp(opts).then((response) => {
            return response.body;
        });
    }
}