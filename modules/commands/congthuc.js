module.exports.config = {
    name: "congthuc",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "DungUwU",
    description: "Công thức toán - vật lý trọn bộ",
    commandCategory: "study",
    usages: "congthuc toan/vatly",
    cooldowns: 5,
    dependencies: {
        "request":"",
        "fs-extra":""
    }
};


module.exports.handleReply = async function({ api, event, handleReply, client }) {
const request = global.nodemodule["request"];
const { createWriteStream, createReadStream, unlinkSync } = global.nodemodule["fs-extra"];
var link = "";
var msg = "";
    switch(handleReply.type) {
        case "toan": {
            switch(event.body) {
                case "1":/*daoham*/ link = "https://i.imgur.com/kQmVXlL.jpg"; msg = "đạo hàm của bạn đây!"; break;
                case "2":/*nguyenham*/ link = "https://i.imgur.com/2jyh72H.jpg"; msg = "nguyên hàm của bạn đây!"; break;
                case "3":/*logarit*/ link = "https://i.imgur.com/WkxOvVZ.jpg"; msg = "Logarit của bạn đây!"; break;
                case "4":/*dientich*/ link = "https://i.imgur.com/AODxsFO.jpg"; msg = "tính diện tích của bạn đây!"; break;
                case "5":/*thetich*/ link = "https://i.imgur.com/ubmnDFT.jpg"; msg = "tính thể tích của bạn đây!"; break;
                case "6":/*lượng giác*/ link = "https://i.imgur.com/Jypelyv.png"; msg = "lượng giác của bạn đây!"; break;
                 case "7":/*luythua*/ link = "https://i.imgur.com/rgXzcRO.jpg"; msg = "lũy thừa của bạn đây!"; break;
                 case "8":/*toadokhonggian*/ link = "https://i.imgur.com/PTPOLrx.jpg"; msg = "tọa độ không gian của bạn đây!"; break;
                default: break;
            };
            const choose = parseInt(event.body);
            if (isNaN(event.body)) return api.sendMessage("Lựa chọn của bạn không phải là một con số!", event.threadID, event.messageID);
            if (choose > 8 || choose < 1) return api.sendMessage("Lựa chọn của bạn không nằm trong danh sách", event.threadID, event.messageID);
            if (link == "" || msg == "") {
                link = "https://i.ibb.co/DKbvzS7/image.png"
                msg = "này sẽ được cập nhật sau!";
            };
            return request(encodeURI(link)).pipe(createWriteStream(__dirname + `/cache/toan.jpg`)).on("close", () =>api.sendMessage('Đang lấy dữ liệu...', event.threadID, event.messageID).then(api.sendMessage({body: `Công thức ${msg}`, attachment: createReadStream(__dirname + "/cache/toan.jpg")}, event.threadID, () => unlinkSync(__dirname + "/cache/toan.jpg"))));
            };
        case "vatly": {
            switch(event.body) {
                case "1":  
                return api.sendMessage(
                "=== Vật lý 10 ===" +
                "\n» Mời bạn nhập lựa chọn «" +
                "\n\n1. Chương 1. Động lực học chất điểm" +
                "\n2. Chương 2. động lực học chất điểm!" +
                "\n3. Chương 3. cân bằng và chuyển động của vật rắn" +
                "\n4. Chương 4. các định luật bảo toàn" +
                "\n5. Chương 5. chất khí" +
                "\n6. Chương 6. cơ sở của nhiệt động lực học" +
                "\n7. Chương 7. chất rắn và chất lỏng.Sự chuyển thể" +
                "\n\n» Hãy reply tin nhắn và chọn theo số «"
            , event.threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "Lop10"
                });
            });
                case "2":
                return api.sendMessage(
                "=== Vật lý 11 ===" +
                "\n» Mời bạn nhập lựa chọn «" +
                "\n\n1. Chương 1. điện tích - điện trường" +
                "\n2. Chương 2. dòng điện không đổi" +
                "\n3. Chương 3. dòng điện trong các môi trường"+
                "\n4. Chương 4. từ trường" +
                "\n5. Chương 5. cảm ứng điện từ" +
                "\n6. Chương 6. khúc xạ ánh sáng" +
                "\n7. Chương 7. mắt các dụng cụ quang" +
                "\n\n» Hãy reply tin nhắn và chọn theo số «"
            , event.threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "Lop11"
                });
            });
                case "3":
                return api.sendMessage(
                "=== Vật lý 12 ===" +
                "\n» Mời bạn nhập lựa chọn «" +
                "\n\n1. Chương 1.dao động cơ" +
                "\n2. Chương 2. sóng cơ" +
                "\n3. Chương 3. dòng điện xoay chiều" +
                "\n4. Chương 4. dao động và sóng điện từ" +
                "\n5. Chương 5. sóng ánh sáng" +
                "\n6. Chương 6. lượng tử ánh sáng" +
                "\n7. Chương 7. hạt nhân nguyên tử" +
                "\n\n» Hãy reply tin nhắn và chọn theo số «"
            , event.threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "Lop12"
                });
            });
                default: break;
        }

            const choose = parseInt(event.body);
            if (isNaN(event.body)) return api.sendMessage("Lựa chọn của bạn không phải là một con số!", event.threadID, event.messageID);
            if (choose > 3 || choose < 1) return api.sendMessage("Lựa chọn của bạn không nằm trong danh sách", event.threadID, event.messageID);
            };


            case "Lop10": {
            switch(event.body) {
                case "1":/*chuong1*/ link = "https://i.imgur.com/vHFSC50.jpg"; msg = "động học chất điểm!"; break;
                case "2":/*chuong2*/ link = "https://i.imgur.com/4oqkAZ8.png"; msg = "động lực học chất điểm!"; break;
                case "3":/*chuong3*/ link = "https://i.ibb.co/WHB4dqD/image.png"; msg = "cân bằng và chuyển động của vật rắn!"; break;
                case "4":/*chuong4*/ link = "https://i.ibb.co/7VJn9xV/image.png"; msg = "các định luật bảo toàn!"; break;
                case "5":/*chuong5*/ link = "https://i.ibb.co/0c7wKqW/image.png"; msg = "chất khí!"; break;
                case "6":/*chuong6*/ link = "https://i.ibb.co/P6gqVfj/image.png"; msg = "cơ sở của nhiệt động lực học!"; break;
                case "7":/*chuong7*/ link = "https://i.ibb.co/bJZPtHQ/image.png"; msg = "chất rắn và chất lỏng.Sự chuyển thể!"; break;
                default: break;
             };

             const choose = parseInt(event.body);
            if (isNaN(event.body)) return api.sendMessage("Lựa chọn của bạn không phải là một con số!", event.threadID, event.messageID);
            if (choose > 7 || choose < 1) return api.sendMessage("Lựa chọn của bạn không nằm trong danh sách", event.threadID, event.messageID);
            if (link == "." || msg == ".") {
                link = "https://i.ibb.co/DKbvzS7/image.png"
                msg = "Tự add link vô?";
            };
            return request(encodeURI(link)).pipe(createWriteStream(__dirname + `/cache/ly.jpg`)).on("close", () =>api.sendMessage('Đang lấy dữ liệu...', event.threadID, event.messageID).then(api.sendMessage({body: `Công thức ${msg}`, attachment: createReadStream(__dirname + "/cache/ly.jpg")}, event.threadID, () => unlinkSync(__dirname + "/cache/ly.jpg"))));
            };

        case "Lop11": {
            switch(event.body) {
                case "1":/*chuong1*/ link = "https://i.imgur.com/S6lSsum.jpg"; msg = "điện tích - điện trường của bạn đây!"; break;
                case "2":/*chuong2*/ link = "https://i.imgur.com/vgrUOSd.jpg"; msg = "dòng điện không đổi của bạn đây!"; break;
                case "3":/*chuong3*/ link = "https://i.imgur.com/u8zwgnp.png"; msg = "dòng điện trong các môi trường của bạn đây!"; break;
                case "4":/*chuong4*/ link = "https://i.imgur.com/LabsAoP.png"; msg = "từ trường của bạn đây!"; break;
                case "5":/*chuong5*/ link = "https://i.imgur.com/LabsAoP.png"; msg = "cảm ứng điện từ của bạn đây!"; break;
                case "6":/*chuong6*/ link = "https://i.imgur.com/0EYFWSi.png"; msg = "khúc xạ ánh sáng của bạn đây!"; break;
                case "7":/*chuong7*/ link = "https://i.imgur.com/eXZBWeQ.png"; msg = "mắt các dụng cụ quang của bạn đây!"; break;
                default: break;
             };

             const choose = parseInt(event.body);
            if (isNaN(event.body)) return api.sendMessage("Lựa chọn của bạn không phải là một con số!", event.threadID, event.messageID);
            if (choose > 7 || choose < 1) return api.sendMessage("Lựa chọn của bạn không nằm trong danh sách", event.threadID, event.messageID);
            if (link == "djt cu thang nao luoi eo them them link de t phai di them" || msg == "bruh") {
                link = "https://i.ibb.co/DKbvzS7/image.png"
                msg = "Tự add link vô?";
            };
            return request(encodeURI(link)).pipe(createWriteStream(__dirname + `/cache/ly.jpg`)).on("close", () =>api.sendMessage('Đang lấy dữ liệu...', event.threadID, event.messageID).then(api.sendMessage({body: `Công thức ${msg}`, attachment: createReadStream(__dirname + "/cache/ly.jpg")}, event.threadID, () => unlinkSync(__dirname + "/cache/ly.jpg"))));
            };

        case "Lop12": {
            switch(event.body) {
                case "1":/*chuong1*/ link = "https://i.imgur.com/Re0PBOS.jpeg"; msg = "dao động cơ của bạn đây!"; break;
                case "2":/*chuong2*/ link = "https://i.imgur.com/cwLdLUh.jpeg"; msg = "sóng cơ của bạn đây!"; break;
                case "3":/*chuong3*/ link = "https://i.imgur.com/bpwATCZ.png"; msg = "dòng điền xoay chiều của bạn đây!"; break;
                case "4":/*chuong4*/ link = "https://i.imgur.com/V1DcjLF.png"; msg = "dao động và sóng điện từ của bạn đây!"; break;
                case "5":/*chuong5*/ link = "https://i.imgur.com/2hbfCmK.jpeg"; msg = "sóng ánh sáng của bạn đây!"; break;
                case "6":/*chuong6*/ link = "https://i.imgur.com/5PMiEVw.png"; msg = "lượng tử ánh sáng của bạn đây!"; break;
                case "7":/*chuong7*/ link = "https://i.imgur.com/6cTmBgY.png"; msg = "hạt nhân nguyên tử của bạn đây!"; break;
                default:  break; //SelenaEpicStun
            };

            const choose = parseInt(event.body);
            if (isNaN(event.body)) return api.sendMessage("Lựa chọn của bạn không phải là một con số!", event.threadID, event.messageID);
            if (choose > 7 || choose < 1) return api.sendMessage("Lựa chọn của bạn không nằm trong danh sách", event.threadID, event.messageID);
            if (link == "abcxyz" || msg == "caklo") {
                link = "https://i.ibb.co/DKbvzS7/image.png"
                msg = "Tự add link vô?";
            };
            return request(encodeURI(link)).pipe(createWriteStream(__dirname + `/cache/ly.jpg`)).on("close", () =>api.sendMessage('Đang lấy dữ liệu...', event.threadID, event.messageID).then(api.sendMessage({body: `Công thức ${msg}`, attachment: createReadStream(__dirname + "/cache/ly.jpg")}, event.threadID, () => unlinkSync(__dirname + "/cache/ly.jpg"))));
            };
    }
}

module.exports.run = ({ event, api, args, client, utils }) => {
    if (!args[0]) {
        api.sendMessage(`Vui lòng nhập các tag: toan/vatly`, event.threadID);
    } else {
        switch(args[0]) {
            case "toan": {
            return api.sendMessage(
                "=== Công thức toán ===" +
                "\n» Mời bạn nhập lựa chọn «" +
                "\n\n1. Đạo hàm." +
                "\n2. Nguyên hàm." +
                "\n3. Logarit." +
                "\n4. Diện tích." +
                "\n5. Thể tích" +
                "\n6. Lượng giác" +
                "\n7. Lũy thừa" +
                "\n8. Tọa độ trong không gian" +
                "\n\n» Hãy reply tin nhắn và chọn theo số «"
            , event.threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "toan"
                });
            }, event.messageID);
        }
            case "vatly": {
            return api.sendMessage(
                "=== Lớp ===" +
                "\n» Mời bạn nhập lựa chọn «" +
                "\n\n1. Lớp 10." +
                "\n2. Lớp 11." +
                "\n3. Lớp 12." + 
                "\n\n» Hãy reply tin nhắn và chọn theo số «"
            , event.threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "vatly"
                });
            }, event.messageID);
        }
            default:
            return utils.throwError("congthuc", event.threadID, event.messageID); break;
        }
    }
}