import Realtime, {
  generateKey,
  getWebSocketUrl,
  getWebSocketToken,
  EVENT_CREATED
} from '.'
import { Server } from 'mock-socket'
import MicroEE from 'microee'

const COZY_URL = 'http://cozy.tools:8888'
const WS_URL = 'ws://cozy.tools:8888/realtime/'
const COZY_TOKEN = 'zvNpzsHILcXpnDBlUfmAqVuEEuyWvPYn'
class CozyClient {
  stackClient = {
    uri: COZY_URL,
    token: {
      token: COZY_TOKEN
    }
  }
}
MicroEE.mixin(CozyClient)
const COZY_CLIENT = new CozyClient()

describe('Realtime', () => {
  let server

  beforeEach(() => {
    server = new Server(WS_URL)
  })

  afterEach(() => {
    server.stop()
  })

  it('should launch handler after subscribe', async done => {
    const type = 'io.cozy.bank.accounts'
    const realtime = new Realtime(COZY_CLIENT)
    const options = { type, eventName: 'created' }
    const doc1 = { title: 'title1' }
    const doc2 = { title: 'title2' }
    const fakeMessage1 = { payload: { type, doc: doc1 }, event: 'CREATED' }
    const fakeMessage2 = { payload: { type, doc: doc2 }, event: 'CREATED' }

    const handler = jest
      .fn()
      .mockImplementationOnce(doc => {
        expect(doc).toEqual(doc1)
      })
      .mockImplementationOnce(doc => {
        expect(doc).toEqual(doc2)
        expect(handler.mock.calls.length).toBe(2)

        realtime.unsubscribeAll()
        expect(realtime._socket.isOpen()).toBe(false)
        done()
      })

    await realtime.subscribe(options, handler)
    server.emit('message', JSON.stringify(fakeMessage1))
    expect(realtime._socket.isOpen()).toBe(true)
    expect(handler.mock.calls.length).toBe(1)

    await realtime.unsubscribe(options, handler)
    server.emit('message', JSON.stringify(fakeMessage2))
    expect(realtime._socket.isOpen()).toBe(false)
    expect(handler.mock.calls.length).toBe(1)

    await realtime.subscribe(options, handler)
    server.emit('message', JSON.stringify(fakeMessage2))
  })
})

describe('generateKey', () => {
  it('should return key from options', () => {
    let options = { type: 'io.cozy.bank.accounts', eventName: EVENT_CREATED }
    expect(generateKey(options)).toBe('io.cozy.bank.accounts\\created')
    options = {
      type: 'io.cozy.bank.accounts',
      eventName: EVENT_CREATED,
      id: 'dzqezfd'
    }
    expect(generateKey(options)).toBe('io.cozy.bank.accounts\\dzqezfd\\created')
    options = { type: 'io.cozy.bank.accounts', id: 'dzqezfd' }
    expect(generateKey(options)).toBe('io.cozy.bank.accounts\\dzqezfd')
  })
})

describe('getWebSocketUrl', () => {
  it('should return WebSocket url from cozyClient', () => {
    const fakeCozyClient = { stackClient: {} }
    fakeCozyClient.stackClient.uri = 'https://a.cozy.url'
    expect(getWebSocketUrl(fakeCozyClient)).toBe('wss://a.cozy.url/realtime/')
    fakeCozyClient.stackClient.uri = COZY_URL
    expect(getWebSocketUrl(fakeCozyClient)).toBe(WS_URL)
    fakeCozyClient.stackClient.uri = 'https://b.cozy.url'
    expect(getWebSocketUrl(fakeCozyClient)).toBe('wss://b.cozy.url/realtime/')
    fakeCozyClient.stackClient.uri = 'http://b.cozy.url'
    expect(getWebSocketUrl(fakeCozyClient)).toBe('ws://b.cozy.url/realtime/')
  })
})

describe('getWebSocketToken', () => {
  it('should return web token from cozyClient', () => {
    const fakeCozyClient = { stackClient: { token: {} } }
    fakeCozyClient.stackClient.token.token = COZY_TOKEN
    expect(getWebSocketToken(fakeCozyClient)).toBe(COZY_TOKEN)
    fakeCozyClient.stackClient.token.token = 'token2'
    expect(getWebSocketToken(fakeCozyClient)).toBe('token2')
  })
  it('should return oauth token from cozyClient', () => {
    const fakeCozyClient = { stackClient: { token: {} } }
    fakeCozyClient.stackClient.token.accessToken = COZY_TOKEN
    expect(getWebSocketToken(fakeCozyClient)).toBe(COZY_TOKEN)
    fakeCozyClient.stackClient.token.accessToken = 'token2'
    expect(getWebSocketToken(fakeCozyClient)).toBe('token2')
  })
})
