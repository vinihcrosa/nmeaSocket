import ClientNmeaSocket2Listener from 'client-nmea-socket-to-event';
import { EventEmitter } from 'events'

export interface NmeaResponse {
  header: string,
  message: string[],
  raw: Buffer
}

export class NmeaSocket extends EventEmitter {
  private socket

  constructor(
    private ip: string,
    private port: number,
    private autoReconnect: boolean,
  ) {
    super()
    this.socket = new ClientNmeaSocket2Listener({
      ip: this.ip,
      port: this.port,
      autoReconnect: this.autoReconnect,
    })
  }

  public connect() {
    this.socket.onConnect(() => {
      this.emit('connect')
    })

    this.socket.onDisconnect(() => {
      this.emit('disconnect')
    })

    this.socket.connect()
  }

  public addNmeaListener(header: string, cb: (data: NmeaResponse) => void) {

    this.socket.addListener(header, cb)
  }

  public addNmeaListenerOnChange(header: string, cb: Function) {

    this.socket.addListener(header, cb)
  }

  public sendNmeaMessage(header: string, message: string[]) {
    this.socket.sendMessage(header, message.join(','))
  }
}
