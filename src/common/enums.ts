export enum CODES {
    ECANNOTCREATE,
    ECANNOTDELETE,
    ECANNOTUPDATE,
    ECRITICALDATABASE,
    EDUPLICATE,
    EINVALIDVALUE,
    EINVALIDSUBCOMPONENT,
    EMISSINGREQUIRED,
    ENOTFOUND,
    ESQLGENERALERROR,
    ESQLSYNTAXERROR,
    ESYNTAXERROR,
    EUNKNOWN,
    EUNAUTHORIZED
}

export enum MESSAGES {
    MDATABASECREATEERROR = 'The request could not be completed due to a conflict with the current state of the target resource.',
    MDATABASEDELETEERROR = 'The source or destination resource of a method is locked.',
    MDATABASEUPDATEERROR = 'The entire request could not be completed, therefore the entire operation was rolled back.'
}

export enum SEVERITY {
    ECANNOTCREATE = 'info',
    ECANNOTDELETE = 'info',
    ECANNOTUPDATE = 'info',
    ECRITICALDATABASE = 'crit',
    EINVALIDVALUE = 'info',
    EINVALIDSUBCOMPONENT = 'info',
    EMISSINGREQUIRED = 'info',
    ENOTFOUND = 'info',
    ESQLGENERALERROR = 'warn',
    ESQLSYNTAXERROR = 'warn',
    ESYNTAXERROR = 'info',
    EUNKNOWN = 'warn',
    EUNAUTHORIZED = 'info'
}
