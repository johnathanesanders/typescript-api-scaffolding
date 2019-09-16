export const Environment: any = {
    credentials: {
        database: {
            maxPoolSize: process.env.DATABASE_MAXPOOLSIZE,
            name: process.env.DATABASE_NAME,
            port: process.env.DATABASE_PORT,
            protocol: process.env.DATABASE_PROTOCOL,
            secret: process.env.DATABASE_SECRET,
            server: process.env.DATABASE_SERVER,
            timeout: process.env.DATABASE_TIMEOUT,
            user: process.env.DATABASE_USER
        }
    },
    environment: process.env.ENVIRONMENT,
    error: {
        debug: process.env.ERROR_DEBUG,
        level: process.env.ERROR_LEVEL
    },
    httpPort: process.env.HTTP_LISTEN,
    namespace: process.env.NAMESPACE
}