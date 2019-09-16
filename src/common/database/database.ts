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
    query<T>(statement: PreparedStatement): any
}

export class PreparedStatement {

    constructor(strings: string[], values: any[]) {
        this.strings = strings;
        this.values = values;
    }

    public append(input: PreparedStatement | string | number): this {
        
        /** Since this.strings is a global and therefore soooo immutable, copy that dude... */
        let working: string[] = Array.from(this.strings);
        if (input instanceof PreparedStatement) {
            working[working.length -1] += input.strings[0];
            working.push.apply(working, input.strings.slice(1));
            this.values.push.apply(this.values, input.values);
        } else {
            working[working.length -1] += input;
        }
        this.strings = working;
        return this;
    }

    public name: string;
    public step: string;
    private strings: string[];

    public get sql(): string {
        return this.strings.join('?');
    }

    public get text(): string {
        return this.strings.reduce((previous, current, index) => previous + '$' + index + current);
    }

    public values: any[]; 
}

export class ReadResult {
    rows: any[];
}

export function Prepare(query: any, ..._values: any[]): PreparedStatement {
    return new PreparedStatement(query, Array.from(arguments).slice(1));
}