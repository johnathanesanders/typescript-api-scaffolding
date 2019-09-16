export const Environment: any = {
    credentials: {
        database: {
            maxPoolSize: 30,
            name: 'muhdbname',
            port: 5432,
            protocol: 'TCPIP',
            secret: 'muhsecret',
            server: 'localhost',
            timeout: 3600000,
            user: 'postgres'    
        }
    },
    environment: 'development',
    error: {
        debug: false,
        level: 'info'
    },
    httpListen: 8443,
    namespace: 'nubilo.typescript-scaffolding'
}