import { zlibSync, unzlibSync, strToU8, strFromU8 } from 'fflate';

export function debounce(fn: (...args: any[]) => void, n = 100) {
  let handle: any;
  return (...args: any[]) => {
    if (handle) clearTimeout(handle);
    handle = setTimeout(() => {
      fn(...args);
    }, n);
  };
}

export const genCdnLink = (
  pkg: string,
  version: string | undefined,
  path: string,
) => {
  version = version ? `@${version}` : '';
  switch ('jsdelivr') {
    case 'jsdelivr':
      return `https://cdn.jsdelivr.net/npm/${pkg}${version}${path}`;
    // case 'jsdelivr-fastly':
    //   return `https://fastly.jsdelivr.net/npm/${pkg}${version}${path}`
    // case 'unpkg':
    //   return `https://unpkg.com/${pkg}${version}${path}`
  }
};

export function utoa(data: string): string {
  const buffer = strToU8(data);
  const zipped = zlibSync(buffer, { level: 9 });
  const binary = strFromU8(zipped, true);
  return btoa(binary);
}

export function atou(base64: string): string {
  const binary = atob(base64);

  // zlib header (x78), level 9 (xDA)
  if (binary.startsWith('\x78\xDA')) {
    const buffer = strToU8(binary, true);
    const unzipped = unzlibSync(buffer);
    return strFromU8(unzipped);
  }

  // old unicode hacks for backward compatibility
  // https://base64.guru/developers/javascript/examples/unicode-strings
  return decodeURIComponent(escape(binary));
}
