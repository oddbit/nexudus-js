import * as _ from "lodash";

/**
 * Create a Nexudus formatted date from a timestamp. This function will create "current timestamp" if no timestamp
 * parameter is provided.
 *
 * @param timestamp Unix timestamp (optional).
 * @returns {string} UTC date string
 */
export function formatDate(timestamp?: number): string {
    const date = new Date((!!timestamp || timestamp === 0) ? timestamp : Date.now());
    const fullYear = date.getUTCFullYear();
    const month = _.padStart(`${date.getUTCMonth() + 1}`, 2, "0");
    const day = _.padStart(`${date.getUTCDate()}`, 2, "0");
    const hour = _.padStart(`${date.getUTCHours()}`, 2, "0");
    const minute = _.padStart(`${date.getUTCMinutes()}`, 2, "0");
    const second = _.padStart(`${date.getUTCSeconds()}`, 2, "0");

    return `${fullYear}-${month}-${day}T${hour}:${minute}:${second}Z`;
}

/**
 * Parse a Nexudus UTC date string into a Unix timestamp.
 *
 * @param dateTimeString Nexudus date string
 * @returns {Date} 
 */
export function parseDateString(dateTimeString: string): Date {
    const normalizedDate = dateTimeString.replace("T", " ").replace("Z", "");
    return new Date(normalizedDate + " UTC");
}