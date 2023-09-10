export const PinoLoggingSettings = (env: any) => {
    const isProduction = env === 'production';

    const baseConfig = {
        redact: {
            paths: ['req.headers.authorization', 'cookie'],
            censor: '*****', // Replace redacted values with asterisks
        },
        serializers: {
            req: (req) => {
                return {
                    method: req.method,
                    url: req.url,
                    headers: {
                        ...req.headers,
                        cookie: undefined,
                    },
                    remoteAddress: req.ip,
                };
            },
        },
    };

    if (isProduction) {
        return {
            ...baseConfig,
            transport: {
                target: '@autotelic/pino-seq-transport',
                options: {
                    serverUrl: process.env.SEQ_URL,
                },
            },
        };
    } else {
        return {
            ...baseConfig,
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    singleLine: true,
                    levelFirst: true,
                    translateTime: 'yyyy-mm-dd HH:MM:ss TT Z',
                },
            },
        };
    }
};
