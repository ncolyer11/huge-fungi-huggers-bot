const HOURLY_MSG_LIMIT = 25;
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

// Define an array of possible welcome messages with different rarities
const welcomeMessages = [
  "Welcome to Huge Fungi Huggers, {member}! We're so glad you're here.", // 1
  "Hey {member}, welcome to the server! Enjoy all the free wood here.", // 2
  "Greetings, {member}! Enjoy your time collecting shroomlights here.", // 3
  "Howdy {member}! We hope you brought spare nylium.", // 4
  "Hello {member}, welcome to the other tree server! How's your day going?", // 5
  "Welcome, {member}! Hope you find what you're looking for here! (I really don't know how you couldn't)", // 6
  "Howdy {member}, did you know {archive} has all the nether tree farms you could dream of?", // 7
  "Yo, {member}! Welcome to the Huge Fungi Huggers server, feel free to ask if you need help with anything.", // 8
  "Welcome to Huge Fungi Huggers, {member}! We're happy to have you here. Have a great time exploring the nether trees.", // 9
  "Hi {member}, did you know {archive} has some awesome designs made by our community? Feel free to check them out!", // 10
  "Yo, {member}! Welcome to Huge Fungi Huggers, where we have some of the nether tree farms around. Enjoy your stay!", // 11
  "Welcome to the server, {member}! We hope you find everything you're looking for this side of the overworld.", // 12
  "Greetings, {member}! Our community is always happy to welcome new members to our nether tree paradise.", // 13
  "Welcome to Huge Fungi Huggers, {member}! Our trees may be on fire, but our community is always cool.", // 14
  "Hey {member}, welcome to the nether tree gang! Let's chop it up and make some charcoal. Oh wait...", // 15
  "Who’s that, hiding in the nether roots? Oh! It’s {member}. Welcome to the server.", // 16
  "{member} has joined the server, I wonder if they know about all the schematics in {archive}...", // 17
  "{member} just slid into some twisting vines.", // 18
  "Welcome {member}, enjoy your stay!", // 19
  "Happy you're here, {member}!", // 20
  "Hey {member}, welcome aboard!", // 21
  "Welcome to the Huge Fungi Huggers community, {member}!", // 22
  "Hello {member}, welcome to our server!", // 23
  "Welcome {member}, Have fun exploring {archive}.", // 24
  "We're happy to have you, {member}!", // 25
  "Greetings, {member}! Welcome to our server!", // 26
  "Welcome to the server, {member}! Enjoy yourself!", // 27
];

const joinMessages = new Map(); // Create a map to store the last join message for each member
let lastMessageIndex; // Create a variable to store the index of the last welcome message sent

// Define an array of integers representing the relative rarities of each welcome message
const messageRarities = [7, 6, 3, 3, 1, 2, 6, 4, 4, 2, 3, 3, 6, 3, 1, 2, 2, 8, 9, 5, 2, 6, 7, 3, 4, 6];


client.on('guildMemberAdd', (member) => {
    let messageIndex = weightedRandomIndex(messageRarities);

    // Make sure the same welcome message isn't sent twice in a row
    while (messageIndex === lastMessageIndex) {
        messageIndex = weightedRandomIndex(messageRarities);
    }

    const archiveChannel = '1019870085617291305'

    const message = welcomeMessages[messageIndex];
    const welcomeMessage = `${message}`.replace('{member}', `<@${member.id}>`).replace('{archive}', `<#${archiveChannel}>`);
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

    const archiveChannel = message.guild.channels.cache.find(channel => channel.name === 'archive');

    if (triggerPhrases.some(phrase => message.content.toLowerCase().includes(phrase)) && canSendMessage(message)) {
        message.channel.send(`Hey ${message.author}, please see ${archiveChannel} for all world downloads and schematics.`);
        console.log('Sent message in response to "world download"');
        messageCount++; // increment the message count
    } else if (otherPhrases.some(phrase => message.content.toLowerCase().includes(phrase)) && canSendMessage(message) &&
        !excPhrases.some(phrase => message.content.toLowerCase().includes(phrase))) {
        message.channel.send(`Hey ${message.author}, this server has many different tree farm designs by many different people. If you came here for help with the Simple 11 Type Tree Farm, please indicate that.`);
        console.log('Sent message in response to "tree farm"');
        messageCount++; // increment the message count
    }
});

client.login('MY-TOKEN);
