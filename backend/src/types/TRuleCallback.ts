import { NextFunction } from "express";

type TRuleCallback = (field?: string, value?: any, dataset?: object, next?: NextFunction) =>
    boolean | string | void;

export default TRuleCallback;
