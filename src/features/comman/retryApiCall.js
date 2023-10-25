const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export async function fetchWithRetries(url, options = {
    method: "GET",
    credentials: "include"
}, retries = 0) {
    try {
        const response = await fetch(url, options);
        if (response.status === 504 && retries < MAX_RETRIES) {
            console.error(`Request failed, retrying... (retry ${retries + 1})`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return fetchWithRetries(url, options, retries + 1);
        }
        else if (response.status === 401) {
            throw new Error("Unauthorized");
        }
        else if (response.status === 404) {
            throw new Error("Not Found");
        }
        return response;
    } catch (error) {
        return error;
    }
}
