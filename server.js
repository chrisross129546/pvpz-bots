import { WebSocket } from 'ws';
import { createSpawnPacketWithToken } from './request.js';
import { connectionAttemptSchema, createHandshakeSchema, setSpawnPacket, writeBufferInitialBytes } from './protocol.js';

const createClient = async () => {
    const websocket = new WebSocket('wss://prod-pvpz-gameserver-1.secondmonitorgames.com/1', {
        headers: {
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
            'Cache-Control': 'no-cache',
            Connection: 'Upgrade',
            Host: 'prod-pvpz-gameserver-1.secondmonitorgames.com',
            Origin: 'https://pvpz.io',
            Pragma: 'no-cache',
            'Sec-Websocket-Extensions': 'permessage-deflate; client_max_window_bits',
            'Sec-Websocket-Key': 'qENJFcmatKeVEqZc76bpAg==',
            'Sec-Websocket-Version': 13,
            Upgrade: 'websocket',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)' +
                ' Chrome/120.0.0.0 Safari/537.36'
        }
    });
    
    await new Promise(r => websocket.once('open', r));
    
    websocket.send(await writeBufferInitialBytes(setSpawnPacket));
    websocket.addEventListener('message', ({ data }) => console.log(data));
    // console.log(await createSpawnPacketWithToken());
};

for (let i = 0; i < 2; i++) createClient();