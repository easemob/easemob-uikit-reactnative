export function splitStringWithDelimiter(str: string, delimiter: string) {
  const result = [];
  let startIndex = 0;
  let index = str.indexOf(delimiter);

  while (index !== -1) {
    if (index > startIndex) {
      result.push(str.substring(startIndex, index));
    }
    result.push(delimiter);
    startIndex = index + delimiter.length;
    index = str.indexOf(delimiter, startIndex);
  }

  if (startIndex < str.length) {
    result.push(str.substring(startIndex));
  }

  return result;
}

export const gUrlPattern =
  // eslint-disable-next-line no-useless-escape
  /(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})(:[0-9]+)?(\/[\w\.-]*)*\/?(\?[=&\w]*)?/g;
// /https?:\/\/[^\s]+/g;
// /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/g;
export function splitStringByUrl(str: string, urlRegex?: RegExp) {
  const result: string[] = [];
  const _urlRegex = urlRegex ?? gUrlPattern;
  let lastIndex = 0;
  let match;

  while ((match = _urlRegex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      result.push(str.substring(lastIndex, match.index));
    }
    result.push(match[0]);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < str.length) {
    result.push(str.substring(lastIndex));
  }

  return result;
}
