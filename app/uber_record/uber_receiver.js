"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });


const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const router = express_1.Router();

router.post("/new_ride", (req, res) => {
    (async () => {
        try {
            const obj = req.body;
            let array = [];
            try {
                array = JSON.parse(fs_1.default.readFileSync("data/sentData.json", "utf-8"));
            }
            catch { }
            array.push(obj);
            while (array.length > 200) {
                array.shift();
            }
            fs_1.default.writeFileSync("data/sentData.json", JSON.stringify(array));
        }
        catch (err) { }
    })();
    res.status(200).send({ loginStatusSend: true });
});
exports.default = router;
