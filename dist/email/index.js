"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const ejs_1 = __importDefault(require("ejs"));
const utils_1 = require("../utils");
const client_sesv2_1 = require("@aws-sdk/client-sesv2");
const ses = new client_sesv2_1.SESv2Client({
    region: "us-east-2",
});
class EmailService {
    async sendReceiptEmail(emailAddress, data) {
        try {
            const emailString = await ejs_1.default.renderFile(__dirname + "/templates/receipt.ejs", data);
            const command = new client_sesv2_1.SendEmailCommand({
                FromEmailAddress: "tools@jxndao.com",
                Destination: {
                    ToAddresses: [emailAddress],
                },
                Content: {
                    Simple: {
                        Subject: {
                            Data: data.partnerName
                                ? `MyBackpack Receipt - ${data.partnerName} Purchase`
                                : "MyBackpack Receipt",
                        },
                        Body: {
                            Html: {
                                Data: emailString,
                            },
                        },
                    },
                },
            });
            await ses.send(command);
        }
        catch (err) {
            utils_1.log.warn({
                func: "sendReceiptEmail",
                err,
            });
        }
    }
}
exports.emailService = new EmailService();
//# sourceMappingURL=index.js.map