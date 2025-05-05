module.exports.config = {
  name: "resetmoney",
  version: "1.0.2",
  hasPermssion: 2,
  credits: "Horizon Team",
  description: "Phiên bản nâng cấp từ xóa tiền nhóm lên xóa tiền all",
  commandCategory: "Admin",
  usages: "UID kèm ID + số tiền hoặc mỗi resetmoney",
  cooldowns: 5
};

module.exports.run = async function ({ api,event,Currencies,Users,args }) {
    	if(args[0]=="UID"){
		var id = args[1];
		var cut = args[2];
		let nameeee = (await Users.getData(id)).name
		   return api.sendMessage(`[𝐇𝐓🐧] => Đã Thay Đổi Số Dư Của ${nameeee} Thành ${cut} Đô`, event.threadID, () => Currencies.setData(id, { money:parseInt(cut)}), event.messageID)	

		}
     var x = global.data.allCurrenciesID;
      for (let ex of x) {
            await Currencies.setData(ex, { money: parseInt(0) });
            var eheh = (await Currencies.getData(ex)).money;
            console.log(eheh)
         }
    return api.sendMessage("[𝐇𝐓🐧] => Đã xóa toàn bộ số tiền trên hệ thống !",event.threadID);
}