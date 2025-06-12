import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import DeviceDetector from 'device-detector-js';

export function middleware(request: NextRequest) {
    const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';

    const deviceDetector = new DeviceDetector();
    const device = deviceDetector.parse(userAgent);

    // Các bot bạn cho phép
    const isFacebookBot = userAgent.includes('facebookexternalhit') || userAgent.includes('facebot');
    const isInstagramBot = userAgent.includes('instagram');
    const isTelegramBot = userAgent.includes('telegrambot');
    const isAllowedBot = isFacebookBot || isInstagramBot || isTelegramBot;

    // Các bot bạn muốn block
    const blockedBots = [
        'googlebot',
        'bingbot',
        'ahrefsbot',
        'semrushbot',
        'mj12bot',
        'dotbot',
        'petalbot',
        'screaming frog',
        'yandexbot',
        'duckduckbot',
        'baiduspider',
        'sogou',
        'exabot',
        'facebookbot',
        'slurp', // Yahoo
    ];

    const isBlockedBot = blockedBots.some(bot => userAgent.includes(bot));

    // Logic chặn bot
    if ((device.bot && !isAllowedBot) || isBlockedBot) {
        return new NextResponse('Not Found', { status: 404 });
        // Hoặc nếu bạn thích redirect:
        // return NextResponse.redirect(new URL('/404', request.url));
    }

    return NextResponse.next();
}

// Cấu hình middleware áp dụng
export const config = {
    matcher: [
        /*
         * Apply middleware cho tất cả các page, trừ _next/ static/ api/
         */
        '/((?!api|_next|favicon.ico|robots.txt|sitemap.xml).*)',
    ],
};
