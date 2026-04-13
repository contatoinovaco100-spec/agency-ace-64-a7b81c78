import makeWASocket, { 
    DisconnectReason, 
    useMultiFileAuthState, 
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    ConnectionState
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import qrcode from 'qrcode-terminal';
import pino from 'pino';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const logger = pino({ level: 'info' });
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

async function syncToSupabase(status: string, qrCode?: string) {
    try {
        const { error } = await supabase
            .from('wa_sync_v1')
            .upsert({ 
                id: 'default-session', // Usando um ID fixo para a sessão padrão
                status, 
                qr_code: qrCode || null,
                updated_at: new Date().toISOString()
            });
        
        if (error) console.error('Erro ao sincronizar com Supabase:', error.message);
    } catch (err) {
        console.error('Erro de rede ao sincronizar com Supabase');
    }
}

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const { version, isLatest } = await fetchLatestBaileysVersion();
    
    console.log(`Usando WhatsApp v${version.join('.')}, isLatest: ${isLatest}`);

    const sock = makeWASocket({
        version,
        printQRInTerminal: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger),
        },
        logger,
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update: Partial<ConnectionState>) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            console.log('--- SCANNEIE O QR CODE NO CONSOLE OU NA PLATAFORMA ---');
            await syncToSupabase('CONNECTING', qr);
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Conexão fechada. Reconectando:', shouldReconnect);
            await syncToSupabase('DISCONNECTED');
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('\n✅ WHATSAPP CONECTADO COM SUCESSO!\n');
            await syncToSupabase('CONNECTED');
        }
    });

    return sock;
}

console.log('Iniciando Serviço de WhatsApp Baileys com Sincronização Supabase...');
connectToWhatsApp();
