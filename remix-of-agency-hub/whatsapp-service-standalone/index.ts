import {
    makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    makeInMemoryStore
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import qrcode from 'qrcode-terminal';
import pino from 'pino';
import dotenv from 'dotenv';

dotenv.config();

const logger = pino({ level: 'silent' });
const store = makeInMemoryStore({ logger });
store.readFromFile('./baileys_store_multi.json');
setInterval(() => {
    store.writeToFile('./baileys_store_multi.json');
}, 10_000);

let sock: any = null;
let qrCodeValue: string | null = null;
let connectionStatus: string = 'DISCONNECTED';

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const { version } = await fetchLatestBaileysVersion();
    
    sock = makeWASocket({
        version,
        printQRInTerminal: false,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger),
        },
        logger,
    });

    store.bind(sock.ev);
    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update: any) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
            qrCodeValue = qr;
            console.log('--- SCANNEIE O QR CODE ---');
            qrcode.generate(qr, { small: true });
        }
        if (connection === 'close') {
            qrCodeValue = null;
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            connectionStatus = 'DISCONNECTED';
            console.log('Conexão fechada. Reconectando...', shouldReconnect);
            if (shouldReconnect) connectToWhatsApp();
        } else if (connection === 'open') {
            qrCodeValue = null;
            connectionStatus = 'CONNECTED';
            console.log('✅ WHATSAPP CONECTADO!');
        }
    });
}

Bun.serve({
    port: 3001,
    async fetch(req) {
        const url = new URL(req.url);
        const headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Content-Type": "application/json"
        };
        if (req.method === "OPTIONS") return new Response(null, { headers });

        try {
            if (url.pathname === "/status") {
                return new Response(JSON.stringify({ connected: connectionStatus === 'CONNECTED', status: connectionStatus, qr: qrCodeValue }), { headers });
            }
            if (url.pathname === "/chats") {
                const chats = store.chats.all().map(c => ({
                    id: c.id,
                    name: c.name || c.id.split('@')[0],
                    unreadCount: c.unreadCount || 0,
                    lastMessage: "" // Placeholder
                }));
                return new Response(JSON.stringify(chats), { headers });
            }
            if (url.pathname === "/messages") {
                const phone = url.searchParams.get("phone");
                if (!phone) throw new Error("Phone required");
                const jid = `${phone.replace(/\D/g, '')}@s.whatsapp.net`;
                const messages = store.messages[jid]?.all() || [];
                return new Response(JSON.stringify(messages), { headers });
            }
            if (url.pathname === "/send-text") {
                const { phone, message } = await req.json();
                const jid = `${phone.replace(/\D/g, '')}@s.whatsapp.net`;
                await sock.sendMessage(jid, { text: message });
                return new Response(JSON.stringify({ success: true }), { headers });
            }
            return new Response(JSON.stringify({ error: "Not Found" }), { status: 404, headers });
        } catch (err: any) {
            return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
        }
    },
});

console.log('📡 Servidor 3001 ativo');
connectToWhatsApp();
