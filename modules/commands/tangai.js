module.exports.config = {
	name: "tangai",
	version: "1.1.0",
	hasPermssion: 0,
	credits: "pcoder",
	description: "Tán gái vip pro, random nhiều câu tán gái ngọt ngào",
	commandCategory: "Tán gái",
	cooldowns: 0
};

// Danh sách các câu tán gái ngọt ngào, dễ thương, ấn tượng
const tangaiQuotes = [
	`Em biết không? Anh đã từng nghĩ rằng cuộc sống của mình cứ thế trôi qua bình thường, mọi thứ đều an yên và ổn định. Nhưng rồi em xuất hiện, giống như một làn gió nhẹ nhàng nhưng đủ để làm thay đổi tất cả. Ngày đầu tiên anh gặp em, anh đã cảm nhận được một điều gì đó đặc biệt, một thứ mà anh chưa từng cảm nhận trước đây. Đó không phải là sét đánh, không phải là điều gì quá kịch tính, mà là một cảm giác rất đỗi êm đềm, như thể em là mảnh ghép mà anh vẫn đang tìm kiếm bấy lâu nay.

Mỗi ngày trôi qua, anh đều dành thời gian nghĩ về em, không phải vì anh cố gắng làm điều đó, mà bởi vì hình ảnh của em cứ vô tình xuất hiện trong tâm trí anh. Nụ cười của em, ánh mắt trong veo, cách em nhẹ nhàng đối xử với mọi người xung quanh – tất cả những điều đó làm anh không thể nào không chú ý. Có lẽ em sẽ nghĩ anh nói quá, nhưng thật sự là từ khi có em, mọi thứ quanh anh như sáng bừng lên, ngay cả những ngày u ám nhất cũng trở nên dễ chịu hơn khi nghĩ về em.

Anh không dám chắc tương lai sẽ ra sao, không dám hứa hẹn điều gì xa vời. Nhưng điều duy nhất anh có thể nói với em lúc này là, anh muốn ở bên cạnh em, được chia sẻ với em niềm vui, nỗi buồn, cùng em trải qua những khoảnh khắc đáng nhớ trong cuộc sống. Và nếu có thể, anh mong rằng, em sẽ cho anh cơ hội để chứng minh rằng tình cảm anh dành cho em không chỉ là những lời nói thoáng qua, mà là cả tấm lòng chân thành.`,
	`Nếu em là một bài toán khó thì anh nguyện học cả đời cũng không muốn giải xong, chỉ mong được ở bên em mãi thôi.`,
	`Anh không phải là người hoàn hảo, nhưng anh chắc chắn là người yêu em nhất trên đời này.`,
	`Em biết không, mỗi lần nhìn thấy em cười, anh thấy mọi mệt mỏi trong ngày của anh đều tan biến.`,
	`Nếu được làm một điều ước, anh sẽ ước mỗi sáng thức dậy đều được nhìn thấy em đầu tiên.`,
	`Anh có thể không phải là người đầu tiên em yêu, nhưng anh muốn là người cuối cùng bên em.`,
	`Yêu em không cần lý do, chỉ cần em đồng ý là đủ rồi.`,
	`Em giống như ly trà sữa vậy, càng uống càng nghiện, càng ở gần càng không muốn rời xa.`,
	`Nếu em là nắng, anh nguyện làm mây để mãi mãi ở bên cạnh em.`,
	`Anh chẳng cần gì nhiều, chỉ cần có em bên cạnh là đủ hạnh phúc rồi.`,
	`Anh đã đi qua bao nhiêu con đường, nhưng con đường dẫn đến trái tim em là nơi anh muốn dừng chân nhất.`,
	`Trái đất có 7 tỷ người, nhưng trong mắt anh chỉ có mỗi mình em.`,
	`Anh không phải là người giỏi tán tỉnh, nhưng anh thật lòng muốn dành tất cả sự chân thành cho em.`,
	`Có thể anh không lãng mạn như trong phim, nhưng anh chắc chắn sẽ làm mọi điều để em luôn hạnh phúc.`,
	`Em không phải là người đầu tiên anh thích, nhưng là người duy nhất anh muốn yêu đến cuối cùng.`
];

module.exports.run = ({ event, api }) => {
	const msg = tangaiQuotes[Math.floor(Math.random() * tangaiQuotes.length)];
	api.sendMessage(msg, event.threadID, event.messageID);
};