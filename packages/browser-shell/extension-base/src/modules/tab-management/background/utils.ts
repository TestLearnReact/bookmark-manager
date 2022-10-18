/* eslint-disable */
// @ts-nocheck

//import responseToDataUrl from 'response-to-data-url';

/** util/pausable-timer */
export class PausableTimer {
  _timeoutId;

  /**
   * @param {Object} args
   * @param {() => any} args.cb The callback to delay.
   * @param {number} args.delay Time in ms to delay for.
   * @param {boolean} [args.start=true] Whether or not to start the timeout immediately or on later `.resume()` call.
   */
  constructor({ cb, delay, start = true }) {
    this.cb = cb;
    this._remain = delay;

    if (start) {
      this.resume();
    }
  }

  set delay(val) {
    this._remain = val;
  }
  get delay() {
    return this._remain;
  }

  /**
   * Resumes a paused timer, storing the resumed time and new timer ID as state.
   */
  resume() {
    if (this._remain <= 0) {
      return;
    }

    this._start = Date.now();
    clearTimeout(this._timeoutId);
    this._timeoutId = setTimeout(this.cb, this._remain);
  }

  /**
   * Pauses the timer and stores the remaining state for next `.resume()` invocation.
   */
  pause() {
    if (this._remain <= 0 || this._start == null) {
      return;
    }

    clearTimeout(this._timeoutId);
    this._remain -= Date.now() - this._start;
  }

  /**
   * Clears any ongoing timer and removes it from state.
   */
  clear() {
    clearTimeout(this._timeoutId);
    this._timeoutId = null;
  }
}

/** util/chunk */
export function chunk<T = any>(array: T[], size: number): T[][] {
  const result: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
}

export async function* iterateChunks<T = any, R = any>(
  array: T[],
  size: number,
  cb: (t: T, i: number, arr: T[]) => Promise<R>,
) {
  for (const items of chunk(array, size)) {
    yield await Promise.all(items.map(cb));
  }
}

export async function mapChunks<T = any, R = any>(
  array: T[],
  size: number,
  cb: (t: T, i: number, arr: T[]) => Promise<R>,
) {
  const result = [];

  for (const items of chunk(array, size)) {
    const res = await Promise.all(items.map(cb));
    result.push(...res);
  }

  return result;
}

/** Resolves website favicon url using google's service */
export function getFavicon(url: string) {
  if (!url) return url;
  return (
    'http://www.google.com/s2/favicons?domain_url=' +
    encodeURIComponent(new URL(url).origin)
  );
}

/** analysis */

export async function fetchFavIcon(url: string): Promise<string> {
  if (url == null) {
    throw new FavIconFetchError('Cannot fetch missing URL');
  }

  const response = await fetch(url);

  if (response.status >= 400 && response.status < 600) {
    throw new FavIconFetchError(response.statusText);
  }

  /// return responseToDataUrl(response);
}

export class FavIconFetchError extends Error {}

/**
 * @param url
 * @param {Document} doc DOM to attempt to find favicon URL from.
 * @returns {string?} URL pointing to the document's favicon or null.
 */
function getFavIconURLFromDOM(url, doc) {
  const favEl = doc.querySelector('link[rel*="icon"]');
  const urlPage = new URL(url);
  if (favEl?.href) {
    const urlFavIcon = new URL(favEl.href);
    if (urlFavIcon.protocol.startsWith('chrome-extension')) {
      return favEl.href.replace(urlFavIcon.origin, urlPage.origin);
    } else {
      return favEl.href;
    }
  } else {
    return `${urlPage.origin}/favicon.ico`;
  }
}

/**
 * @param {Document} doc DOM to attempt to extract favicon from.
 * @returns {string?} Favicon encoded as data URL.
 */
const extractFavIcon = (url, doc = document) => {
  try {
    return getFavIcon(getFavIconURLFromDOM(url, doc));
  } catch (err) {
    console.log(err);

    return undefined; // carry on without fav-icon
  }
};
