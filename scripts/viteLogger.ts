import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createLogger, type Logger } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGS_DIR = path.resolve(__dirname, '../logs');

function ensureLogsDir(): void {
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  }
}

function writeToLogFile(logFile: string, level: string, message: string): void {
  const line = `[${new Date().toISOString()}] [${level}] ${message}\n`;
  fs.appendFileSync(logFile, line);
}

function wrapLoggerMethod(
  logger: Logger,
  method: 'info' | 'warn' | 'error',
  logFile: string
): Logger[typeof method] {
  const original = logger[method].bind(logger);

  return (
    message: string,
    options?: { clear?: boolean; timestamp?: boolean }
  ) => {
    writeToLogFile(logFile, method.toUpperCase(), message);
    original(message, options);
  };
}

export function createViteFileLogger(mode: string): Logger {
  ensureLogsDir();

  const logFile = path.join(LOGS_DIR, `vite-${mode}.log`);
  const logger = createLogger('info', { allowClearScreen: false });

  return {
    ...logger,
    info: wrapLoggerMethod(logger, 'info', logFile),
    warn: wrapLoggerMethod(logger, 'warn', logFile),
    error: wrapLoggerMethod(logger, 'error', logFile),
  };
}
