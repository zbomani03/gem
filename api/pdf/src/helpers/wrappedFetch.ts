import fetch from 'node-fetch';

const wrappedFetch = (token: string) => {
    return (url: string, params = {} as any) => {
        params.headers = Object.assign(
            {},
            params.hasOwnProperty("headers") && params.headers || {},
            {'Authorization': token}
        );
        return fetch(url, params).then(handleErrors);
    };
};

const handleErrors = (response:any) => {
    if (response.ok) {
        return response;
    }
    return response.json().then((error:any) => {
        throw new Error(error.error_description || error.Message || error.message || error.error || "Unexpected internal server error.");
    });
};

export default wrappedFetch;
