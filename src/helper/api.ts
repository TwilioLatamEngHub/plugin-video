export function prepServiceBaseUrl(url: string) {
    // prepend https if it doesn't exist
    if (!url.startsWith('https://')) {
        url = 'https://' + url;
    }

    // append a trailing slash if it doesn't exist
    if (url.substring(-1) !== '/') {
        url = url + '/';
    }
    return url;
}