import { createLogger, format, transports } from 'winston';

const {combine, timestamp, printf, colorize, errors} = format;

const myFormat = printf(({timestamp, level, message, stack}) => {
    const text = stack ? `${message} ${stack}` : message;
    return `${timestamp} ${level} ${text}`;
});

const LOG_LEVEL = process.env.LOG_LEVEL || 'debug';

const logger = createLogger({
    level: LOG_LEVEL,
    format: combine(
        errors({stack: true}),
        colorize(),
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.Console()
    ]
});

export default logger;