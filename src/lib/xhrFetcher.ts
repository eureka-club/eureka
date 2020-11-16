export default async function xhrFetcher<JSON = Record<string, unknown>>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const res = await fetch(input, init);
  return res.json();
}
