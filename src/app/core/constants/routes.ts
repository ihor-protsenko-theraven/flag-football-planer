export enum RoutePath {
    CATALOG = 'catalog',
    BUILDER = 'builder',
    TRAININGS = 'trainings',
    PLAYS = 'plays',
    ADMIN = 'admin',
    LOGIN = 'login',
    NEW = 'new',
    EDIT = 'edit',
    ID_PARAM = ':id'
}

export const APP_ROUTES = {
    HOME: '/',
    CATALOG: `/${RoutePath.CATALOG}`,
    CATALOG_DETAIL: (id: string) => `/${RoutePath.CATALOG}/${id}`,
    BUILDER: `/${RoutePath.BUILDER}`,
    TRAININGS: `/${RoutePath.TRAININGS}`,
    TRAINING_DETAIL: (id: string) => `/${RoutePath.TRAININGS}/${id}`,
    PLAYS: `/${RoutePath.PLAYS}`,
    PLAY_DETAIL: (id: string) => `/${RoutePath.PLAYS}/${id}`,

    ADMIN: {
        ROOT: `/${RoutePath.ADMIN}`,
        LOGIN: `/${RoutePath.ADMIN}/${RoutePath.LOGIN}`,
        DASHBOARD: `/${RoutePath.ADMIN}`,
        DRILLS: `/${RoutePath.ADMIN}/drill`,
        DRILL_NEW: `/${RoutePath.ADMIN}/drill/${RoutePath.NEW}`,
        DRILL_EDIT: (id: string) => `/${RoutePath.ADMIN}/drill/${RoutePath.EDIT}/${id}`,
        PLAYS_LIST: `/${RoutePath.ADMIN}/plays`,
        PLAYS_NEW: `/${RoutePath.ADMIN}/plays/${RoutePath.NEW}`,
        PLAYS_EDIT: (id: string) => `/${RoutePath.ADMIN}/plays/${RoutePath.EDIT}/${id}`,
    }
} as const;

// Patterns for route definitions (app.routes.ts, admin.routes.ts)
export const ROUTE_PATTERNS = {
    CATALOG: RoutePath.CATALOG,
    CATALOG_DETAIL: `${RoutePath.CATALOG}/${RoutePath.ID_PARAM}`,
    BUILDER: RoutePath.BUILDER,
    TRAININGS: RoutePath.TRAININGS,
    TRAINING_DETAIL: `${RoutePath.TRAININGS}/${RoutePath.ID_PARAM}`,
    PLAYS: RoutePath.PLAYS,
    PLAY_DETAIL: `${RoutePath.PLAYS}/${RoutePath.ID_PARAM}`,

    ADMIN: {
        ROOT: RoutePath.ADMIN,
        LOGIN: `${RoutePath.ADMIN}/${RoutePath.LOGIN}`,
        DRILL_NEW: `drill/${RoutePath.NEW}`,
        DRILL_EDIT: `drill/${RoutePath.EDIT}/${RoutePath.ID_PARAM}`,
        PLAYS_NEW: `plays/${RoutePath.NEW}`,
        PLAYS_EDIT: `plays/${RoutePath.EDIT}/${RoutePath.ID_PARAM}`,
    }
} as const;
