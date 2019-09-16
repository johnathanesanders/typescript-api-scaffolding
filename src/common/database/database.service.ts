import { elementsAtPath } from '@app/common/utility/utility';

import { IDatabaseAdapter, PreparedStatement } from '@app/common/database/database';

export class DatabaseService {
    private adapter: IDatabaseAdapter;
    public ready: Promise<any>;

    constructor(adapter: string) {
        this.ready = new Promise(async (resolve) => {
            try {
                await this.selectAdapter(adapter);
                resolve(undefined);
            } catch (error) {
                console.error(error);
                process.exit(0);
            }
        });
    } 

    private async selectAdapter(adapter: string): Promise<boolean> {
        try {
            const availableAdapters = await elementsAtPath(`${__dirname}/adapters`, /(\.adapter\.ts)/);
        
            const selectedAdapter = availableAdapters.find((x) => {
                return x.name === adapter;
            });

            if (selectedAdapter) {
                const instanceObject = await import(selectedAdapter.path);
                this.adapter = new instanceObject[Object.keys(instanceObject)[0]]();
                return Promise.resolve(true);
            } else {
                throw(null);
            }
        } catch (error) {
            return Promise.reject({code: 1, message:`FATAL: Invalid Database Adapter!`});
        }
        
    }

    public async readOperation<T>(statement: PreparedStatement): Promise<T> {
        return this.adapter.query<T>(statement);
    }

    public async writeOperation<T>(statement: PreparedStatement[]): Promise<T[]> {
        return this.adapter.executeTransaction<T>(statement);
    }
}


