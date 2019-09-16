import { DatabaseService } from '@app/common/database/database.service';
import { RestService } from '@app/common/rest/rest.service';

const main = async () => {
    try {
        /** Start data service */
        const databaseService = new DatabaseService('postgresql');
        await databaseService.ready;

        /** Start REST HTTP service */
        const restService = new RestService();
        await restService.ready;

    } catch (error) {
        console.log(error);
        process.exit(0);
    }
}

main();

