import { Environment } from '@environment/environment';
import winston = require('winston');
import TransportStream = require('winston-transport');
import { Format } from 'logform';

export class LoggingService {
    private readonly defaultMeta: any;
    private readonly format: Format;
    private readonly level: string;
    public readonly log: winston.Logger;
    private readonly transports: TransportStream | TransportStream[];

    constructor(level?: string) {
        this.defaultMeta = {
            service: Environment.namespace
        };

        this.format = winston.format.combine(
            winston.format.timestamp({
                format: 'YYYY-MM-DDTHH:mm:ss'
            }),
            winston.format.errors({stack: true}),
            winston.format.splat(),
            winston.format.json()
        );

        this.level = level || 'error';

        this.transports = [];

        this.transports.push(new winston.transports.Console({format: winston.format.combine(winston.format.colorize(), winston.format.simple())}));

        this.log = winston.createLogger({
            level: this.level,
            format: this.format,
            defaultMeta: this.defaultMeta,
            transports: this.transports
        });
    }

    public writeLog(severity: string, module: string, message: any, debug?: any): void {
        const writeOut = debug ? `${module}: ${message}\n${debug}` : `${module}: ${message}`;
        switch(severity) {
            case 'crit': 
                this.log.error(writeOut);
                break;
            case 'warn': 
                this.log.warn(writeOut);
                break;
            case 'info':
                this.log.info(writeOut);
                break;
            default:
                this.log.info(writeOut);
        }
    }

}