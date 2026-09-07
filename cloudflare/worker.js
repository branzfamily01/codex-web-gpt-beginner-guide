const REALM = 'Codex Web GPT Guide';
const SESSION_COOKIE = 'codex_guide_limited_session';
const SESSION_TTL_SECONDS = 90 * 24 * 60 * 60;
const SESSION_VERSION = 'v1';
const encoder = new TextEncoder();

function unauthorized() {
  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
      'Cache-Control': 'private, no-store'
    }
  });
}

async function constantTimeEqual(left, right) {
  const [leftHash, rightHash] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(left)),
    crypto.subtle.digest('SHA-256', encoder.encode(right))
  ]);
  const a = new Uint8Array(leftHash);
  const b = new Uint8Array(rightHash);
  let difference = 0;
  for (let i = 0; i < a.length; i += 1) difference |= a[i] ^ b[i];
  return difference === 0;
}

function base64Utf8(value) {
  let binary = '';
  for (const byte of encoder.encode(value)) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function expectedBasicAuthHeader(value) {
  if (!value) return '';
  if (value.includes(':')) return `Basic ${base64Utf8(value)}`;
  return `Basic ${value}`;
}

async function hasValidBasicAuth(request, env) {
  const expected = expectedBasicAuthHeader(env.BASIC_AUTH_CREDENTIALS_B64);
  const provided = request.headers.get('Authorization') || '';
  return Boolean(expected) && await constantTimeEqual(provided, expected);
}

function cookieValue(request, name) {
  const header = request.headers.get('Cookie') || '';
  for (const part of header.split(';')) {
    const index = part.indexOf('=');
    if (index < 0) continue;
    if (part.slice(0, index).trim() === name) return part.slice(index + 1).trim();
  }
  return '';
}

function base64Url(bytes) {
  let binary = '';
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}

async function sessionKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function sessionMessage(request, expiresAt) {
  return `${SESSION_VERSION}.${new URL(request.url).hostname}.${expiresAt}`;
}

async function issueSessionCookie(request, env) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const key = await sessionKey(env.BASIC_AUTH_SESSION_SECRET);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(sessionMessage(request, expiresAt)));
  const token = `${SESSION_VERSION}.${expiresAt}.${base64Url(signature)}`;
  return `${SESSION_COOKIE}=${token}; Max-Age=${SESSION_TTL_SECONDS}; Path=/; Secure; HttpOnly; SameSite=Lax`;
}

async function hasValidSession(request, env) {
  if (!env.BASIC_AUTH_CREDENTIALS_B64 || !env.BASIC_AUTH_SESSION_SECRET) return false;
  const token = cookieValue(request, SESSION_COOKIE);
  const match = token.match(/^v1\.(\d+)\.([A-Za-z0-9_-]+)$/);
  if (!match) return false;
  const expiresAt = Number(match[1]);
  if (!Number.isSafeInteger(expiresAt) || Date.now() / 1000 >= expiresAt) return false;
  try {
    const key = await sessionKey(env.BASIC_AUTH_SESSION_SECRET);
    return await crypto.subtle.verify(
      'HMAC',
      key,
      fromBase64Url(match[2]),
      encoder.encode(sessionMessage(request, expiresAt))
    );
  } catch {
    return false;
  }
}

function logoutResponse() {
  return new Response(null, {
    status: 204,
    headers: {
      'Cache-Control': 'private, no-store',
      'Set-Cookie': `${SESSION_COOKIE}=; Max-Age=0; Path=/; Secure; HttpOnly; SameSite=Lax`
    }
  });
}

function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'private, no-store');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'no-referrer');
  headers.set('X-Frame-Options', 'DENY');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/__logout') return logoutResponse();

    const basicAuth = await hasValidBasicAuth(request, env);
    const sessionAuth = await hasValidSession(request, env);
    if (!basicAuth && !sessionAuth) return unauthorized();

    const response = withSecurityHeaders(await env.ASSETS.fetch(request));
    if (basicAuth && !sessionAuth && env.BASIC_AUTH_SESSION_SECRET) {
      response.headers.set('Set-Cookie', await issueSessionCookie(request, env));
    }
    return response;
  }
};
