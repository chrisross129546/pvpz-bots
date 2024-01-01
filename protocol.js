import { createSpawnPacketWithToken } from './request.js';

const generateInstantiationProtocolMessage = p_ => {
    const Schema = {
        keys: [],
        props: {}
    };
    
    const x = {
        key: 0,
        prop: 'ntype',
        type: 'Uint8',
        interp: !1
    };
    
    Schema.keys.push(x);
    Schema.props['ntype'] = x;
    
    const d = {
        key: 1,
        prop: 'nid',
        type: 'Uint16',
        interp: !1
    };
    
    Schema.keys.push(d);
    Schema.props['nid'] = d;
    
    for (let i in p_) {
        if ('nid' === i) throw Error('No need to define `nid` in a schema, this is added by default.');
        if ('ntype' === i) throw Error('No need to define `ntype` in a schema, this is added by default.');
        
        if (p_[i].type) {
            let k = {
                key: 2,
                prop: i,
                type: p_[i].type,
                interp: p_[i].interp
            };
            
            Schema.keys.push(k);
            Schema.props[i] = k;
        } else {
            let k = {
                key: 3,
                prop: i,
                type: p_[i],
                interp: !1
            };
            
            Schema.keys.push(k);
            Schema.props[i] = k;
        }
    }
    
    return Schema;
};

export const connectionAttemptSchema = generateInstantiationProtocolMessage({ handshake: 'String' });

const count = (schema, entity) => {
    let bytes = 0;
    schema.keys.forEach(propData => {
        let a;
        
        if (propData.type === 'Uint8') a = 1;
        if (propData.type === 'Uint16') a = 2;
        
        bytes += propData.type !== 'String' ? a : new Blob([entity.handshake]).size + 4;
    });
    
    return bytes;
};

export const setSpawnPacket = await createSpawnPacketWithToken();
export const createHandshakeSchema = async () => ({
    ntype: 'ConnectionAttempt',
    handshake: setSpawnPacket
});
const countBytes = async () => count(connectionAttemptSchema, await createHandshakeSchema());

const createBuffer = async () => new ArrayBuffer((await countBytes()) + 3);

export const writeBufferInitialBytes = async data => {
    const buffer = await createBuffer();
    const view = new DataView(buffer);
    
    const encode = (encoder => encoder.encode.bind(encoder))(new TextEncoder());
    let offset = 0;
    
    view.setUint8(offset, 1);
    offset += 1;
    
    view.setUint8(offset, 1);
    offset += 1;
    
    view.setUint8(offset, 3);
    offset += 1;
    
    view.setUint8(offset, 3);
    offset += 1;
    
    view.setUint16(offset, undefined);
    offset += 2;
    
    const encoded = encode(data);
    view.setUint32(offset, encoded.byteLength);
    offset += 4;
    
    encoded.forEach(byte => {
        view.setUint8(offset, byte);
        offset += 1;
    });
    
    return buffer;
};

