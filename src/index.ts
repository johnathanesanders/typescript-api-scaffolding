import { DatabaseService } from '@app/common/database/database.service';
import { Prepare, PreparedStatement } from '@app/common/database/database';

const databaseService = new DatabaseService('postgresql');

databaseService.ready.then(async () => {
    let transaction: PreparedStatement[] = [];
    const statement = Prepare`SELECT * from t_foo`;
    let result = await databaseService.readOperation<any>(statement);
    console.log(result.rows);
}).catch((error) => {
    console.log(error);
    process.exit(0);
});
