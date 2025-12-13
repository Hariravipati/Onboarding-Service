"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.winstonLokiLogger = void 0;
const winston = require("winston");
const winston_loki_1 = require("winston-loki");
exports.winstonLokiLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.colorize({
        all: true,
        colors: {
            info: 'blue',
            warn: 'yellow',
            error: 'red',
        },
    }), winston.format.timestamp(), winston.format.printf(({ timestamp, level, message, requestId }) => {
        return `${timestamp} [${level}]${requestId ? ` [req:${requestId}]` : ''} ${message}`;
    })),
    transports: [
        new winston_loki_1.default({
            host: process.env.GRAFANA_LOKI_URL || '',
            labels: { job: process.env.GRAFANA_JOB_NAME },
            json: true,
        }),
        new winston.transports.Console(),
    ],
});
//# sourceMappingURL=winston.js.map