import { Pool, PoolClient, PoolConfig, QueryResult } from 'pg';
import { IDatabaseAdapter, Prepare, PreparedStatement } from '@app/common/database/database';
import { Environment } from '@environment/environment';
import { CODES } from '@app/common/enums';
import { LoggingService } from '@app/common/logging/logging.service';


export class PostgresqlAdapter implements IDatabaseAdapter {
    private readonly configuration: PoolConfig;
    protected pool: Pool;
    private readonly loggingService: LoggingService;
    
    constructor() {
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

    public async executeTransaction<T>(transaction: PreparedStatement[]): Promise<T[]> {
        return;
    }

    private handleError(code: string): number {
        switch(code) {
            case '23502': 
                return CODES.EMISSINGREQUIRED;
            case '23503':
                return CODES.EINVALIDSUBCOMPONENT;
            case '23505': 
                return CODES.ECANNOTCREATE;
            case '42703':
                return CODES.ECRITICALDATABASE;
            default: 
                return CODES.EUNKNOWN;
        }
    }

    /**
     * Executes a SQL query against a PostgreSQL pool 
     * @param {PreparedStatement} statement - The Prepared SQL statement to execute
     * @return {Promise<QueryResult>} - The result of the query operation
     */
    public async query<T>(statement: PreparedStatement): Promise<QueryResult<T>> {
        if(!this.pool) return Promise.reject(`Pool is undefined! No connection to the database!`);

        try {
            const result = await this.pool.query(statement);
            return Promise.resolve(result);
        } catch (error) {
            const errorCode = this.handleError(error.code);
            return Promise.reject({code: CODES[errorCode], message: `Error excecuting request.`});
        }
        
    }
}