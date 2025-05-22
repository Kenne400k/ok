/**
 * Constants for the PCAR racing game
 */

// Game constants
const TRACK_LENGTH = 30; // Độ dài đường đua
const LANE_HEIGHT = 50; // Chiều cao làn đua (tăng từ 30 lên 50)
const CELL_WIDTH = 35; // Chiều rộng ô (tăng từ 20 lên 35)
const CANVAS_WIDTH = TRACK_LENGTH * CELL_WIDTH + 150; // Chiều rộng canvas
const MAX_PLAYERS = 5; // Số người chơi tối đa mặc định

// Các kỹ năng xe
const SKILLS = [
  {
    name: "boost_pro",
    displayName: "🚀 Boost Pro",
    description: "Tăng tốc mạnh mẽ trong 2 lượt",
    cooldown: 5,
    handler: (car, room) => {
      car.position += car.speed * 2;
      car.effects.push({type: "boost", duration: 2});
      return "🚀 Boost Pro kích hoạt! Tăng tốc mạnh trong 2 lượt.";
    }
  },
  {
    name: "emp",
    displayName: "⚡ EMP",
    description: "Làm chậm xe đối thủ gần nhất",
    cooldown: 4,
    handler: (car, room) => {
      // Tìm xe gần nhất phía trước
      const aheadCars = room.players
        .filter(p => p.playerId !== car.playerId && p.position > car.position)
        .sort((a, b) => a.position - b.position);
      
      if (aheadCars.length > 0) {
        const target = aheadCars[0];
        target.speed = Math.max(1, target.speed - 1.5);
        target.effects.push({type: "emp", duration: 2});
        return `⚡ EMP đã tấn công ${target.name}!`;
      }
      return "⚡ EMP kích hoạt nhưng không tìm thấy mục tiêu phía trước!";
    }
  },
  {
    name: "trap",
    displayName: "🔥 Trap",
    description: "Đặt bẫy trên đường đua",
    cooldown: 3,
    handler: (car, room) => {
      room.obstacles.push({
        position: car.position + 2,
        type: "trap",
        placedBy: car.playerId
      });
      return "🔥 Đã đặt bẫy trên đường!";
    }
  },
  {
    name: "shield",
    displayName: "🛡️ Shield",
    description: "Bảo vệ xe khỏi hiệu ứng tiêu cực",
    cooldown: 4,
    handler: (car, room) => {
      car.effects.push({type: "shield", duration: 3});
      return "🛡️ Shield đã được kích hoạt trong 3 lượt!";
    }
  },
  {
    name: "nitro",
    displayName: "💨 Nitro",
    description: "Tăng tốc đột ngột và qua mặt xe khác",
    cooldown: 5,
    handler: (car, room) => {
      car.position += car.speed * 3;
      car.effects.push({type: "nitro", duration: 1});
      return "💨 Nitro kích hoạt! Tăng tốc đột ngột.";
    }
  }
];

// Độ khó bot
const BOT_DIFFICULTIES = {
  easy: {
    name: "Dễ",
    speedFactor: 0.7,
    skillChance: 0.1,
    smartLevel: 1,
    dodgeChance: 0.3,
    consistency: 0.5,
    description: "Bot di chuyển chậm và ít khi sử dụng kỹ năng."
  },
  normal: {
    name: "Thường",
    speedFactor: 0.9,
    skillChance: 0.2,
    smartLevel: 2,
    dodgeChance: 0.5,
    consistency: 0.7,
    description: "Bot có tốc độ và phản ứng trung bình."
  },
  hard: {
    name: "Khó",
    speedFactor: 1.1,
    skillChance: 0.3,
    smartLevel: 3,
    dodgeChance: 0.7,
    consistency: 0.85,
    description: "Bot chạy nhanh và thông minh, có chiến lược tốt."
  },
  expert: {
    name: "Chuyên gia",
    speedFactor: 1.3,
    skillChance: 0.4,
    smartLevel: 4,
    dodgeChance: 0.9,
    consistency: 0.95,
    description: "Bot có kỹ năng và phản ứng gần như hoàn hảo."
  }
};

// Loại thời tiết trong game
const WEATHER_TYPES = {
  clear: {
    name: "Quang đãng",
    description: "Thời tiết tốt, đường đua lý tưởng",
    icon: "☀️",
    effects: {
      speedFactor: 1.0,
      controlFactor: 1.0,
      visibility: 1.0
    }
  },
  rainy: {
    name: "Mưa",
    description: "Đường trơn trượt, khó kiểm soát",
    icon: "🌧️",
    effects: {
      speedFactor: 0.85,
      controlFactor: 0.7,
      visibility: 0.8
    }
  },
  foggy: {
    name: "Sương mù",
    description: "Tầm nhìn giảm, khó quan sát phía trước",
    icon: "🌫️",
    effects: {
      speedFactor: 0.9,
      controlFactor: 0.8,
      visibility: 0.6
    }
  },
  windy: {
    name: "Gió mạnh",
    description: "Xe dễ bị đẩy sang một bên",
    icon: "🌬️",
    effects: {
      speedFactor: 0.9,
      controlFactor: 0.75,
      visibility: 0.9
    }
  },
  stormy: {
    name: "Bão",
    description: "Gió mạnh và mưa lớn, cực kỳ nguy hiểm",
    icon: "⛈️",
    effects: {
      speedFactor: 0.7,
      controlFactor: 0.6,
      visibility: 0.5
    }
  },
  snowy: {
    name: "Tuyết rơi",
    description: "Đường trắng xóa, xe di chuyển chậm",
    icon: "❄️",
    effects: {
      speedFactor: 0.8,
      controlFactor: 0.65,
      visibility: 0.7
    }
  },
  night: {
    name: "Đêm tối",
    description: "Tầm nhìn giảm đáng kể",
    icon: "🌃",
    effects: {
      speedFactor: 0.9,
      controlFactor: 0.85,
      visibility: 0.65
    }
  },
  sunny: {
    name: "Nắng gắt",
    description: "Nhiệt độ cao, xe dễ quá nhiệt",
    icon: "🔆",
    effects: {
      speedFactor: 0.95,
      controlFactor: 0.9,
      visibility: 0.95
    }
  },
  sandstorm: {
    name: "Bão cát",
    description: "Cát bay mù mịt, rất khó điều khiển",
    icon: "🏜️",
    effects: {
      speedFactor: 0.75,
      controlFactor: 0.6,
      visibility: 0.4
    }
  }
};

// Phụ kiện xe
const CAR_CUSTOMIZATIONS = {
  colors: [
    { id: "red", name: "Đỏ Ferrari", value: "#FF0000", unlockLevel: 1 },
    { id: "blue", name: "Xanh Lamborghini", value: "#0000FF", unlockLevel: 2 },
    { id: "green", name: "Xanh lá McLaren", value: "#00FF00", unlockLevel: 3 },
    { id: "yellow", name: "Vàng Mustang", value: "#FFFF00", unlockLevel: 4 },
    { id: "purple", name: "Tím Bugatti", value: "#800080", unlockLevel: 5 },
    { id: "orange", name: "Cam Porsche", value: "#FFA500", unlockLevel: 8 },
    { id: "silver", name: "Bạc Aston Martin", value: "#C0C0C0", unlockLevel: 10 },
    { id: "gold", name: "Vàng kim", value: "#FFD700", unlockLevel: 15 },
    { id: "rainbow", name: "Cầu vồng", value: "rainbow", unlockLevel: 20 }
  ],
  decals: [
    { id: "none", name: "Không có", value: null, unlockLevel: 1, stats: {} },
    { id: "flames", name: "Ngọn lửa", value: "flames", unlockLevel: 3, stats: { acceleration: 0.1 } },
    { id: "stripes", name: "Sọc đua", value: "stripes", unlockLevel: 5, stats: { speed: 0.1 } },
    { id: "stars", name: "Ngôi sao", value: "stars", unlockLevel: 7, stats: { handling: 0.1 } },
    { id: "lightning", name: "Tia sét", value: "lightning", unlockLevel: 10, stats: { acceleration: 0.15, speed: 0.05 } },
    { id: "tribal", name: "Bộ lạc", value: "tribal", unlockLevel: 12, stats: { handling: 0.15, speed: 0.05 } },
    { id: "digital", name: "Kỹ thuật số", value: "digital", unlockLevel: 15, stats: { speed: 0.1, handling: 0.1 } },
    { id: "ultimate", name: "Tối thượng", value: "ultimate", unlockLevel: 20, stats: { speed: 0.15, acceleration: 0.1, handling: 0.1 } }
  ],
  wheels: [
    { id: "standard", name: "Tiêu chuẩn", value: "standard", unlockLevel: 1, stats: {} },
    { id: "sport", name: "Thể thao", value: "sport", unlockLevel: 4, stats: { handling: 0.1 } },
    { id: "racing", name: "Đua xe", value: "racing", unlockLevel: 8, stats: { speed: 0.05, handling: 0.1 } },
    { id: "offroad", name: "Địa hình", value: "offroad", unlockLevel: 10, stats: { handling: 0.2 } },
    { id: "slick", name: "Trơn láng", value: "slick", unlockLevel: 15, stats: { speed: 0.15, handling: 0.05 } },
    { id: "pro", name: "Chuyên nghiệp", value: "pro", unlockLevel: 20, stats: { speed: 0.1, handling: 0.2 } }
  ],
  spoilers: [
    { id: "none", name: "Không có", value: null, unlockLevel: 1, stats: {} },
    { id: "small", name: "Nhỏ", value: "small", unlockLevel: 6, stats: { handling: 0.1 } },
    { id: "medium", name: "Trung bình", value: "medium", unlockLevel: 12, stats: { handling: 0.15, speed: 0.05 } },
    { id: "large", name: "Lớn", value: "large", unlockLevel: 18, stats: { handling: 0.2, speed: 0.1 } },
    { id: "extreme", name: "Cực đoan", value: "extreme", unlockLevel: 22, stats: { handling: 0.25, speed: 0.15 } }
  ],
  nitros: [
    { id: "none", name: "Không có", value: null, unlockLevel: 1, stats: {} },
    { id: "basic", name: "Cơ bản", value: "basic", unlockLevel: 5, stats: { acceleration: 0.1 } },
    { id: "advanced", name: "Nâng cao", value: "advanced", unlockLevel: 10, stats: { acceleration: 0.2 } },
    { id: "pro", name: "Chuyên nghiệp", value: "pro", unlockLevel: 15, stats: { acceleration: 0.3 } },
    { id: "ultimate", name: "Tối thượng", value: "ultimate", unlockLevel: 25, stats: { acceleration: 0.5 } }
  ]
};

// Loại chướng ngại vật
const OBSTACLE_TYPES = {
  oil: {
    name: "Vũng dầu",
    icon: "🛢️",
    speedReduction: 0.5,
    duration: 2,
    avoidable: true,
    message: "bị trượt vào vũng dầu! Giảm tốc độ."
  },
  rock: {
    name: "Đá",
    icon: "🪨",
    damage: 10,
    speedReduction: 0.3,
    avoidable: true,
    message: "va phải tảng đá! Xe bị hỏng."
  },
  spike: {
    name: "Dải đinh",
    icon: "🔪",
    damage: 15,
    speedReduction: 0.4,
    duration: 2,
    avoidable: true,
    message: "đi qua dải đinh! Lốp xe bị thủng."
  },
  traffic: {
    name: "Xe cộ",
    icon: "🚌",
    damage: 20,
    speedReduction: 0.7,
    avoidable: true,
    message: "đâm vào xe trên đường! Xe bị hư hỏng nặng."
  },
  boost: {
    name: "Đệm tăng tốc",
    icon: "⚡",
    speedBoost: 1.5,
    positive: true,
    avoidable: false,
    message: "đi qua đệm tăng tốc! Tốc độ tăng tạm thời."
  },
  repair: {
    name: "Hộp sửa chữa",
    icon: "🧰",
    repair: 20,
    positive: true,
    avoidable: false,
    message: "nhặt được hộp sửa chữa! Xe được phục hồi."
  },
  trap: {
    name: "Bẫy",
    icon: "💣",
    damage: 15,
    speedReduction: 0.6,
    avoidable: true,
    message: "trúng bẫy! Xe bị hỏng và giảm tốc độ."
  }
};

// Xuất các hằng số
module.exports = {
  TRACK_LENGTH,
  LANE_HEIGHT,
  CELL_WIDTH,
  CANVAS_WIDTH,
  MAX_PLAYERS,
  SKILLS,
  BOT_DIFFICULTIES,
  WEATHER_TYPES,
  CAR_CUSTOMIZATIONS,
  OBSTACLE_TYPES
};