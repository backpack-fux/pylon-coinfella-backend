"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingService = void 0;
const Setting_1 = require("../models/Setting");
class SettingService {
    static getInstance() {
        return new SettingService();
    }
    async getSetting(name) {
        const setting = await Setting_1.Setting.findOne({
            where: {
                name
            }
        });
        return (setting === null || setting === void 0 ? void 0 : setting.enabled) || false;
    }
}
exports.SettingService = SettingService;
//# sourceMappingURL=settingService.js.map