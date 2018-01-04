# @oddbit/nexudus 
![License](https://img.shields.io/npm/l/@oddbit/nexudus.svg)
![NPM version](https://img.shields.io/npm/v/@oddbit/nexudus.svg)
![Total NPM downloads](https://img.shields.io/npm/dt/@oddbit/nexudus.svg)
[![Travis build status](https://img.shields.io/travis/oddbit/nexudus-js.svg)](https://travis-ci.org/oddbit/nexudus-js)

An easy to use and Typscript friendly API client for Nexudus.

## Admin API 
The admin API requires a [registered Nexudus "App"](http://help.spaces.nexudus.com/en/api/getting-started.html) and an auth token.

> The Nexudus Spaces API allows you to develop Apps and modules that extend the Nexudus Spaces platform. You can implment features that your business may require or even create solutions that can be sold to other Nexudus Spaces customers.

In order to create an App you need a Nexudus account for your business or if you have set up a "test space" for sandbox testing (perhaps you should check first with Nexudus to see what they advice: info@nexudus.com).

Log in to your space and enter the "Apps list" and create an entry for your own App: https://spaces.nexudus.com/Apps/Applications

Select all the permissions that are matching the API endpoints that you intend to be using.

### Usage
Before you can use the *admin API client* you must complete an installation request that Nexudus will push to your endpoint when a someone is choosing to activate/install your App.

Please read the [official API documentation](http://help.spaces.nexudus.com/en/api/authentication.html) to learn more about the variables that are passed in the `requests.query` that is used to initialize `AppInstallationRequest` in the example below.

#### Consuming installation request

```typescript
import * as nexudus from "@oddbit/nexudus";

function apiEndoint(request, response) {
    // Store your secret/public app keys safely somewhere...
    const application = new nexudus.Application(SECRET_APP_KEY, PUBLIC_APP_KEY);

    const installationRequest = new nexudus.AppInstallationRequest(request.query);

    try {
        application.validate(installationRequest);
    } catch(err) {
        response.status(401).send("The installation request was not valid");
        return;
    }
    const apiAuthToken = application.createAuthToken(installationRequest);

    // ...
    // Store the apiAuthToken somewhere in your database
    // ...
    // Do other stuffs
    // ...

    response.status(200).send("Install succsess!");
}
```

#### Fetch all businesses
In the example below, we're fetching all `Business` objects that a certain account. See the documentation the official documentation for how Nexudus is organizing the hierarchy and relationships between *businesses*, *user*, *coworkers* and *check-ins*. 

```typescript
import * as nexudus from "@oddbit/nexudus";

const apiClient = new nexudus.AdminApiClient(apiAuthToken);
const nexudusBusinessList = await apiClient.getBusinesses();
nexudusBusinessList.forEeach(nexudusBusiness => {
    console.log(`Got business '${nexudusBusiness.Name}' with id: ${nexudusBusiness.Id}`);
});
```
#### Fetch businesses and filter results
Currently it's only supported to filter the results by "time of update", which allows you to only fetch records that has been updated after a certain point in time.

 ```typescript
const timestamp = new Date(2015, 3, 1);
const nexudusBusinessList = await apiClient.getBusinesses({updatedAfter: timestamp.getTime()});
```

#### Fetch single businesses 

 ```typescript
// You must know the Nexudus ID of the business
const nexudusBusiness = await apiClient.getBusiness(12345);
```

#### Update 
The API client will perform an **update** if the data object contains an `Id`. The operation will fail if Nexudus does not know of any corresponding object with that id (i.e. if it hasn't been created yet).

 ```typescript
const nexudusBusiness = {
    "Id": 123456,
    "Name": "Kumpul Coworking Space",
    "WebAddress": "https://www.kumpul.co"
} as nexudus.Business;
await apiClient.saveBusiness(nexudusBusiness);
```

#### Create 
The API client will **create** a new record at Nexudus if there is no `Id` attribute present. 
 ```typescript
const nexudusBusiness = {
    "Name": "Kumpul Coworking Space",
    "WebAddress": "https://www.kumpul.co"
} as nexudus.Business;
await apiClient.saveBusiness(nexudusBusiness);
```

#### Delete 

 ```typescript
// You must know the Nexudus ID of the business
await apiClient.deleteBusiness(12345);
```


## Public API
The public API is designed to work with the public resources of the space **and** also member restricted resources. The API is using the member's email and password for authentication, which makes it easier to use and apply in your application. But it is also restricted in its powers. You can't do things like "check in" or "check out".

### Usage

In the example below, we're fetching the `Coworker` object of the user *"john.doe@example.com"* at Nexudus. See the documentation on the difference between "User" and "Coworker" at [Nexudus's API documentation](http://help.spaces.nexudus.com/en/api/public/profile.html).

The API client is throwing a `HTTP 401` error if username or password is wrong.

```typescript
import * as nexudus from "@oddbit/nexudus";

const apiClient = new nexudus.PublicApiClient("kumpul", "john.doe@example.com", "secretPassword");

try {
    const nexudusCoworker = await apiClient.getCoworker();
} catch (err) {
    console.log(`You just got yourself a HTTP ${err.statusCode} error: ${err.message}`);
}
```