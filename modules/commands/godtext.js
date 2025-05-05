module.exports.config = {
    name: "godtext",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Heo Rừng - mod từ yaytext bigtext",
    description: "Chúa nói tiếng Anh, không nói tiếng Việt",
    commandCategory: "Công cụ",
    cooldowns: 0
};
module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, senderID, body } = event;;
    var content = args.join(" ").toLowerCase();
    let msgtext = content.replace(/a/g, "ꋫ").replace(/b/g, "ꃃ").replace(/c/g, "ꏸ").replace(/d/g, "ꁕ").replace(/e/g, "ꍟ").replace(/f/g, "ꄘ").replace(/g/g, "ꁍ").replace(/h/g, "ꑛ").replace(/i/g, "ꂑ").replace(/j/g, "ꀭ").replace(/k/g, "ꀗ").replace(/l/g, "꒒").replace(/m/g, "ꁒ").replace(/n/g, "ꁹ").replace(/o/g, "ꆂ").replace(/p/g, "ꉣ").replace(/q/g, "ꁸ").replace(/r/g, "꒓").replace(/s/g, "ꌚ").replace(/t/g, "꓅").replace(/u/g, "ꐇ").replace(/v/g, "ꏝ").replace(/w/g, "ꅐ").replace(/x/g, "ꇓ").replace(/y/g, "ꐟ").replace(/z/g, "ꁴ");
    return api.sendMessage(msgtext, threadID,messageID);
}