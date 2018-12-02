const { createLogger } = require("bunyan");
const BunyanSlack = require("bunyan-slack");

const loggerOptions = {
    name: "Seclot-API",
    streams: [
        {
            level: "info",
            stream: process.stdout
        },
        {
            level: "error",
            stream: new BunyanSlack({
                webhook_url: process.env.SLACK_LOG_WEBHOOK,
                channel: process.env.SLACK_LOG_CHANNEL,
                username: process.env.SLACK_LOG_SENDER_ID,
                customFormatter: function(record) {
                    const detail = record.detail.split(/\r?\n/);
                    let brief = record.detail;
                    let message = record.msg;

                    if (detail.length > 0) {
                        // likely an uncaught error
                        brief = detail.slice(0,5).join("\n");
                        message = "Unexpected Error";
                    }

                    return {
                        text: `*${message}*\n\`\`\`${brief}\`\`\``
                    }
                }
            })
        }
    ]
};

module.exports = createLogger(loggerOptions);