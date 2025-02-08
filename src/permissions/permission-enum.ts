export enum Permission {
    MANAGE_PROJECT = 'MANAGE_PROJECT',

    MANAGE_USERS = 'MANAGE_USERS',
    MANAGE_TRAINERS = 'MANAGE_TRAINERS',
    MANAGE_SCHEDULES = 'MANAGE_SCHEDULES',

    VIEW_CLIENTS = 'VIEW_CLIENTS',
    ADD_CLIENTS = 'ADD_CLIENTS',
    EDIT_CLIENTS = 'EDIT_CLIENTS',
    DELETE_CLIENT = 'DELETE_CLIENT',
}

export interface Permissions {
    MANAGE_PROJECT: boolean,
    MANAGE_USERS: boolean,
    MANAGE_TRAINERS: boolean,
    MANAGE_SCHEDULES: boolean,
    VIEW_CLIENTS: boolean,
    ADD_CLIENTS: boolean,
    EDIT_CLIENTS: boolean,
    DELETE_CLIENT: boolean,
}