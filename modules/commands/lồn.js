module.exports.config = {
  name: "lồn",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "MAVERICK",
  description: "Random Ảnh Lồn 18+",
  commandCategory: "random-img",
  usages: "lồn",
  cooldowns: 2,
  dependencies: {
    "request":"",
    "fs-extra":"",
    "axios":""
  }
};

module.exports.run = async({api,event,args,client,Users,Threads,__GLOBAL,Currencies}) => {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
  var link = [
"https://i.postimg.cc/90rdZWtp/000-tuoi69com-avtt-sieu-pham-mua-dich-yeu-tim-dung-tim-toi-8.jpg",
"https://i.postimg.cc/3RwmQK6T/33f211a.jpg",
"https://i.postimg.cc/SNYLKxKQ/anh-sex-lon-hong-4-1.jpg",
"https://i.postimg.cc/8C4MYFZ4/anh-sex-lon-hong-6.jpg",
"https://i.postimg.cc/RZr7Jx37/anh-sex-lon-hong-8.jpg",
"https://i.postimg.cc/TPfnQjJh/anh-sex-lon-hong-7.jpg",
"https://i.postimg.cc/VvpjF3Kc/anh-sex-0821-192229-001.jpg",
"https://i.postimg.cc/nVPYZDpw/anh-sex-0821-192230-002.jpg",
"https://i.postimg.cc/T1LbhtfN/anh-sex-1220-113022-0013637110876791872443.jpg",
"https://i.postimg.cc/zD6W4YFs/anh-sex-1220-113023-0136393045848809360110.jpg",
"https://i.postimg.cc/DZYs29kb/anh-sex-1220-113023-0169212316104187981978.jpg",
"https://i.postimg.cc/T1zDbnPd/anh-sex-1220-113023-0183908425055169071936.jpg",
"https://i.postimg.cc/W16kDFcV/anh-sex-1220-113023-0183908425055169071936-1.jpg",
"https://i.postimg.cc/GpLsvLby/anh-sex-1220-113024-0416348071432112490157.jpg",
"https://i.postimg.cc/XY057Khx/anh-sex-1220-113025-0493661381699023954378.jpg",
"https://i.postimg.cc/MKBRS3sv/anh-sex-dit-lon-hong-gai-xinh.jpg",
"https://i.postimg.cc/fb8SKGbg/Anh-Sex-Gai-Dep-Cung-Cai-Lon-Hu-Hong-12-scaled.jpg",
"https://i.postimg.cc/hjhz32z4/Anh-Sex-Gai-Dep-Cung-Cai-Lon-Hu-Hong-14-scaled.jpg",
"https://i.postimg.cc/sX8QF57Y/Anh-Sex-Gai-Dep-Cung-Cai-Lon-Hu-Hong-2-scaled.jpg",
"https://i.postimg.cc/5yCHfjSZ/Anh-Sex-Gai-Dep-Cung-Cai-Lon-Hu-Hong-9-scaled.jpg",
"https://i.postimg.cc/66g1W3Xz/anh-sex-gai-to-12.jpg",
"https://i.postimg.cc/t4HS6M7x/anh-sex-lon-gai-goi.jpg",
"https://i.postimg.cc/SjbnRqZj/anh-sex-lon-gai-nga-dep-khong-ti-vet-nhin-muon-hup-sach-21.jpg",
"https://i.postimg.cc/3JGfdTrh/anhx-net-1.jpg",
"https://i.postimg.cc/gcnTbhfn/Bo-anh-sex-gai-teen-khoe-lon-theo-kieu-doggy-1-scaled.jpg",
"https://i.postimg.cc/QtPSd6RV/Bo-anh-sex-gai-teen-khoe-lon-theo-kieu-doggy-10-scaled.jpg",
"https://i.postimg.cc/N0sdJ26G/Bo-anh-sex-gai-teen-khoe-lon-theo-kieu-doggy-17.jpg",
"https://i.postimg.cc/qvXmxxCZ/Bo-anh-sex-gai-teen-khoe-lon-theo-kieu-doggy-2-scaled.jpg",
"https://i.postimg.cc/DzxBtf6r/Bo-anh-sex-gai-teen-khoe-lon-theo-kieu-doggy-20.jpg",
"https://i.postimg.cc/vBD3MR2p/Bo-anh-sex-gai-teen-khoe-lon-theo-kieu-doggy-21.jpg",
"https://i.postimg.cc/FHZZLF2M/Bo-anh-sex-gai-teen-khoe-lon-theo-kieu-doggy-22-scaled.jpg",
"https://i.postimg.cc/BvnCc93X/Bo-anh-sex-gai-teen-khoe-lon-theo-kieu-doggy-29-scaled.jpg",
"https://i.postimg.cc/xjwtr4v4/Bo-anh-sex-gai-teen-khoe-lon-theo-kieu-doggy-29-scaled-1.jpg",
"https://i.postimg.cc/qq3whsTw/Bo-anh-sex-gai-teen-khoe-lon-theo-kieu-doggy-3-scaled.jpg",
"https://i.postimg.cc/05McBswS/Bo-anh-sex-gai-teen-khoe-lon-theo-kieu-doggy-4-scaled.jpg",
"https://i.postimg.cc/vH5XGtXH/Bo-Anh-Sex-Lam-Tinh-Dit-Em-Gai-Lon-Mup-Trong-Nha-Nghi-1-scaled.jpg",
"https://i.postimg.cc/htgsvQ38/body-kich-dam281729.jpg",
"https://i.postimg.cc/PxLz9WPH/Co-phi-cong-dang-chup-anh-sex-china-11.jpg",
"https://i.postimg.cc/qR9XTN33/Co-phi-cong-dang-chup-anh-sex-china-25-scaled.jpg",
"https://i.postimg.cc/59CSmShq/gai-goi.jpg",
"https://i.postimg.cc/D0LQy7rY/hot-girl-khoe-lon-dam-s75-10.jpg",
"https://i.postimg.cc/Mpd7GPBx/hot-girl-khoe-lon-dam-s75-11.jpg",
"https://i.postimg.cc/Hkp0dDVB/hot-girl-khoe-lon-dam-s75-3.jpg",
"https://i.postimg.cc/WbmmBbbd/hot-girl-khoe-lon-dam-s75-6.jpg",
"https://i.postimg.cc/BQfc71sW/hot-girl-khoe-lon-dam-s75-7.jpg",
"https://i.postimg.cc/jj2znH6f/lon-dep-03-1024x695.jpg",
"https://i.postimg.cc/5tr8BXpR/lon-mup-nhieu-nuoc.jpg",
"https://i.postimg.cc/NMrmpQzf/Sex-vi-t-xem-l-n-g-i-d-m-l-n-non-m-i-l-n.png",
"https://i.postimg.cc/XNd9575s/Suon-Xam-Voi-Cac-Buc-Anh-Sex-China-Lo-Thien-15.jpg",
"https://i.postimg.cc/WzLryxBm/Suon-Xam-Voi-Cac-Buc-Anh-Sex-China-Lo-Thien-16-scaled.jpg",
"https://i.postimg.cc/gjVRbNpC/Suon-Xam-Voi-Cac-Buc-Anh-Sex-China-Lo-Thien-20-scaled.jpg",
  ];
  var max = Math.floor(Math.random() * 6);  
  var min = Math.floor(Math.random() * 2);
  var data = await Currencies.getData(event.senderID);
  var exp =  data.exp;
  var money = data.money
      if(money < 1000) api.sendMessage("Bạn cần 100 đô để xem ảnh ?",event.threadID,event.messageID)
          else {
   Currencies.setData(event.senderID, options = {money: money - 1000})
   var callback = () => api.sendMessage({body:`Như này mà nhét Cặc vào rồi nhấp thì phê chết đi được.`,attachment: fs.createReadStream(__dirname + "/cache/5.jpg")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/5.jpg")); 
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/5.jpg")).on("close",() => callback());
   }
};