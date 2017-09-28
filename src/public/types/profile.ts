import {NexudusApiResponse} from "./response";

export interface ProfileResponse extends NexudusApiResponse {
    Value: {
        User: User,
        Coworker: Coworker
    }     
}

export interface CoworkerResponse extends NexudusApiResponse {
    Value: Coworker
}

export interface UserResponse extends NexudusApiResponse {
    Value: User
}

export interface Coworker {
    FullName: string,
    GuessedFirstNameForInvoice: string,
    GuessedLastNameForInvoice: string,
    GuessedFirstName: string,
    GuessedLastName: string,
    Salutation: string,
    Address?: any,
    PostCode?: any,
    CityName?: any,
    State?: any,
    Email: string,
    Active: boolean,
    DiscountCode?: any,
    RefererGuid: string,
    ReferenceNumber?: any,
    IsNew: boolean,
    CheckedIn: boolean,
    DeleteAvatar: boolean,
    DeleteBanner: boolean,
    AvatarUrl: string,
    ProfileUrl: string,
    CountryId: number,
    SimpleTimeZoneId: number,
    UtcNextInvoice: string,
    TariffId: number,
    IsMember: boolean,
    IsContact: boolean,
    NextTariffId: number,
    CancellationDate?: any,
    UtcCancellationDate?: any,
    AbsoluteCancellationDate?: any,
    DoNotProcessInvoicesAutomatically: boolean,
    MobilePhone?: any,
    LandLine?: any,
    NickName?: any,
    BusinessArea?: any,
    Position?: any,
    CompanyName?: any,
    ProfileTags: string,
    ProfileTagsSpaces: string,
    ProfileSummary?: any,
    ProfileWebsite?: any,
    Url: string,
    Gender: string,
    ProfileIsPublic: boolean,
    RegistrationDate: string,
    UtcRegistrationDate: string,
    DateOfBirth?: any,
    UtcDateOfBirth?: any,
    Twitter?: any,
    Skype?: any,
    Facebook?: any,
    Linkedin?: any,
    Google?: any,
    Telegram?: any,
    Github?: any,
    Pinterest?: any,
    Flickr?: any,
    Instagram?: any,
    Vimeo?: any,
    Tumblr?: any,
    Blogger?: any,
    HasContactDetails: boolean,
    BillingName: string,
    BillingEmail?: any,
    BillingAddress: string,
    BillingPostCode: string,
    BillingCityName: string,
    BillingState?: any,
    TaxIDNumber?: any,
    CardNumber?: any,
    AccessPincode: string,
    Custom1: string,
    Custom2?: any,
    Custom3?: any,
    Custom4?: any,
    Custom5?: any,
    Custom6?: any,
    Custom7?: any,
    Custom8?: any,
    Custom9?: any,
    Custom10?: any,
    Custom11?: any,
    Custom12?: any,
    Custom13?: any,
    Custom14?: any,
    Custom15?: any,
    Custom16?: any,
    Custom17?: any,
    Custom18?: any,
    Custom19?: any,
    Custom20?: any,
    Custom21?: any,
    Custom22?: any,
    Custom23?: any,
    Custom24?: any,
    Custom25?: any,
    Custom26?: any,
    Custom27?: any,
    Custom28?: any,
    Custom29?: any,
    Custom30?: any,
    EmailForInvoice: string,
    AddressForInvoice: string,
    PostCodeForInvoice: string,
    CityForInvoice: string,
    StateForInvoice: string,
    FullNameForInvoice: string,
    GeneralTermsAccepted: boolean,
    AgeInDays: number,
    HasBanner: boolean,
    Id: number,
    IdString: string,
    UpdatedOn: string,
    CreatedOn: string,
    UniqueId: string,
    IsNull: boolean
}

export interface User {
    FullName: string,
    Email: string,
    OnHelpDeskMsg: boolean,
    OnNewWallPost: boolean,
    OnNewBlogComment: boolean,
    OnNewEventComment: boolean,
    ReceiveCommunityDigest: boolean,
    ReceiveEveryMessage: boolean,
    IsAuthenticated: boolean,
    Id: number,
    IdString: string,
    UpdatedOn: string,
    CreatedOn: string,
    UniqueId: string,
    IsNull: boolean
  }