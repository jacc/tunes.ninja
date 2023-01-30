"use strict";
exports.__esModule = true;
exports.appRouter = void 0;
var server_1 = require("@trpc/server");
var zod_1 = require("zod");
var trpcExpress = require("@trpc/server/adapters/express");
var express_1 = require("express");
// created for each request
var createContext = function (_a) {
    var req = _a.req, res = _a.res;
    return ({});
}; // no context
var t = server_1.initTRPC.context().create();
exports.appRouter = t.router({
    getUser: t.procedure.input(zod_1.z.string()).query(function (req) {
        req.input; // string
        return { id: req.input, name: "Bilbo" };
    })
});
var app = (0, express_1["default"])();
app.use("/trpc", trpcExpress.createExpressMiddleware({
    router: exports.appRouter,
    createContext: createContext
}));
app.listen(4000);
