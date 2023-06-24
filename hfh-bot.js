
const joinMessages = new Map(); // Create a map to store the last join message for each member
let lastMessageIndex; // Create a variable to store the index of the last welcome message sent

// Define an array of integers representing the relative rarities of each welcome message
const messageRarities = [7, 3, 3, 3, 1, 2, 3, 4, 4, 4, 3, 3, 6, 3, 1, 4, 2, 7, 7, 5, 2, 6, 7, 3, 4, 6, 5];
const archiveChannel = '1019870085617291305'


client.on('guildMemberAdd', (member) => {
    let messageIndex = weightedRandomIndex(messageRarities);

    // Make sure the same welcome message isn't sent twice in a row
    while (messageIndex === lastMessageIndex) {
        messageIndex = weightedRandomIndex(messageRarities);
    }

    const message = welcomeMessages[messageIndex];
    const welcomeMessage = `${message}`.replace('{member}', `<@${member.id}>`).replace('{archive}', `<#${archiveChannel}>`).replace('{Froge}', `<:Froge:930083494938411018>`);
    const sentMessage = member.guild.systemChannel.send(welcomeMessage);

    joinMessages.set(member.id, sentMessage);
    lastMessageIndex = messageIndex;
    console.log(`Sent welcome message to ${member.user.tag}`);
});

function weightedRandomIndex(weights) {
    let totalWeight = weights.reduce((acc, w) => acc + w);
    let random = Math.random() * totalWeight;
    for (let i = 0; i < weights.length; i++) {
        random -= weights[i];
        if (random < 0) {
            return i;
        }
    }
}


client.on('messageCreate', (message) => {
    if (message.author.bot) return; // Check if the author is a bot

    // Check if the current hour has changed since the last message was sent
    if (new Date().getHours() != hour) {
        messageCount = 0; // reset the message count
        hour = new Date().getHours(); // update the current hour
    }
    // safe roles
    safeRoles = [
        'fungus enthusiast',
        'trusted user',
        'nft',
        'slightly different shade of cyan',
        'hamper',
        'carter',
        'demoman'
    ];

    // trigger phrases
    const triggerPhrases = [
        'world download',
        'can i find',
        'wdl',
        'where is the farm',
        'where is the download',
        'where is the schematic',
        'where is the litematic',
        'have a schematic',
        'have a litematic',
        'where is the world',
        'fungus farm download',
        'farm download',
        'anybody got that',
        'where download',
        'can i have'
    ];

    const otherPhrases = [
        'the tree farm',
        'the nether tree farm'
    ];

    const excPhrases = [
        'but',
        'than'
    ];

    // const archiveChannel = message.guild.channels.cache.find(channel => channel.name === '📁│archive');

    if (triggerPhrases.some(phrase => message.content.toLowerCase().includes(phrase)) && canSendMessage(message)) {
        message.channel.send(`Hey ${message.author}, please see <#${archiveChannel}> for all world downloads and schematics.`);
        console.log('Sent message in response to "world download"');
        messageCount++; // increment the message count
    } else if (otherPhrases.some(phrase => message.content.toLowerCase().includes(phrase)) && canSendMessage(message) &&
        !excPhrases.some(phrase => message.content.toLowerCase().includes(phrase))) {
        message.channel.send(`Hey ${message.author}, this server has many different tree farm designs by many different people. If you came here for help with the Simple 11 Type Tree Farm, please indicate that.`);
        console.log('Sent message in response to "tree farm"');
        messageCount++; // increment the message count
    }
});

client.login(MY-TOKEN);
