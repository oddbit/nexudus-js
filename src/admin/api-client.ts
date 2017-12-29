import {CookieJar, Cookie} from "request";
import * as rp from "request-promise";
import * as tough from "tough-cookie";
import * as types from "./types";
import * as utils from "../utils";
import { WebHook } from "../index";

/**
* Generic JSON structure for a Nexudus API response
*/
interface AdminApiResponse {
    Status: number,
    Message: string,
    Value?: any,
    OpenInDialog?: boolean,
    OpenInWindow?: boolean,
    RedirectURL?: any,
    JavaScript?: any,
    Errors?: AdminApiErrorDetail[],
    WasSuccessful: boolean
}
    
/**
* Error details
*/
interface AdminApiErrorDetail {
    AttemptedValue?: any,
    Message: string,
    PropertyName: string
}


/**
* Envelope structure for an API call that responds with a list of data.
*/
interface AdminApiListResponse {
    Records: any[],
    CurrentPageSize: number,
    CurrentPage: number,
    CurrentOrderField?: string,
    CurrentSortDirection: number,
    FirstItem: number,
    HasNextPage: boolean,
    HasPreviousPage: boolean,
    LastItem: number,
    PageNumber: number,
    PageSize: number,
    TotalItems: number,
    TotalPages: number
}


export interface QueryOptions {
    updatedAfter?: number;
}

interface InternalQueryOptions extends QueryOptions {
    module: string;
    url: string;
}

const BUSINESS_QUERY_OPTS: InternalQueryOptions = {
    module: "Business",
    url: "https://spaces.nexudus.com/api/sys/businesses"
};

const COWORKER_QUERY_OPTS: InternalQueryOptions = {
    module: "Coworker",
    url: "https://spaces.nexudus.com/api/spaces/coworkers"
};

const CHECKIN_QUERY_OPTS: InternalQueryOptions = {
    module: "Checkin",
    url: "https://spaces.nexudus.com/api/spaces/checkins"
};

const WEBHOOK_QUERY_OPTS: InternalQueryOptions = {
    module: "WebHook",
    url: "https://spaces.nexudus.com/api/sys/webhooks"
};

/**
 * The Nexudus API client wraps the HTTP/REST API communication with Nexudus.
 * The client handles the complexity of paginated response data and nice error handling at times when unsuccessful API
 * actions receive HTTP 200 status response with the error only described in the JSON data (see e.g. check-ins that
 * fail due to semantic restrictions of the membership).
 */
export class AdminApiClient {
    private readonly url: string;
    private readonly moduleName: string;
    private readonly nodeTlsRejectUnauthorized?: string;
    private requestOptions: rp.RequestPromiseOptions;

    /**
     * Create an instance of the API client.
     *
     * @param url Base URL for the API endpoint
     * @param apiKey The API key configured in the Nexudus installation of this business
     * @param name Name of the current module/data model (i.e. "Business", "Coworker", etc). This is used for parameter names if needed.
     */
    constructor(apiKey: string) {
        this.requestOptions = this.requestOptions || {};
        this.requestOptions.json = true;
        this.requestOptions.headers = this.requestOptions.headers || {};
        this.requestOptions.headers["Authorization"] = `Basic ${apiKey}`;
        this.nodeTlsRejectUnauthorized = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    }

    getBusiness(id: number) {
        return this.get(id, BUSINESS_QUERY_OPTS) as Promise<types.Business>;
    }

    getBusinesses(opts?: QueryOptions) {
        return this.getList(Object.assign(opts, BUSINESS_QUERY_OPTS)) as Promise<types.Business[]>;
    }

    getCoworker(id: number) {
        return this.get(id, COWORKER_QUERY_OPTS) as Promise<types.Coworker>;
    }

    getCoworkers(opts?: QueryOptions) {
        return this.getList(Object.assign(opts, COWORKER_QUERY_OPTS)) as Promise<types.Coworker[]>;
    }

    getCheckIn(id: number) {
        return this.get(id, CHECKIN_QUERY_OPTS) as Promise<types.CheckIn>;
    }

    getCheckIns(opts?: QueryOptions) {
        return this.getList(Object.assign(opts, CHECKIN_QUERY_OPTS)) as Promise<types.CheckIn[]>;
    }

    getWebHook(id: number) {
        return this.get(id, WEBHOOK_QUERY_OPTS) as Promise<types.WebHook>;
    }

    getWebHooks(opts?: QueryOptions) {
        return this.getList(Object.assign(opts, WEBHOOK_QUERY_OPTS)) as Promise<types.WebHook[]>;
    }

    saveWebHook(data: WebHook) {
        return this.save(data, WEBHOOK_QUERY_OPTS);
    }

    deleteWebHook(id: number) {
        return this.remove(id, WEBHOOK_QUERY_OPTS);
    }

    private async getList(opts: InternalQueryOptions) {
        const requestOptions = Object.assign({}, this.requestOptions);
        requestOptions.qs = requestOptions.qs || {};
        requestOptions.qs.size = 1000;
        requestOptions.qs.page = 1;
        requestOptions.qs[`from_${opts.module}_UpdatedOn`] = utils.formatDate(opts.updatedAfter);

        const responseData: any[] = [];
        let hasMorePages = true;
        while (hasMorePages) {
            try {
                console.log(`Nexudus API client GET ${opts.url} with options: ${JSON.stringify(requestOptions)}`);
                this.setIgnoreSslCertRejection(true);
                const response: AdminApiListResponse = await rp.get(opts.url, requestOptions);
                hasMorePages = response.HasNextPage;
                for (const record of response.Records) {
                    responseData.push(record);
                }
            } catch (error) {
                return AdminApiClient.handleError(error)
            } finally {
                this.setIgnoreSslCertRejection(false);
            }

            requestOptions.qs.page += 1;
        }

        return responseData;
    }

    private async get(id: number, opts: InternalQueryOptions) {
        const requestOptions = Object.assign({}, this.requestOptions);
        const url = `${opts.url}/${id}`;
        try {
            console.log(`Nexudus API client GET ${url} with options: ${JSON.stringify(requestOptions)}`);
            this.setIgnoreSslCertRejection(true);
            return rp.get(url, requestOptions);
        } catch (error) {
            return AdminApiClient.handleError(error)
        } finally {
            this.setIgnoreSslCertRejection(false);
        }
    }

    private async remove(id: number, opts: InternalQueryOptions) {
        const requestOptions = Object.assign({}, this.requestOptions);
        const url = `${opts.url}/${id}`;
        try {
            console.log(`Nexudus API client DELETE ${url} with options: ${JSON.stringify(requestOptions)}`);
            this.setIgnoreSslCertRejection(true);
            return await rp.delete(url, requestOptions);
        } catch (error) {
            return AdminApiClient.handleError(error)
        } finally {
            this.setIgnoreSslCertRejection(false);
        }
    }

    /**
     * Create or update a Nexudus entity. Upon success, the method will only resolve the numeric Id. This is done
     * to stay consistent between Nexudus's API response types between PUT/POST:
     *
     *  - POST: Responds with a fully created object
     *  - PUT: Responds only with the Id of the updated object
     *
     * Akses will instead rely on the subsequent webhook notification(s) that will report any potential difference
     * between the data we tried to create and what was actually written.
     *
     * @param data Nexudus JSON data that will be sent in the POST request
     * @returns {Promise<any>}
     */
    private async save(data: any, opts: InternalQueryOptions) {
        const requestOptions = Object.assign({}, this.requestOptions);
        requestOptions.body = data;
        requestOptions.method = data.Id ? "PUT" : "POST";
        try {
            console.log(`Nexudus API client ${requestOptions.method} ${opts.url} with options: ${JSON.stringify(requestOptions)}`);
            console.log(`Nexudus API client ${requestOptions.method} data: ${JSON.stringify(data)}`);
            this.setIgnoreSslCertRejection(true);
            const responseData: AdminApiResponse = await rp(opts.url, requestOptions);
            console.log(`Nexudus API response: ` + JSON.stringify(responseData));
            if (!responseData["WasSuccessful"]) {
                return AdminApiClient.handleError(responseData);
            }

            return responseData.Value.Id;
        } catch (error) {
            console.error(`Got error while saving data (HTTP ${requestOptions.method}): ${error.message}`);
            return AdminApiClient.handleError(error);
        } finally {
            this.setIgnoreSslCertRejection(false);
        }
    }


    /**
     * Smartly handle Nexudus error replies
     */
    private static handleError(error: any) {
        console.log("Raw error data: " + JSON.stringify(error));
        if (error.hasOwnProperty("Message")) {
            return Promise.reject({message: error["Message"]});
        }

        return Promise.reject(error);
    }

    /**
     * Ignore SSL certificate rejection errors that seems to occur some times. Search Google for
     * "RequestError: Error: certificate has expired" related to NodeJS
     *
     * @param flag Set `true` to ignore error and `false` to reset default
     */
    private setIgnoreSslCertRejection(flag: boolean) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = flag ? '0' : this.nodeTlsRejectUnauthorized;
    }
}
