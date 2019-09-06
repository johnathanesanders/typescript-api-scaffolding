import { Pool, PoolClient, PoolConfig, QueryResult } from 'pg';

import { Environment } from '@environment/environment';
import { LoggingService } from '@app/common/logging/logging.service';

export class PostgresqlAdapter {
    private readonly configuration: PoolConfig;
    protected pool: Pool;

    constructor(private loggingService: LoggingService) {
        this.configuration = {
            database: Environment.credentials.database.name,
            host: Environment.credentials.database.server,
            idleTimeoutMillis: Environment.credentials.database.timeout,
            max: Environment.credentials.database.maxPoolSize,
            port: Environment.credentials.database.port,
            password: Environment.credentials.database.secret,
            user: Environment.credentials.database.user
        };

        this.pool = new Pool(this.configuration);

        this.pool.on('error', (error: Error, client: PoolClient) => {
            if (error.message === 'ECONNRESET') {
                this.loggingService.writeLog('warn', 'PostgreSQL', {code: 'ECONNRESET', message: 'PostgreSQL connection encountered a hard reset condition. Attempts will be made to reconnect'}, client);
            } else {
                this.loggingService.writeLog('warn', 'PostgreSQL', {code: 'EUNKNOWN', message: 'PostgreSQL connection encountered an unknown condition. Reconnection attempts are uncertain.'}, client);
            }
        });
    }


}