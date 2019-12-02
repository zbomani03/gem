// This interface came from the API. Both objects should be the same.
export interface IAuthObject {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    token_type: string;
}

export interface IAuthObjectUI extends IAuthObject {
    expires_at: number;
}

// This the service interface.
export interface IIdentityAPIService {
    login(username: string, password: string): Promise<IAuthObjectUI>;
    renewToken(refreshToken: string): Promise<IAuthObjectUI>;
}
