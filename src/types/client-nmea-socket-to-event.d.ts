declare module 'client-nmea-socket-to-event' {
  interface ClientNmeaSocket2ListenerOptions {
    ip: string;
    port: number;
    autoReconnect?: boolean;
  }

  interface NmeaResponse {
    header: string;
    message: string[];
    raw: Buffer;
  }

  class ClientNmeaSocket2Listener {
    constructor(options: ClientNmeaSocket2ListenerOptions);

    connect(): void;
    onConnect(cb: () => void): void;
    onDisconnect(cb: () => void): void;
    addListener(header: string, cb: (data: NmeaResponse) => void): void;
    sendMessage(header: string, message: string): void;
  }

  export default ClientNmeaSocket2Listener;
}