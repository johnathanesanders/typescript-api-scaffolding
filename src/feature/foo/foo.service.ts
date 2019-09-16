import { CODES } from '@app/common/enums';
import { Prepare, PreparedStatement, ReadResult } from '@app/common/database/database';
import { DatabaseService } from '@app/common/database/database.service';

export class FooService {
    public ready: Promise<any>;

    constructor(
        private databaseService: DatabaseService
    ) {
        this.ready = new Promise(async (resolve) => {
            /** Create the t_foo table if it doesn't already exist */
            try {
                const createTableStatement: PreparedStatement = Prepare`CREATE TABLE IF NOT EXISTS t_foo (identifier serial PRIMARY KEY NOT NULL, bar character varying(256) NOT NULL)`;
                await this.databaseService.writeOperation<any>([createTableStatement]);
                resolve(undefined);
            } catch (error) {
                console.error(error);
                process.exit(0);
            }
        });
    }

    /**
     * Create a record
     * @param {string} barValue - Value to create in the database table t_foo
     * @returns {Promise<number>} The number of records created (should be one in this demo!)
     */
    public async createBar(barValue: string): Promise<number> {
        try {
            const insertRecordStatement: PreparedStatement = await this.generateCreateBarStatement(barValue);
            const insertRecordResult: any = await this.databaseService.writeOperation<any>([insertRecordStatement]);
            return Promise.resolve(insertRecordResult[0].rowCount);
        } catch (error) {
            return Promise.reject(error);
        }
    } 

    /**
     * Delete a record
     * @param {string} barValue - Value to delete in the database table t_foo
     * @returns {Promise<number>} The number of records deleted
    */
    public async deleteBar(barValue: string): Promise<number> {
        try {
            const deleteRecordStatement: PreparedStatement = await this.generateDeleteBarStatement(barValue);
            const deleteRecordResult: any = await this.databaseService.writeOperation<any>([deleteRecordStatement]);
            return Promise.resolve(deleteRecordResult[0].rowCount);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Generate create statement
     * @param {string} barValue - Value to create in the database table t_foo
     * @returns {Promise<PreparedStatement>} The prepared statement to utilize in a create operation
     */
    private async generateCreateBarStatement(barValue: string): Promise<PreparedStatement> {
        return Promise.resolve(Prepare`INSERT INTO t_foo (bar) VALUES (${barValue})`);
    }

    /**
     * Generate delete statement
     * @param {string} barValue - Value to delete in the database table t_foo
     * @returns {Promise<PreparedStatement>} The prepared statement to utilize in a delete operation
     */
    private async generateDeleteBarStatement(barValue: string): Promise<PreparedStatement> {
        return Promise.resolve(Prepare`DELETE FROM t_foo WHERE bar = ${barValue}`);
    }

    /**
     * Generate get statement
     * @param barValue - Value to search for in the database table t_foo
     * @returns {Promise<PreparedStatement>} The prepared statement to utilize in a get operation
     */
    private async generateGetBarStatement(barValue?: string): Promise<PreparedStatement> {
        const statement: PreparedStatement = Prepare`SELECT * FROM t_foo `
            .append(barValue ? Prepare`WHERE bar ILIKE ${barValue} ` : ``);
        return Promise.resolve(statement);
    }

    /**
     * Generate update statement
     * @param {number} barIdentifier - Identifier of the record to update
     * @param {string} barValue - Value to update in the database table t_foo
     * @returns {Promise<PreparedStatement>} The prepared statement to utilize in an update operation
     */
    private async generateUpdateBarStatement(barIdentifier: number, barValue: string): Promise<PreparedStatement> {
        return Promise.resolve(Prepare`UPDATE t_foo SET bar = ${barValue} WHERE identifier = ${barIdentifier}`);
    }

    /**
     * Get records
     * @param {string} [barValue] - Value to search for in bar column of t_foo
     * @returns {Promise<T[]>} A result set of matching records
     */
    public async getBar<T>(barValue?: string): Promise<T[]> {
        try { 
            const statement: PreparedStatement = await this.generateGetBarStatement(barValue);
            const result: ReadResult = await this.databaseService.readOperation(statement);
            return Promise.resolve(result.rows);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Update a record
     * @param {number} barIdentifier - Identifier of the record to update
     * @param {string} barValue - Value to update in the database table t_foo
     * @returns {Promise<number>} The number of records updated
     */
    public async updateBar(barIdentifier: number, barValue: string): Promise<number> {
        try {
            const updateRecordStatement: PreparedStatement = await this.generateUpdateBarStatement(barIdentifier, barValue);
            const updateRecordResult: any = await this.databaseService.writeOperation([updateRecordStatement]);
            return Promise.resolve(updateRecordResult[0].rowCount);
        } catch (error) {
            return Promise.resolve(error);
        }
    }
}
