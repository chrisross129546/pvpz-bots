const generateAnonymousUserIdentifier = async () => {
    const request = await fetch('https://api.secondmonitorgames.com/pvpz/anonymous-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        
        body: JSON.stringify({
            lang: 'en-GB',
            userAgentString: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)' +
                ' Chrome/120.0.0.0 Safari/537.36',
            originatingDomain: 'pvpz.io',
            documentReferrer: 'https://pvpz.io/'
        })
    });
    
    const text = await request.text();
    const { _id } = JSON.parse(text);
    
    return _id;
};

const getConnectionToken = async userIdentifier => {
    const request = await fetch(`https://api.secondmonitorgames.com/pvpz/game/start-run?r=true&anonymousUserId=${userIdentifier}&preferredRegion=any`);
    const text = await request.text();
    const { connectionToken } = JSON.parse(text);
    
    return connectionToken;
};

export const createSpawnPacketObject = token => JSON.stringify({
    connectionToken: token,
    clientWidth: 1e3,
    clientHeight: 1e3,
    gameClientVersion: '1.2.6-alpha',
    clientZoomLevel: 1.75
});

const generateClient = async () => getConnectionToken(await generateAnonymousUserIdentifier());
export const createSpawnPacketWithToken = async () => createSpawnPacketObject(await generateClient());
