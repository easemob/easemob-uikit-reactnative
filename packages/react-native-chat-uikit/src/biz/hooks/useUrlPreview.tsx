import { uilog } from '../../const';

// const g_url_regexp: RegExp = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
const urlPattern: RegExp =
  // eslint-disable-next-line no-useless-escape
  /(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})(:[0-9]+)?(\/[\w\.-]*)*\/?(\?[=&\w]*)?/gi;

// x regex patterns
const titleOGPattern = /<meta property="og:title" content="(.*?)"\s*\/?>/i;
const descriptionOGPattern =
  /<meta property="og:description" content="(.*?)"\s*\/?>/i;
const imageOGPattern = /<meta property="og:image" content="(.*?)"\s*\/?>/i;

// Non-Open Graph protocol regex patterns
const titlePattern = /<title>(.*?)<\/title>/i;
const descriptionPattern =
  /<meta\s+name="description"\s+content="(.*?)"\s*\/?>/i;
const imagePattern = /<img\s+[^>]*src="(https?:\/\/[^\s]+)"[^>]*>/i;
const imageSrcPattern =
  /<link\s+rel="image_src"\s+href="(https?:\/\/[^\s]+)"\s*\/?>/i;

export function useUrlPreview() {
  return {
    getUrlFromText: UseUrlPreview.getUrlFromText,
    getUrlListFromText: UseUrlPreview.getUrlListFromText,
    fetchUrlPreview: UseUrlPreview.fetchUrlPreview,
  };
}

export class UseUrlPreview {
  static getTitle(html: string) {
    let match = titleOGPattern.exec(html);
    if (match) {
      return match[1];
    }
    match = titlePattern.exec(html);
    if (match) {
      return match[1];
    }
    return undefined;
  }
  static getDescription(html: string) {
    let match = descriptionOGPattern.exec(html);
    if (match) {
      return match[1];
    }
    match = descriptionPattern.exec(html);
    if (match) {
      return match[1];
    }
    return undefined;
  }
  static getImageUrl(html: string) {
    let match = imageOGPattern.exec(html);
    if (match) {
      return match[1];
    }
    match = imagePattern.exec(html);
    if (match) {
      return match[1];
    }
    match = imageSrcPattern.exec(html);
    if (match) {
      return match[1];
    }
    return undefined;
  }
  static async fetchUrlPreview(url: string) {
    const r = url.match(urlPattern);
    if (!r || r.length === 0) {
      return undefined;
    }
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out')), 5000);
      });
      const res = (await Promise.race([
        fetch(url),
        timeoutPromise,
      ])) as Response;
      const html = await res.text();
      return {
        url,
        title: UseUrlPreview.getTitle(html),
        description: UseUrlPreview.getDescription(html),
        imageUrl: UseUrlPreview.getImageUrl(html),
      };
    } catch (error) {
      uilog.error('Failed to fetch URL preview', error);
      return undefined;
    }
  }
  static getUrlFromText(text: string) {
    const match = urlPattern.exec(text);
    if (match) {
      return match[0];
    }
    return undefined;
  }
  static getUrlListFromText(text: string) {
    return text.match(urlPattern);
  }
}
