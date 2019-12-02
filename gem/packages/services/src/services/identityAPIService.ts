import {IAuthObject, IIdentityAPIService} from "../models/identityAPIService";

const getToken = (apiUrl: string, wrappedFetch: any, body:string) => {

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: body + "&client_id=gem&client_secret=PZjWg1MHar"
    };

    return wrappedFetch(`${apiUrl}/connect/token`, requestOptions).then(
        (response: any) => response.json()
    ).then(
        (auth: IAuthObject) => ({...auth, expires_at: Date.now() + auth.expires_in * 1000})
    );

};

const login = (apiUrl: string, wrappedFetch: any, username:string, password:string) => {
    return getToken(
        apiUrl,
        wrappedFetch,
        `username=${username}&password=${password}&grant_type=password&scope=openid offline_access AgStudioApi.readonly AgStudioApi.Warehouse BaseDataApi`
    );
};

const renewToken = (apiUrl: string, wrappedFetch: any, refreshToken:string) => {
    return getToken(apiUrl, wrappedFetch, `refresh_token=${refreshToken}&grant_type=refresh_token`);
};

// ***** public SERVICE *****

export const identityAPIServiceFactory = (apiUrl: string, wrappedFetch: any) => ({
    login: (username: string, password: string) => login(apiUrl, wrappedFetch, username, password),
    renewToken: (refreshToken: string) => renewToken(apiUrl, wrappedFetch, refreshToken)
} as IIdentityAPIService);
