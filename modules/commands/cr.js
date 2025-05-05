module.exports.config = {
    name: "cr",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "",
    description: "Trò chơi hỏi đáp về crush",
    commandCategory: "game",
    cooldowns: 0
};

module.exports.run = ({ event, api }) => {
    const questions = [
        {
            question: "Món ăn yêu thích của crush là gì?",
            answers: ["Pizza", "Bánh mì", "Kem"],
            correctAnswer: 2
        },
        {
            question: "Crush thích màu gì?",
            answers: ["Xanh", "Đỏ", "Vàng"],
            correctAnswer: 1
        },
        {
            question: "Hoạt động yêu thích của crush là gì?",
            answers: ["Đọc sách", "Chơi thể thao", "Xem phim"],
            correctAnswer: 0
        }
        // Thêm các câu hỏi khác tại đây
    ];

    // Chọn ngẫu nhiên một câu hỏi
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

    // Tạo tin nhắn với các lựa chọn
    let message = `📩 ${randomQuestion.question}\n`;
    randomQuestion.answers.forEach((answer, index) => {
        message += `${index + 1}. ${answer}\n`;
    });

    api.sendMessage(message, event.threadID, event.messageID);

    // Lưu trữ thông tin câu hỏi để xử lý phản hồi
    global.client.handleReply.push({
        name: this.config.name,
        author: event.senderID,
        messageID: event.messageID,
        question: randomQuestion
    });
};

module.exports.handleReply = ({ event, api, handleReply }) => {
    const userAnswer = parseInt(event.body);
    const { question, correctAnswer } = handleReply.question;

    if (isNaN(userAnswer) || userAnswer < 1 || userAnswer > question.answers.length) {
        return api.sendMessage("❌ Vui lòng chọn một đáp án hợp lệ!", event.threadID, event.messageID);
    }

    const isCorrect = userAnswer - 1 === correctAnswer;
    const replyMessage = isCorrect ? "🎉 Chính xác! Bạn thật hiểu crush đấy!" : `❌ Sai rồi! Đáp án đúng là: ${question.answers[correctAnswer]}`;

    api.sendMessage(replyMessage, event.threadID, event.messageID);
};