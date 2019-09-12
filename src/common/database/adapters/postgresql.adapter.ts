import { Pool, PoolClient, PoolConfig, QueryResult } from 'pg';
import { IDatabaseAdapter, PreparedStatement } from '@app/common/database/database';
import { Environment } from '@environment/environment';
import { CODES } from '@app/common/enums';
import { LoggingService } from '@app/common/logging/logging.service';
import { asyncForEach } from '@app/common/utility/utility';


export class PostgresqlAdapter implements IDatabaseAdapter {
    private configuration: PoolConfig;
    private pool: Pool;
    private readonly loggingService: LoggingService;
    public ready: Promise<any>;

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
        const result: T[] = [];
        let transactionError: any;

        try {
            await this.pool.query('BEGIN');
            await asyncForEach(transaction, async(statement: any) => {
                if (transactionError) return;
                try {
                    const statementResult = await this.pool.query(statement);
                    result.push(statementResult);
                } catch (error) {
                    transactionError = error;
                    transactionError.message = statement.step;
                    return;
                }
            });

            if (transactionError) throw(transactionError);

            await this.pool.query('COMMIT');
            return Promise.resolve(result);
        } catch (error) {
            await this.pool.query('ROLLBACK');
            const translatedErrorCode = this.translateError(error.code);
            return Promise.reject({code: translatedErrorCode, message: error.message});
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
            const translatedErrorCode = this.translateError(error.code);
            return Promise.reject({code: translatedErrorCode, message: error.message});
        }
        
    }

    private translateError(code: string): number {
        switch(code) {
            case '22003': 
                return CODES.EINVALIDVALUE;
            case '22007':
                return CODES.EINVALIDVALUE;
            case '22P02': 
                return CODES.EINVALIDVALUE;
            case '23502': 
                return CODES.EMISSINGREQUIRED;
            case '23503':
                return CODES.EINVALIDSUBCOMPONENT;
            case '23505': 
                return CODES.ECANNOTCREATE;
            case '42601': 
                return CODES.EINVALIDVALUE;
            case '42703':
                return CODES.ECRITICALDATABASE;
            case 'ENOTFOUND': 
                return CODES.ENOTFOUND;
            case 'EDUPLICATE':
                return CODES.EDUPLICATE;
            default: 
                return CODES.EUNKNOWN;
        }
    }
}
