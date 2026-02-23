function handler(event) {
    var request = event.request;
    var uri = request.uri;

    // /catalog/ → /catalog/index.html
    if (uri.endsWith('/')) {
        request.uri += 'index.html';
    }
    // /catalog or /catalog/p/oversize-210gsm → append /index.html
    // Skip files with extensions (.css, .js, .webp, etc.)
    else if (!uri.includes('.')) {
        request.uri += '/index.html';
    }

    return request;
}
