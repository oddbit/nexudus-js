export interface NexudusApiResponse {
    Status: number,
    Message: string,
    Value?: any,
    RedirectURL?: any,
    JavaScript?: any,
    Errors?: any,
    WasSuccessful: boolean,
    OpenInDialog: boolean,
    OpenInWindow: boolean
}
