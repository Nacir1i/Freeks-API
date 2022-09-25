"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.initiateRound = void 0;
var server_1 = require("../server");
var initiateRound = function (list) { return __awaiter(void 0, void 0, void 0, function () {
    var fistHalf, secondHalf;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(list.length > 2)) return [3 /*break*/, 3];
                fistHalf = list.slice(0, Math.ceil(list.length / 2));
                return [4 /*yield*/, (0, exports.initiateRound)(fistHalf)];
            case 1:
                _a.sent();
                secondHalf = list.slice(Math.ceil(list.length / 2));
                return [4 /*yield*/, (0, exports.initiateRound)(secondHalf)];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, server_1.prisma.matches.create({
                    data: {
                        eventId: list[0].eventId,
                        startedAt: "2022-09-06T02:52:03.731Z",
                        endedAt: "2022-09-06T02:52:03.731Z",
                        partMatch: {
                            create: [
                                {
                                    participantId: list[0].id
                                },
                                {
                                    participantId: list[1].id
                                },
                            ]
                        }
                    }
                })];
            case 4:
                _a.sent();
                server_1.prisma.$disconnect();
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.initiateRound = initiateRound;
//# sourceMappingURL=initiateRound.js.map