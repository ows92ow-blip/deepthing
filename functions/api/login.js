function timingSafeEqual(a, b) {
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
}

export async function onRequestPost(context) {
    const { request, env } = context;
    
    try {
        const { username, password } = await request.json();
        const ADMIN_USER = env.ADMIN_USER || 'test';
        const ADMIN_PASS = env.ADMIN_PASS || '114514';

        const isValidUser = timingSafeEqual(username, ADMIN_USER);
        const isValidPass = timingSafeEqual(password, ADMIN_PASS);

        if (isValidUser && isValidPass) {
            const sessionToken = crypto.randomUUID(); 
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Set-Cookie': `auth_token=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400`
                }
            });
        } else {
            return new Response(JSON.stringify({ success: false, msg: '账号或密码错误' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } catch (e) {
        return new Response(JSON.stringify({ success: false, msg: '服务器错误' }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' } 
        });
    }
}
