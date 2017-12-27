import {MD5} from "crypto-js";

export class AppInstallationRequest {
    readonly applicationKey: string;
    readonly token: string;
    readonly requestTime: string;
    readonly validationHash: string;
    readonly subdomain: string;
    readonly email: string;

    constructor(requestQuery: any) {
        this.applicationKey = requestQuery.a;
        this.token = requestQuery.t;
        this.requestTime = requestQuery.query.d;
        this.validationHash = requestQuery.query.h;
        this.subdomain = requestQuery.query.b;
        this.email = requestQuery.query.e;
    }
}

export class Application {
    readonly secretAppKey: string;
    readonly publicAppKey: string;

    constructor(secretAppKey: string, publicAppKey: string) {
        this.secretAppKey = secretAppKey;
        this.publicAppKey = publicAppKey;
    }

    /**
     * Check if the installation request is "valid". This means to make sanity check of the provided parameters such as
     * `applicationKey` and hash values calculated from combined attributes, application secret and to be compared to
     * the provided `validationHash`. Will throw errors if validation fails. Will do nothing if validation passes.
     *
     * @param installationRequest Nexudus application configuration
     */
    public validate(installationRequest: AppInstallationRequest) {
        if (installationRequest.applicationKey !== this.publicAppKey) {
            console.error(`Request application key '${installationRequest.applicationKey}' does not match configured application key '${this.publicAppKey}'`);
            throw new Error("Request parameters are not correct.");
        }

        const unsortedParams = [installationRequest.token, installationRequest.applicationKey, installationRequest.requestTime];
        const sortedParams = unsortedParams.sort();
        const calculatedHash = MD5(sortedParams.join("|").concat(this.secretAppKey)).toString();

        if (calculatedHash.toLowerCase() !== installationRequest.validationHash.toLowerCase()) {
            console.error(`Calculated request hash '${calculatedHash}' does not equal validation hash '${installationRequest.validationHash}'`);
            throw new Error("Checksums doesn't match.");
        }
    }

    public createAuthToken(installationRequest: AppInstallationRequest) {
        const appPassword = MD5(installationRequest.token + this.secretAppKey).toString().toLowerCase();
        return new Buffer(`${this.publicAppKey}:${appPassword}`).toString("base64");
    }
}
