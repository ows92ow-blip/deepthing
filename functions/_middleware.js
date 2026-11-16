export async function onRequest(context) {
    const { request, next } = context;
    const url = new URL(request.url);

    if (url.pathname === '/test.html') {
        const cookieHeader = request.headers.get('Cookie');
        
        if (!cookieHeader || !cookieHeader.includes('auth_token=')) {
            return Response.redirect(url.origin, 302);
        }
    }

    return next();
}
