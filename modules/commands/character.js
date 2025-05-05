module.exports.config = {
  name: "character",
  version: "1.10.5", //fix error
  hasPermssion: 0,
  credits: "Penguin Convert to Mirai",
  description: "Lấy thông tin anh hùng trong ma về",
  commandCategory: "Thông tin", //error
  usages: "character [name]",
  cooldowns: 5
};

async function Hero(api,event,name) {
    var out = (msg) => api.sendMessage(msg, event.threadID,event.messageID);
        var axios = require('axios');
            // var { data:Res } = await axios.get("http://localhost:1337/api/f-apis/6");
        //     var x = await Res.data.attributes.Api; 
            //  2 dòng trên của bên penguin api nên kemenos đi , vô trang https://superheroapi.com/index.html để lấy key
                var key = '585880862849147';
            var url = `https://www.superheroapi.com/api.php/${key}/search/${encodeURIComponent(name)}`;
        try {
            var { data } = await axios({ url: url, method: "GET" });
                if (data.response == "error") return out("[𝑷𝑮🐧] => Không Tìm Thấy Nhân Vật Lầy")
                    else if (data.response == "success") {
                        var dt = data.results[0];
                            var Name = dt.name,
                                    thongminh = dt.powerstats.intelligence,
                                        suckhoe = dt.powerstats.strength,
                                            tocdo = dt.powerstats.speed,
                                                benbi = dt.powerstats.durability,
                                            sucmanh = dt.powerstats.power,
                                        chiendau = dt.powerstats.combat,
                                    tenthat = data.results[0].biography['full-name'],
                                bietdanh = dt.biography.aliases,
                                    noisinh = data.results[0].biography['place-of-birth'],
                                        xuathienlandau = data.results[0].biography['first-appearance'],
                                            nhaxuatban = dt.biography.publisher,
                                                gioitinh = dt.appearance.gender,
                                            toc = dt.appearance.race,
                                        chieucao = dt.appearance.height[1],
                                    nang = dt.appearance.weight[1],
                                maumat = dt.appearance['eye-color'],
                                    mautoc = dt.appearance['hair-color'],
                                        nghenghiep = dt.work.occupation,
                                    cancu = dt.work.base,
                                image = dt.image.url;
                            var push = [];
                        var request = require('request');
                            const { createReadStream, unlinkSync, writeFileSync,statSync } = require("fs-extra");
                    request(encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=vi&dt=t&q=${nghenghiep}`), (err, response, body) => {if (err) return api.sendMessage("Đã có lỗi xảy ra!", event.threadID, event.messageID);var retrieve = JSON.parse(body);var nghenghiep2 = '';retrieve[0].forEach(item => (item[0]) ? nghenghiep2 += item[0] : '');
                return api.sendMessage({body:`[𝑷𝑮🐧] => Tên Nhân Vật : ${Name}\n[🐧] => Độ Thông Minh : ${thongminh}\n[🐧] => Sức Khỏe : ${suckhoe}\n[🐧] => Tốc Độ : ${tocdo}\n[🐧] => Độ Bền Bỉ : ${benbi}\n[🐧] => Sức Mạnh : ${sucmanh}\n[🐧] => Khả Năng Chiến Đấu : ${chiendau}\n[🐧] => Tên Thật : ${tenthat}\n[🐧] => Biệt Danh : ${bietdanh.join(", ")}\n[🐧] => Nơi Sinh : ${noisinh}\n[🐧] => Xuất Hiện Lần Đầu : ${xuathienlandau}\n[🐧] => Nhà Xuất Bản : ${nhaxuatban}\n[🐧] => Giới Tính : ${gioitinh}\n[🐧] => Tộc : ${toc}\n[🐧] => Chiều Cao : ${chieucao}\n[🐧] => Nặng : ${nang}\n[🐧] => Màu Mắt : ${maumat}\n[🐧] => Màu Tóc : ${mautoc}\n[🐧] => Nghề : ${nghenghiep2}\n[🐧] => Căn Cứ : ${cancu}\n[🐧] => Ảnh : ${image}\n\n[𝑷𝑮🐧] => Chú Thích : N/A vs Undefined vs Dấu - : Không Xác Định\n[🐧] => Tìm Kiến Được : ${data.results.length}, Chọn Lọc Số 1`},event.threadID,event.messageID);
        });
    }
}
 catch (e) {
        console.log(e);
            return out("Lỗi !!!");
    }
}

module.exports.run = async function({ api, event, client,args }) {
    var Content = args.join(" ");
        if (Content.length < 3) return api.sendMessage("[𝑷𝑮🐧] => Hãy Nhập Tên Của Nhân Vật Trên 3 Kí Tự !",event.threadID,event.messageID);
            var out = (msg) => api.sendMessage(msg, event.threadID,event.messageID);
        try {
            await Hero(api,event,Content);
        }
    catch (e) {
        console.log(e);
            return out("Đã Bị Lỗi !");
    }
};