import fetch from 'node-fetch';
import { RequestParams, StreamEvent, StreamMessage } from '../../common';
import { createParser } from '../../parser';

export async function eventStream<ForID extends boolean>(options: {
  signal: AbortSignal;
  url: string;
  headers?: Record<string, string> | undefined;
  body?: RequestParams;
}): Promise<AsyncIterableIterator<StreamMessage<ForID, StreamEvent>>> {
  const { signal, url, headers, body } = options;

  const res = await fetch(url, {
    signal,
    method: body ? 'POST' : 'GET',
    headers: {
      ...headers,
      accept: 'text/event-stream',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);

  return (async function* messages() {
    if (!res.body) throw new Error('Missing response body');
    const parse = createParser();
    try {
      for await (const chunk of res.body) {
        if (typeof chunk === 'string')
          throw new Error(`Unexpected string chunk "${chunk}"`);

        // read chunk and if messages are ready, yield them
        const msgs = parse(chunk);
        if (!msgs) continue;

        for (const msg of msgs) {
          yield msg;
        }
      }
    } catch (err) {
      if (signal.aborted) return;
      throw err;
    }
  })();
}
