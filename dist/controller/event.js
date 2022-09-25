"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.controller = void 0;
var client_1 = require("@prisma/client");
var server_1 = require("../server");
var initiateRound_1 = require("../utils/initiateRound");
exports.controller = {
    getAllEvents: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var events, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, server_1.prisma.event.findMany({
                            include: {
                                details: true
                            }
                        })];
                case 1:
                    events = _a.sent();
                    res.status(200).send({ events: events });
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.log("getAllEvents : ", err_1);
                    res.status(401).send({ message: "Internal server error" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    getEvent: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var event, result, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, server_1.prisma.event.findMany({
                            where: {
                                id: req.body.eventId
                            },
                            include: {
                                details: true,
                                participants: {
                                    include: {
                                        user: {
                                            select: {
                                                username: true,
                                                email: true
                                            }
                                        }
                                    }
                                },
                                matches: {
                                    include: {
                                        partMatch: {
                                            include: {
                                                participants: {
                                                    include: {
                                                        user: {
                                                            select: {
                                                                username: true,
                                                                email: true
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        })];
                case 1:
                    event = _a.sent();
                    result = event.map(function (event) {
                        return __assign(__assign({}, event), { matches: event.matches.map(function (partMatch) {
                                return partMatch.partMatch.map(function (participants) { return participants.participants; });
                            }) });
                    });
                    res.status(200).send({ result: result });
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    console.log("getEvent : ", err_2);
                    res.status(401).send({ message: "Internal server error" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    getParticipants: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var participants;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, server_1.prisma.participants.findMany({
                        where: {
                            eventId: req.body.partId
                        }
                    })];
                case 1:
                    participants = _a.sent();
                    res.status(200).send(participants);
                    return [2 /*return*/];
            }
        });
    }); },
    create: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var event, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, server_1.prisma.event.create({
                            data: {
                                id: server_1.crypto.randomBytes(10).toString("hex"),
                                name: req.body.name,
                                details: {
                                    create: {
                                        maxplayers: req.body.maxPlayers,
                                        startsIn: req.body.start,
                                        endsIn: req.body.end
                                    }
                                }
                            }
                        })];
                case 1:
                    event = _a.sent();
                    console.log("event : \"".concat(event.id, "\" has been created"));
                    res.status(200).send(event);
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _a.sent();
                    console.log("event create : ", err_3);
                    res.status(500).send({ message: "Internal server error" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    join: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var event, participant, groupACount, maxplayers, participant_1, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, server_1.prisma.event.findFirst({
                        where: {
                            id: req.body.eventId
                        },
                        include: {
                            details: true,
                            participants: true
                        }
                    })];
                case 1:
                    event = _a.sent();
                    if (!!event) return [3 /*break*/, 2];
                    res.status(404).send({ message: "Event not found" });
                    return [2 /*return*/];
                case 2:
                    if (!event.full) return [3 /*break*/, 3];
                    res.status(403).send({ message: "Event is full" });
                    return [2 /*return*/];
                case 3: return [4 /*yield*/, server_1.prisma.participants.findFirst({
                        where: {
                            AND: [
                                {
                                    userId: req.body.userId
                                },
                                {
                                    eventId: req.body.eventId
                                },
                            ]
                        }
                    })];
                case 4:
                    participant = _a.sent();
                    if (participant) {
                        res.status(403).send({ message: "User already joined" });
                        return [2 /*return*/];
                    }
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    groupACount = event.participants.filter(function (participant) { return participant.group === client_1.GROUP.A; }).length;
                    maxplayers = event.details[0].maxplayers;
                    return [4 /*yield*/, server_1.prisma.participants.create({
                            data: {
                                eventId: req.body.eventId,
                                userId: req.body.userId,
                                eliminated: false,
                                group: maxplayers / 2 > groupACount ? client_1.GROUP.A : client_1.GROUP.B
                            }
                        })];
                case 6:
                    participant_1 = _a.sent();
                    res.status(200).send({ participant: participant_1 });
                    console.log("user : \"".concat(req.body.userId, "\" joined event : \"").concat(req.body.eventId, "\""));
                    return [3 /*break*/, 8];
                case 7:
                    err_4 = _a.sent();
                    console.log("join : ", err_4);
                    res.status(401).send({ message: "Internal server error" });
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); },
    eliminate: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var participant, eliminated, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    participant = req.body.participant;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, server_1.prisma.participants.update({
                            where: {
                                id: participant === null || participant === void 0 ? void 0 : participant.id
                            },
                            data: {
                                eliminated: true
                            }
                        })];
                case 2:
                    eliminated = _a.sent();
                    res.status(200).send(eliminated);
                    return [3 /*break*/, 4];
                case 3:
                    err_5 = _a.sent();
                    console.log("eliminate : ", err_5);
                    res.status(401).send({ message: "Internal server error !" });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    initiate: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var event, groupA, groupB, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, server_1.prisma.event.findFirst({
                        where: {
                            id: req.body.eventId
                        },
                        include: {
                            details: true,
                            participants: {
                                where: {
                                    eliminated: false
                                }
                            }
                        }
                    })];
                case 1:
                    event = _a.sent();
                    if (!event) {
                        res.status(404).send({ message: "Event not found" });
                        return [2 /*return*/];
                    }
                    groupA = event.participants.filter(function (participant) { return participant.group === client_1.GROUP.A; });
                    groupB = event.participants.filter(function (participant) { return participant.group === client_1.GROUP.B; });
                    if (!(groupA.length === 1 && groupB.length === 1)) return [3 /*break*/, 6];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, initiateRound_1.initiateRound)([groupA[0], groupB[0]])];
                case 3:
                    _a.sent();
                    res.status(200).send({ message: "Final round initiated !" });
                    return [3 /*break*/, 5];
                case 4:
                    err_6 = _a.sent();
                    console.log("initiate last match : ", err_6);
                    res.status(401).send({ message: "Internal server error !" });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
                case 6: return [4 /*yield*/, Promise.all([(0, initiateRound_1.initiateRound)(groupA), (0, initiateRound_1.initiateRound)(groupB)])
                        .then(function () {
                        res.status(200).send({ message: "Round initiated !" });
                    })["catch"](function (err) {
                        res.status(401).send({ message: "Internal server error !" });
                        console.log("initiate round : ", err);
                    })];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); },
    deletePart: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var participant, update, err_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    participant = req.body.participant;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, server_1.prisma.participants["delete"]({
                            where: {
                                id: participant === null || participant === void 0 ? void 0 : participant.id
                            }
                        })];
                case 2:
                    update = _a.sent();
                    res.status(200).send(update);
                    return [3 /*break*/, 4];
                case 3:
                    err_7 = _a.sent();
                    console.log("deletePart : ", err_7);
                    res.status(500).send({ message: "Internal server error !" });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }
};
//# sourceMappingURL=event.js.map