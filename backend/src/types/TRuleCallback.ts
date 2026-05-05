import { NextFunction } from 'express';

type TRuleCallback<T = unknown> = (
    field?: string,
    value?: T | undefined,
    dataset?: object,
    next?: NextFunction
) => boolean | string | void;

export default TRuleCallback;
