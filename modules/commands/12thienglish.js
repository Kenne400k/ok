const fs = require("fs");
module.exports.config = {
  name: "12thitienganh",
  version: "1.1.8",
  hasPermssion: 0,
  credits: "TuanDzz", 
  description: "Xem 12 thì trong tiếng anh",
  commandCategory: "Tiện ích",
  usages: "12 thì",
  cooldowns: 5, 
};

module.exports.handleReply = async ({ api, event, handleReply }) => {
const { threadID, messageID, senderID } = event;
    switch(handleReply.type) {
        case "choosee": {
            switch(event.body) {

          case "1":
      api.sendMessage({
        body: "1.The Present Simple-Thì Hiện Tại Đơn \nDấu hiệu nhận biết\nAlways\nUsually\nRegularly\nFrequently\nOften\nSometimes\nOccationally\nRarely\nNever\nCách sử dụng\n* Diễn tả 1 sự việc diễn ra trong 1 thời gian dài hoặc sở thích ở hiện tại.\nVí dụ: Mary often goes to school by bicycle.\n* Diễn tả 1 sự việc lặp đi lặp lại đã thành thói quen ở hiện tại hoặc năng lực của con người.\nVí dụ: I get up early every morning.\n* Diễn tả 1 hiện tượng luôn luôn đúng, chân lí, sự thật hiển nhiên.\nVí dụ: The sun rises in the East.\n4. Diễn tả một kế hoạch sắp xếp trước trong tương lai hoặc thời khóa biểu, đặc biệt dùng với các động từ di chuyển.\nVí dụ: The plane takes off at 3 p.m this afternoon.\nCác quy tắc\nQuy tắc chia động từ ngôi thứ 3 số ít ở thời hiện tại đơn:\n Thông thường: => động từ + s (ví dụ: reads)\nKết thúc bằng S, SS, SH, X, O => động từ + ES (ví dụ: goes)\nKết thúc bằng phụ âm + Y => đổi thành I + ES (ví dụ: fly => flies)\nKết thúc bằng nguyên âm + Y => động từ + S (ví dụ: plays)\nKết thúc bằng F, FE => đổi F, FE thành VES (ví dụ: dwarf => dwarves)", 
      }, event.threadID, event.messageID);
      break;
    case "2":
      api.sendMessage({
        body: "2.The Present Continuous -Hiện Tại Tiếp Diễn\nDấu hiệu nhận biết\nNow\nRight\n now\nAt the moment\nAt this moment\nAt present\nCâu thức mệnh lệnh (Look!, Listen!)\nCách dùng\n* Sử dụng hiện tại tiếp diễn để nói về hiện tại: \nDiễn tả một hành động đang diễn ra ở hiện tại. Ví dụ:\nThe children are playing football now.\nThì này cũng thường tiếp theo sau câu đề nghị, mệnh lệnh. Ví dụ:\nLook! The child is crying.\nBe quiet! The baby is sleeping in the next room.\nThì này còn diễn tả 1 hành động xảy ra lặp đi lặp lại dùng với phó từ ALWAYS. Ví dụ:\nHe is always borrowing our books and then he doesn’t remember.\nDiễn tả hành động đang xảy ra trước và sau khoảng thời gian được cho. Ví dụ:\nAt eight o’clock we are usually having breakfast.\nDiễn tả một xu hướng, một sự kiện mới xảy ra gần đây. Ví dụ:\nThese days most people are using email instead of writing letters.\nWhat sort of clothes are teenagers wearing nowadays?\nWhat sort of music are they listening to?*Sử dụng hiện tại tiếp diễn để nói về tương lai:\nDiễn tả một hành động sắp xảy ra – có khả năng xảy ra rất cao (ở tương lai gần). Ví dụ:\nHe is coming tomorrow.\nMột việc gì đó vừa được lên kế hoạch hoặc vừa được thu xếp. Ví dụ:\nMary is going to a new school next term.\nWhat are you doing next week?\n*Sử dụng để kể chuyện, khi đang tóm tắt lại nội dung câu chuyện của một quyển sách, bộ phim…\nThe movie ends when Thor is wondering where to land the ship.\nI’m reading a novel to the chapter when the main character is losing everything he has built.\nMột số động từ không chia tiếp diễn\nĐộng từ chỉ sự suy nghĩ: believe, see, recognize, imagine, remember, forget, understand, realize, know, suppose…\nĐộng từ chỉ cảm xúc: like, love, dislike, prefer, hate, want…\nĐộng từ chỉ nhận thức: see, taste, hear, smell, feel…\nCác động từ khác: to be, need, seem, belong to, include, have (khi mang nghĩa có)…\nVí dụ:\nI am tired now.She wants to go for a walk at the moment.Do you understand your lesson?\nQuy tắc cấu tạo V-ing\nThông thường => động từ + ing. (ví dụ: stand => standing)\nKết thúc bằng E => động từ bỏ E và + ing. (ví dụ: write => writing)\nĐộng từ 1 âm tiết kết thúc bằng 1 phụ âm, trước nó là 1 nguyên âm => nhân đôi phụ âm cuối và + ing. (ví dụ: swim => swimming)\nĐộng từ 2 âm tiết, trọng âm rơi vào âm tiết thứ 2, kết thúc bằng 1 phụ âm, trước nó là 1 nguyên âm => nhân đôi phụ âm cuối và + ing. (ví dụ: pre’fer => preferring)", 
      }, event.threadID, event.messageID);
      break;
    case "3":
      api.sendMessage({
        body: "3.The Present Perfect –Thì Hiện Tại Hoàn Thành\nDấu hiệu nhận biết\nAlready\nJust\nRecently\nLately\nNot…yet\nEver\nNever\nStill\nSeveral times\nUp to now\nMany times\nSo far\nNever before\nFor + 1 khoảng thời gian (ví dụ: for 5 years)\nSince + 1 mốc thời gian (ví dụ: since 2012)For so long/a long time\nCách sử dụng\n*Diễn tả 1 sự việc đã xảy ra ở quá khứ nhưng kết quả của nó vẫn liên quan đến hiện tại. Ví dụ:\nThey’ve been married for nearly fifty years./nShe has lived in Liverpool all her life.\nDiễn tả 1 hành động thường xuyên làm trong quá khứ và vẫn tiếp tục đến hiện tại. Ví dụ:\nI’ve played the guitar ever since I was a teenager.\nHe has written three books and he is working on another one.\n*Ta thường sử dụng mệnh đề với “since” khi 1 sự việc bắt đầu trong quá khứ. Ví dụ:\nI have worked here since I left school.\nNói về kinh nghiệm đã từng trải qua. Lưu ý:Thường sử dụng từ ever để nói về kinh nghiệm, việc từng trải qua cho đến hiện tại. Ví dụ:\nMy last birthday was the worst day I have ever had.\nVà không bao giờ sử dụng thể phủ định với ever. Ví dụ:\nHave you ever met George?\nYes, but I’ve never met his wife.\n*Diễn tả hành động đã xảy ra trong quá khứ nhưng lại rất quan trọng ở thời điểm nói. Ví dụ:\nI can’t get in the house.I’ve lost my keys.\nI’m tired out.I’ve been working all day.\n*Thường sử dụng phân từ 2 của “be” khi ai đó vừa tới nơi nào đó và đã quay trở lại. Ví dụ:\nA: Where have you been?\nB: I’ve just been out to the supermarket.\nA: Have you ever been to San Francisco?\nB: No, but I’ve been to Los Angeles.\nNhưng khi người đó chưa trở lại thì ta sử dụng have/has gone:\nA: Where is Maria? I haven’t seen her for weeks.\nB: She’s gone to Paris for a week. She’ll be back tomorrow.\n7. Thường dùng hiện tại hoàn thành với trạng ngữ chỉ thời gian để nói về thời gian gần đây: just, only just, recently. Ví dụ:\nScientists have recently discovered a new breed of monkey.\nWe have just got back from our holidays.\nHoặc trạng ngữ tính đến hiện tại: ever (trong câu hỏi), so far, until now, up to now, yet (trong câu hỏi và phủ định). Ví dụ:\nHave you ever seen a ghost?\nWhere have you been up to now?\nHave you finished your homework yet?\nNo, so far I’ve only done my history.\nChú ý: Không sử dụng hiện tại hoàn thành với các trạng ngữ chỉ quá khứ với những việc đã kết thúc:\nI have seen that film |yesterday|.\nWe have just bought a new car |last week|.\n|When we were| children we have been to California.\nNhưng có thể sử dụng với những việc chưa kết thúc:\nHave you seen Helen today?\nWe have bought a new car this week.", 
      }, event.threadID, event.messageID); 
      break;
    case "4":
      api.sendMessage({
        body: "4.The Present Perfect Continuous – Thì Hiện Tại Hoàn Thành Tiếp Diễn\nDấu hiệu nhận biết\nAll day\nAll week\nFor a long time\nAlmost\nThis week\nRecently\nAll day long\nThe whole week\nLately\nIn the past week\nIn recent years\nUp until now\nSo far\nFor + 1 khoảng thời gian\nSince + 1 mốc thời gian\n(Thời này thường đi với các động từ wait, stay, live, work, learn, sit, stand…)\nCách sử dụng\n*Dùng để nhấn mạnh tính liên tục của 1 hành động bắt đầu trong quá khứ, kéo dài đến hiện tại và còn tiếp tục đến tương lai.  Ví dụ:\nI have been waiting for you since 4 p.m.\nShe has been working for more than 2 hours.\n2. Là nguyên nhân dẫn đến kết quả hiện tại.\nSo sánh hiện tại hoàn thành và hiện tại hoàn thành tiếp diễn\nNhấn mạnh kết của hành động, số lượng thu được.\nVí dụ: I have taught for 4 hours today. (hành động đã hoàn tất vào lúc nói, nhấn mạnh vào kết quả “4 giờ”)\n Hiện Tại Hoàn Thành Tiếp Diễn\nNhấn mạnh tính liên tục của hành động.\nVí dụ: I have been teaching since 2 p.m (hành động chưa hoàn tất, nhấn mạnh vào tính liên tục)", 
      }, event.threadID, event.messageID); 
      break;
    case "5":
      api.sendMessage({
        body: "5. The Simple Past – Thì Quá Khứ Đơn\nDấu hiệu nhận biết\nYesterday\nLast (night, week…)\nKhoảng thời gian + ago\nThời gian trong quá khứ. Ví dụ: 2 weeks ago; In 1945\nCách sử dụng\n*Diễn tả 1 hành động, sự việc đã xảy ra trong quá khứ, không liên quan đến hiện tại và tương lai.\nHe worked at McDonald’s.\n*Sử dụng trong câu điều kiện If, đưa ra giả thuyết và câu mong ước.  Ví dụ:\nHe could get a new job if he really tried.\nI would always help someone who really needed help.\nI wish it wasn’t so cold.\n*Có thể sử dụng quá khứ đơn ở hiện tại khi muốn thể hiện sự lịch thiệp.\nI just hoped you would be able to help me.\nQuy tắc cấu tạo V-ed (Chỉ áp dụng với động từ có quy tắc)\nThông thường => động từ+ ED (ví dụ: want => wanted)\nKết thúc bằng E => động từ + D (ví dụ: like => liked)\nKết thúc bằng phụ âm + Y => đổi thành I + ED (ví dụ: fly => flied)\nKết thúc bằng nguyên âm + Y => động từ + ED (ví dụ: play => played)\nĐộng từ 1 âm tiết kết thúc bằng 1 phụ âm, trước nó là 1 nguyên âm => nhân đôi phụ âm cuối và + ED (ví dụ: refer => referred)\n Động từ 2 âm tiết, trọng âm rơi vào âm tiết thứ 2, kết thúc bằng 1 phụ âm, trước nó là 1 nguyên âm => nhân đôi phụ âm cuối và + ED (ví dụ: prefer => preferred)\nChú ý:\nVisit => Visited\nListen => Listened\nOpen=>Opened\nEnter => Entered", 
      }, event.threadID, event.messageID); 
      break;
    case "6":
      api.sendMessage({
        body: "6. The Past Continous – Quá Khứ Tiếp Diễn\nDấu hiệu nhận biết\nThời điểm xác định trong quá khứ. Ví dụ: at 8 p.m yesterday; at this time last yesterday.\nMệnh đề When + quá khứ đơn với động từ thường.\nMệnh đề While + quá khứ tiếp diễn.\nAt this morning (afternoon).\nAt that very moment.\nCách sử dụng\n*Diễn tả 1 sự việc đang xảy ra ở 1 thời điểm xác định trong quá khứ. Ví dụ:\nThey were meeting secretly after school.\n*Diễn tả 1 sự việc đang diễn ra ở quá khứ thì 1 sự việc khác cắt ngang. Ví dụ:\nThe children were doing their homework when I got home.\nI often get home when the children are doing their homework.\n*Diễn tả 2 hành động đang diễn tả song song tại 1 thời điểm trong quá khứ. Ví dụ:\nI was cooking dinner while my son was playing with our dog.", 
      }, event.threadID, event.messageID); 
      break;
    case "7":
      api.sendMessage({
        body: "7.The Past Perfect – Thì Quá Khứ Hoàn Thành\ Dấu hiệu nhận biết \nBy/until + thời gian trong quá khứ. Ví dụ: By 2005, he had written 5 books.\nBefore + thời gian trong quá khứ\nAfter + mệnh đề quá khứ\nAs soon as\nBy the time\nWhen\nAlready\nJust\nCách sử dụng\nDiễn tả 1 hành động, sự việc đã xảy ra và hoàn thành trước 1 thời điểm hoặc 1 sự việc khác ở quá khứ. Ví dụ:\nI had done all my homework before 9 p.m yesterday.\nHe phoned me after he had passed the exam.", 
      }, event.threadID, event.messageID); 
      break;
    case "8":
      api.sendMessage({
        body: "8. The Past Perfect Continous –Thì Quá Khứ Hoàn Thành Tiếp Diễn\nDấu hiệu nhận biết\nUntil then\nBy the time\nPrior to that time\nBefore\nAfter\nCách sử dụng\nNhấn mạnh khoảng thời gian của 1 hành động đã đang xảy ra trong quá khứ và kết thúc trước 1 hành động khác xảy ra và cũng kết thúc trong quá khứ.\nVí dụ:\nEverything was wet.It had been raining for hours.\nHe was a wonderful guitarist.He had been playing ever since he was a teenager.\nShe didn’t want to move.She had been living in Liverpool all her life.\nI had been watching the programme every week, but I missed the last episode.", 
      }, event.threadID, event.messageID); 
      break;
    case "9":
      api.sendMessage({
        body: "9. The Simple Future –Thì Tương Lai Đơn\nDấu hiệu nhận biết\nTonight\nTomorrow\nNext (day, week, month, year)\nLater\nSoon\nIn + 1 khoảng thời gian\nThời gian trong tương lai\nTrong câu có những động từ chỉ quan điểm như: think, believe, suppose, perhaps, probably\nCách sử dụng\nKhi bạn đoán (predict, guess), dùng will hoặc be going to. Ví dụ:\nI think the United will win the game.\nI think the United is going to win the game.\n*Khi có dự định trước, dùng be going to. Ví dụ:\nWe’re going to have a meal.\n*Diễn tả sự tình nguyện hoặc sự sẵn sàng, dùng will. Ví dụ:\nOh, I’ve left the door open. I will go and shut it.", 
      }, event.threadID, event.messageID); 
      break;
    case "10":
      api.sendMessage({
        body: "10. The Future Continuous – Thì Tương Lai Tiếp Diễn\nDấu hiệu nhận biết\nIn the future\nNext time/year/week\nSoon\nAt this time/ At this moment + thời gian trong tương lai\nAt + giờ cụ thể + thời gian trong tương lai\nCách sử dụng\n*Dùng để diễn tả một hành động hay sự việc đang diễn ra tại một thời điểm xác định trong tương lai.  Ví dụ:\nDon’t ring at 8 o’clock. I’ll be watching “Who Wants to be a Millionaire”.\nThis time tomorrow we’ll be sitting on the beach. I can’t wait!\n* Dùng để diễn tả một hành động, một sự việc đang xảy ra thì một hành động, sự việc khác xen vào trong tương lai.  Ví dụ:\nWhen you come tomorrow, they will be playing badminton.\nHe will be waiting for me when I arrive tomorrow.\nTrong những câu không phải về tương lai nhưng chúng ta có thể sử dụng thì tương lai tiếp diễn để nói về những gì chúng ta giả định đang xảy ra tại thời điểm này.  Ví dụ:\nDon’t phone grandma now, she’ll be having dinner.\nThe kids are very quiet. They’ll be doing something wrong, I know it!", 
      }, event.threadID, event.messageID); 
            break;
      case "11":
      api.sendMessage({
        body: "11. The Future Perfect – Thì Tương Lai Hoàn Thành\nDấu hiệu nhận biết\nBy the time\nPrior to the time\nBy + thời gian trong tương lai\nBy the end of + thời gian trong tương lai\nBefore + thời gian trong tương lai\nCách sử dụng\n*Dùng để diễn tả một hành động hay sự việc hoàn thành trước một thời điểm trong tương lai. Ví dụ:\nDo you think you will have finished it by next Thursday?\nIn 5 years time I’ll have finished university.\n*Dùng để diễn tả một hành động hay sự việc hoàn thành trước một hành động hay sự việc khác trong tương lai. Ví dụ:\nI will have made the meal ready before the time you come tomorrow.", 
      }, event.threadID, event.messageID); 
      break;
      case "12":
      api.sendMessage({
        body: "12. The Future Perfect Continuous – Thì Tương Lai Hoàn Thành Tiếp Diễn\nDấu hiệu nhận biết\nFor + khoảng thời gian + by/before + mốc thời gian trong tương lai. VD: For 2 hours by the time she arrives.\nCách sử dụng\nDùng để diễn tả một hành động xảy ra trong quá khứ tiếp diễn liên tục đến một thời điểm cho trước trong tương lai.  Ví dụ:\nI will have been studying English for 10 year by the end of next month.\nTomorrow, when you come back, I will have been watching that football match on TV for half an hour.", 
      }, event.threadID, event.messageID); 
            break;
          default:
        const choose = parseInt(event.body);
              if (isNaN(event.body)) return api.sendMessage("💟 𝐕𝐮𝐢 𝐥𝐨̀𝐧𝐠 𝐧𝐡𝐚̣̂𝐩 𝟏 𝐜𝐨𝐧 𝐬𝐨̂́", event.threadID, event.messageID);
              if (choose > 12 || choose < 1) return api.sendMessage("🔰 𝐋𝐮̛̣𝐚 𝐜𝐡𝐨̣𝐧 𝐤𝐡𝐨̂𝐧𝐠 𝐧𝐚̆̀𝐦 𝐭𝐫𝐨𝐧𝐠 𝐝𝐚𝐧𝐡 𝐬𝐚́𝐜𝐡.", event.threadID, event.messageID); 

      }
    }
  }
}

module.exports.run = async ({ api, event, handleReply }) => {
  const fs = require("fs");
  const { threadID, messageID, senderID } = event;
  return api.sendMessage({ body: "📚 𝟏𝟐 𝐓𝐡𝐢̀ 𝐓𝐫𝐨𝐧𝐠 𝐓𝐢𝐞̂́𝐧𝐠 𝐀𝐧𝐡 📚" +
                "\n𝟏. 𝐓𝐡𝐞 𝐏𝐫𝐞𝐬𝐞𝐧𝐭 𝐒𝐢𝐦𝐩𝐥𝐞 (𝐓𝐡𝐢̀ 𝐇𝐢𝐞̣̂𝐧 𝐓𝐚̣𝐢 Đ𝐨̛𝐧) 📓\n" +
                "\n𝟐. 𝐓𝐡𝐞 𝐏𝐫𝐞𝐬𝐞𝐧𝐭 𝐂𝐨𝐧𝐭𝐢𝐧𝐮𝐨𝐮𝐬(𝐓𝐡𝐢̀ 𝐇𝐢𝐞̣̂𝐧 𝐓𝐚̣𝐢 𝐓𝐢𝐞̂́𝐩 𝐃𝐢𝐞̂̃𝐧) 📔\n" +
                "\n𝟑. 𝐓𝐡𝐞 𝐏𝐫𝐞𝐬𝐞𝐧𝐭 𝐏𝐞𝐫𝐟𝐞𝐜𝐭 (𝐓𝐡𝐢̀ 𝐇𝐢𝐞̣̂𝐧 𝐓𝐚̣𝐢 𝐇𝐨𝐚̀𝐧 𝐓𝐡𝐚̀𝐧𝐡) 📒\n" +
                "\n𝟒. 𝐓𝐡𝐞 𝐏𝐫𝐞𝐬𝐞𝐧𝐭 𝐏𝐞𝐫𝐟𝐞𝐜𝐭 𝐂𝐨𝐧𝐭𝐢𝐧𝐮𝐨𝐮𝐬 (𝐓𝐡𝐢̀ 𝐇𝐢𝐞̣̂𝐧 𝐓𝐚̣𝐢 𝐇𝐨𝐚̀𝐧 𝐓𝐡𝐚̀𝐧𝐡 𝐓𝐢𝐞̂́𝐩 𝐃𝐢𝐞̂̃𝐧) 📕\n" +
                "\n𝟓. 𝐓𝐡𝐞 𝐒𝐢𝐦𝐩𝐥𝐞 𝐏𝐚𝐬𝐭 (𝐓𝐡𝐢̀ 𝐐𝐮𝐚́ 𝐊𝐡𝐮̛́ Đ𝐨̛𝐧) 📗\n" +
                "\n𝟔. 𝐓𝐡𝐞 𝐏𝐚𝐬𝐭 𝐂𝐨𝐧𝐭𝐢𝐧𝐨𝐮𝐬 (𝐓𝐡𝐢̀  𝐐𝐮𝐚́ 𝐊𝐡𝐮̛́ 𝐓𝐢𝐞̂́𝐩 𝐃𝐢𝐞̂̃𝐧) 📘\n" +
                "\n𝟕. 𝐓𝐡𝐞 𝐏𝐚𝐬𝐭 𝐏𝐞𝐫𝐟𝐞𝐜𝐭 (𝐓𝐡𝐢̀ 𝐐𝐮𝐚́ 𝐊𝐡𝐮̛́ 𝐇𝐨𝐚̀𝐧 𝐓𝐡𝐚̀𝐧𝐡) 📙\n" +
                "\n𝟖. 𝐓𝐡𝐞 𝐏𝐚𝐬𝐭 𝐏𝐞𝐫𝐟𝐞𝐜𝐭 𝐂𝐨𝐧𝐭𝐢𝐧𝐨𝐮𝐬 (𝐓𝐡𝐢̀ 𝐐𝐮𝐚́ 𝐊𝐡𝐮̛́ 𝐇𝐨𝐚̀𝐧 𝐓𝐡𝐚̀𝐧𝐡 𝐓𝐢𝐞̂́𝐩 𝐃𝐢𝐞̂̃𝐧) 📚\n" +
                "\n𝟗. 𝐓𝐡𝐞 𝐒𝐢𝐦𝐩𝐥𝐞 𝐅𝐮𝐭𝐮𝐫𝐞 – (𝐓𝐡𝐢̀ 𝐓𝐮̛𝐨̛𝐧𝐠 𝐋𝐚𝐢 Đ𝐨̛𝐧) 📖\n" +
                "\n𝟏𝟎. 𝐓𝐡𝐞 𝐅𝐮𝐭𝐮𝐫𝐞 𝐂𝐨𝐧𝐭𝐢𝐧𝐮𝐨𝐮𝐬 (𝐓𝐡𝐢̀ 𝐓𝐮̛𝐨̛𝐧𝐠 𝐋𝐚𝐢 𝐓𝐢𝐞̂́𝐩 𝐃𝐢𝐞̂̃𝐧) 📝\n" +
                "\n𝟏𝟏. 𝐓𝐡𝐞 𝐅𝐮𝐭𝐮𝐫𝐞 𝐏𝐞𝐫𝐟𝐞𝐜𝐭 ( 𝐓𝐡𝐢̀ 𝐓𝐮̛𝐨̛𝐧𝐠 𝐋𝐚𝐢 𝐇𝐨𝐚̀𝐧 𝐓𝐡𝐚̀𝐧𝐡) 📰\n" +
                "\n𝟏𝟐. 𝐓𝐡𝐞 𝐅𝐮𝐭𝐮𝐫𝐞 𝐏𝐞𝐫𝐟𝐞𝐜𝐭 𝐂𝐨𝐧𝐭𝐢𝐧𝐮𝐨𝐮𝐬 (𝐓𝐡𝐢̀ 𝐓𝐮̛𝐨̛𝐧𝐠 𝐋𝐚𝐢 𝐇𝐨𝐚̀𝐧 𝐓𝐡𝐚̀𝐧𝐡 𝐓𝐢𝐞̂́𝐩 𝐃𝐢𝐞̂̃𝐧) 🗞" + 
                "\n\n📚 𝐑𝐞𝐩𝐥𝐲 𝐭𝐢𝐧 𝐧𝐡𝐚̆́𝐧 𝐭𝐡𝐞𝐨 𝐬𝐨̂́ 𝐧𝐞̂́𝐮 𝐦𝐮𝐨̂́𝐧 𝐱𝐞𝐦 𝐭𝐡𝐞̂𝐦 𝐯𝐞̂̀ 𝐭𝐮̛̀𝐧𝐠 𝐭𝐡𝐢̀ 𝐧𝐡𝐚"
            ,attachment: fs.createReadStream(__dirname + `/noprefix/12thi.jpg`)}, event.threadID, (error, info) => {
        global.client.handleReply.push({
            type: "choosee",
            name: this.config.name,
            author: event.senderID,
            messageID: info.messageID
        })  
    })
}