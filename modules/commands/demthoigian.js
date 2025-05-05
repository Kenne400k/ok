module.exports.config = {
  name: "đếm",
  version: "1.0",
  hasPermssion: 0,
  credits: "Jukie",
  description: "Đếm thời gian",
  commandCategory: "Công cụ",
  cooldowns: 5
}

module.exports.run = async ({ event, api, args })  => {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;
    const threadSetting = global.data.threadData.get(parseInt(event.threadID)) || {};
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
if (!args[0] || args[0].length > 8 || args[0].length < 7) {
      api.sendMessage(`[⚜️] Hướng dẫn sử dụng [⚜️]\n[⚜️]→ ${prefix}${this.config.name} sinhnhat [năm-tháng-ngày]\n[⚜️]→ ${prefix}${this.config.name} ngayyeu [năm-tháng-ngày]\n[⚜️]→ ${prefix}${this.config.name} thoigian [năm-tháng-ngày] [năm-tháng-ngày]`, event.threadID, event.messageID);
    }
    else {
  if (args[0] == 'sinhnhat') {
    if (!args[1] || args[1].length > 10 ) {
    return api.sendMessage(`[⚜️]→ Vui lòng nhập theo định dạng: ${prefix}${this.config.name} ${args[0]} [năm-tháng-ngày]`, event.threadID, event.messageID);	
    }
    else {


      const ngay = args[1];
        const t = Date.parse(ngay) - Date.parse(new Date()) ;
        const seconds = Math.floor( (t/1000) % 60 );
        const minutes = Math.floor( (t/1000/60) % 60 );
        const hours = Math.floor( (t/(1000*60*60)) % 24 );
        const days = Math.floor( t/(1000*60*60*24) );
        return api.sendMessage(`[⚜️]→ Thời gian tới sinh nhật của bạn là: ${days} ngày ${hours} tiếng ${minutes} phút ${seconds} giây`, event.threadID, event.messageID);
}
}
    else {
  if (args[0] == 'thoigian') {
    if (!args[1] || args[1].length > 10 ) {
    return api.sendMessage(`[⚜️]→ Vui lòng nhập theo định dạng: ${prefix}${this.config.name} ${args[0]} [năm-tháng-ngày] [năm-tháng-ngày]`, event.threadID, event.messageID);	
    }
    else {
      const timestart = args[1];
    if (!args[2] || args[2].length > 10 ) {
    return api.sendMessage(`[⚜️]→ Vui lòng nhập theo định dạng: ${prefix}${this.config.name} ${args[0]} [năm-tháng-ngày] [năm-tháng-ngày]`, event.threadID, event.messageID);	
    }
    else {	
      const timeend = args[2];
        const t = Date.parse(timeend) - Date.parse(timestart)
        const seconds = Math.floor( (t/1000) % 60 );
        const minutes = Math.floor( (t/1000/60) % 60 );
        const hours = Math.floor( (t/(1000*60*60)) % 24 );
        const days = Math.floor( t/(1000*60*60*24) );
        return api.sendMessage(`[⚜️]→ Thời gian được tính toán là: ${days} ngày`, event.threadID, event.messageID);
}
}
}
    else {
      if (args[0] == 'ngayyeu') {
      if (!args[1] || args[1].length > 10 ) {
      return api.sendMessage(`[⚜️]→ Vui lòng nhập theo định dạng: ${prefix}${this.config.name} ${args[0]} [năm-tháng-ngày]`, event.threadID, event.messageID);	
    }
    else {
      const ngay = args[1];
        const t = Date.parse(new Date()) - Date.parse(ngay)
        const seconds = Math.floor( (t/1000) % 60 );
        const minutes = Math.floor( (t/1000/60) % 60 );
        const hours = Math.floor( (t/(1000*60*60)) % 24 );
        const days = Math.floor( t/(1000*60*60*24) );
        return api.sendMessage(`[⚜️]→ Tổng thời gian đã yêu nhau của bạn là: ${days} ngày ${hours} tiếng ${minutes} phút ${seconds} giây`, event.threadID, event.messageID);
      }
    }
    }
    }
  }
}

