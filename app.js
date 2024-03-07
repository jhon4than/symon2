const qrcode = require("qrcode-terminal");
const { Client, MessageMedia, LocalAuth } = require("whatsapp-web.js");
const moment = require("moment"); // Importando a biblioteca moment

// IDs dos grupos. Adicione mais IDs conforme necessário
const GROUP_IDS = [
    "120363236495256824@g.us",
    "120363242331328544@g.us"
];

// Links correspondentes aos grupos
const groupLinks = {
    "120363236495256824@g.us": [
        { label: "🎮SITE", url: "https://sshortly1.com/x6VaNf\n\n" },
        { label: "ACESSO AO APP HACKER🛬📲", url: " https://aviator-10x.vercel.app/" }
    ],
    "120363242331328544@g.us": [
        { label: "🎮SITE", url: "https://sshortly1.com/x6VaNf\n\n" },
        { label: "🛩", url: " 💸🔑💥📲" }
    ]
};

const SIGNAL_INTERVAL_MINUTES_ONE = 2; // Intervalo entre a análise e o primeiro sinal
const SIGNAL_INTERVAL_MINUTES = 30; // Intervalo entre os ciclos de sinal

const games = [{ name: "✈ AVIATOR ✈", image: "./aviator.jpg" }];

let currentGameIndex = 0;
let analysisSent = {}; // Objeto para controlar se a análise já foi enviada

const client = new Client({
    authStrategy: new LocalAuth(),
});

function startSendingSignals() {
    GROUP_IDS.forEach(chatId => {
        if (!analysisSent[chatId]) { // Verifica se a análise já foi enviada para esse grupo
            sendAnalysisMessage(chatId); // Envia a análise se ainda não foi enviada
            analysisSent[chatId] = true; // Marca como enviada
        }
    });
}

function sendAnalysisMessage(chatId) {
    client.sendMessage(
        chatId,
        "👑 ATENÇÃO... IDENTIFICANDO PADRÕES🔎❗\n📊 ANALISANDO ALGORITMO...\n"
    ).then(() => {
        setTimeout(() => sendGameSignal(chatId), 1000 * 60 * SIGNAL_INTERVAL_MINUTES_ONE);
    });
}

function sendGameSignal(chatId) {
    const game = games[currentGameIndex];
    const gameImage = MessageMedia.fromFilePath(game.image);
    
    const links = groupLinks[chatId]; // Obtém os links correspondentes ao ID do grupo

    if (!links) {
        console.error(`Não há links definidos para o grupo com o ID ${chatId}`);
        return;
    }

    // Gera um horário aleatório entre 3 a 8 minutos a partir de agora
    const randomMinutes = Math.floor(Math.random() * 6) + 3; // Gera um número aleatório entre 3 e 8
    const signalTime = moment().add(randomMinutes, 'minutes'); // Adiciona minutos aleatórios à hora atual

    let message = `𝙅𝙊𝙂𝙊: ${game["name"]}✈\n\nENTRADA 𝗗𝗔 𝗩𝗘𝗟𝗔: ${signalTime.format('HH:mm')}⏰\n\n🎯 𝗘𝗡𝗧𝗥𝗘 𝗡𝗢 𝗛𝗢𝗥𝗔𝗥𝗜𝗢 𝗘 𝗦𝗔𝗜𝗔\n\n📲⚡Decolar até 5x a 10X hackeado\n\n🌪 Liberado até 3 tentativas\n\n`;

    links.forEach(link => {
        message += `${link.label} 📲: ${link.url}`;
    });

    client.sendMessage(chatId, gameImage, { caption: message }).then(() => {
        // Adiciona 3 minutos ao signalTime para o envio da mensagem GREEN
        const greenSignalTime = signalTime.add(3, 'minutes');

        // Calcula a diferença de tempo até o greenSignalTime e agenda o envio da mensagem GREEN
        setTimeout(() => sendGreenSignal(chatId), greenSignalTime.diff(moment()));

        // Espera 20 minutos para reiniciar o processo
        setTimeout(() => sendGameSignal(chatId), 1000 * 60 * SIGNAL_INTERVAL_MINUTES);
    });
}

function sendGreenSignal(chatId) {
    client.sendMessage(chatId, "GREEN ✅🚀").then(() => {
        console.log("Mensagem GREEN enviada com sucesso!");
    });
}

client.on("ready", () => {
    console.log("Bot Online!");
    startSendingSignals(); // Inicia o envio de sinais para todos os grupos configurados
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on("ready", () => {
    console.log("Client is ready!");
    client.getChats().then((chats) => {
        const groups = chats.filter((chat) => chat.isGroup);
        groups.forEach((group) => {
            console.log(
                `Group Name: ${group.name}, Group ID: ${group.id._serialized}`
            );
        });
    });
});

client.initialize();
