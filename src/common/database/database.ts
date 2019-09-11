export enum DATATYPES {
    BIGINT = 'bigint',
    BIT = 'bit',
    BLOB = 'blob',
    CHAR = 'char',
    CLOB = 'clob',
    DATE = 'date',
    DATETIME = 'datetime',
    DECIMAL = 'decimal',
    DOUBLE = 'double',
    FLOAT = 'float',
    INT = 'int',
    JSON = 'json',
    MONEY = 'money',
    NCHAR = 'nchar',
    NULL = 'null',
    SMALLDATETIME = 'smalldatetime',
    SMALLINT = 'smallint',
    SMALLMONEY = 'smallmoney',
    TIME = 'time',
    TIMESTAMP = 'timestamp',
    TINYINT = 'tinyint',
    UNIQUEIDENTIFIER = 'uniqueidentifier'
}

export interface IDatabaseAdapter {
    executeTransaction<T>(transaction: PreparedStatement[]): Promise<T[]>,
    query<T>(statement: PreparedStatement): Promise<any>
}

export class PreparedStatement {
    private readonly query: string[];

    constructor(query: string[], values: any[]) {
        this.query = query;
        this.values = values;
    }

    get text() {
        return this.query.reduce((prev, curr, i) => prev + '$' + i + curr);
    }

    get values() {
        return this.values;
    }

    set values(values: any[]) {
        this.values = values;
    }

    append(input: PreparedStatement | string): PreparedStatement {
        if (input instanceof PreparedStatement) {
            this.query.push(...input.query);
            this.query.push.apply(this.values, input.values);
        } else {
            this.query[this.query.length -1] += input;
        }
        return this;
    }
}

export function Prepare(query: any, ..._values: any[]): PreparedStatement {
    const queryLength = query.length;
    const sliced = queryLength > 1 ? query.slice(0, queryLength - 1) : query;
    return new PreparedStatement(sliced, Array.from(arguments).slice(1));
}