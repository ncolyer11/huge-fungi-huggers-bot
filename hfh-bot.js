const HOURLY_MSG_LIMIT = 10;
const Discord = require('discord.js');
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent
    ]
});

let messageCount = 0; // variable to keep track of the number of messages sent
let hour = new Date().getHours(); // variable to keep track of the current hour

// Check if the message was sent in one of the specified channels
const channelIds = [
    '1092283954805084200',
    '930033193170661436',
    '930027805398429739',
    '930037624893231114',
    '1094609234978668765'
];

const channelNames = [
    'general',
    'question us',
    'welcome',
    'simple',
    'bot testing'
];

function canSendMessage(message) {
  // Check if the member has any of the restricted roles
  if (message.member.roles.cache.some(role => safeRoles.includes(role.name))) {
    console.log('Member has restricted role');
    return false;
  }

  // Check if the message was sent in one of the specified channels
  if (!channelIds.includes(message.channel.id) && !channelNames.includes(message.channel.name)) {
    console.log('Invalid channel');
    return false;
  }

  // Check if the message count has reached the limit of 100 messages per hour
  if (messageCount >= HOURLY_MSG_LIMIT) {
    console.log('Reached message limit');
    return false;
  }

  // All checks passed
  return true;
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return; // Check if the author is a bot

    if (!(channelIds.includes(message.channel.id) || channelNames.includes(message.channel.name))) {
        console.log('Invalid Channel');
        return;
    }
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
        'where is the world',
        'fungus farm download',
        'farm download',
        'anybody got that',
        'where download',

    ];

    const otherPhrases = [
        'the tree farm',
        'the nether tree farm'
    ];

    const archiveChannel = message.guild.channels.cache.find(channel => channel.name === 'archive');

    if (triggerPhrases.some(phrase => message.content.toLowerCase().includes(phrase)) && canSendMessage(message)) {
        message.channel.send(`Hey ${message.author}, please see ${archiveChannel} for all world downloads and schematics.`);
        console.log('Sent message in response to "world download"');
        messageCount++; // increment the message count
    } else if (otherPhrases.some(phrase => message.content.toLowerCase().includes(phrase)) && canSendMessage(message)) {
        message.channel.send(`Hey ${message.author}, this server has many different tree farm designs by many different people. If you came here for help with the Simple 11 Type Tree Farm, please indicate that.`);
        console.log('Sent message in response to "tree farm"');
        messageCount++; // increment the message count
    }
});

client.login('MY-TOKEN');
