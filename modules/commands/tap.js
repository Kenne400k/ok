module.exports.config = {
  name: "tapngon",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "...",
  description:
    "táp chết con mẹ nó luôn, đừng đùa với lửa, bố mày táp chết con đĩ mẹ mà luôn",
  commandCategory: "group",
  usages: "tapngon @mention",
  cooldowns: 10,
  dependencies: {
    "fs-extra": "",
    axios: "",
  },
};

module.exports.run = async function ({ api, args, Users, event }) {
  var mention = Object.keys(event.mentions)[0];
  if (!mention)
    return api.sendMessage(
      "Cần phải tag 1 người bạn muốn đáp ngôn vào mặt nó",
      event.threadID,
    );
  let name = event.mentions[mention];
  var arraytag = [];
  arraytag.push({ id: mention, tag: name });
  var a = function (a) {
    api.sendMessage(a, event.threadID);
  };
  a(
    "mày hả bưởi! chết mẹ mày nhá con, đt yếu thì chuẩn bị tinh thần lagg nha coan. sorry nhá t chỉ làm theo lệnh của cung chủ thôi. địt mẹ mày sãn sàng chưa con chó....",
  );
  setTimeout(() => {
    a({ body: "Địt con mẹ mày" + " " + name, mentions: arraytag });
  }, 3000);
  setTimeout(() => {
    a({
      body:
        "con tam tai nghiệt súc ru rú trong xó ẳng lên được vài ba câu ngôn rách thì tự vỗ ngực xưng tên sao?mẹ tin rằng lúc mày mới thò cái mặt dái chó thâm sì ra khỏi cái lồn của con gái mẹ xấu số thì bác sĩ đã phải khóc thương cho số phận nghiệt ngã đẻ ra con quái thai lai người ngu si đần độn tứ chi kẹp mép lồn.Đánh trống gõ mõ múa may quay cuồng như một con hề trước mặt mẹ làm mẹ cảm thấy ói mửa tởm lợm quá đi,phun ba cái ngôn rách thì đòi dập được ai? thôi thì mẹ rộng lòng cho con được hưởng diễm phúc nằm chèm bẹp dưới gót chân ngàn vàng và của mẹ Giỏi văn có ngôn thì lên thỉnh mẹ mày nè con đĩ lồn? Mày nhắm ăn được mẹ thì hãy lên đây bùng war nha con lồn bại não, ngồi ở ba hoa xàm lồn muốn dập mẹ thì mày nhả cái ngôn rác của mày ra đây húp mẹ nè đĩ? Ba hoa xàm lồn lúc mẹ dí lòi lồn thì đừng block kẻo mẹ dí cặc vào mồm mày cho mày rên ư ử như con nứng lồn đó đĩ, cứ vác mấy câu ngôn phèn cặc của mày lên đây để mẹ sục nát lồn mày hay gì vậy? Cần mẹ cầm đầu mày đút lại vào lỗ lồn mẹ mày cho bớt làm khổ nhân loại dính dáng tới con sống trong tầng lớp thiểu năng vô tri vô giác đụng mek nghĩ mình ngầu? Có to thì nhả cái ngôn của mày ra type 1-1 với mẹ ngồi đó nhảm nãy giờ thấy mệt 0 vậy đĩ? Nhân cách như nép lồn mà đòi dạy đời tao đéo = 1/3 nhân cách của tao thì mày nín cái họng mày lại 0 mẹ xiên cặc vào mồm mày từ đầu đến chân cho não mày hoạt động lại bớt úng nước lồn nha đĩ, đéo nhả ngôn của mày cho mẹ dập thì bớt ngông cái mồm lồn của mày vào đây kẻo mẹ dí mày xuống âm tiên tiễn mày đi gặp diêm vương thỉnh cái tội lỗi hồ đồ của mà,Giỏi văn có ngôn thì lên thỉnh mẹ mày nè con đĩ lồn? Mày nhắm ăn được mẹ thì hãy lên đây bùng war nha con lồn bại não, ngồi ở ba hoa xàm lồn muốn dập mẹ thì mày nhả cái ngôn rác của mày ra đây húp mẹ nè đĩ? Ba hoa xàm lồn lúc mẹ dí lòi lồn thì đừng block kẻo mẹ dí cặc vào mồm mày cho mày rên ư ử như con nứng lồn đó đĩ, cứ vác mấy câu ngôn phèn cặc của mày lên đây để mẹ sục nát lồn mày hay gì vậy? Cần mẹ cầm đầu mày đút lại vào lỗ lồn mẹ mày cho bớt làm khổ nhân loại dính dáng tới con sống" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 5000);
  setTimeout(() => {
    a({
      body:
        "con lồn cẩu tặc tiểu yêu tinh nhà mày 10 năm nhai được 1 câu hay sao mà spam 3 câu dài dài mà cùn như dái chó mẹ mày không để tâm thì tự ngậm mõm mà suy nghĩ chứ mắc gì dổng ra đây spam định bú dái cha hay bú lồn mẹ hay định la liếm đít tao mà ăn nói hàm hồ đợi chị mày dí mày tàn xác khỏi lên mạng ba hoa xàm lồn nhai ngôn như nhai cứt chó rồi ngồi trong góc khóc huhu hay sao mà ngu lồn tàn tạ để chị mày phải tặng mày cái lồn bát giới để trấn tĩnh âm hồn khỏi lên đây hóa ma dọa quỷ háo hức như hồng hài nhi chui ra từ bụng trư bát giới ngồi đó ngấm ngía 3 câu đại trà bình dân đến cả đứa c1 còn nhai được còn ăn được thằng đỉ mặt lồn nhà mày chừng nào tan thành xác pháo thì thôi chứ dù mày có tu tâm dưỡng tính tu tiên thành phật thì cũng chỉ là cộng rau muống nằm dưới chân chị mày mà liếm đợi chị thương xót vớt con lên về nhà đoàng tụ với gia đình khỏi boàng hoàng đợi mẹ đổi ý rồi tới lượt thằng cha mày bú đít, cho dù có thân phận thấp hèn thì cũng phải biết thân biết phận đừng có bật dậy để mẹ mày đạp xuống đáy đòi lấy oán báo ơn thì mẹ xin con chó nhà mày ngậm mõm lại chứ phun câu nào là bẩn mồm câu đấy toạc tuệ hết trúng người ta" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 7000);
  setTimeout(() => {
    a({
      body:
        "mặt lồn chó quàu mèo gặm trình war như con dòi ngặm xác chết tưởng đâu là hay không ngờ lại gặp chị mày đây chuyên trị mấy con phò lồn âm binh ngu dốt để tạo đì mày xuống 18 tầng địa ngục cho mày làm cô hồn tình dục cho mấy con cô hồn dạ quỷ khác để gái mẹ và thằng cha già mồm đầy cứt trâu của mày phải lặn lội khắp nơi cạo đầu sám hối đi tu để chị mày tha thứ và cho 2 mặt lồn rách nát là cha và gái mẹ mày xuống cứu nhưng không ngờ đi được nữa đường thì gái mẹ mày đã bị bọn âm binh hiếp dâm xé xác vức lồn ra bãi tha ma còn thằng cha mày phải chịu cảnh số phận mất vợ mất con mà sinh bệnh tử vong để cô hồn dạ quỷ vất vưởng như mày phải trả giá về những hành động ngu lồn như giờ thì phải bị tao đì ở dưới đó 3 đời 7 kiếp nha" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 9000);
  setTimeout(() => {
    a({
      body:
        "Con đỉ nghiệt súc tiện tì nhà mày chơi được thì chịu được nhảy chân sáo ra đây mà tỉ thí 1 1 coi ai thắng ai thua chứ sao núp bờ núp bụi sợ mẹ mày phỉ bán nhục mạ con đỉ nghiệp tụ chúng sanh nhà mày khỏi đi lăng mạ người tađụ má con đỉ yêu nghiệt chó tha ma hóa nào đụng người ta thì lết xác ra đây coi tao sài 72 phép thần thông hô mưa gọi gió đều động 500 mã lực ra đây tì đầu bẻ cổ chết tươi con đỉ trời đánh thánh đâm chết mương chết cán đầu đường xó chợ đó nhabốc xác con cẩu tặc mẫn nhi lên 18 tầng mây xong một tay tao phủi con thú hồng liên rác rưởi như mày xuống hạ giới rồi kêu diêm vương ra đì đoạ mày xuống 7 tầng địa ngục nhấn đầu mày xuống sông hoàng hà để cứt trong đầu mày được rửa sạch nha quá khập khiễng khi mà phải để tao khạc ngôn như khạc đờm để type với con chó chân ướt chân ráo mà bày đặt làm bố thiên hạ nhảy lên đầu tao ngồi chê mẹ mày ngôn rách ngôn nát là sao hả con xàm cứt, câm cụ m cái họng lồn xàm xí đú cứ ngồi gia giảng đạo đức cho mấy con óc cứt não tôm rình mò cắn lồn cạp bướm chị đi, trình thì thở được dăm ba câu như con thú nhồi bông lông nhông loắt choắt, đụ đỉ mẹ đúng là âm cực dương hồi dòng đời xoay chuyển dòng họ 9981 đời nhà m nhìn cái bài vị tao lù lù trên cửa Phật có há hốc mồm cầu xin mẹ m dung thứ cho cái hạng ăn cháo lá đa như màybiết đường chui lối thoát thì ngậm họng để bố mày hoá địa tạng soi sáng chúng sinh phổ độ trần thế nhất là mấy con cá vàng thoi thóp tưởng mình là kình nghê bị tao đè đầu đạp như phanh xích lô chết bất đắc kì tử thì đến đấng cứu nhân độ thế phật tổ như lai hay thiên bồng nguyên soái cũng đéo siêu thoát nổi con âm binh khí tụ đụ hình như mày đâu nha còn giờ thì đéo còn ngôn để cop chơi với mẹ mày nữa thì cút xa xa đi bà mày ngứa mắt nhảy ra bẻ đầu con quỷ cái già lồn như cưng chết bất đắc kỷ tử ngay tại bây giờ chứ sao phải sợ con lồn hạ đẳng như mày?" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 12000);
  setTimeout(() => {
    a({
      body:
        "Cái nhân cách mày dơ dáy hôi thối quá có cần tao rửa cho không chai nước hoa của tao là bằng cả năm mày đi ăn sinh lê lết ngoài đường rồi đấy thứ bẩn thỉu mà lên mặt âm binh khí đụ hay dì mà cứ gây sự thế nhề mày được bằng ai có giỏi ra đây mà đạp tao đây này tao chống mặt chờ mày đập tao đây không chừng mày chưa kịp đạp là tim gan phèo phổi bị t móc ra r xay nhuyễn cho thú cưng  rồi mày câm mồm lại đừng hở tí mà sủa mày chả bằng 1 gốc của con chó tao đâu" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 15000);
  setTimeout(() => {
    a({
      body:
        "ranh con ngu ngục ăn nói hàm hồ coi trời bằng vung trời chu bất diện chị nắm tóc em giựt hết sạch không còn một nào vứt xuống giếng xé xác em ra trăm mảnh vứt cho cá ăn.Chị thắp 3 nén nhang để cúng hồn em nơi diêm la địa phủ về để dập đầu xin lỗi chị xới luôn cả cha ông em đã khuất từ nghìn năm lên để rửa tội thay cho em nè con ôn" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 17000);
  setTimeout(() => {
    a({
      body:
        "0 ngôn 0 lí mà cũng bầy đặt làm màu trên cái sàn war này sao ,sân si mẹ trong khi mày còn đéo bằng cái lồn của mẹ  gái ạ , người ta ghen ăn tức ở muôn đời nát còn mày thì khỏi cần ghen ăn tức ở thì nó cũng nát sẳn rồi gái ạ, nết thì còn đéo bằng cái móng của con chó nhà tao mà cứ nghĩ mình cao sang, để mẹ bank mày 10k mua cây dũa về dũa lại cái nết chó cắn của mày nha gái,nhắm ăn được mẹ thì hãy xách cái lồn lên đây set kèo với mẹ mày chứ mà set rồi ăn 0 được để mẹ dí như con chó ghẻ rồi lại rén, với cái ngôn cùi của gái thì muôn đời 0 đấu lại mẹ đâu gái ạ ,lên đây ẳng để mẹ mày nhấn cái đầu con lồn như mày xuống sông hoàng hà rửa cho bớt ngu sao gái?ngôn thì đã ít còn hạ đẳng mà còn muốn dí mẹ sao ?con tiện tì hạ đẳng bò dưới chân mẹ mà cũng muốn ngang hàng với mẹ thì hề quá rồi đấy gái, ngôn từ nhảm nhí từ thời nạn đói mà Việt Nam bị mấy anh ngoại quốc tống bom mà chết qua từng ngày vậy mà cũng đòi đấu với mẹ mày ,lên đây ẳng được vài câu để mẹ mày nắm đầu quay như con gà què ,dăm ba cái ngôn đại trà núp dưới mép lồn mẹ mà cũng muốn thắng mẹ ? Hề hước quá rồi đó gái,mẹ mày mang danh con ngọc hoàng nắm đầu con đĩ như mày ném âm trì địa phủ bú cu các vong linh để lấy tinh trùng ém vào cái não lồn của mày để cho mày khôn ra và nhận ra là cho dù m có luyện bao lâu nữa thì cái trình của mày vẫn đéo thắng được tao ,mãi keo" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 20000);
  setTimeout(() => {
    a({
      body:
        "súc vật ngu lồn mày tính làm mẹ thiên hạ ra lệnh cho tao hả? con âm binh tù đụ mày chỉ có nước quỳ xuống khóc lóc van xin mẹ tha mạng thôi chứ ở đó mà oai ? oai với ai chứ oai với tao thì sục cho nát lồn. Nhục nhã quay mặt rời đi giờ quay lại thách đấu thì xin nhận lời. Con khí đụ xàm lồn mày bại não nên nói câu nào đéo hiểu câu đó hả em ơi? ngôn thì đéo đâu vào đâu toàn dập mõm được vài câu rồi gáy toang lên nhưng bị chị mày bịt mõm nè. trình rách mà bày đặt nhào vô kiếm ăn? Tập tành đú war thì đụng được mấy con 0 ngôn 0 lí thôi chứ có ngôn có lí thì em tuổi lồn sánh vai. Rác mà ảo tưởng thánh thần hy lặp muốn tap ai thì tap nhưng tiếc rằng tap trúng thượng đế nên bị dí cho không lối thoát? Đuối thì dập đầu xin tha chứ đừng có dở trò nha. Trình lồn mày mẹ búng cái 1 là văng đi chứ ở đó mà bày đặt hét toáng lên giọng bố mày là nhất ở đây với mẹ. Rác rưởi bại trận mà dám xông vô thách đấu mẹ là sai lầm rồi nha con súc nô bại não. con ôn óc chó ngu lồn cố khuấy động giữa đám đông nhưng đéo ai thèm care có nhục không? Bản thân là 1 con quèn đã bại trận từ lâu mà bây giờ 5 đầu 6 tay lao vô khiêu khích tao? ngôn thì như cái củ lồn mà bày đặt vỗ ngực ra oai. Con ranh mày mẹ búng tay 1 cái là văng đi hàng tỷ km nha. Thấy mẹ mày đéo nói gì là bắt đầu tự cao? Ờ tự cao đi rồi mẹ sục cho nát lồn nha.súc vật ngu lồn mày tính làm mẹ thiên hạ ra lệnh cho tao hả? con âm binh tù đụ mày chỉ có nước quỳ xuống khóc lóc van xin mẹ tha mạng thôi chứ ở đó mà oai ? oai với ai chứ oai với tao thì sục cho nát lồn. Nhục nhã quay mặt rời đi giờ quay lại thách đấu thì xin nhận lời. Con khí đụ xàm lồn mày bại não nên nói câu nào đéo hiểu câu đó hả em ơi? ngôn thì đéo đâu vào đâu toàn dập mõm được vài câu rồi gáy toang lên nhưng bị chị mày bịt mõm nè. trình rách mà bày đặt nhào vô kiếm ăn? Tập tành đú war thì đụng đươ �c mấy con 0 ngôn 0 lí thôi chứ có ngôn có lí thì em tuổi lồn sánh vai. Rác mà ảo tưởng thánh thần hy lặp muốn tap ai thì tap nhưng tiếc rằng tap trúng thượng đế nên bị dí cho không lối thoát? Đuối thì dập đầu xin tha chứ đừng có" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 23000);
  setTimeout(() => {
    a({
      body:
        "Loại chó đẻ nứng lồn mong manh dễ vỡ , :)) tao địt nát lồn khí tụ quanh lồn phong ba tinh trùng vào bảng mặt lồn nhà mày :)) , loại con phò rẻ tiền non nớt bại não , loại ngu ngục hãm cặc , con đĩ chó vô danh mà cứ tưởng là nhà thơ tài ba hả thằng mặt lồn 😔 tao lôi cả dòng họ nội ngoại cô gì chú bát tao đụ nát lồn bể trứng , nát cặc rách lồn :b cả nhà mày ra , loại động vật 4 chân biết sủa nhưng đéo biết cắn , trai tân mà tưởng mình là tổng thống à🥰 , thôi hãy về nới thuộc về mày đi nói đạo lí thì vô rừng mà chơi với khỉ với ếch đi con nha:) nới này không giành cho mày rồi con à đi war không ngôn mãi bại con nhé , thương lắm mới nói nè , :)) đéo biết war về bú lồn mẹ mà học hỏi thêm đi rồi hãy đi tap thì đéo lại ngôn thì được vài câu mà toàn trên mạng:) có mấy câu cụ mày còn bt trên top top 😔 chửi văn minh hả :)) vậy thôi đừng kê con nha hãm vãi đạo lí trên mạng thì nín bú cặc cha mày mà ăn năn xám hối mãi ghét thằng mặt lồn nhà mày🥰!" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 25000);
  setTimeout(() => {
    a({
      body:
        "Anh đây được trời phái xuống để đạp đầu em gõ được ba cái ngib6 cop ngôn lồn là ngôn được với anh sao tưởng núp được mấy con gà bập bẹ sàn war là hay hay anh dâng hiến cho đời ngôn cao sang thưởng đẳng em nghĩ ngôn dơ ngôn bẩn của em làm anh phải dây vào" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 28500);
  setTimeout(() => {
    a({
      body:
        "Anh dậm banh lồn em cho em lâm chung với mẹ em luôn chứ để con kì đà cản mũi trước chân anh ngăn anh bước lên ngôi vị mẫu nghi thiên hạ" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 31000);
  setTimeout(() => {
    a({
      body:
        "chó rác quái thai nghiệt xúc khè kháy mẹ mày buông vài câu ngôn rác rưởi xàm lồn bập bẹ câu cục câu què ngôn phèn nát chua nổi men nổi móc rác rưởi của thiên hạ tế mẹ thiên nhiên mẹ đạp mày xuống đáy sông Hoàng Hà tu tâm dưỡng tánh cùng tổ tiên tổ tông nhà mày. Con chó rác lang thang đầu đường xó chợ dungf teencode ngập mu lon mẹ viết tiếng Việt còn không xong mà đòi khè kháy mẹ mày tao dạy mày học lại các từ ngữ tiếng Việt rồi hãy kháy tao . Súc vật thân tàn ma dại ngu dốt như rác rưởi của xã hội thối nát nên đạp đầu mày xuống đáy Hoàng Hà rửa lại nhân cách thối tha chó chết nhà mả mẹ mả cha cả tổ tiên nhà mày nha rác rưởi Chó chết bày đặt thanh cao tao nhã tao bẻ lệch ngôn cùn cõi của mày tao vả lệch bướm nát văng cho chó tab đi là liếm học vài ba câu ngôn loi ra mà khè kháy tao Có ngày sặc ngôn chết tươi vương vấn cõi trần thế đéo thể siêu thoát khỏi cõi dư âm địa ngục tù túng khè kháy vài câu ngôn teencode phèn chưa cức đái thông não bằng thông bồn cầu mới thông nỗi não bộ kém phát triển của chó chết nhà mả mẹ mày ấu trĩ nhảy câng cẩng lên táp như chó dại sống chui rút lui thủi nơi thối nát thái độ ngông nghênh ngang ngó liếc ngang liếc dọc như chó tìm xương mà ngập thái độ xấc xược láo toét như má thiên hạ nhưng đéo làm được cái đéo tích sự trò chống gì ra hồn thân rác bại trận thân ta ma dại thân bại danh liệt chó mõm sồn sồn lên cắn với vài ba type ngôn cùn cợt bẩn thỉu Type ngôn chát chua type ngôn xàm lồn lên giọng mẹ gáy như con thiểu năng tứ chi kiếm phát triển thối nát vô danh tiểu tốt đè bẹp xuống sông cho chết chìm trôi nổi trên sông Hoàng Hà rửa sạch tội lỗi của mày . Nghiệt xúc tai ương ngôn ngữ uốn éo ba hoa xàm lồn mà đòi nhai ngôn tao tao nắm đầu quay như quay dế để thông bộ não con người lại thui còn chó dại con kiki hạ đẳng tao đạp nát bướm nát cu mày đạp nát cả dòng tộc mả tổ tiên nhà mày như đống đổ nát lật cả tổ cả tiên nhà lên tế sống chó dại quen đường khua môi múa mép làm được cái tích sự trò trống gì tao băm tán xương nát thịt cho cá ăn cá nó còn chê nhân cách thối tha thân dành bại liệt Con lồn dơ bẩn thỉu ăn nói hàm hồ không bằng không chứng đòi tao phục ăn bám anh em mf tưởng oai hùng lẫm liệt lắm cà kê dê ngỗng mách ông mách cha làm mẹ mày à lên solo 1 1 để tao đạp chết mả cha cả dòng họ mày bôi tro chét trấu ăn nói hàm hồ không bằng cầm thú khôn hồn xin lỗi mẹ để mẹ bao dung rộng lượng mà buông tha cho con nghiệt súc âm binh quái thai nhà mày con đường sống.Cha sanh mẹ đẻ học đâu ra cái thói khè kháy người khác thói hư tật xấu lồn nát bẩm sinh thiểu năng trí tuệ bộ não kém cỏi mà tưởng là má thiên mẹ thiên nhiên khua môi múa mép ba hoa xàm lồn tao chưa lông lồn lông cặc là mày cho mày ở đó mà khè kháy mẹ mày mồm còn hôi mùi sữa mà lên giọng mẹ với tao con lồn dơ bẩn trình cỏn còn tao bẻ gãy ngôn gáy mẹ gáy cha cà kê dê ngỗng ngôn như lông cặc tép riêu thối rữa tưởng bản thân cao siêu không xem ai ra gì về nhà họ lại tiếng việt rồi hãy vỗ ngực xưng tên với tao ngông nghênh tao dùi đầu xuống đóng cứt thối tha ki " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 36000);
  setTimeout(() => {
    a({
      body:
        "Em gõ mõ tụng kinh xàm ngôn rặn ra được 1 sớ ngôn xàm lồn ấu trĩ đi lụm từ đống cơ ngơi cơ đồ anh trích ra cho bàn dân thiên hạ thi nhau đua đòi chen lấn lụm lại sài tiếp như cái bao cao su ông bà già em đã lấy sài đi sài lại sài tới sài lui sài xuôi sài ngược để tiết kiệm tiền nuôi thứ vô ơn bội nghĩa súc sinh bần hèn như em ăn học vậy đó con đĩ lồn rách màng trinh bán lấy tiền cúng thờ ông bà già mày trên bàn thờ tổ tiên 18 đời nhà mày đâu nha con đĩ chó ngu lồn tận cõi âm ti quái thai từ lúc mới đẻ" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 39000);
  setTimeout(() => {
    a({
      body:
        "đụ mẹ quên uống nước, chờ tao đi uống nước rồi tao chửi tiếp..." +
        " " +
        name,
      mentions: arraytag,
    });
  }, 40000);
  setTimeout(() => {
    a({
      body:
        "Cái đụ mẹ con ôn lồn khí đụ đụ nát bàn thờ tổ gia tiên 7 đời nhà mày, Cái thể loại chó đẻ âm binh cô hồn lên đây ăn lồn gái mẹ m hay sao mà ngu vãi cả lồn vậy con tinh trùng khuyết tật què cụt tay chân kia? Bố m phải vác nào lên nghĩ ngôn để gõ vào cái mu lồn của m thì đéo còn cơ hội để m đi lùi nữa rồi.dí ank đá mu lồn m hả gái? Chứ anh thấy con tinh trù, g yếu ớt của tk mả cha m đéo đủ để dập anh đâuu gái ạỐ là la bại thì Chứ anh thấy con tinh trùng yếu ớt của tk mả cha m đéo đủ để dập anh đâuu gái ạ.ẫn mãi bại thôy?" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 65000);
  setTimeout(() => {
    a({
      body:
        "Mày đang cố gõ tận cùng để chia ly cách biệt vạn kiếp quy tông năm xưa anh đât đi qua hoa sơn luân kiếm hoài thân thành công và 1 nhát thôi đủ làm cưng lìa đời đấy mà thời đại bao nhiêu rồi sao không giám ra mặt mà đi núp war hả cưng? Định làm trò đùa cho thiên hạ sao?anh dùng ngôn gà trình yếu nhưng hơn trình với ngôn của cưng?lên đây vỗ nhẹ ngực anh mà làm như mình là một dân war thành thạo?1 con vô danh như cưng đòi đạp đỗ anh mày à?mới nhú mà lên sàn war đưa mấy ngôn xàm lồn lên? chẳng khác gì cưng bại rồi?chân còn đạp cức mồm còn hôi mùi sữa mà đòi lên sàn war của anh?cưng đéo có trình mà đi chửi ?cưng bại là do cưng dùng ngôn gà đéo trình đéo ngôn?cưng bại cũng ở dưới lỗ đích của anh?hay cưng muốn soi lồn anh nhỉ?cưng cop ngôn chắc gì cưng đã thừa nhận?anh có vật chứng nhân chứng đéo phải ngôn lồn đâu ?anh có trình có ngôn đỡ hơn cưng đéo có ngôn đòi lên đây war vs anh?anh sống cũng tạo nghiệp nhưng nghiệp cưng rất nặng để anh chữa nghiệp dùm cho?ơ thế cưng ở dưới mép lồn anh à?Con gà công nhiệp vỗ ngực xưng oai không sợ anh mày vặt lông mu cho vào nồi sao mà còn ngồi ở đây mở mõm réo tên anh?" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 70000);
  setTimeout(() => {
    a({
      body:
        "cái lồn bà già con cô hồn cát đảng âm binh khí đụ tụ vào lồn con đĩ mẹ mày nhúng tay nhả dăm ba cái ngôn ba hoa xàm lồn như nước đái chó , như tinh trùng từ cặc thằng cha mày tiết ra mà dám dỏng mỏ lên sủa sảng với chị mày hả ? đánh giá người ta thì được tới cái lúc bị dập lại dãy đành đạch ra là cái mả sống mưu sinh gì ở đây con lồn âm binh ơi? cần anh đổ nước sôi vô não mày để rửa sạch cặn cứt và cho não mày mấy nếp nhăn trong đầu mày cho cái thân xác quèn chó tam mai nhà mày bớt lộ diện tính chó dại ra ngoài chứ cái lồn rách nhà mày chỉ đáng  nằm dưới đách lồn tao mà vẫn nghênh ngang nhả ba cái ngôn xàm lồn với chị sao? đòi ăn tao thì ráng ăn nuốt trọn vào bản họng nha con đĩ ăn không hết coi tao sục chết con đĩ mẹ mày nha gái?vác mặt lồn mày vào đây để tao đá nát óc lồn của mày thể loại bại trận ra lẹ đi gái ơi" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 75000);
  setTimeout(() => {
    a({
      body:
        "Đụ đỉ mẹ mày con súc vật nông dân móng chân vàng đừng có để tao phải nhìn thấy cái mặt lồn nhà mày thì thằng bố mày đây sẽ bửa nát tử cung khai thông buồng trứng con mẹ mày đấy đừng để tao phải tìm ra cái mặt lồn con mẹ mày rồi tao lại tọng vào lồn con đĩ mẹ mày 1000 cái xà beng nung đỏ và 100 tấn xi măng bít lồn con gái mẹ mày trình như con chó rúc vào ổ như con gà chui vào bếp bới tìm tro cốt ông bà mày để lập đàn cầu siêu cúng tế thần tiên thổ địa cho cái danh dự của mày giữ được chút ít sau hồi thi nhảy lò cò với mẹ bị mẹ đá lồn đập mồm vào cặc của thằng ất ơ nào đấy ấy vậy mà còn gan trời tưởng mình cao sang quyền quý lá ngọc cành vàng tựa đông dựa tây đi đòi dập mẹ nhưng thực chất trình gà lồn của mày chỉ đủ dập thú nhồi bông thôi zậy hot" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 80000);
  setTimeout(() => {
    a({
      body:
        "bốc xác con cẩu tặc mẫn nhi lên 18 tầng mây xong một tay tao phủi con thú hồng liên rác rưởi như mày xuống hạ giới rồi kêu diêm vương ra đì đoạ mày xuống 7 tầng địa ngục nhấn đầu mày xuống sông hoàng hà để cứt trong đầu mày được rửa sạch nha quá khập khiễng khi mà phải để tao khạc ngôn như khạc đờm để type với con chó chân ướt chân ráo mà bày đặt làm bố thiên hạ nhảy lên đầu tao ngồi chê mẹ mày ngôn rách ngôn nát là sao hả con xàm cứt, câm cụ m cái họng lồn xàm xí đú cứ ngồi gia giảng đạo đức cho mấy con óc cứt não tôm rình mò cắn lồn cạp bướm chị đi, trình thì thở được dăm ba câu như con thú nhồi bông lông nhông loắt choắt, đụ đỉ mẹ đúng là âm cực dương hồi dòng đời xoay chuyển dòng họ 9981 đời nhà m nhìn cái bài vị tao lù lù trên cửa Phật có há hốc mồm cầu xin mẹ m dung thứ cho cái hạng ăn cháo lá đa như mày" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 85000);
  setTimeout(() => {
    a(
      " Không phải là nắng mà cứ thích chói chang.Không phải là gió mà cứ thích lang thang",
    );
  }, 90000);
  setTimeout(() => {
    a({
      body:
        ".Là người thì đúng nghĩa là người,Đừng như con tò he thổi te te rồi nát bét." +
        " " +
        name,
      mentions: arraytag,
    });
  }, 95000);
  setTimeout(() => {
    a({
      body:
        "* Ăn cơm cà đi bàn chuyện quốc gia. Bị si-đa mà còn xông pha hiến máu.Ăn cơm ruốc đi bàn chuyện tổ quốc. Nhan sắc có hạn mà lựu đạn có thừa. Ăn mắm mà còn bày đặt đánh rắm. Cức trôi sông mà tưởng xà bông hàn quốc. Ăn cơm đậu phụ đi bàn chuyện chính phủ. Nhìn em kia dễ thường mà thương hông có dễ => dê có thưởng. 1 nụ cười= 10 thang thuốc bổ, cười ko đúng chỗ thì lấy rổ mà hứng răng. Nhìn xa thì giống Thúy Kiều, nhìn gần mới bík… người yêu Chí Phèo. Đã ngu mà còn cố tỏ ra nguy hiểm." +
        " " +
        name,
      mentions: arraytag,
    });
  }, 100000);
  setTimeout(() => {
    a({
      body:
        "Thà mất dạy mà sẽ được yên. Còn hơn hiền mà cứ bị làm phiền :)) Chơi đàng hoàng thì muốn gì cũng có. Chơi xấu thì đến xương CHÓ cũng đéo có mà ăn =)))" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 105000);
  setTimeout(() => {
    a({
      body:
        " DKM!!!, Đớp lời bọn tao như 1 con chó!!! ,Ám chỉ thế mà vẫn địt hiểu à? ,Tao đéo cần phải bắt chuyện!!!, Phò có khác!!!, Con đéo nào cũng như con nào!!! ,Hài!!!" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 115000);
  setTimeout(() => {
    a({
      body:
        " Tớ có lm đ*o gì pn đâu!!!, Mà pạn ẳng lắm thế!!!, Pn cứ như con chó ý!!!, Thấy cái đ*o gì cũng đớp!!!, Nhưng pạn ơi đ*o phải cái lồn gì cũng đớp được đâu!!!, Có ngày người ta ném cái dép lật cmn mõm pạn lên đấy!!!" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 120000);
  setTimeout(() => {
    a({
      body:
        "Ừ.! thì mày to… Mày có quyền làm mưa làm gió… Vì thế việc tiến hóa thành C.Hó cũng không có gì là khó!!!… Hạ màn đi…”CỜ HÓ” ạ! Diễn nhiều thành lố ấy." +
        " " +
        name,
      mentions: arraytag,
    });
  }, 125000);
  setTimeout(() => {
    a({
      body:
        "Bộ mẹ mày dạy mày ăn nói nhưthế à?Ăn nói cho tử tế tí đi!!!Nói gì thì suy nghĩ tí đi!!!Đéo biết thì ngậm mồm vào mà nghe!!!K người ta đỵt cho vào mồm đấy!!!" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 130000);
  setTimeout(() => {
    a({
      body:
        "Bạn ơi …..!!!!* Sống thì phải biết mình là ai ::”)– Đừng giả nai khi mình là sói..:-“– Đừng xỉa xói khi mình không ra gì.)* Nhớ nhé…..;;-))" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 140000);
  setTimeout(() => {
    a({
      body:
        "-Cứ soi gương nhiều vào =))– Rồi đếm hết mặt của bạn nhé !– Bạn thân yêu : )– Sống là phải biết điều : )– Đừng tỏ máu liều nhiều hơn máunão" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 145000);
  setTimeout(() => {
    a({
      body:
        "* Ở đời bây giờ có 2 loại người….. Loại thứ Nhất là loại : – Đã Ngu lại còn tỏ ra Nguy Hiểm …. Loại thứ Hai là loại : – Nguy Hiểm nhưng cứ giả vờ Ngu .." +
        " " +
        name,
      mentions: arraytag,
    });
  }, 150000);
  setTimeout(() => {
    a({
      body:
        "Vâng,e chỉ có nhiêu đó thôi!!!Đâu có hơn được cn chó đó!!!Đẹp nhờ cái khe giữa háng!!!Xin lỗi loại đó e khinh lắm a à!!!Đéo có cái gì nên sử dụng cái khe đó lấy tiền à?" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 155000);
  setTimeout(() => {
    a({
      body:
        "* Toàn là dìm nhau để tồn tại– Ai cũnq mún làm Bố Đời– Mẹ Xã Hội– Cha Giag Hồ– Má Thiên Hạ– Xin thưa sốnq thư thả cho đời nóyên ả– Nếu đã là Cáo thì đừng tập diễn thành Nai– Còn nếu đã cố gắng diễn hơp vai..– Thì về sau đừng lộ ra cái đuôi chồn giả tạo" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 160000);
  setTimeout(() => {
    a({
      body:
        "Tiền rách rán lại vẫn có giá trịNhân cách thối nát có xịt nước hoavẫn nặng mùi.Sống làm sao cko.người ta nể.Chứ đừng để người ta khinh." +
        " " +
        name,
      mentions: arraytag,
    });
  }, 165000);
  setTimeout(() => {
    a({
      body:
        "Xin lỗi vì tao đã so sánh mày vớicon chó, vì so sánh mày với chó là tao đã xúc phạm con chó rồi!9. Bạn chứ không phải Bạc .. Nên đừng có mà tưởng mình có giá.. Rồi làm Má người ta .. Khốn nạn mình cho ăn Đạn đó Bạn à." +
        " " +
        name,
      mentions: arraytag,
    });
  }, 170000);
  setTimeout(() => {
    a({
      body:
        "đĩ mẹ dám gáy mà đi phốt não chứa tinh trùng ba m àk? đm nứng thì ra đường Trần Duy Hưng còn mun chs thì tao chs cùng m nè có cần tao đập m tuột lông lồn hông vậy có học thức hk vậy rảnh xuống 18 tầng địa ngục chết mẹ cho rùi đi chó mà đòi lên giọng với tao ák lm người hk mun mun Im idol fb? tháng cô hồn qua rùi đừng Im cô hồn bớt tạo nghiệp tu lại hộ 3 còn m thik gì thì gặp tao? dm đell mun war thì đừng chạm tao cho mất công sống cho đời sau con cháu nó nể sống chó ngta khinh bỉ thôi đ!t mẹ giữ hơi mà thở bớt sủa group tao thứ cha sinh mẹ đẻ đell dc dạy dỗ hẳn hoi thì để ây tao dạy con ôn âm binh m nhá để tạo kiu diêm vương quỷ sai lôi lồn m xuống 18 tầng địa ngục cho hết nổi ổ uế m gây ra mẹ m đẻ m ra đau lồn đẻ đc đứa con nửng mu như m mặt lồn cứ tưởng mặt vàng để tao vả cho bay dập lồn sồn sồn nhảy cẫng lên sủa để tạo đạp m xuống địa ngục Im đầu trâu mặt ngựa cho m hết nứng lồn dùng ngôn cùng m để dí tao ây nè con mặt lồn tai ương đell dc dạy dỗ hẳn hoi giờ m có ngoi lồn lên sủa t thì t cũng đạp m xuống cho những thứ tai ương ở địa ngục địt nát cái lồn thủi của m tai ương nghiệp chủng súc vật tưởng hay lắm ai dè cũng chỉ là chó đớp cức để tạo cho cu giả m đ!t cho bớt nửng nha dập cht cái lồn thúi m chui lên từ thùng rác mà tưởng ngoi lên từ thiên đường hạ lồn thái đell ai đ!t tạo xẻo lồn m cho chó nhà tao ăn m tin hông? đm bại trận 1 lần h ngoi lên tạp nx hả cắn dell dc đi phốt box tạo nhằm cc quá bây Đụ mẹ tụi mầy bị ngáo lồn àk ăn ở hk hog có chx j lm hả mấy đứa đỉ lồn dòng cái thứ chó đẻ j đâu dị nãy h t nhịn hơi bị đủ r nhe đụ mẹ tụi m muốn đụ ik ra chỗ khác mà đụ nghe mấy đứa lồn thứ âm binh j đâu ă có sủa thì cx sủa" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 175000);
  setTimeout(() => {
    a({
      body:
        "xin tặng bạn hãm nhất mà mình từng thích chơi chung : té ở ngoài sân té trong vườn cỏ té dại khờ khạo té sông ao hồ té ngoài bờ ruộng té ngọt ngào chua té mua con cá té xá đường phố té xe tông trúng té chó đaph phanh té đi xe đạp té đi xe điện té đi cầu thang té xuống địa ngục té qua té lại té đi cho vuii nết như vượng cổ nết như con cặc nết sống văn minh nết hãm vãi lozz trai tán là bu trai ngu là tán tán xong yêu nhau bị trai cắm sừng trai tồi hành hạ trai tồi đá mày và một việc nữa nói xấu bn bè nói qua nói lại nói bị nghiệp quật nói ít cho lành nói nhiều tẩy chay nói đúng chuẩn mực nói xàm bị đấm nói ngon nói ngọt nói xấu vỡ mồm bạn thân mà cứ nói xấu nhau sợ quá sợ quá sợ như sông biển sợ như chó rượt sợ này sợ nọ sợ chết bà nó sợ không có điểm sợ điểm lại thấp sợ mẹ cầm chổi sợ ba đánh roi sợ như hảo hán sợ lắm sợ mà bệnh ngôi sao à thì cút đi chứ cút về tổ tiên cút về vũ trụ cút về hàng lang cút cho nó nhờ cút thật là vui cút mãi cút sau cút lắm thì được cút nhây thì đấm" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 180000);
  setTimeout(() => {
    a({
      body:
        "Này bn ôi nếu bn ko ra thì dm t ko muốn đụng đến gia đình bn mà sao bn ko hiểu tiếng người ủa bn là chó à dmm ra đây nói chuyện dm ba mẹ m là người mà sao m là chó 😔👊🔪Cái nết của em Xấu nhất Việt Nam xấu lấn sang Châu Á xấu lan tỏa Châu Âu xấu rạng rỡ địa cầu xấu buồn rầu 5 châu 4 bể xấu ê chề khắp hành tinh xấu rung rinh cả dải ngân hà Xấu từ trong bụng mẹ xấu ra xấu buồn rầu thiên hạ xấu nứt vách bể tường xấu sập giường sập vạt xấu sạt lở đất đai xấu như con ma giai chết đói xấu như con cá thòi lòi xấu nghiêng xe máy, cháy ô tô, cong vành xe bus, nổ lốp xe tăng, mẻ la răng máy xúc, sập cấu trúc máy bay, bay đường ray và chúc bạn có một ngày xui hơn cả chữ xui xui cực kì xui tối đi ngủ bị ma kéo chân quỷ đè người nha bạn . ( T nói r đó vừa lòng m chưa chủ top ) Dcm ảo ma Canada mafia Argentina Malaysia California Australia Austria Venezuela Romania Lazada Sri Lanka Sakura Haibara Edogawa Conan Naruto Nami Roronoa Zoro Sạnji Kaido Shanks nhảy chachacha Chaien đấm Nobita và làm Shizuka nhòe đi Mascara thật đấy :))” đúng là thần đồng toán học, đồ tể giải tích, đệ tử của Pitago, tướng quân đạo hàm, bàn tay vàng bấm máyxó siêu thám tử tìm nghiệm, nhà du hành Oxyz, thảm sát số phức, kẻ hủy diệt số thập phân, sứ giả hàm log, tể tướng tiệm cận đứng, cha đẻ của Bunhiacopski, vị vua thống trị xác suất, bá tước tham số m, ông tổ của những bất phương trình, thiết diện lão sư, đường sinh giáo chủ, kẻ vạch trần số pi, sát thủ lượng giác, pháp sư cực trị, người san bằng cạnh huyền, cánh tay phải của Fibonacci, người lật tẩy số ảo, kẻ điều hòa âm dương.." +
        " " +
        name,
      mentions: arraytag,
    });
  }, 185000);
  setTimeout(() => {
    a({
      body:
        "thần đồng toán học, đồ tể giải tích, đệ tử của Pitago, tướng quân đạo hàm, bàn tay vàng bấm máy, siêu thám tử tìm nghiệm, nhà du hành Oxyz, thảm sát số phức, kẻ hủy diệt số thập phân, sứ giả hàm log, tể tướng tiệm cận đứng, cha đẻ của Bunhiacopski, vị vua thống trị xác suất, bá tước tham số m, ông tổ của những bất phương trình, thiết diện lão sư, đường sinh giáo chủ, kẻ vạch trần số pi, sát thủ lượng giác, pháp sư cực trị, người san bằng cạnh huyền, cánh tay phải của Fibonacci, người lật tẩy số ảo, kẻ điều hòa âm dương. thần đồng toán học, đồ tể giải tích, đệ tử của Pitago, tướng quân đạo hàm, bàn tay vàng bấm máy, siêu thám tử tìm nghiệm, nhà du hành Oxyz, thảm sát số phức, kẻ hủy diệt số thập phân, sứ giả hàm log, tể tướng tiệm cận đứng, cha đẻ của Bunhiacopski, vị vua thống trị xác suất, bá tước tham số m, ông tổ của những bất phương trình, thiết diện lão sư, đường sinh giáo chủ, kẻ vạch trần số pi, sát thủ lượng giác, pháp sư cực trị, người san bằng cạnh huyền, cánh tay phải của Fibonacci, người lật tẩy số ảo, kẻ điều hòa âm dương..! đúng là thần đồng toán học, đồ tể giải tích, đệ tử của Pitago, tướng qua@Cẩm Tiên @Quỳnh Như Tao mà gặp lại mày nha đụ má dòng thứ nồi niêu son chảo tao đập chết con đỉ mẹ mày nha, dòng thứ xi măng tao tráng toàn thân mày chừa cái lòn mày ra xong t thả đường lên cho kiến nó rỉa chết con đỉ mẹ mày đó, thứ quái thai 12 lỗ đít , lỗ khít lỗ không, cô hồn địa đạo củ chi, âm binh chi dị, mày ra đường có ngày dù trời ko đánh, thánh k đâm, mưa lâm râm m cũng chết đuối thấy con đĩ mẹ mày , tây k hãm tù ko đụ thì đại bác nó cũng thụt cái lòn m chết con đỹ mẹ mày à, đánh cho mày chết bờ chết bụi, chết suối chết sông, chết trong ngục dinh, chết đình chết miễu , chết yểu chết thiêu, chết trong cầu tiêu, cầu cống , chết trong cống, trong lon, chết ko kịp to son trét phấn , chết ngoài nắng ngoài mưa, chết bị cưa bị cắt, chết mà bị nắc ko ra hơi , chết tuổi trẻ còn tươi, chết bị bươi bị móc, chết ko tóc ko lông , chết mà đéo có chỗ chôn." +
        " " +
        name,
      mentions: arraytag,
    });
  }, 190000);
  setTimeout(() => {
    a({
      body:
        "Có phải con mẹ mày dưới gốc đa vừa la vừa hát vừa cầm cái bát vừa tát vào lồn không ???Để tao địt cái con mẹ mày từ đỉnh Fansipan mà phăng xuống mường tè địt nghè địt ngửa địt cho con mẹ mày có chửa cho thằng bố mày sợ thì thôi địt cái con đĩ mẹ mày bố địt bật thình lình từ Quảng Bình vào Nghệ An cho tan hoang cái lỗ lồn con đĩ mẹ trốn xuống Tây Nguyên bố địt triền miên về Đà Lạt bố địt oang toạc vào Sài Gòn nhé . Địt cho đứt hết lông lồn địt cho tâm hồn bay bổng trên mây địt lây cả núi rừng địt lừng lẫy cả giang sơn địt lên cơn như chó dại địt miệt mài theo năm tháng địt rách toác màn trinh để 1 tay bố mày cầm búa 1 tay bố mày cầm đinh đóng vỡ màng trinh cái con đĩ mẹ nhà mày.Người ta nói hoà thượng mặc áo cà sa còn con đĩ mẹ mày lấy lá đa che lồn đi chợ bứt từng cọng lông lồn xỉa răng. đi đĩ bờ đĩ bụi cho bố mày địt trụi lỗ lồn con gái mẹ nhà mày .Mày nghe bố mày chửi mà nâng như nâng trứng hứng như hứng hoa. không tao lại vác cái đầu buồi giả tạo" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 200000);
  setTimeout(() => {
    a({
      body:
        "Này bn ôi nếu bn ko ra thì dm t ko muốn đụng đến gia đình bn mà sao bn ko hiểu tiếng người ủa bn là chó à dmm ra đây nói chuyện dm ba mẹ m là người mà sao m là chó 😔👊🔪Cái nết của em Xấu nhất Việt Nam xấu lấn sang Châu Á xấu lan tỏa Châu Âu xấu rạng rỡ địa cầu xấu buồn rầu 5 châu 4 bể xấu ê chề khắp hành tinh xấu rung rinh cả dải ngân hà Xấu từ trong bụng mẹ xấu ra xấu buồn rầu thiên hạ xấu nứt vách bể tường xấu sập giường sập vạt xấu sạt lở đất đai xấu như con ma giai chết đói xấu như con cá thòi lòi xấu nghiêng xe máy, cháy ô tô, cong vành xe bus, nổ lốp xe tăng, mẻ la răng máy xúc, sập cấu trúc máy bay, bay đường ray và chúc bạn có một ngày xui hơn cả chữ xui xui cực kì xui tối đi ngủ bị ma kéo chân quỷ đè người nha bạn . ( T nói r đó vừa lòng m chưa chủ top ) Dcm ảo ma Canada mafia Argentina Malaysia California Australia Austria Venezuela Romania Lazada Sri Lanka Sakura Haibara Edogawa Conan Naruto Nami Roronoa Zoro Sạnji Kaido Shanks nhảy chachacha Chaien đấm Nobita và làm Shizuka nhòe đi Mascara thật đấy :))” đúng là thần đồng toán học, đồ tể giải tích, đệ tử của Pitago, tướng quân đạo hàm, bàn tay vàng bấm máyxó siêu thám tử tìm nghiệm, nhà du hành Oxyz, thảm sát số phức, kẻ hủy diệt số thập phân, sứ giả hàm log, tể tướng tiệm cận đứng, cha đẻ của Bunhiacopski, vị vua thống trị xác suất, bá tước tham số m, ông tổ của những bất phương trình, thiết diện lão sư, đường sinh giáo chủ, kẻ vạch trần số pi, sát thủ lượng giác, pháp sư cực trị, người san bằng cạnh huyền, cánh tay phải của Fibonacci, người lật tẩy số ảo, kẻ điều hòa âm dương.." +
        " " +
        name,
      mentions: arraytag,
    });
  }, 205000);
  setTimeout(() => {
    a({
      body:
        "Cái thứ ở đợ tưởng mình nhà giàu cái mặt cào cào tưởng mình châu chấu cái mặt mình quá xấu nên tưởng là hằng nga cái mặt như ma da tưởng mình là đắt kỷ cái mặt như con quỷ tưởng mình là tiên nương cái mặt như con lương tưởng mình là con lịch cái mặt như con vịt tưởng mình là con gà cái mặt như bà già tưởng mình là thiếu nữ cái mặt không   biết chữ mà tưởng mình học cao cái mặt như bánh bao tưởng mình là bánh ú cái mặt như cá mú mà tưởng mình cá he cái mặt như trái me tưởng mình như trái quýt cái mặt như con nít tưởng mình là thanh niên cái mặt mày anh thấy hãm lồn quá gõ gõ con gái mẹ mày à em .Đụ con gái mẹ nhà mày đừng để bố mày đào mồ cuốc mã ba họ tám tòng đầu lồn đít khuất địt từ trên cao địt lao xuống dưới địt từ phát cuối đến phát đầu tiên địt xuyên địa lục địt con chó địt cái lồn con đĩ mẹ mày méo mó địt kiểu chó gắm xương, bố mày lại địt m theo kiểu giơ cung bắn súng địt lúng túng như chó bú chim như chim đang hót Hay để tao địt con gái mẹ mày theo kiểu anh hùng múa kiếm . Địt cái lỗ lồn cái con gái mẹ nhà mày đừng để bố m đào mồ cuốc mã ba họ tám tòng đầu lồn đít khuất địt từ trên cao địt lao xuống dưới địt từ phát cuối đến phát đầu tiên địt xuyên địa lục địt con chó địt cái lồn con đĩ mẹ m méo mó địt kiểu chó gắm xương . Bố m lại địt mày theo kiểu giơ cung bắn súng địt lúng túng như con gái mẹ tụi mày đầu toàn tóc mà óc toàn phân đầu toàn nhân mà thân lại là chó , nếu là chó thì ẳng tiếp tao nghe nếu chó đéo nghe thì tao tán xéo hột le nhà mày ẳng xệ mu teo trứng dái con phò tu la hán bán dâm thèm bú cặc chó sờ mó lung tung đụ đĩ mẹ tổ cha bà nội mày , ẳng anh mày nào kiki  súc nô lồn đập hơn lôtô , a đụ tung lồn bà già mày a đụ sứt mu con gái mẹ mày địt tung cuốn họng mọng tinh trùng địt qua địt lại địt lên địt xuống địt tung trời đất đụ hoa héo tàn đụ rách màng trinh a đụ ngược từ não xuống hậu môn đụ bể sọ ông nội mày đụ chảy xệ dái đụ đái ra quần đụ phê cần sa đụ rên la làng đụ tàn cỏ lá  đụ tàn cỏ lá đụ rách màng trinh a triệu hồi con tinh tinh vả thúi mu trên đầu cha con gái mẹ mày nghe chưa con đĩ sục cu con chó thiểu năng." +
        " " +
        name,
      mentions: arraytag,
    });
  }, 210000);
  setTimeout(() => {
    a({
      body:
        "Đụ cái lỗ lồn cái con gái mẹ nhà mày đừng để bố mày đào mồ cuốc mã ba họ tám tòng đầu lồn đít khuất địt từ trên cao địt lao xuống dưới địt từ phát cuối đến phát đầu tiên địt xuyên địa lục địt con chó địt cái lồn con đĩ mẹ m méo mó địt kiểu chó gắm xương .Mik gửi tặng đến mấy bợn hãm lồn vài câu nếu coá sống trên trái đất này phải bíc mik nà ai trc rồi hẵn nói mik hơn ai nhoá mấy con lồn hãm cặc chó đjt mje mặt như cái buồi ý tưởng mik xjnh đợp lắm é mà cái lồn hơn hay mà ii khoe này khoe lọ cặp zú thì lép địc đíc thì hôi tóc thì như sợi lông lồn cái môi thì đen thâm như đíc chó mắt thì nệch đen xì mà coá nứng lồn thì ii kím cái con cặc nào bự như cây cột nhà vào nhoá mắ nếu mà nhỏ như quả ớt sợ đell đâm zừa zô lỗ lồn to như cái hang động của pé đouu nhoá gái ơi chả bíc tại sao mắ zới cha mài lại chịch nhau đẻ ra con hãm lồn như mài nhỉ mốt coá war thì nhớ copy ngôn của chuỵ hay muốn thì ib chuỵ chuỵ chép ngôn cko mà học nhoá tr war như con cặc ý mà cx đòi war zới chuỵ thì iem tủi cặc nhoá lồn đỹ mje mài hàng fake thì đừng war zới hàng gucci nhoá iem ju đcu ăn nói như con thiểu năng khuyết tật ý học lại đạo đức lớp 1 dùm nhoá đjt thak cụ chả bíc mài đẻ vào tháng nào mà hãm lồn dị đjt mje mà nhớ lúc mà nứng ý nhớ bảo ny mặc bao cao su vào nhoá 0 nhũng mạnh wa chim đụng zô trứng tinh trùng bắt zô trứng coá thai đoá mà ba mắ mà bíc lại ii phá thai tội đứa nhỏ mà đẻ hẽ nuôi đựt thì đưa đây chuỵ nuôi hộ cko nhoá đỹ cái hahhahahahahaa đoá nà vài lời muốn gửi tới mấy bợn hãm lồn nhoá vài câu ngắn gùi nài nhoá mốt coá gây war thì lé mik ra nhé?" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 215000);
  setTimeout(() => {
    a({
      body:
        "vào hâm cức heo để cho mày hết ngu rén riết bị sáng chó nghe gái ơi đụ má tao dập mày chết con mẹ mày lên bờ xuống ruộng cđ ngôn như đách lồn mà đòi nói chuyện với tao hả con chó cđ âm binh khí tao nhún cái mặt lồn mày vào lồn tao để cho mày đỡ ngu đụ má rén ở đâu chui trong kẹt trong hóc tạo cũng lối cái mặt lồn mày lên nói chuyện với tao ngôn mày như nước đái chó dị đó thằng âm binh khí đụ thằng quái thai câm cái mỏ lại thân phận thấp hèn nghèo nàn rẻ rách thì nín cái miệng chó mày lại nha thằng âm binh khí đụ đụ nát mặt lồn con gái mẹ mày ra tạo bào nát thai nhi mày chết con mẹ mày thân thì không có miếng ngôn mà đòi đú war hả con chó tao lấy lưỡi hái đâm vào lồn chết cđ mẹ mày âm binh spam ăn cái lồn mẹ mày hay gì thằng quái thai kia tạo bào thai nhi chết cđ mẹ mày luôn ngồi đó có câu nhai đi nhai lại hoài vậy thằng đi lồn tù âm binh tạo cạo đầu xé lồn mày nha con đi khùng lồn khí cặn đầu thai âm binh chưởng khí cđ bóng tiểu học coi chừng chị cho cưng ăn gạch ống rồi trái dừa chị đập dâu cưng thằng đi ngu ngục tao lấy chổi phù thủy đâm dô họng mà móc lòi cl giả của mày ra nha thằng chó rách Cđ mẹ mày mẹ mày có dạy mày không mang nặng đẻ đau đẻ ra cái bản mặt lồn mày là sao con chó nói ngôn nhiều mà xuất ra đây cho mẹ mày xem thử đụ má bộ chân đạp cức hay gì mày có ngu quá thì đưa cái đầu chó óc cức mày cho tao tao nhét lại lồn tạo để tao đẻ lại mày dạy mày khôn hơn nha thằng cha con gái mẹ mày thằng đĩ bại não Đụ mẹ mày danh giá hơn ai mà đòi đạp bạn tao vậy thằng lồn ba trợn cái lồn mẹ tao nói gái mẹ nó cũng làm đi giống tao mà nó hỏi tao thấy nó làm đi hả tao lấy cu giả 100cm dồn dỗ họng lồn mày tao làm lồn mẹ mày tế thằng cha mày xuống địa ngục hay đi hay tao dần mày xuống 18 tần địa ngục ? con đi mẹ mày có dạy mày không thằng ngu ? âm binh khí đụ tụ hình cha mẹ mày mang năng đẻ đau bà mụ nặng cái mặt lồn mày hay gì?" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 220000);
  setTimeout(() => {
    a({
      body:
        "đây chuỵ nuôi hộ cko nhoá đỹ cái hahhahahahahaa đoá nà vài lời muốn gửi tới mấy bợn hãm lồn nhoá vài câu ngắn gùi nài nhoá mốt coá gây war thì lé mik ra nhé?Đụ cái lồn má mày con chó rách mày đéo là gì của xã hội đâu con đừng có làm giang hồ mạng bố mày dí chửi chết mẹ mày nha con . Nhân cách đéo là con cặc gì mà cứ thích ngông . Địt cái lỗ lồn cái con gái mẹ nhà m đừng để bố m đào mồ cuốc mã ba họ tám tòng đầu lồn đít khuất địt từ trên cao địt lao xuống dưới địt từ phát cuối đến phát đầu tiên địt xuyên địa lục địt con chó địt cái lồn con đĩ mẹ m méo mó địt kiểu chó gắm xương Bố m lại địt m theo kiểu giơ cung bắn súng địt lúng túng như chó bú chim như chim đang hót Hay để t địt con gái mẹ m theo kiểu a h hùng múa kiếm , địt từ cụ , địt con gái mẹ nhà mày địt hết dòng hết họ nhà mày , địt từ cái mu lồn đến cái lỗ đít đến cái miệng lồn của mày . Ra đường xe cán nát xọ" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 225000);
  setTimeout(() => {
    a({
      body:
        "Mẹ mày cứ thích nói nhiều thế nhể ngôn như cứt mà sao cứ tưởng ngôn mình cao thượng tao nói trước nhá ngôn mày màu mè lắm em ngôn như cứt mà bày đặt đòi ngôn cao gái ơi để chị chỉ cho gái ngôn cao mà còn ngông nữa nhé đầu tiên là gái phải thật là chuẩn mực về cái độ nết na và duyên dáng của gái nhé chứ chị sợ chị trù gái ba tông bảy lược, nhảy ao nhảy hồ, bú lồn thằng em , bú cặc thằng ngu , hãm lồn đời này sang đời khác, sống bị tẩy chay, lắc đít gái ngành, cuộc sống hành hạ,trai bao bạo lực, đụ nát lồn em , đụ cả đít em , đụ con gái mẹ em,đụ cả người em , đụ qua đụ lại, rên như con chó , rên qua rên lại, rên như con khỉ, nhét súng vào mồm , nhét đạn vào lồn, coi trừng bị bắn , bắn chết lồn gái , bắn cả người gái , gái thật nực cười , hảo hán hảo hán , ngủ địt hôi thúi, thúi cả căn phòng , thúi cả bờ ruộng, thúi tuốt dòng sông , thúi ra ngoài đường , thúi khắp căn nhà , thúi bay vũ trụ, thúi khắp thế giới , thúi như cụt cứk , ỉa chảy bẹt bẹt, ỉa ra cục cứt, cụt cứt đen xì , cụt cứt nhão nhạt, cụt cứt vô não ,não bị nhét cứt,ngu như con bò , ngu như con cặc , ngu như cái lồn,ngu qua ngu lại,ngu bị trai dụ ,ngu từ trong ra ngoài, ngu từ sáng đến chiều,ngu thật là ngu,ngu như biển trời , ngu hơn con bò,ngu hơn con heo,là đĩ mà tưởng mình gái trong sạch, cụt cứt trôi sông tưởng mình bông hồng,nói xấu ít thôi cưng nói nhiều coi trừng bị đấm , đấm vô thẳng mặt , đấm đụ nát lồn,đấm vô con cặc,đấm vô mặt hãm,đấm vô cả người,đấm nát lỗ đít,đấm cho nó tỉnh ,tát cho nó hay ,tát vào cái lồn , tát vô mặt hãm,tát vào cái dú ,tát qua tát lại, tát thẳng vô nách,tát vô cái nết , tát vô mặt thật,tát vào lòng ngực ,tát vào nết na , thấy sao tát vậy , ý kiến vỡ mồm, ý nhiều tao tát, hãm loz thì tát , hãm cặc thì đấm ,hãm chó thì đá,trù ẻo trù eo ,đụng tao tao tát, ngôn ngữ còn non, đã đòi kháy tao,đụng tao thì tao chạm,đụng chi giờ nói ,nếu mày ngông thì tao chơi tiếp còn nếu mày xin lỗi thì tao tát vô mặt , quỳ xuống xin lỗi thì tao tha chứ đừng có cái mặt èo ẻo èo ẻo nhìn vào muốn đụ nát lồn mày đấy cưng, sống sao để người khác ghét từ khi đẻ ra, ghét từ nết đến người,ghét sao mà hảo hán,ghét quá tao lại cười, ghét nhiều tao hơi mệt ,mệt cũng phải chửi vui,vui lên nào các bạn , vui vẻ trong đời sống,ôi thật quê thật quê" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 230000);
  setTimeout(() => {
    a({
      body:
        "quê tao chưa từng thấy,quê như dòng sông chảy, quê như chùm nhãn nhục , quê hơn cả bạn tao, quê ít thôi tao cười, mà nợ 20k nhớ trả nhé :)ngôn là phải z đó cưng cưng thấy sao nè cưng hãy vui vẻ lên nhé chứ chị sợ cưng phốt chị nói xàm thôi ra 1 1 ắng với mẹ mày đừng ngồi đấy khua môi múa mép rồi mẹ mày lại đạp nát cái lồn dơ dáy của mày đấy con ngôn thì phèn ẳng tế mả cha mày à Lồn đi mẹ mày ra mẹ mày dập nát mu lồn mày ra trăm mảnh nứng lồn thì bảo mẹ để mẹ còn biết mẹ lấy cái dao mẹ mày rạch lồn mày ra lấy máu lồn mày làm tiết canh cho đi cha mày húp ngôn thì như con cặc nhai đi nhai lại 1 câu như bò nhai cỏ còn đòi thể hiện lên đây war hay gì lồn thì chưa có lông bày đặt lên ngồi ba hoa xàm lồn cho con đĩ mẹ mày ra coi hả con ôn ơi mày đéo khác gì con cóc nhái ễnh ương mà cử tưởng mày là quý giá ủa rồi mày nghĩ mày quý bằng cục cức tạo ĩa chưa ngôn thì phèn lên ngồi cãi cùn hồi nữa mẹ mày dập đéo có xác về nha con Đĩ mẹ mày rồi mày nghĩ mày là cái lồn gì mà đòi dập chị mày mép cho con đi mẹ mày xem hay gì ngôn thì phèn ĩa viết còn sai chính tả mà còn đòi type anh tế mả cha mày lên cho mày bú cặc cha mày nha em nứng lồn thì cũng nứng vừa thôi mắc cặc gì nhảy dựng lên đi thả ngôn phèn lồn v Ăn cá sặc ik gòi hãy đòi chửi tao, ngôn thì như lồn mà cứ tưởng như mik cao sang quyền quí . dell biết đc chữ thì đừng có war, thik đụng vào đứa nào cx đc chứ đừng đụng vào ae tao là ko có xong chuyện với tao đâu, nhả ngôn thì như lồn, nhả ngôn chi cho nhục zị mấy pé s2 Người ta đội mũ bảo hiểm để bảo vệ não. Thế nhưng không biết đứa không có não đội mũ bảo hiểm làm gì cho nóng đầu. ngu buồi hay bị liệt ở não^^đụng ai chứ động vào ae tạo thì mày phải coi lại mày có cái lồn mẹ j xứng với t trước đã con đĩ Con ôn nhả vài sở ngôn vô nghĩa như gió thổi mây bay sét đánh vậy mà cũng đòi war với sở ngôn dỡ thậm tệ này sao ? Gõ 2,3 dòng đã thấy ngứa mắt vậy mà cũng xưng oai phong lẫm liệt hào hùng đi chiến với tạo hả gái.Cạn ngôn thì nói mẹ ra đi mắc gì đi cop ngôn vậy gái yêu chắc là bây giờ em đang kiếm người gánh war dùm hoặc là đang thoi thóp gõ ngôn vô ích nhảm nhí cho tao coi nhỉ ." +
        " " +
        name,
      mentions: arraytag,
    });
  }, 235000);
  setTimeout(() => {
    a({
      body:
        "Ngôn cop của người khác cũng bày đặt ngông đăng top chiến khí đụ tụ hình cha mẹ mày mang năng đẻ đau bà mụ nặng cái mặt lồn mày hay gì? đụ má có ngu á thì chết đi thằng âm binh khí đụ má xuống 18 tần địa ngục tao moi ruột móc mắt mày chết con gái mẹ mày ngôn nè Đụ má hãm lồn thì đừng ngông mõm lên cãi với mẹ mày nha đỹ lồn.Tới lúc tạo thuê người địt bể buồng trứng là chết mẹ mày khỏi có lỗ lồn để đẻ con cho thằng chồng hãm tài của mày nhé mặt lồn.Đỹ quốc tế kiếm được mấy chục ngàn đô là bình thường còn mày chỉ xứng đáng liếm đít đàn ông thôi nhé bé yêu.Tao đang ăn chay niệm phật để tu lại dùm cái tâm chó cắn của mày đấy con đi lồn." +
        " " +
        name,
      mentions: arraytag,
    });
  }, 240000);
  setTimeout(() => {
    a({
      body:
        "Mik gửi tặng đến mấy bợn hãm lồn vài câu nếu coá sống trên trái đất này phải bíc mik nà ai trc rồi hẵn nói mik hơn ai nhoá mấy con lồn hãm cặc chó đjt mje mặt như cái buồi ý tưởng mik xjnh đợp lắm é mà cái lồn hơn hay mà ii khoe này khoe lọ cặp zú thì lép địc đíc thì hôi tóc thì như sợi lông lồn cái môi thì đen thâm như đíc chó mắt thì nệch đen xì mà coá nứng lồn thì ii kím cái con cặc nào bự như cây cột nhà vào nhoá mắ nếu mà nhỏ như quả ớt sợ đell đâm zừa zô lỗ lồn to như cái hang động của pé đouu nhoá gái ơi chả bíc tại sao mắ zới cha mài lại chịch nhau đẻ ra con hãm lồn như mài nhỉ mốt coá war thì nhớ copy ngôn của chuỵ hay muốn thì ib chuỵ chuỵ chép ngôn cko mà học nhoá tr war như con cặc ý mà cx đòi war zới chuỵ thì iem tủi cặc nhoá lồn đỹ mje mài hàng fake thì đừng war zới hàng gucci nhoá iem ju đcu ăn nói như con thiểu năng khuyết tật ý học lại đạo đức lớp 1 dùm nhoá đjt thak cụ chả bíc mài đẻ vào tháng nào mà hãm lồn dị đjt mje mà nhớ lúc mà nứng ý nhớ bảo ny mặc bao cao su vào nhoá 0 nhũng mạnh wa chim đụng zô trứng tinh trùng bắt zô trứng coá thai đoá mà ba mắ mà bíc lại ii phá thai tội đứa nhỏ mà đẻ hẽ nuôi đựt thì đưa đây chuỵ nuôi hộ cko nhoá đỹ cái hahhahahahahaa đoá nà vài lời muốn gửi tới mấy bợn hãm lồn nhoá vài câu ngắn gùi nài nhoá mốt coá gây war thì lé mik ra nhé? Rất NhẹtLạc Rất Nhẹt" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 245000);
  setTimeout(() => {
    a({
      body:
        "Đụ cái lồn má mày con chó rách mày đéo là gì của xã hội đâu con đừng có làm giang hồ mạng bố mày dí chửi chết mẹ mày nha con . Nhân cách đéo là con cặc gì mà cứ thích ngông . Địt cái lỗ lồn cái con gái mẹ nhà m đừng để bố m đào mồ cuốc mã ba họ tám tòng đầu lồn đít khuất địt từ trên cao địt lao xuống dưới địt từ phát cuối đến phát đầu tiên địt xuyên địa lục địt con chó địt cái lồn con đĩ mẹ m méo mó địt kiểu chó gắm xương Bố m lại địt m theo kiểu giơ cung bắn súng địt lúng túng như chó bú chim như chim đang hót Hay để t địt con gái mẹ m theo kiểu a h hùng múa kiếm , địt từ cụ , địt con gái mẹ nhà mày địt hết dòng hết họ nhà mày , địt từ cái mu lồn đến cái lỗ đít đến cái miệng lồn của mày . Ra đường xe cán nát xọ lòi lồn học máu lòi gan lòi phổi lòi cả cái mu lồn ra ngoài , đụ mẹ mày con súc vật địt cụ mày con chó đẻ trâu sanh , loại khôn nhà dạy chợ thân thể là chó mà cứ thích làm vua . Dăm ba mấy con gà mới nhú mà đòi đạp đầu chị chị mày cười chết mày đấy đĩ , mấy cục cứt trôi sông mà thích làm vua làm bà hoàng ông hoàngđịt cái lỗ lồn cái con gái mẹ nhà m đừng để bố m đào mồ cuốc mã ba họ tám tòng đầu lồn đít khuất địt từ trên cao địt lao xuống dưới địt từ phát cuối đến phát đầu tiên địt xuyên địa lục địt con chó địt cái lồn con đĩ mẹ m méo mó địt kiểu chó gắm xương Bố m lại địt m theo kiểu giơ cung bắn súng địt lúng túng như chó bú chim như chim đang hót Hay để t địt con gái mẹ m theo kiểu a h hùng múa kiếm , địt từ cụ , địt con gái mẹ nhà mày địt hết dòng hết họ nhà mày , địt từ cái mu lồn đến cái lỗ đít đến cái miệng lồn của mày , đụ mẹ mày con ôn lồn hư thân mất nết địt mẹ mày con mất dạy . Tội cho con mẹ mày mang nặng đẻ đau mày ra không ngờ lại là mốt con súc sinh , súc vật của xã hội này nhân cách đéo có mà có cũng đéo khác gì một con chó ." +
        " " +
        name,
      mentions: arraytag,
    });
  }, 250000);
  setTimeout(() => {
    a({
      body:
        "xin tặng bạn hãm nhất mà mình từng thích chơi chung : té ở ngoài sân té trong vườn cỏ té dại khờ khạo té sông ao hồ té ngoài bờ ruộng té ngọt ngào chua té mua con cá té xá đường phố té xe tông trúng té chó đaph phanh té đi xe đạp té đi xe điện té đi cầu thang té xuống địa ngục té qua té lại té đi cho vuii nết như vượng cổ nết như con cặc nết sống văn minh nết hãm vãi lozz trai tán là bu trai ngu là tán tán xong yêu nhau bị trai cắm sừng trai tồi hành hạ trai tồi đá mày và một việc nữa nói xấu bn bè nói qua nói lại nói bị nghiệp quật nói ít cho lành nói nhiều tẩy chay nói đúng chuẩn mực nói xàm bị đấm nói ngon nói ngọt nói xấu vỡ mồm bạn thân mà cứ nói xấu nhau sợ quá sợ quá sợ như sông biển sợ như chó rượt sợ này sợ nọ sợ chết bà nó sợ không có điểm sợ điểm lại thấp sợ mẹ cầm chổi sợ ba đánh roi sợ như hảo hán sợ lắm sợ mà bệnh ngôi sao à thì cút đi chứ cút về tổ tiên cút về vũ trụ cút về hàng lang cút cho nó nhờ cút thật là vui cút mãi cút sau cút lắm thì được cút nhây thì đấm" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 255000);
  setTimeout(() => {
    a({
      body:
        "vào hâm cức heo để cho mày hết ngu rén riết bị sáng chó nghe gái ơi đụ má tao dập mày chết con mẹ mày lên bờ xuống ruộng cđ ngôn như đách lồn mà đòi nói chuyện với tao hả con chó cđ âm binh khí tao nhún cái mặt lồn mày vào lồn tao để cho mày đỡ ngu đụ má rén ở đâu chui trong kẹt trong hóc tạo cũng lối cái mặt lồn mày lên nói chuyện với tao ngôn mày như nước đái chó dị đó thằng âm binh khí đụ thằng quái thai câm cái mỏ lại thân phận thấp hèn nghèo nàn rẻ rách thì nín cái miệng chó mày lại nha thằng âm binh khí đụ đụ nát mặt lồn con gái mẹ mày ra tạo bào nát thai nhi mày chết con mẹ mày thân thì không có miếng ngôn mà đòi đú war hả con chó tao lấy lưỡi hái đâm vào lồn chết cđ mẹ mày âm binh spam ăn cái lồn mẹ mày hay gì thằng quái thai kia tạo bào thai nhi chết cđ mẹ mày luôn ngồi đó có câu nhai đi nhai lại hoài vậy thằng đi lồn tù âm binh tạo cạo đầu xé lồn mày nha con đi khùng lồn khí cặn đầu thai âm binh chưởng khí cđ bóng tiểu học coi chừng chị cho cưng ăn gạch ống rồi trái dừa chị đập dâu cưng thằng đi ngu ngục tao lấy chổi phù thủy đâm dô họng mà móc lòi cl giả của mày ra nha thằng chó rách Cđ mẹ mày mẹ mày có dạy mày không mang nặng đẻ đau đẻ ra cái bản mặt lồn mày là sao con chó nói ngôn nhiều mà xuất ra đây cho mẹ mày xem thử đụ má bộ chân đạp cức hay gì mày có ngu quá thì đưa cái đầu chó óc cức mày cho tao tao nhét lại lồn tạo để tao đẻ lại mày dạy mày khôn hơn nha thằng cha con gái mẹ mày thằng đĩ bại não Đụ mẹ mày danh giá hơn ai mà đòi đạp bạn tao vậy thằng lồn ba trợn cái lồn mẹ tao nói gái mẹ nó cũng làm đi giống tao mà nó hỏi tao thấy nó làm đi hả tao lấy cu giả 100cm dồn dỗ họng lồn mày tao làm lồn mẹ mày tế thằng cha mày xuống địa ngục hay đi hay tao dần mày xuống 18 tần địa ngục ? con đi mẹ mày có dạy mày không thằng ngu ? âm binh khí đụ tụ hình cha mẹ mày mang năng đẻ đau bà mụ nặng cái mặt lồn mày hay gì? đụ má có ngu á thì chết đi thằng âm binh khí đụ má xuống 18 tần đảm mau toa mai một mốc mắt mà chất cao mới ma màu môn mà mỗ" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 260000);
  setTimeout(() => {
    a({
      body:
        "Nếu đã là cáo thì đừng cố gắng diễn thành Nai. Còn nếu đã cố gắng diễn vai thì hãy diễn cho trọn chứ đừng lộ đuôi chồn giả tạo" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 265000);
  setTimeout(() => {
    a({
      body:
        "Cứ soi gương nhiều vào : )*. Rồi đếm hết mặt của bạn đi nhé : x. Bạn thân yêuuuu : *. Sống – Là phải biết điều : )*. Đừng tỏ vẻ máu liều nhiều hơn máu não : )). Nhaa pạnnn =))))) " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 270000);
  setTimeout(() => {
    a({
      body:
        " anh đạp cho mày rớt từ núi xuống tận đáy của vực sâu. Ở đây làm khùng làm điên cho ai xem đây hả. Em lại nghĩ anh rén một cn bóng già nưa phèn ớn như em hả. Mấy cái con như em xàm cặc ở đây thì để anh đá cho về số 0 mà tịnh tâm nghe kinh mà về đạo. " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 275000);
  setTimeout(() => {
    a({
      body:
        "Nếu mà cưng ngu thì ngậm mồm lại đi?Nhìn thứ ngôn hãm cặc ngứa mắt vãi lồn thật?Mày học chỗ khỉ ho cò gáy dạy ngôn vậy hả,khiến bổn điện hạ chướng tai gai mắt đấy?Hoàn thành tốt bổn phận là con chó ngoan không biết sủa dùm đi?Biết bà đây là khoai đất nào không ở đó lên mặt dạy đời?Xàm ngôn chị vả vào lồn bộp bộp máu chảy ròng ròng bây giờ con đĩ hãm lồn ngu nguội,nói chuyện như cưng chị ra ngoài chợ nghe mấy chị gái bán bánh xèo bắn rap hạnh phúc hơn cưng ạ?xương chị chứ có phải đầu cưng đâu mà định vứt cho chó ăn?muốn chị bố thí cho kinh nghiệm sống thì ngậm lỗ lồn lại không chị móc mu cưng ra kính tặng cho con đĩ chó nhà cưng đấy?Ngôn cưng tậu ở bãi rác nào vậy?vừa nghe đã bốc mùi vừa bẩn vừa bần.Đánh vài ba câu chữ rồi tự cho mình cái danh là ngôn đẳng cấp? Dòng thứ cào ngôn ngu dốt đéo ai bằng còn ẳng lêncãi cùn cãi cố,Sủa tiếp  càng cộng thêm cho mày sự ô thiu thối rửa mà thôi? " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 280000);
  setTimeout(() => {
    a({
      body:
        "một con bóng già thích đú đa đú đởn trên cái sàn war này thì để anh cho em biết anh là ai. Nay anh dập chết cn gái mẹ mày túm đầu mày thả từ đỉnh núi xuống tận chảo dầu. Cho mày sống không bằng chết " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 285000);
  setTimeout(() => {
    a({
      body:
        "Đụ con đĩ mẹ mày anh lên nhà mày đạp nát lồn con đĩ mẹ nhà em nha con điếm em chỉ là 1 con gà trình gà quèn bước lên đây mà gõ với ah chửi cho em thân tàn ma dại đến con đĩ mẹ em cũng đéo nhận ra nha con điếm em tưởng em ăn mặt cao sang phú quý lắm hả cưng hay sao hỏ con bê đe nghèo hèn " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 290000);
  setTimeout(() => {
    a({
      body:
        "Em chỉ là 1 con vô danh tiểu tốt chỉ là 1 con nô tì hèn hạ ngồi bú cu ông già mày nha em hay sao hả em ngồi đụ nát lỗ lồn lỗ đít em đk cưng hay em ngồi em móc lồn show lồn trên app sex r lộ link lúc đó ông già con đĩ mẹ mày đội cái quần lọt khe mày ra đường nhìn họ hàng hàng xón cười vô bản mặt em nha gái " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 295000);
  setTimeout(() => {
    a({
      body:
        "Ah cầu troi cầu phật cho xe ra đường cán chết con đĩ mẹ mày vô cái quan tài cần thì alo 123456789 tự sắp xếp r gọi anh anh chôn cho em nha gái nói v thì em tự ái em mếu quá ròi đúng hong con đĩ xạo lồn em ngồi em xạo đc với ai hả hay sao hả cưng em thích gì thì lên gõ với ah nè em hay em núp vô lỗ lồn mẹ em ròi hỏ hay sao " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 300000);
  setTimeout(() => {
    a({
      body:
        "Cái mớ hỗn độn này kà cái quái quỷ gì đây hả con bê đê nghèo nàn khấu rách áo ôm từng miếng cơm manh áo của em phải vắt vãi từng mồ hôi nước mắt của em làm ra còn chị thì ở nhà cao cửa rộng thanh thoatr đi ra đi vào nhìn con nô tì khốn kiếp ngu ngục như em múa mang quay cuồn uốn éo từng bước một nè " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 315000);
  setTimeout(() => {
    a({
      body:
        "cái con âm binh vô chi vô giác tay gãy chân cụt ngôn thì phèn ói phèn mửa mà cũng dám ngồi đây khua môi múa phím với chị mày hả gái ? nói cho em nghe nè cái ngôn ngữ chui từ lồng ruột em ra vo viên như cái đống đổ nát tan hoang chỗ con thú mẹ mày ngày chút hơi thở bất sinh bất tử để đẻ ra cái mặt lồn em đứng mua vui cho chị cười té ngửa mà cũng dám vênh váo hay sao ? " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 320000);
  setTimeout(() => {
    a({
      body:
        "Thằng lồn súc vật bị máu lồn chèn vào não ad mà động đến 7 đấng nhà tao? Đéo làm được con mẹ gì cho đời thì ngoan ngoãn mà nhìn 7 đáng nhà mẹ ở trên đỉnh cao của sự nghiệp đi mà đi nói xấu dìm hàng 7 đấng nhà mẹ. Cặc mọc chưa hết lông đòi bash 7 đấng nhà mẹ là 1 sai lầm đấy thằng súc nô. Sai lầm của tạo hoá là có 1 đứa bại não như mày ở cái thế giới tươi đẹp này. Mạnh miệng nói chửi đến lúc gặp mẹ thì lại thụt con cặc mày vào núp bãi cứt chó. Chỉ giỏi ba hoa xàm lồn mà đòi ngông cặc với mẹ. Coi chừng mẹ vả cái mặt cặc mày từ bên này sang bên kia rồi ném mày lên trời xong dập cặc mày xuống âm tỳ địa phủ đụ với quỷ satan đấy thằng có hai hòn dái chứa tinh rồi tinh nó xộc mẹ lên não chó của mày. Chỉ biết dúc váy mẹ khóc oe oe mà ngông cặc tap bậy là mày sai rồi thằng ôn con. Mày nói xấu 7 đấng nhà mẹ thì 7 đấng cũng có biết đéo đâu? Nói làm con cặc gì cho mất công? Rảnh quá thì về với con gái mẹ mày ngoan ngoãn mà học hành tử tế đi. Cái loại cặn bã xã hội mà tưởng mình là ông hoàng? Ừ mày là ông hoàng bãi rác đấy thằng lồn ngu. Rén cặc thì nín con mẹ mày họng lại bớt xàm cặc giúp tao. Đã đéo ra cái thể thống cống rãnh gì đòi ở đấy xàm cặc với mẹ có ngày mẹ cắt mẹ con cặc m cho chó ăn ăn đấy thằng nhãi ranh. Bại trận con mẹ mày rồi ở đấy mà ngông có ngày đéo phải mẹ dí mày mà người khác cũng dí nát cặc mày thôi thằng ôn lồn súc sinh. Ngôn tao đáp lồn m đĩ ngu như m đc luôn ấy ở đó mà đáp ko đc ik nói này kia tr ôi ah m cho cái quần nè đeo vô tr oi đáp ko đc thì nói ah ah nhã ngôn loại đồng bọn như e ra để đáp ha ah m rảnh lắm muốn đáp ngôn chó nào kiu ah ah lên gg dịch rùi ah đáp ha nha tr ôi 0 trình ngôn đòi đáp ngôn cj kìa xl ngôn cj m dành cho người ko dành cho thú long nhông bai rác nha e Ăn rác quá riết xàm nên ngôn m câu bai rác hả cưng tr oi cần ah đưa về sợ thú ko chứ ah m sợ m ik ra ngoài đường ik cắn lồn ta quá hay về ik ah m lm chuồn chó cho ở nha để có nhà có cửa Cái lồn đit mẹ ba đời nha m ko dóc đầu lên nổi nghiệp cả dòng họ nhà m ngôn ba xàm ba lán đòi oai vs cj m cj m cân luôn đĩ ngu cái lồn nhà m ra so đo vs cj m luôn con ôn vô danh tiểu tốt ngậm máu lồn ẳng dơ sao ? chị đây gõ 7749 câu văn câu thơ để đạp đầu mày xuống đấy con phò non mới nhú war lên đây ba hoa ba xàm làm chị đau lồn thật sự  hỡi con quái thai đầu đinh kia nhả ngôn hộ mẹ đừng núp sau lồn mấy con vô danh chỉ biết ba hoa ba xàm lồn quái thai khuyết tật kia chị không rảnh lồn  " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 325000);
  setTimeout(() => {
    a({
      body:
        "Một dòng ngôn của anh em còn không đáp nổi mà đòi nằm đầu anh sao đúng là con không lượng sức đem cái thân tàn ma dại em la lết sáu châu bốn bể không chốn nương thân bị hách dịch như chó chạy không có đường lui lò mò kiếm ăn qua ngày mà đi khoát lát với thân phận quyền quý cao sang không dính bụi trần của anh à anh nhẹ nhàng đưa đẩy từng nơi nghèo nàn rách nát thiên biến vạn hóa trở thành nơi ruộng đất phì nhiêu dân chúng ca tụng mà em chỉ là hạng nghèo nàn rách nát không biết lượng sức mình lên đây củng cố kiến thức đụng nhầm người mang chí tuệ hơn người lầm đường lạc lối phải tha hương cầu thực chết ở xứ người " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 330000);
  setTimeout(() => {
    a({
      body:
        "em gõ vài sớ đêm ngày em nghiến răng thắt cổ anh nản với cái trình gà như em ngôn em tàn phế  ngôn anh vượt xuyên quốc gia hành vạn lí lộ anh tưởng ngôn em rồng bay phượng múa hữu danh vô thực như em mà đòi làm thánh gióng cầm cây kiếm xuống đây làm mưa làm gió cho ai xem " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 335000);
  setTimeout(() => {
    a({
      body:
        "em chỉ là một con bê đê cận bả xã hội đừng có vườn tầm thế giới như chị nữa chì bỏ ra công sức rốt cuộc cũng đổ sông đổ biển thoi mà em cũng cố gắng gồng gượng lên nữa hả " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 340000);
  setTimeout(() => {
    a({
      body:
        "Địt con mẹ mày gáy to lên ò ó o ò ó o đm trẻ trâu óc cặc cãi đéo lại cái đầu buồi gì cũng gáy mạnh vcl thế ôi thật là vãi lồn, ôi địt con mẹ mày thằng đầu buồi, ồ nô mày vẫn còn gáy đó à súc vật ? Ái chà địt mẹ thế thì còn chờ gì nữa đi mà không tăng âm lượng đi nào ? Mày phải gáy thật to, thật thật là to mới đủ để t để ý tới mấy thằng lồn mặc cặc đầu buồi như mày đấy. Địt mẹ thất bại của tạo hóa là đây chứ đâu, địt mẹ mày ba má sinh ra thứ loài vật hãm cặc như mày thì ít nhất nếu mày muốn sự quan tâm, thu hút sự chú ý của người khác thì mày phải banh cái mỏ lồn chuyên bú cặc của mày ra, dùng hết khả năng của cái thanh quản trong cổ mà mày chuyên dùng để bú cu ấy để gáy to hơn. Gáy cho muôn đời tốt đẹp, gáy cho muôn vật được vui tươi, gáy cho trái đất được yên bình. Bởi họ biết ở đây có một con chó xạo lồn hãm cặc vẫn cố gân cổ, gằng giọng lên để mà gáy gáy gáy. Cho họ biết rằng mày là một con chó thất bại, và họ vui vì họ sẽ biết mà tránh xa lũ chó dơ bẩn như thế này. Địt con mẹ mày ồ ? Mày nhắc tới bố mẹ tao ư ? Hay lắm đấy con chó, mày đã gáy đủ to để dành được sự chú ý của t rồi đấy. Mày nên mừng sau khi bỏ ra bao bao công sức, gát khang cả giọng và mày đã làm được rồi! Mày đã thành công chứng minh mày chỉ là một con chó súc sinh hạ đẳng chuyên bú cu với cái mồm thối đầy bựa cặc. Kể cả vậy t vẫn cảm thấy tội ba má mày khi sinh ra mày đấy, một thằng điếm thèm cặc mê cu thích sủa, gây ô nhiễm không khí khi tiếp tục gáy và mồm phun đầy bựa cặc và tinh trùng. Địt con mẹ mày nếu mày đã đạt được điều mày muốn là thu hút sự chú ý của tao ? Thì làm ơn mày có thể bớt gáy được không ? Tao đéo ngại phải tiếp những con súc vật hạ đẳng như mày nhưng làm ơn đấy màn gáy của mày đã to đến mức làm phiền những người xung quanh đấy. Họ khác mày là những con người bình thường chứ đéo phải là một con sâu bọ như mày cứ mở mồm ra là gáy và gáy. Ôi chúa ơi, phật tổ ơi những con người đầy quyền năng và mạnh mẽ hãy giúp con trừng trị thứ loài vật khiếm khuyết này. Hãy khóa mõm con thú đáng ghê tởm mà cứ liên tục gáy trước mặt con, hãy trừ họa nó cho một thế giới tươi đẹp hơn, đẹp đẽ hơn. Địt con mẹ mày bớt gáy đi, thứ súc vật gớm ghiếc. Những gì mày gáy ra đéo đủ trình độ, đẳng cấp để tao hiểu đâu hết, thứ chó đẻ Xàm lồn hả con chó .... trưa nóng nảy ngồi nhảm ngôn như chưa từng được nói vậy? Mày đừng để mẹ m phải ngồi gáy ngôn với những đứa đéo ngôn với m, m tin mẹ m đá lọt lồn m xuống 8 tấc đất để m tu tâm dưỡng tích cho cái sự ngu lồn của m gây ra kh? Mẹ m phải dập đầu mồ mả m xuống háng t xin lỗi thì t mới tha🤩 Nãy thấy tao đéo nói gì trèo lên đầu lên cổ con Phương nhà tao ngồi đừng để tao đạp mày lọt xuống cống phọt cứt lòi ruột lòi gan phèo phổi ra chứ ở đấy mà nắm đầu bạn tao chửi bới đến cả bạn mẹ mày để mẹ m dọ mồm m vô chuồng chó chơi với những con bét nha đĩ mẹ mày.Chúng mày cũng chỉ là mấy con chó hằng ngày bị mẹ xích cổ buộc chân vào những xó tường mục nát đầy rẫy ruồi bọ, tận rệp đu bấm. Nay bị đứt xích được bay nhảy lại quay sang cắn người như chí thèm cứt bị người ta chặt đuôi lặc đái về máu mê bê bết trây đâ �y người còn hên giữ được tính mạng thì lo giữ đi mấy con đĩ ba hoa xàm lồn 😏 Đem ba cái ngôn cùi lồn như giẻ lau nhà của m ra khóc mướn khóc thây cái trình gà lồn ra mà đòi ăn chị m?Mãi mới đào bới sửa được vài ba câu mà ngồi ba hoa xàm lồn với ai vậy? Địt mẹ bố mấy con dở hơi đéo có ngôn mà dám ló cặc ra sủa😏 Đầu chứa toàn cứt mà tưởng mình là nữ hoàng vương quốc sao? Bạn nó đâu lo lôi cặc nó về dùm đừng để nó sủa bậy nha🤩 Đụ mẹ thằng lồn ranh con non nớt phò rách? Tao đéo làm cc gì mày nhảy từ bàn thờ nào nên dám tap mẹ mày vậy thằng ranh? Mẹ mày lại đạp mồ mày xuống 18 tầng địa ngục lúc đấy thì khóc lóc oán than xin tha😏 " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 345000);
  setTimeout(() => {
    a({
      body:
        "dcm hết ngôn mẹ rồi, đề nghị thằng mặt lồn admin updates thêm ngôn cho tao để tao tap nó, chứ nhiêu đâu dcm dell đủ để tao tap cái bọn lồn mặt dày này" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 350000);
  setTimeout(() => {
    a({
      body:
        "Cha mẹ mày nuôi nấng dạy dỗ cho tiền ăn học thầy cô bạn bè đéo dạy mày nên người thì để chị đây mở lòng từ bi thay trời hành đạo dạy dỗ con đĩ tai ương xàm cứt Quật lồn 8 phía địa ngục chắc lồn gì đã sang cái giọng lồn giọng mẹ ? " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 355000);
  setTimeout(() => {
    a({
      body:
        "thứ lồn đụ âm binh chị mẹ mày đây hôm nay sẽ thay trời hành đạo con đĩ trưa bát giới thiện tai đi thỉnh kinh nhầm thằng sư phụ nứng lồn hả em, chị nói em nghe này lựa thế là chết dở chết cười em ạ, đừng cố tấu hài cho chị mày cười sảnh ban đêm cười sang chấn tâm lý coi em, đừng múa mép xàm lồn cho chị mày xem nữa con đĩ " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 355000);
  setTimeout(() => {
    a({
      body:
        "Thằng cha con đĩ mẹ mày năm xưa đéo bóp chết gái mẹ mày đi để giờ ngồi đây bép xép xàm lồn với chị mày ba cái ngôn lủng ca lủng củng " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 355000);
  setTimeout(() => {
    a({
      body:
        "Đụ mẹ anh đá lồn chết con đĩ mẹ nhập viện nhảy đành đạch chết xuống dưới đạp đầu thằng dị tật ngông lồn như em ha con chó rách rưới mà ảo tưởng em là công chúa con , anh đá nát cu thằng chó rách em nha em đụ mẹ anh đưa em lên lưng chim rồi thả em xuống dầu sôi lửa bổng cho em chết mẹ em nha đụ mẹ sống hãm lồn đéo chừa 1 cục cứt chó cho con em nữa mà ở đó sủa dơ anh đưa em lên đường đi thỉnh kinh với mấy đồ đệ của tôn ngộ không để nó dập chết con đĩ ngựa mụ nội cha dòng họ tổ tiên ngứa lồn nha con ôn hà bá chướng khí anh đưa dô chùa để em tu nghiệp sinh em đi nha em hãm quá đĩ mẹ em còn đéo dám nhận em nữa đó nha đĩ đụ mẹ anh quăng em ra đường lộ 8 phương 9 hướng cho xe cán lủng mu em nha em đụ mẹ miệng còn hôi sữa mà ở đó sủa dơ anh cắn nát lồn em nha con đàn bà có râu nhảy đành đạch chết " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 355000);
  setTimeout(() => {
    a({
      body:
        "đem mấy câu ất ơ đại trà đó về leo lên bàn thờ tụng kinh niệm phật cho gái mẹ mày nghe nó siêu sinh về với vùng cực lạc chứ bị anh nắm đầu xoay như con thú hoang té úp mặt xuống nước đái tanh hôi thối rửa không ai lôi lên còn muốn bị dí đầu thêm mấy mét nữa hả?mấy con bần hèn tì như mày vào tụ hình tụ bóng ngôn không ra ngôn khoai không ra khoai ngồi đấy phun nả bay lòng vòng không thấm thía hay gãi ngứa cho anh được vậy con điếm  nhả ngôn nào dame mạnh mạnh thổi mát đít tao xíu coi? chứ cái ngôn của m tao thổi như thổi chong chóng 7 phương 8 hướng cũng dập đó em? " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 355000);
  setTimeout(() => {
    a({
      body:
        "đĩ mẹ ngồi phán từng câu từng chữ tin chị đây gõ cho u đầu mày 0 con não bộ chậm hiểu chị đây lại cầm đầu mày dí xuống dưới âm ti cho âm binh oan hồn dưới đấy nó đè mày ra địt thông lỗ lồn mày giờ.Ngôn trình rác nhả được vài ba câu xàm chó em ngồi đây dương oai đòi dí chị ôi con đĩ ơi đáp khùng đáp điên đáp điên đáp rồ ngôn em còn chưa với nổi một con lông lồn của chị mà em còn ngồi đây văng mõm ra tay chân khi gõ với chị còn đang run run từng chút từng chút sợ đái ra quần mà em dám ngồi đây nói mẹ chị làm đĩ vậy chắc lúc mẹ chị đang được mấy đại gia tầng trên cao cao tại thượng địt rồi bank cho vài trăm đô vào lồn thì mẹ con em còn đang ngồi lau dọn liếm chân cho mấy lão già 70-80 rồi van xin mẹ chị quăng cho vài thứ chất tinh dịch của mấy lão kia nhét vào lồn mẹ em để đẻ ra 1 đứa như em cho có cha có mẹ không lại mồ côi thì tội.Mà vì mẹ em ngày xưa van xin mẹ chị lên giờ chắc em cũng quỳ xuống liếm từng đầu ngón chân cho chị để tạ công ơn ngày xưa khi còn làm đĩ mẹ chị cho tinh dịch để mẹ con em được chu cấp chu toàn như bây giờ con nứng lồn.Lớn hơn ai mà mày tao hả con đĩ mẹ mày mày tao cái con loz đĩ chó con mẹ mày .Đẻ ra mà nứng lồn mà cx xinh đó mà xấu hơn con chó nhà tao " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 355000);
  setTimeout(() => {
    a({
      body:
        "Ngôn của em thì như đống cứt sa mạc cho chó liếm lấm la mà em ỷ ôi như mình được tôn thờ cao quý, anh mày đè đầu cưa cổ mày đến chết chứ ngồi lo phun ra vài câu xàm cho ai coi hả con ranh vài ba cái sớ ngôn quèn của em anh đây đích thân lên trời để hành bá tôn trang mày lại để đè mày xuống âm ti tổ ngục cho mày xàm hối biết điều ? " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 355000);
  setTimeout(() => {
    a({
      body:
        "Ngoi đầu cặc rống lỗ tai lên nghe Phật Tổ giảng kinh nè,con yêu tinh nghiệt súc ơi,năm xưa nữ oa vá trời còn bây giờ để anh vá cái lồn bị chúng đụ của gái nè,con âm bi khí đụ tụ hình để anh nhờ diêm vương lôi mày xuống tầng 19 địa ngục cho vạn tuyễn xem tâm bắn vô cái mu lồn đầy nghiệp chướng của mày để mày bớt đi đụ bậy con súc nô bần hèn này,mày chỉ mãi là con đĩ bại dưới tay bọn anh thôi nên đừng có ngông lồn nha em gái con chó phèn này add bọn súc sinh kia vào đây để anh giải nghiệp 1 thể cho thế giới được sạch đẹp và mãi xanh tươi vì không có mấy con chó ghẻ làm bẩn cái không khí cái bầu không khí trong lành của trời đất ban tặng, con chó não úng bị khùng lồn hay sao mà toàn cùn ngôn óc cặc thế,cháu Ngoi đầu cặc rống lỗ tai lên nghe Phật Tổ giảng kinh nè,con yêu tinh nghiệt súc ơi,năm xưa nữ oa vá trời còn bây giờ để anh vá cái lồn bị chúng đụ của gái nè,con âm bi khí đụ tụ hình để anh nhờ diêm vương lôi mày xuống tầng 19 địa ngục cho vạn tuyễn xem tâm bắn vô cái mu lồn đầy nghiệp chướng của mày để mày bớt đi đụ bậy con súc nô bần hèn này,mày chỉ mãi là con đĩ bại dưới tay bọn anh thôi nên đừng có ngông lồn nha em gái con chó phèn này add bọn súc sinh kia vào đây để anh giải nghi... " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 360000);
  setTimeout(() => {
    a({
      body:
        "Địt con mẹ, địt cả lò cả họ cả xóm nhà chúng mài ra chứ ngồi đấy làm chi mà rách rưới nát việc.Bố đã đéo thích nói đến thì thôi, chúng mày lại còn chu cái mỏ như cái mỏ lồn vào làm gì, thích thì phắn mẹ chúng mày hết đi, không bố lại xua con chó cái nhà bố ra cho chúng mày bú lồn thì có mà ngộ độc thực phẩm cả lũ, cả nút đấy nhá..hãm vcl.Còn riêng thằng Admin thì ra đây bố bảo, cái việc nhà mày thì bố đéo quan tâm, nhưng cái việc mày đang làm thì đéo khác gì thằng già 80 ngồi sục cặc tơ tưởng lại hồi trai trẻ..thế nên mày chui vào cái lồn mẹ mày mà chết đi cho đẹp trời..đéo ra cái thể lồn gì…nãn " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 365000);
  setTimeout(() => {
    a({
      body:
        "Chúng mày ngày xưa ko đc học đạo đức lớp 1 hay sao. Chắc ba mẹ sinh mày ra khổ lắm nhỉ? Có đứa con sống chó ra ngoài ngông lồn lên xạo chó lồn ra ẳng cho người ngoài nghe mắc mắc ỉa. Sống ở đời thì đừng có sống chó, Diêm Vương cho đầu thai làm người thì khôn ngoan sống tốt mà làm người. Đâu như cái kiểu cho làm người mà lại sống chó mà cứ ngông lồn lên mình lad người " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 370000);
  setTimeout(() => {
    a({
      body:
        "chị cao sang như vậy mà em nỡ đi so với con chó rách nát nhà em ? chị cầm đầu em dẫm bẹp lên đá cho lủng lẳng rồi trả về cho thằng cha con mẹ em rồi cầm đầu con chó nhà em gắn vô bộ não của em cho biết nhận thức khi so sánh người với chó nói nhảm mới bặp bẹ phun ra được cái câu hồi bọn trẩu tụi nó dùng cũng ngồi đây nơm nớp oai ? " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 375000);
  setTimeout(() => {
    a({
      body:
        "Ba hồn 7 vía mày chui lên từ địa ngục trần gian vác kinh thánh cho bà già mày để tao lôi đầu chó mày lôi lên lôi xuống tầng mây ngôn như trệc dưới mương máng nhà gái mẹ mày chứ chui mõm lồn lên cãi lội hả sủa sản sủa dơ chi để mẹ dập lồn mày xuống âm đạo xin lỗi mẹ mày hả con chó ranh ,tao đang nấu mì ăn chứ để tao nấu nước sôi đỗ lên đầu gái mẹ mày đỗ xuống vậy thằng khùng ngôn cùn lồn quá về kêu gái mẹ mày dạy lại cách học đánh vần viết chữ chứ loại lồn đéo xứng với con chó nhà tao nữa con quỷ cái đợi tao nấu xong tao đá mõm thằng cha già nhà mày mở mõm nói đéo biết há hốc cái họng lồn mày ra xin lỗi mà ngồi cùn lông với ai hả đụng ai chứ kiếm mấy con gà lồn mà kiếm cơm qua ngày chứ kiếm cơm mày đang đụng khó nuốt khuyên lắm chưa kịp nuốt hồn bay phách lạc nãy giờ diễn ngồi em bé ba mi hả con khùng lồn đợi tao dí như chuột cống rồi mới mở mõm lồn ra xin lỗi đúng không đĩ mẹ mày đến lúc đó tao cúp đuôi bà già mày chạy 8 hướng chui vô hang hốc đập chết gái mẹ mày luôn chứ mày nghĩ trình gà lồn vươn lên từ đất mẹ mày hả thằng lồn điên lảm nhảm lảm nhảm cho thằng cha con gái mẹ mày nghe chứ trình cỏn con như con kiến tao bóp chết thằng cha già mày còn được ,nhét cứt vô họng đời này sang đời khác đéo rửa hết tội của dòng tộc nhà mày đâu con ôn lồn cầu trời lạy phật vì nãy giờ tai chửi đá động con gái mẹ mày mà để tao chửi lên bờ xuống ruộng núm đầu gái mẹ mày chui lên từ 7 tầng địa ngục qua khỏi cửa ảiĐợi bà đào mộ tổ tiên mày lên để lên tiếng xin lỗi à ? Tao ib thì không rep rồi mà tỏ ra ngây thơ hả ? Mày định diễn cho ai coi, tấu hài hả ? Tao tưởng diễn kịch mù không đấy ? Mày định đợi bị mẹ mày dí rồi mới biết ân hận hả ? Tao đào 7749 mộ mã mẹ mày lên để chôn sống mày xuống đó ? Trước khi nói chuyện với tao làm ơn đem cái não đi thay rồi muốn nói gì nói ? đừng mạnh mồm với bà đây rồi lại không dám rep ib  ? Tao thục cái con cặc của mày bay 9 tận trời mây xanh ? 1 là lên tiếng xin lỗi bà đây 2 là rep ib type 11 nè ? Đừng để mẹ dí mày chạy 63 tỉnh thành ? Bi bô đi war rồi giả bộ ngây thơ xàm cặc với chị? Dập đầu xuống âm đạo xin lỗi chị đi bé ơi ? Đừng để tao tế mày lên rồi lúc đó khoá wall cái kiểu, định làm vậy con đĩ mẹ mày coi hả, sống theo thời nguyên thủy hay sao mà không hiểu tiếng tao nói ? Con lồn tai ương nghiệp chướngĐợi bà đào mộ tổ tiên mày lên để lên tiếng xin lỗi à ? Tao ib thì không rep rồi mà tỏ ra ngây thơ hả ? Mày định diễn cho ai coi, tấu hài hả ? Tao tưởng diễn kịch mù không đấy ? Mày định đợi bị mẹ mày dí rồi mới biết ân hận hả ? Tao đào 7749 mộ mã mẹ mày lên để chôn sống mày xuống đó ? Trước khi nói chuyện với tao làm ơn đem cái não đi thay rồi muốn nói gì nói ? đừng mạnh mồm với bà đây rồi lại không dám rep ib  ? Tao thục cái con cặc của mày bay 9 tận trời mây xanh ? 1 là lên tiếng xin lỗi bà đây 2 là rep ib type 11 nè ? Đừng để mẹ dí mày chạy 63 tỉnh thành ? Bi bô đi war rồi giả bộ ngây thơ xàm cặc với chị? Dập đầu xuống âm đạo xin lỗi chị đi bé ơi ? Đừng để tao tế mày lên rồi lúc đó khoá wall cái kiểu, định làm vậy con đĩ mẹ mày coi hả, sống theo thời nguyên thủy hay sao mà không hiểu tiếng tao nói ? Con lồn tai ương nghiệp chướngNhư chó cúp đuôi chạy 4 phương 8 hướng mở họng ra xàm lồn múa mép mua vui cho thiên hạ đéo nhục hả thằng quỷ tai ương nghiệp chướng ? cái đội ngũ lớp da người biết thân biết phận thù đêm tối giật lồn tao chửi như cá mắc cạn tù đụ tàn hình núm lông cạ �c mày chửi lên bờ xuống ruộng rửa chó sạch chứ dòng thứ cho tha ma đụ Đừng để mẹ mày đày mày xuống dưới cùng cho họng nhỏ mồm to bụng quanh năm chết đói như cô hồn chất vưởng nha , tao không thay tiên thay trời sử cái tội danh đáng vả lệch cái mặt mày về sau như quỷ là còn có tính bao dung độ lượng cho cái thứ tàn phế khuyết tật như mày rồi thằng lồn Mày nghĩ mày gặm như trâu gặm cỏ mấy cái ngôn phèn phẹt đó mày đem ra sánh ngang đòi cùng vai ngang hàng với mẹ mày hả mày nghĩ cái lồn gì vậy mẹ mày đi từ dưới lên cao còn loại mày đã hãng thấp lại tụt xuống hạng bần phèn chứ đéo phải ngồi đây đòi ngang trình với má đâu con đĩ cắm mặt xuống đất đít chổng lên trời Con đĩ mẹ mày ngồi xàm cặc ở đây với mẹ vậy cho chán cho cố rồi đến lúc má mày dã cái mặt mày như đàn ngựa nó phi đàn trâu nó chngy thì mày bẹp dí như cái bánh chứ đéo phải ngồi thể hiện mình to xác lớn người giỏi ngôn giỏi ngữ mà gáy to giọng mẹ vỗ tay vô ngực nhận danh xưng tiếng đem đi phè lồn khoe mẽ với đĩ mẹ mày đâu con ôn . Cái thứ lồn không lông mông toàn tinh chó đực mày chắc phải chui xuống leo háng vái lạy bà mày thì ít ra bà còn kêu phật độ cái mả mẹ mày đó ! Chửi mẹ mày mà đéo biết há cái hang sâu hốc tối ra xin lỗi nhưng rúc rúc như bị săn bắn thì cẩn thận mẹ là người vắt chân treo cổ mày dựng ngược lên cây như mấy đứa bị treo chân bắn chết đó con chó con ngang đường ? Con lồn tai ương nghiệp chướng mở họ " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 380000);
  setTimeout(() => {
    a({
      body:
        "trời chưa gõ em đã tự thân tự lự tự gán danh gán phận tâng bốc cái trình què quặt của em tầm cao đấy nóc thượng đẳng chưa biết gõ tới đâu mà đã ngồi đây xưng trung hàm trung uý tưởng đâu đi war lâu năm hoá ra chỉ là con gà mới chớm nở le te bị chửi lên đầu lên cổ tối ngày mà cũng dám ngông cuồng ngang tàn hống hách vượt phá tâng bốc bản thân ở đâu mà có cái định luật cấm tuổi tác phân biệt giới trẻ chưa gõ đã một hai chê bai đại trà nhìn lại cái đống bùi nhùi em gõ ra phụ khoa tràn lan anh còn không thèm nhấc mi liếc mắt tự dòm ngó dòm mắt học lỏm học sẳn ở đâu đối đáp đơm đặt bịa chuyện vô đây gán phận nay anh m ngồi đây chấp trước bàn cầu cơ nghiêng ngã chấp trước 50 chữ mà dám ngồi đây tác oai tác oai dằn mâm thắng chén ra oai v đã đủ trình độ vất đồ ra cho anh mày nhả phỉ nhổ từng bãi nước miếng để mặt chó mày có cơ hội ngồi đây gõ mà đòi đủ tư cách ăn đứt kêu anh dùng đại trà để lập bàn tế con má mày theo làn sương mờ khói hồn bay phách lạc loạng xoạng chị đạp 1 cái là lăng đùng ngã lăn ra đất nằm bịch xuống sàn cho bả hấp hối từng câu cuối trước khi về miền cực lạc chuyển sinh thành kiếp mạng chó ngồi 5 lượt 7 phải để con bả đứng lên xưng vương với anh, thấp cổ bé họng trong khi từ đầu trận đến cuối trận anh đưa ra như là nòng súng đại bát bắn thẳng vào l//ồn khắm có mùi thum thủm của em em rên ư ử mà nãy giờ em ngồi đó cứ lảm nhảm vài câu xàm lồn tin anh ngắt con chim mày không hả? đã đủ trình độ vất đồ ra cho anh mày nhả phỉ nhổ từng bãi nước miếng để mặt chó mày có cơ hội ngồi đây gõ mà đòi đủ tư cách ăn đứt kêu anh dùng đại trà để lập bàn tế con má mày theo làn sương mờ khói hồn bay phách lạc loạng xoạng anh đạp 1 cái là lăng đùng ngã lăn ra đất nằm bịch xuống sàn cho bả hấp hối từng câu cuối trước khi về miền cực lạc chuyển sinh thành kiếp mạng chó ngồi 5 lượt 7 phải để con bả đứng lên xưng vương với anh thấp cổ bé họng trong khi từ đầu trận đến cuối trận chị đưa ra như là nòng súng đại bát bắn thẳng vào lồn khắm có mùi thum thủm của em em rên ư ử mà nãy giờ em ngồi đó cứ lảm nhảm vài câu xàm lồn tin chị ngắt con chim mày không hả? đã đủ trình độ vất đồ ra cho anh mày nhả phỉ nhổ từng bãi nước miếng để mặt chó mày có cơ hội ngồi đây gõ mà đòi đủ tư cách ăn đứt kêu anb dùng đại trà để lập bàn tế con má mày theo làn sương mờ khói hồn bay phách lạc loạng xoạng anh đạp 1 cái là lăng đùng ngã lăn ra đất nằm bịch xuống sàn cho bả hấp hối từng câu cuối trước khi về miền cực lạc chuyển sinh thành kiếp mạng chó ngồi 5 lượt 7 phải để con bả đứng lên xưng vương với anh, thấp cổ bé họng trong khi từ đầu trận đến cuối trận chị đưa ra như là nòng súng đại báts bắn thẳng vào lồn khắm có mùi thum thủm của em em rên ư ử mà nãy giờ em ngồi đó cứ lảm nhảm vài câu xàm lồn tin anh ngắt con chim mày không hả? đã đủ trình độ vất đồ ra cho chị mày nhả phỉ nhổ từng bãi nước miếng để mặt chó mày có cơ hội ngồi đây gõ mà đòi đủ tư cách ăn đứt kêu anh dùng đại trà để lập bàn tế con má mày theo làn sương mờ khói hồn bay phách lạc loạng xoạng anh đạp 1 cái lồn🥰 " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 385000);
  setTimeout(() => {
    a({
      body:
        "Anh hạ phàm xuống cái sàn war này dập nát cái bản mặt lồn mày còn kịp chứ thuở ba hoa xàm lồn đòi gõ với anh anh đá mày xuống hố sâu không đáy như tám giác quỷ ngoài biển sau còn kịp mẹ mày sủa được vài câu ngôn là xưng danh tưởng anh sợ sao anh đá tới gái mẹ mày học cái máu lồn tinh trùng khuyết ra còn kịp chứ mày ở đó lên đây đòi gõ với anh, anh xuống hồ hoàng tiền hốt cốt con đĩ mẹ mày lên đem đi đấp mồ chôn cất còn kịp chứ mày ở đó xài mấy cái ngôn học lõ được.ở mấy cái sàn war bại đem lên đây gõ với anh cái ngôn củ em muốn móc rùm lên rồi chứ đừng ở đó đem lên đây gõ anh gõ tới con đĩ mẹ mày chết trôi chết nổi còn kịp " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 390000);
  setTimeout(() => {
    a({
      body:
        "cái não em dị tật không gõ câu nào ra câu nào đúng không con chó ơi ngồi ở vực hiu hoạnh cố gắng mà gào lên tên anh để thấy được sự từ bi mà anh dành cho mày vào ngày tháng cuối lúc viết bài cáo phó đưa tiễn mặt mày đi từ ngày sữa ngày xưa hát khúc nhạc làm người cõi âm cho mặt mày được ngồi ở hố sâu mà kêu lên để có người trợ giúp em  máy khoan từ lõi tâm trái đất nay khoan đầu của em ra làm đôi tại trận đấu này trình rõ khác xa trận này có thả ra em cũng không có nhai được câu nào trong câu từ của anh đâu vì bí thư toàn khoa 36 kế của tôn tử có kế 37 dành cho em phải thoát khỏi anh chứ đừng để anh dùng phong lâm hoả sơn trong binh pháp giao tranh đưa tiễn em nơi này liền tại trận chiến xích bích em như hoá thành quân tào bị anh đánh cho tan nát trận cũng như cái ngôn của em vậy vòng lặp từ này tới vòng xoay kia coi còn xoay vòng vòng như trong chống rồi cũng có ăn được anh vào câu nào từ nào khi không vắp ngã câu nào được ăn anh là nỗi giấc mộng mày được nhận sự từ bi của anh khỏi cái trận đáu này là nỗi ác mộng như những ngày xa xưa biết trình độ em rõ khác xa anh rồi nay anh sẽ làm người từ bi để nhường nhịn em vài ba câu ba cọc ba đồng đổi được cái mớ rau hư của em để nay lên anh bẻ hết câu hết từ rồi tí hồi em nhai được cái nào hay là thiếu chất xám nên không được đối đáp anh 1 cách đàng hoàng mà cố gắng gào thét trong hiu hoạnh để đem lý vào nói cho mẹ mày mở bài đưa tiễn hai mẹ con múa may quay cuồng làm bài ca dao tục ngữ múa như khá bảnh trong cơn mê ngồi chờ em gõ lâu la lâu lắc khiến anh phải lắc đầu ngao ngán khi trình độ rõ khác xa vậy như em là quân đức quốc xã thua trận thảm hải còn tốc độ anh bấm phím vào mặt của em thì nhanh hơn tên lửa bắn vào hiroshima vậy đó em khiên em phải mang nhục như hai bà trưng về với hát giang mà hủ hỉ với nhau lúc cuối đời đó anh dâng nước sông hoàng hà lên mới đủ để cho em rửa cái nhục khi đối đầu với anh tại trang sử mới hả con má mày ngồi sủa khùng sủa điên về cái sông hương gì vậy con chó ơi ngồi cứ địa ngục để chôn con gái mje mày từ thời sơ khai hay sao vậy con chó ngồi gõ được vài ba câu mà chứ nhai di nhai lại như cái địa ngục để cúng con mẹ mày ở chỗ đó vậy rồi còn ba hoa xàm lồn còn câu từ nào đại trà hơn không hả con chó ơi ngồi gõ câu nào cho anh có hứng để đáp đi còn em gõ như mấy con gà mà cố gắng tập tành lên vậy hả coi anh dập mày từ cái trận này rõ trình độ khác xa rồi cầm cung dương lên bắn vào con mẹ mày phải phát ói lên đó chứ ngồi nhảm hoài quái thai lai con mẹ mày từ thời sơ khai lúc ông nội mày cầm mày trên tay ở hình hài thai nhi anh ngăn cán rồi hả coi quan âm nào cứu được mày khỏi cái tay bố coi cái ngôn của em gà quèn chứ ngồi nhả ba câu nhìn nghe phát ói chứ anh mượn dây của ông tơ bà nguyệt vào cuống em khỏi cái trận này chứ ngồi kì bí với con mẹ mày sơ khai lập nghiệp lên đứa con nghiệt ngã ở cái trận đấu không ngang tài ngang sức này bị anh đá vào khung thành em chỉ có vỡ oà lên mà khóc thôi coi con súc vật tai ương là con mẹ mày hay sao mà cứ nhai từ câu này đến câu khác vậy con mẹ mày khi xưa động dục bị anh cầm cây xà beng đổ cồn 90 độ vào mà cậy ra khỏi chứ em tính làm kẻ đu càng anh cầm súng bắn 3 que chứ em cuống gói về nạn đói đi chứ ngồi lếu láo câu từ của em khiến anh ói từng câu anh nhồi vào não mày từ lúc chui từ ổ nhục mẹ mày ra giờ ngồi nhảm với làm trò điên khùng ở cái trận trình độ rõ khác rồi còn cố gắng gõ được câu từ của mày làm trò con bò nhai đi nhai lại vài câu vài chữ để che đậy sự thật thối tha rách nát mày bị anh nắm đầu quay cuồng hả con chó " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 395000);
  setTimeout(() => {
    a({
      body:
        "em nghĩ mình vừa phun ra câu từ hôi thối như nào không mà đang nghênh mặt ra oai ? Dòng ngôn chị đây nả như rồng bay phượng múa đè nát bét máu lồn phun thành sông cái loại ngôn nhẹ hều không chút trọng lượng chẳng miếng sát thương nhà cưng. Mẹ đây thả lòng từ bi mà từ trên cao nhảy xuống đè đầu cưỡi cổ chặt tiết con đĩ gái mẹ em cho con nghiệp chướng âm binh nhà em siêu thoát thế mà làm sao con oan hồn vất vưởng ngàn năm khí đụ như cưng vẫn lởn vởn như con điếm tìm khác sao lồn ôn ranh ? Loại tiện tì như cưng biết điều thì quỳ xuống liếm móng chân chị may ra chị đây còn có nhã hứng ban phát cho con ẩm ương như em chút ít hồng phúc tề thiên để khỏi đầy ải gian nan ba đời bảy kiếp lang thang tóc tai bù xù, cha mẹ chết tức tưởi nhìn cpn chó điếm như em điên dại cắn người. " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 400000);
  setTimeout(() => {
    a({
      body:
        "Mồm lồn của mày động tới chị để chị trèo đầu cưỡi cổ túm lồn đá văng 3 phương 8 hướng xách háng chạy về với con mẹ mày cầu cứu ? Loại ngu ngục như mày chị đá văng lồn xuống âm ti địa phủ đi 18 tầng địa ngục để chôn vùi cáu thân xát rác rưởi của mày để kiếp sau có gặp lại chị thì mày biết cung kính để chị đỡ phải cắt cái lồn dơ bẩn của mày đi nha con lồn tù đụ , trong lúc em làm nhảm vài ba câu xàm mu anh đi truy lùng được danh của em rồi đó gái , không ngôn không trình dồn dập nhau như một lũ chó hùa . Cười nhẹ " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 405000);
  setTimeout(() => {
    a({
      body:
        "Để anh múa lửa cầm rìu sắt, búa vào đầu mày cho tỉnh ngủ nha cái mạng chó mày còn lo không xong đòi lên giọng dạy đời ai hả anh cười đái xè xè vào cái sớ ngôn trâm tiêu toàn phụ khoa em móc từ cái lồn hôi hám của mả mày ra khè ai sợ hả " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 410000);
  setTimeout(() => {
    a({
      body:
        "trời chưa gõ em đã tưy� thân tự lự tự gán danh gán phận tâng bốc cái trình què quặt của em tầm cao đấy nóc thượng đẳng chưa biết gõ tới đâu mà đã ngồi đây xưng trung hàm trung uý tưởng đâu đi war lâu năm hoá ra chỉ là con gà mới chớm nở le te bị chửi lên đầu lên cổ tối ngày mà cũng dám ngông cuồng ngang tàn hống hách vượt phá tâng bốc bản thân ở đâu mà có cái định luật cấm tuổi tác phân biệt giới trẻ chưa gõ đã một hai chê bai đại trà nhìn lại cái đống bùi nhùi em gõ ra phụ khoa tràn lan anh còn không thèm nhấc mi liếc mắt tự dòm ngó dòm mắt học lỏm học sẳn ở đâu đối đáp đơm đặt bịa chuyện vô đây gán phận nay anh m ngồi đây chấp trước bàn cầu cơ nghiêng ngã chấp trước 50 chữ mà dám ngồi đây tác oai tác oai dằn mâm thắng chén ra oai v đã đủ trình độ vất đồ ra cho anh mày nhả phỉ nhổ từng bãi nước miếng để mặt chó mày có cơ hội ngồi đây gõ mà đòi đủ tư cách ăn đứt kêu anh dùng đại trà để lập bàn tế con má mày theo làn sương mờ khói hồn bay phách lạc loạng xoạng chị đạp 1 cái là lăng đùng ngã lăn ra đất nằm bịch xuống sàn cho bả hấp hối từng câu cuối trước khi về miền cực lạc chuyển sinh thành kiếp mạng chó ngồi 5 lượt 7 phải để con bả đứng lên xưng vương với anh, thấp cổ bé họng trong khi từ đầu trận đến cuối trận anh đưa ra như là nòng súng đại bát bắn thẳng vào l//ồn khắm có mùi thum thủm của em em rên ư ử mà nãy giờ em ngồi đó cứ lảm nhảm vài câu xàm lồn tin anh ngắt con chim mày không hả? đã đủ trình độ vất đồ ra cho anh mày nhả phỉ nhổ từng bãi nước miếng để mặt chó mày có cơ hội ngồi đây gõ mà đòi đủ tư cách ăn đứt kêu anh dùng đại trà để lập bàn tế con má mày theo làn sương mờ khói hồn bay phách lạc loạng xoạng anh đạp 1 cái là lăng đùng ngã lăn ra đất nằm bịch xuống sàn cho bả hấp hối từng câu cuối trước khi về miền cực lạc chuyển sinh thành kiếp mạng chó ngồi 5 lượt 7 phải để con bả đứng lên xưng vương với anh thấp cổ bé họng trong khi từ đầu trận đến cuối trận chị đưa ra như là nòng súng đại bát bắn thẳng vào lồn khắm có mùi thum thủm của em em rên ư ử mà nãy giờ em ngồi đó cứ lảm nhảm vài câu xàm lồn tin chị ngắt con chim mày không hả? đã đủ trình độ vất đồ ra cho anh mày nhả phỉ nhổ từng bãi nước miếng để mặt chó mày có cơ hội ngồi đây gõ mà đòi đủ tư cách ăn đứt kêu anb dùng đại trà để lập bàn tế con má mày theo làn sương mờ khói hồn bay phách lạc loạng xoạng anh đạp 1 cái là lăng đùng ngã lăn ra đất nằm bịch xuống sàn cho bả hấp hối từng câu cuối trước khi về miền cực lạc chuyển sinh thành kiếp mạng chó ngồi 5 lượt 7 phải để con bả đứng lên xưng vương với anh, thấp cổ bé họng trong khi từ đầu trận đến cuối trận chị đưa ra như là nòng súng đại báts bắn thẳng vào lồn khắm có mùi thum thủm của em em rên ư ử mà nãy giờ em ngồi đó cứ lảm nhảm vài câu xàm lồn tin anh ngắt con chim mày không hả? đã đủ trình độ vất đồ ra cho chị mày nhả phỉ nhổ từng bãi nước miếng để mặt chó mày có cơ hội ngồi đây gõ mà đòi đủ tư cách ăn đứt kêu anh dùng đại trà để lập bàn tế con má mày theo làn sương mờ khói hồn bay phách lạc loạng xoạng anh đạp 1 cái lồn🥰 " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 415000);
  setTimeout(() => {
    a({
      body:
        "Anh đụ lên đụ xuống đụ uống nước mầm đụ sầm con tim đụ sum cái lồn đụ sồn đụ lên đụ tai đụ hóa đụ xóa giấc ngủ đụ máu đụ mủ đụ sủ đụ cảo đụ mải đụ miếc đụ xiếc đụ hề đụ lòi mề gà đụ sà lan lã đụ xã quận đen đụ sen 3 lá đụ xá cái lồn đụ mòn con mắt đụ sắc đụ màu đụ nhào nát ruộng " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 420000);
  setTimeout(() => {
    a({
      body:
        "Em nghĩ em là ai mà giám lên giọng với đế phương lừng lẫy đang truy sát gia tộc con đĩ dị tật nhà em? Ngôn em dài nhưng cũng chỉ như một mớ rẻ lau khi vào tay anh. Bại còn không chịu nhận còn cố gông mồm lên để rồi mang ba cái ngôn rách nát này xong lại bị anh quật cho túi bụi " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 425000);
  setTimeout(() => {
    a({
      body:
        "Con ôn lồn quái thai dị vật ngôn type ngôn như mớ rẻ lau mà cũng đòi đi kháy anh. Xong để giờ bại trận thì bỏ anh cop.Liệu em có tìm được type ngôn nào có thể dập nát lồn con đĩ mẹ em như anh không mà giám lên mặt bảo anh đi cop ? " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 430000);
  setTimeout(() => {
    a({
      body:
        "chị ngồi đây gõ vài ba sớ ngôn để đè dí con ôn khí đụ ăn hôi bợ đít như gái, loại đĩ chó như mày ra đây tao đạp xuống đống cứt cho gia phả tổ tiên dòng họ nhà mày chiêm ngưỡng một con gà quèn mới nhú war bập bẹ được vài ba câu ngôn phèn cứt mà lên đây xưng danh với chị sao? dăm ba câu ngôn của một con đĩ xanh non bại trận như em mà đòi tap khè lồn chị à tao cào xé nát cái bản mặt dơ bẩn hôi thối ngập tràn mùi tinh của thằng cha mày cho rách tả tơi thành từng miếng mang cho chó nhai giờ chứ ở đấy mà lên mạng ẳng được mấy câu ngôn cùn đi tap chị " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 435000);
  setTimeout(() => {
    a({
      body:
        "con mồm lồn tai ương . Mẹ mày đụ 3 đời 7 kiếp mới đẻ ra được ai ngờ vớ phải mấy con ranh hãm lồn thà bà già chúng mày bóp chết cụ chúng mày đi sống đéo gì cho chật đất của xã hội mấy con tinh trùng khuyết tật? Mới đẻ ra mẹ mày cho bú cặc hay sao phát ngôn toàn mấy ngôn xàm lồn ỉa vậy mấy đĩ ? Tao đạp lồn mày xuống mương dập tím lồn nè mấy con đĩ não úng tinh trùng👯‍♀️ " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 440000);
  setTimeout(() => {
    a({
      body:
        "Em nghĩ nhả vài ba câu ngôn sát thương không đụng đến cọng lông kẽ tóc của anh mà em đòi dập anh lên bờ xuống ruộng anh cầm gậy Như Ý vung 1 chưởng làm cả nhà em tan gia bại sản chết bờ chết bụi như mấy con vô gia cư không có nhà để về. Cái vẫy tay nhẹ của anh cũng làm hàng trăm đứa như em phải quỳ xuống bò lăn bò lết vẫn xin anh rủ lòng từ bi tha cho cái mạng quèn rác rưởi của nó mà em còn dám ở đây dựng cờ khởi nghĩa lập bàn bày trận tính kế để đạp đổ ý trí kiên cường của anh " +
        " " +
        name,
      mentions: arraytag,
    });
  }, 445000);
  setTimeout(() => {
    a({
      body: "cúttttttttttttttttttttttttt " + " " + name,
      mentions: arraytag,
    });
  }, 450000);
  setTimeout(() => {
    a({
      body: "cúttttttttttttttttttttttttt " + " " + name,
      mentions: arraytag,
    });
  }, 455000);

  setTimeout(() => {
    a({
      body: "cúttttttttttttttttttttttttt " + " " + name,
      mentions: arraytag,
    });
  }, 460000);
  setTimeout(() => {
    a({
      body:
        "ꕥؖؖؖؖؖꕹؖؖؖؖؖؖؖؖؖꕹؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖꗝꕥؖؖؖؖؖꕹؖؖؖؖؖؖؖؖؖꕹؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖꗝꗝؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖꕹؖؖؖؖؖؖؖؖꕥꕥؖؖؖؖؖꕹؖؖؖؖؖؖؖؖؖꕹؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖꗝꗝؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖؖꕹؖؖؖؖؖ" +
        " " +
        name,
      mentions: arraytag,
    });
  }, 465000);
};
