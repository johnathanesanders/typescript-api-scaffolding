import { Next, Request, Response, Server } from 'restify';
import { IRoute, IPreparedError, PreparedError } from '@app/common/rest/rest';
import { Foo } from '@app/feature/foo/foo';
import { FooService } from '@app/feature/foo/foo.service';
import { DatabaseService } from '@app/common/database/database.service';

export class FooRoute implements IRoute {
    private fooService: FooService;

    constructor(
        private databaseService: DatabaseService, 
        private basePath: string = `/foo`
    ) {
        this.fooService = new FooService(this.databaseService);   
    }

    public applyRoutes(server: Server): void {

        server.get(`${this.basePath}/:bar`, async (request: Request, response: Response, next: Next) => {
            try {
                const result = await this.fooService.getBar<Foo>(request.params.bar);
                response.send(result);
            } catch (error) {
                const responseError: IPreparedError = new PreparedError(error);
                response.status(responseError.status);
                response.statusMessage();
            }
            response.send(`Hello World!`);
            next();
        });
    }
}
