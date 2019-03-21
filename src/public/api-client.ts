import {CookieJar, Cookie} from "request";
import * as rp from "request-promise";
import * as tough from "tough-cookie";
import * as nxTypes from "../types";

export class PublicApiClient {

    private _cookieJar: CookieJar;
    private _spaceUrl: string;
    private _credentials: string;

    constructor(spaceName: string, email: string, password: string) {
        this._cookieJar = rp.jar();

        this._spaceUrl = `https://${spaceName}.spaces.nexudus.com/en`;
        this._credentials = new Buffer(`${email}:${password}`).toString("base64");

        console.log("CREATED PublicApiClient: " + JSON.stringify(this, null, 2));
    }

    getProfile() {
        return this.request("GET", "/profile") as Promise<nxTypes.Profile>;
    }

    getCoworker() {
        return this.request("GET", "/profile?_resource=Coworker") as Promise<nxTypes.Coworker>;
    }

    getUser() {
        return this.request("GET", "/profile?_resource=User") as Promise<nxTypes.User>;
    }

    getInvoices() {
        return this.request("GET", "/invoices") as Promise<nxTypes.InvoiceData>;
    }

    // ------------------------------------------------------------------------

    private async request(method: string, uri: string, body?: any) {
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
