# @oddbit/nexudus [![npm version](https://img.shields.io/npm/v/@oddbit/nexudus.svg)](https://www.npmjs.com/package/@oddbit/nexudus) ![npm](https://img.shields.io/npm/l/@oddbit/nexudus.svg)

An easy to use and Typscript friendly API client for Nexudus.

## Application API 
The application API requires a [registered Nexudus "App"](http://help.spaces.nexudus.com/en/api/getting-started.html) and an auth token.

> The Nexudus Spaces API allows you to develop Apps and modules that extend the Nexudus Spaces platform. You can implment features that your business may require or even create solutions that can be sold to other Nexudus Spaces customers.

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