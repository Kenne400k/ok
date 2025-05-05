module.exports.config = {
    name: "dec",
    version: "1.0.7",
    hasPermssion: 3,
    credits: "HungCho",
    description: "Chỉ là decode mà thôi",
    commandCategory: "dành cho admin",
    usages: "",
    cooldowns: 0,
    dependencies: { "javascript-obfuscator": "" }
}

module.exports.run = async function({ api, event, args, Currencies }) {
    var JavaScriptObfuscator = global.nodemodule["javascript-obfuscator"];

    var obfuscationResult = JavaScriptObfuscator.obfuscate(`${args.join("")}`, {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        numbersToExpressions: true,
        simplify: true,
        shuffleStringArray: true,
        splitStrings: true,
        stringArrayThreshold: 1
    });

    //console.log(obfuscationResult.getObfuscatedCode());
    api.sendMessage(obfuscationResult.getObfuscatedCode(), event.threadID, event.messageID)
}
