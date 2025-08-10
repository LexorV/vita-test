addEventListener('fetch', (event) => event.respondWith(handle(event.request)));

async function handle(req) {
	const url = new URL(req.url);

	const originBase = url.pathname.startsWith('/auth')
		? 'http://91.220.155.234:8080/FrontTestingService-auth'
		: url.pathname.startsWith('/api')
			? 'http://91.220.155.234:8080/FrontTestingService-back'
			: null;

	if (!originBase) return new Response('Not found', { status: 404 });

	if (req.method === 'OPTIONS') {
		return new Response(null, { status: 204, headers: buildCorsHeaders(req) });
	}

	const targetUrl = originBase + url.pathname.replace(/^\/(api|auth)/, '') + (url.search || '');

	const reqHeaders = new Headers(req.headers);
	reqHeaders.set('host', new URL(originBase).host);

	const init = {
		method: req.method,
		headers: reqHeaders,
		body: ['GET', 'HEAD'].includes(req.method) ? null : await req.arrayBuffer(),
		redirect: 'manual',
	};

	const upstream = await fetch(targetUrl, init);

	const headers = new Headers(upstream.headers);
	const cors = buildCorsHeaders(req);
	for (const [k, v] of Object.entries(cors)) headers.set(k, v);

	const setCookies = getSetCookies(upstream.headers);
	if (setCookies.length) {
		headers.delete('set-cookie');
		for (let c of setCookies) {
			c = c.replace(/;\s*Domain=[^;]+/i, '').replace(/;\s*Secure/gi, '');
			c += `; Domain=${url.hostname}; Path=/; Secure; SameSite=None`;
			headers.append('set-cookie', c);
		}
	}

	return new Response(upstream.body, { status: upstream.status, headers });
}

function buildCorsHeaders(req) {
	const origin = req.headers.get('Origin') || '*';
	const headers = {
		'Access-Control-Allow-Methods': 'GET,HEAD,POST,PUT,DELETE,OPTIONS,PATCH',
		'Access-Control-Allow-Headers': req.headers.get('Access-Control-Request-Headers') || '*',
		'Access-Control-Max-Age': '86400',
		'Access-Control-Expose-Headers': '*, Authorization, Set-Cookie',
		Vary: 'Origin',
	};
	headers['Access-Control-Allow-Origin'] = origin;
	headers['Access-Control-Allow-Credentials'] = 'true';
	return headers;
}

function getSetCookies(hdrs) {
	if (typeof hdrs.getAll === 'function') return hdrs.getAll('set-cookie') || [];
	const one = hdrs.get('set-cookie');
	return one ? [one] : [];
}
