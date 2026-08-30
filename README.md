# nmeaSocket

TypeScript/Node client for reading and writing [NMEA 0183](https://en.wikipedia.org/wiki/NMEA_0183) sentences over a TCP socket, with per-sentence event listeners and automatic reconnection.

Published on npm as [`nmeasocket`](https://www.npmjs.com/package/nmeasocket). Ships CommonJS, ESM, and type declarations.

## Scope

This library covers the **Node/TypeScript** side of NMEA-over-TCP: connect to an NMEA source (chart plotter, GPS receiver, AIS transponder, gateway, or a simulator), subscribe to specific sentence headers, and send sentences back.

There is a sibling project, [`NmeaTransport`](https://github.com/vinihcrosa/NmeaTransport), which solves a similar problem for **C#/.NET** and additionally supports UDP. The two are separate ports for separate ecosystems, not successors — pick the one matching your runtime.

## Install

```sh
npm install nmeasocket
```

Requires Node.js 20+.

## Usage

```ts
import { NmeaSocket } from 'nmeasocket'

const socket = new NmeaSocket('192.168.1.10', 10110, true)

socket.on('connect', () => console.log('connected'))
socket.on('disconnect', () => console.log('disconnected'))

socket.addNmeaListener('GPGGA', ({ header, message, raw }) => {
  console.log(header, message)
})

socket.connect()

socket.sendNmeaMessage('GPGLL', ['4916.45', 'N', '12311.12', 'W'])
```

## API

### `new NmeaSocket(ip, port, autoReconnect)`

| Param | Type | Description |
| --- | --- | --- |
| `ip` | `string` | Host of the NMEA TCP source. |
| `port` | `number` | TCP port. `10110` is the conventional NMEA-over-TCP port. |
| `autoReconnect` | `boolean` | Reconnect automatically when the connection drops. Required — there is no default. |

Extends Node's `EventEmitter`.

### `connect(): void`

Wires up the connection lifecycle and opens the socket. Emits `connect` and `disconnect` on the instance.

### `addNmeaListener(header, cb): void`

Invokes `cb` for every received sentence whose header matches `header` (for example `GPGGA`, `GPRMC`, `AIVDM`).

The callback receives an `NmeaResponse`:

```ts
interface NmeaResponse {
  header: string    // sentence header, without the leading '$'
  message: string[] // comma-separated fields, already split
  raw: Buffer       // the untouched bytes as received
}
```

### `addNmeaListenerOnChange(header, cb): void`

**Currently identical to `addNmeaListener`** — it does not yet deduplicate repeated values. The intended behavior is to fire only when the sentence payload differs from the previous one. Treat it as reserved API until that lands.

### `sendNmeaMessage(header, message): void`

Sends a sentence. `message` is a `string[]` of fields; they are joined with commas before being written to the socket.

## Events

| Event | Payload | When |
| --- | --- | --- |
| `connect` | — | Socket established. |
| `disconnect` | — | Socket closed. With `autoReconnect: true`, a reconnect attempt follows. |

## Development

```sh
npm install
npm test           # vitest
npm run build      # tsup -> dist (cjs, esm, d.ts)
npm run dev        # tsup --watch
```

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) (enforced by commitlint + husky). Releases are cut by `release-it` from `main`, which tags, publishes to npm, and creates the GitHub release.

## License

MIT © Vinicius Rosa
