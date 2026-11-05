import 'server-only';
import * as cheerio from 'cheerio';
import { lookup } from 'node:dns/promises';
import net from 'node:net';
import { HttpError } from './http';

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    return (
      a === 0 || a === 10 || a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      a >= 224
    );
  }
  const v6 = ip.toLowerCase();
  if (v6.startsWith('::ffff:')) return isPrivateIp(v6.slice(7));
  return v6 === '::1' || v6 === '::' || v6.startsWith('fc') || v6.startsWith('fd') || v6.startsWith('fe80');
}

/** Blocks non-http(s) schemes and hosts that resolve to private/loopback addresses (SSRF guard). */
async function assertPublicUrl(u: URL) {
  if (!['http:', 'https:'].includes(u.protocol)) throw new HttpError(400, 'Only http/https URLs are allowed');
  const host = u.hostname.replace(/^\[|\]$/g, '');
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.internal')) {
    throw new HttpError(400, 'URL not allowed');
  }
  const addrs = net.isIP(host) ? [{ address: host }] : await lookup(host, { all: true }).catch(() => []);
  if (!addrs.length) throw new HttpError(400, 'Could not resolve host');
  if (addrs.some((a) => isPrivateIp(a.address))) throw new HttpError(400, 'URL not allowed');
}

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

export async function getMetadata(rawUrl: string) {
  if (!rawUrl) throw new HttpError(400, 'URL parameter is required');
  let target = rawUrl.trim();
  if (!/^https?:\/\//i.test(target)) target = 'https://' + target;

  let url: URL;
  try {
    url = new URL(target);
  } catch {
    throw new HttpError(400, 'Invalid URL');
  }

  // Follow up to 5 redirects manually so every hop passes the SSRF check
  let res: Response | null = null;
  for (let i = 0; i < 5; i++) {
    await assertPublicUrl(url);
    res = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: 'text/html,*/*' },
      redirect: 'manual',
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    }).catch(() => null);
    if (!res) throw new HttpError(400, 'Failed to fetch URL');
    const loc = res.headers.get('location');
    if (res.status >= 300 && res.status < 400 && loc) {
      url = new URL(loc, url);
      continue;
    }
    break;
  }
  if (!res || !res.ok) throw new HttpError(400, `Failed to fetch URL: ${res?.status ?? ''}`);

  const html = (await res.text()).slice(0, 1_000_000);
  const $ = cheerio.load(html);
  const title = $('meta[property="og:title"]').attr('content') || $('title').first().text() || '';
  const description =
    $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '';
  const iconHref = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href') || '';
  let favicon = `${url.origin}/favicon.ico`;
  try {
    if (iconHref) favicon = new URL(iconHref, url).href;
  } catch {}

  return { title: title.trim(), description: description.trim(), favicon };
}
