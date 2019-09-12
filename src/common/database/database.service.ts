import { elementsAtPath } from '@app/common/utility/utility';

import { IDatabaseAdapter, PreparedStatement } from '@app/common/database/database';
import { Environment } from '@environment/environment';
import { PostgresqlAdapter } from '@app/common/database/adapters/postgresql.adapter';

export class DatabaseService {
    private adapter: IDatabaseAdapter;

    constructor(adapter: string) {
        this.selectAdapter(adapter)
            .then((result) => {
                this.adapter = result;
            })
            .catch((error) => {
                console.log(error);
                process.exit(0);
            });
    } 

    private async selectAdapter(adapter: string): Promise<IDatabaseAdapter> {
       console.log(await elementsAtPath(`${__dirname}/adapters`));

        
        switch (adapter) {
            case 'PostgreSQL': 
                return Promise.resolve(new PostgresqlAdapter());
            default: 
                return Promise.reject({code: 1, message:`FATAL: Invalid Database Adapter!`});
        }
    }

    public async readOperation<T>(statement: PreparedStatement): Promise<T> {
        return await this.adapter.query(statement);
    }
}


