const { createCanvas } = require('canvas');
const { TRACK_LENGTH, LANE_HEIGHT, CANVAS_WIDTH, CELL_WIDTH, WEATHER_TYPES } = require('./constants');
const { drawRaceProgress, drawRaceMiniMap } = require('./visualEffects');

// Track themes with visual properties
const TRACK_THEMES = {
  city: {
    name: "Thành phố",
    bg: "#303841", // Dark gray
    lane: "#3A4750", // Lighter gray
    divider: "#FFFFFF", // White 
    objects: (ctx, y, posIndex) => {
      // Draw buildings
      if (posIndex % 5 === 0) {
        ctx.fillStyle = "#8D99AE";
        const height = 35 + Math.floor(Math.random() * 45); // Tăng chiều cao tòa nhà
        ctx.fillRect(posIndex * CELL_WIDTH, y - height, 26, height); // Tăng chiều rộng tòa nhà
        
        // Windows - cửa sổ to hơn
        ctx.fillStyle = "#F7E733";
        for (let i = 0; i < height - 8; i += 8) {
          ctx.fillRect(posIndex * CELL_WIDTH + 5, y - i - 6, 4, 4); // Cửa sổ to hơn
          ctx.fillRect(posIndex * CELL_WIDTH + 15, y - i - 6, 4, 4); // Cửa sổ to hơn
        }
      }
    }
  },
  
  desert: {
    name: "Sa mạc",
    bg: "#E0B165", // Sandy yellow
    lane: "#D2926B", // Dusty road
    divider: "#F0D78C", // Light sand
    objects: (ctx, y, posIndex) => {
      // Draw cacti - lớn hơn
      if (posIndex % 8 === 2) {
        ctx.fillStyle = "#688F4E";
        ctx.fillRect(posIndex * CELL_WIDTH, y - 18, 9, 18); // Cao và rộng hơn
        ctx.fillRect(posIndex * CELL_WIDTH - 3, y - 14, 5, 9); // Nhánh cây xương rồng lớn hơn
      }
      
      // Draw rocks - lớn hơn
      if (posIndex % 10 === 5) {
        ctx.fillStyle = "#9E7A49";
        ctx.beginPath();
        ctx.arc(posIndex * CELL_WIDTH + 5, y - 5, 6, 0, Math.PI * 2); // Đá to hơn
        ctx.fill();
      }
    }
  },
  
  mountain: {
    name: "Núi",
    bg: "#61764B", // Forest green
    lane: "#9BA17B", // Mountain road
    divider: "#CFB997", // Light gravel
    objects: (ctx, y, posIndex) => {
      // Draw mountains in background - lớn hơn
      if (posIndex % 15 === 0) {
        ctx.fillStyle = "#3C4932";
        ctx.beginPath();
        ctx.moveTo(posIndex * CELL_WIDTH - 18, y); // Rộng hơn
        ctx.lineTo(posIndex * CELL_WIDTH + 25, y - 40); // Cao hơn
        ctx.lineTo(posIndex * CELL_WIDTH + 50, y); // Rộng hơn
        ctx.fill();
        
        // Snow cap - lớn hơn
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.moveTo(posIndex * CELL_WIDTH + 18, y - 32);
        ctx.lineTo(posIndex * CELL_WIDTH + 25, y - 40);
        ctx.lineTo(posIndex * CELL_WIDTH + 32, y - 32);
        ctx.fill();
      }
      
      // Draw trees - lớn hơn
      if (posIndex % 7 === 3) {
        ctx.fillStyle = "#6E3B3B";
        ctx.fillRect(posIndex * CELL_WIDTH + 2, y - 18, 5, 18); // Thân cây cao và rộng hơn
        
        // Tree top - lớn hơn
        ctx.fillStyle = "#567D46";
        ctx.beginPath();
        ctx.arc(posIndex * CELL_WIDTH + 4, y - 22, 10, 0, Math.PI * 2); // Tán cây to hơn
        ctx.fill();
      }
    }
  },
  
  space: {
    name: "Không gian",
    bg: "#0F2027", // Dark space
    lane: "#203A43", // Space lane
    divider: "#2565AE", // Neon blue
    objects: (ctx, y, posIndex) => {
      // Draw stars - lớn hơn
      if (posIndex % 3 === 0) {
        ctx.fillStyle = "#FFFFFF";
        // Vẽ sao to hơn
        const starSize = Math.random() < 0.3 ? 2 : 1;
        ctx.fillRect(posIndex * CELL_WIDTH + Math.random() * 20, 
                    y - 45 + Math.random() * 45, starSize, starSize);
      }
      
      // Draw planets - lớn hơn
      if (posIndex % 30 === 15) {
        const planetColors = ["#FF5F6D", "#9C27B0", "#3F51B5", "#76C893"];
        const colorIndex = Math.floor(Math.random() * planetColors.length);
        
        ctx.fillStyle = planetColors[colorIndex];
        ctx.beginPath();
        // Hành tinh to hơn
        ctx.arc(posIndex * CELL_WIDTH + 10, y - 30, 9 + Math.random() * 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Planet rings - lớn hơn
        if (Math.random() > 0.5) {
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 2; // Đường vành đai dày hơn
          ctx.beginPath();
          // Vành đai rộng hơn
          ctx.ellipse(posIndex * CELL_WIDTH + 10, y - 30, 15, 5, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }
  },
  
  beach: {
    name: "Bãi biển",
    bg: "#FAEDCD", // Sand
    lane: "#E9EDC9", // Light sand
    divider: "#FFFFFF", // White
    objects: (ctx, y, posIndex) => {
      // Draw water - lớn hơn
      if (posIndex % 5 === 0) {
        ctx.fillStyle = "#457B9D";
        ctx.fillRect(posIndex * CELL_WIDTH - 8, y - 8, 50, 8); // Vùng nước rộng và sâu hơn
        
        // Waves - lớn hơn
        ctx.strokeStyle = "#A8DADC";
        ctx.lineWidth = 2; // Đường sóng dày hơn
        ctx.beginPath();
        ctx.moveTo(posIndex * CELL_WIDTH - 8, y - 5);
        ctx.quadraticCurveTo(posIndex * CELL_WIDTH + 10, y - 1, 
                            posIndex * CELL_WIDTH + 20, y - 5);
        ctx.stroke();
      }
      
      // Draw palm trees - lớn hơn
      if (posIndex % 17 === 8) {
        ctx.fillStyle = "#BC6C25";
        ctx.fillRect(posIndex * CELL_WIDTH, y - 28, 4, 28); // Thân cây cao và rộng hơn
        
        // Palm leaves - lớn hơn
        ctx.fillStyle = "#606C38";
        ctx.beginPath();
        ctx.moveTo(posIndex * CELL_WIDTH + 2, y - 28);
        ctx.lineTo(posIndex * CELL_WIDTH - 10, y - 38); // Lá cọ dài hơn
        ctx.lineTo(posIndex * CELL_WIDTH - 6, y - 33);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(posIndex * CELL_WIDTH + 2, y - 28);
        ctx.lineTo(posIndex * CELL_WIDTH + 14, y - 38); // Lá cọ dài hơn
        ctx.lineTo(posIndex * CELL_WIDTH + 10, y - 33);
        ctx.fill();
      }
    }
  },
  
  snow: {
    name: "Tuyết",
    bg: "#E5E5E5", // Snow white
    lane: "#D6D6D6", // Light gray snow
    divider: "#FFFFFF", // White
    objects: (ctx, y, posIndex) => {
      // Draw snowflakes - lớn hơn
      if (posIndex % 3 === 0) {
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(posIndex * CELL_WIDTH + Math.random() * 15, 
               y - 40 + Math.random() * 40, 2, 0, Math.PI * 2); // Bông tuyết to hơn
        ctx.fill();
      }
      
      // Draw evergreen trees - lớn hơn
      if (posIndex % 12 === 6) {
        ctx.fillStyle = "#2D3A3A";
        ctx.fillRect(posIndex * CELL_WIDTH + 5, y - 15, 5, 15); // Thân cây to hơn
        
        // Tree layers - lớn hơn
        ctx.fillStyle = "#5C946E";
        for (let i = 0; i < 3; i++) {
          const width = 18 - i * 4; // Tăng độ rộng tầng lá
          ctx.beginPath();
          ctx.moveTo(posIndex * CELL_WIDTH + 7.5, y - 18 - i * 9); // Tăng khoảng cách giữa các tầng
          ctx.lineTo(posIndex * CELL_WIDTH + 7.5 - width/2, y - 9 - i * 9);
          ctx.lineTo(posIndex * CELL_WIDTH + 7.5 + width/2, y - 9 - i * 9);
          ctx.fill();
        }
        
        // Snow on trees - lớn hơn
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(posIndex * CELL_WIDTH, y - 9, 15, 2); // Tuyết dày và rộng hơn
        ctx.fillRect(posIndex * CELL_WIDTH + 1, y - 18, 13, 2); // Tuyết dày và rộng hơn
        ctx.fillRect(posIndex * CELL_WIDTH + 3, y - 27, 9, 2); // Tuyết dày và rộng hơn
      }
    }
  }
};

// Draw car shape with visual effects
function drawCarShape(ctx, x, y, color, effects = [], customization = null) {
  const width = 35; // Tăng từ 20 lên 35
  const height = 18; // Tăng từ 10 lên 18
  
  // Apply special visual effects
  if (effects.some(e => e.type === "boost")) {
    // Boost flames 
    ctx.fillStyle = "#FF4500";
    ctx.beginPath();
    ctx.moveTo(x - 7, y + height/2);
    ctx.lineTo(x - 22, y);
    ctx.lineTo(x - 22, y + height);
    ctx.fill();
    
    // Boost particles
    for (let i = 0; i < 8; i++) { // Thêm nhiều hạt hơn
      ctx.fillStyle = `rgba(255, ${Math.floor(Math.random() * 100)}, 0, ${Math.random() * 0.8 + 0.2})`;
      ctx.beginPath();
      const particleX = x - 7 - Math.random() * 20; // Kéo dài hơn
      const particleY = y + Math.random() * height;
      const particleSize = Math.random() * 5 + 2; // Lớn hơn
      ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Base car shape
  ctx.fillStyle = color;
  
  // Body
  ctx.fillRect(x, y, width, height);
  
  // Apply decal if available
  if (customization && customization.decal && customization.decal.id !== 'none') {
    const decalColor = customization.decal.color || "#FFFFFF";
    ctx.fillStyle = decalColor;
    
    if (customization.decal.id === 'racing_stripe') {
      // Racing stripe down the middle
      ctx.fillRect(x + width/2 - 2, y, 4, height);
    } else if (customization.decal.id === 'flames') {
      // Flame decal on sides
      ctx.beginPath();
      ctx.moveTo(x + 2, y + height - 2);
      ctx.lineTo(x + 5, y + 2);
      ctx.lineTo(x + 8, y + height - 2);
      ctx.fill();
    } else if (customization.decal.id === 'lightning') {
      // Lightning bolt
      ctx.beginPath();
      ctx.moveTo(x + width/2, y);
      ctx.lineTo(x + width/2 - 3, y + height/2);
      ctx.lineTo(x + width/2, y + height/2);
      ctx.lineTo(x + width/2 - 3, y + height);
      ctx.fill();
    }
  }
  
  // Front windshield
  ctx.fillStyle = "#87CEEB";
  ctx.fillRect(x + width - 12, y + 3, 9, height - 7);
  
  // Wheels
  const wheelColor = (customization && customization.wheels) 
    ? customization.wheels.color || "#000000" : "#000000";
  
  ctx.fillStyle = wheelColor;
  ctx.fillRect(x + 5, y - 3, 7, 3); // Front left wheel
  ctx.fillRect(x + width - 12, y - 3, 7, 3); // Front right wheel
  ctx.fillRect(x + 5, y + height, 7, 3); // Rear left wheel
  ctx.fillRect(x + width - 12, y + height, 7, 3); // Rear right wheel
  
  // Booster if equipped
  if (customization && customization.booster && customization.booster.id !== 'none') {
    ctx.fillStyle = "#555555";
    ctx.fillRect(x - 3, y + height/2 - 2, 3, 4);
    
    if (effects.some(e => e.type === "boost")) {
      ctx.fillStyle = "#00FFFF";
    } else {
      ctx.fillStyle = "#999999";
    }
    ctx.beginPath();
    ctx.arc(x - 2, y + height/2, 1, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Shield effect
  if (effects.some(e => e.type === "shield")) {
    ctx.strokeStyle = "#00FFFF";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + width/2, y + height/2, width/2 + 5, 0, Math.PI * 2);
    ctx.stroke();
    
    // Shield glow
    const gradient = ctx.createRadialGradient(
      x + width/2, y + height/2, width/2,
      x + width/2, y + height/2, width/2 + 5
    );
    gradient.addColorStop(0, "rgba(0, 255, 255, 0.3)");
    gradient.addColorStop(1, "rgba(0, 255, 255, 0)");
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x + width/2, y + height/2, width/2 + 5, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // EMP/Jump effect
  if (effects.some(e => e.type === "emp")) {
    // Electric zaps
    ctx.strokeStyle = "#FFFF00";
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(x + width/2, y + height/2);
      const angle = Math.random() * Math.PI * 2;
      const distance = 15 + Math.random() * 10;
      ctx.lineTo(
        x + width/2 + Math.cos(angle) * distance,
        y + height/2 + Math.sin(angle) * distance
      );
      ctx.stroke();
    }
  } else if (effects.some(e => e.type === "jump")) {
    // Jump shadow/effect
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.beginPath();
    ctx.ellipse(x + width/2, y + height + 5, width/2, height/4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Up arrow indicator
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.moveTo(x + width/2, y - 5);
    ctx.lineTo(x + width/2 - 3, y);
    ctx.lineTo(x + width/2 + 3, y);
    ctx.fill();
  }
}

function drawObstacle(ctx, x, y, type) {
  switch (type) {
    case "oil":
      // Oil spill
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.beginPath();
      ctx.ellipse(x, y, 17, 8, 0, 0, Math.PI * 2); // Tăng kích thước
      ctx.fill();
      
      // Oil shine
      ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
      ctx.beginPath();
      ctx.ellipse(x - 3, y - 2, 4, 2, 0, 0, Math.PI * 2); // Tăng kích thước
      ctx.fill();
      break;
      
    case "rock":
      // Rock
      ctx.fillStyle = "#888888";
      ctx.beginPath();
      ctx.moveTo(x - 9, y + 9); // Tăng kích thước
      ctx.lineTo(x, y - 9);   // Tăng kích thước
      ctx.lineTo(x + 9, y + 9); // Tăng kích thước
      ctx.fill();
      
      // Rock details
      ctx.strokeStyle = "#666666";
      ctx.lineWidth = 2; // Đường kẻ dày hơn
      ctx.beginPath();
      ctx.moveTo(x - 4, y);
      ctx.lineTo(x + 4, y + 5);
      ctx.stroke();
      break;
      
    case "trap":
      // Spike trap
      ctx.fillStyle = "#444444";
      ctx.fillRect(x - 14, y - 2, 28, 4); // Tăng kích thước
      
      // Spikes
      for (let i = -10; i <= 10; i += 5) { // Tăng khoảng cách và phạm vi
        ctx.beginPath();
        ctx.moveTo(x + i, y - 2);
        ctx.lineTo(x + i, y - 8); // Spike cao hơn
        ctx.lineTo(x + i + 2, y - 2);
        ctx.fill();
      }
      break;
      
    case "crate":
      // Wooden crate
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(x - 9, y - 9, 18, 18); // Tăng kích thước
      
      // Crate details
      ctx.strokeStyle = "#5D2906";
      ctx.lineWidth = 2; // Đường kẻ dày hơn
      ctx.strokeRect(x - 9, y - 9, 18, 18);
      ctx.beginPath();
      ctx.moveTo(x - 9, y);
      ctx.lineTo(x + 9, y);
      ctx.moveTo(x, y - 9);
      ctx.lineTo(x, y + 9);
      ctx.stroke();
      break;
  }
}

// Generate the main race canvas
function generateRaceCanvas(room) {
  // Create canvas
  const canvas = createCanvas(CANVAS_WIDTH, 60 + (LANE_HEIGHT * room.players.length) + 140);
  const ctx = canvas.getContext('2d');
  
  // Get track theme
  const trackTheme = TRACK_THEMES[room.options?.trackType || 'city'] || TRACK_THEMES.city;
  
  // Calculate track area height
  const trackHeight = LANE_HEIGHT * room.players.length;
  
  // Background gradient based on track theme
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, trackTheme.bg);
  gradient.addColorStop(1, adjustColor(trackTheme.bg, -30)); // Darker at bottom
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add header with race info
  drawRaceHeader(ctx, room);
  
  // Draw track
  const trackY = 60; // Start of track area (below header)
  
  // Draw each lane
  for (let i = 0; i < room.players.length; i++) {
    const laneY = trackY + (i * LANE_HEIGHT);
    
    // Lane background
    ctx.fillStyle = trackTheme.lane;
    ctx.fillRect(0, laneY, canvas.width, LANE_HEIGHT);
    
    // Lane divider
    ctx.strokeStyle = trackTheme.divider;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(0, laneY + LANE_HEIGHT);
    ctx.lineTo(canvas.width, laneY + LANE_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw position markers - to hơn
    for (let j = 0; j <= 10; j++) {
      const markerX = (canvas.width / 10) * j;
      
      // Position marker - phông chữ lớn hơn
      ctx.fillStyle = "#FFFFFF"; 
      ctx.font = "14px Arial"; // Tăng cỡ chữ từ 10 lên 14
      ctx.textAlign = "center";
      ctx.fillText((j * 10) + "", markerX, laneY + 16); // Điều chỉnh vị trí y
    }
    
    // Draw background objects
    for (let pos = 0; pos < TRACK_LENGTH; pos += 5) {
      if (trackTheme.objects) {
        const screenX = (pos / TRACK_LENGTH) * canvas.width;
        trackTheme.objects(ctx, laneY, pos);
      }
    }
    
    // Draw finish line
    if (i === 0) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(canvas.width - 5, trackY, 5, trackHeight);
      
      // Checkered pattern
      for (let j = 0; j < trackHeight; j += 10) {
        if (j % 20 === 0) {
          ctx.fillStyle = "#000000";
          ctx.fillRect(canvas.width - 5, trackY + j, 5, 10);
        }
      }
    }
  }
  
  // Apply weather effects
  if (room.currentWeather && room.currentWeather !== 'clear') {
    applyWeatherEffects(ctx, canvas.width, canvas.height, room.currentWeather);
  }
  
  // Draw obstacles
  for (const obstacle of room.obstacles) {
    const obstacleX = (obstacle.position / TRACK_LENGTH) * canvas.width;
    const laneY = trackY + (obstacle.lane * LANE_HEIGHT) + (LANE_HEIGHT / 2);
    
    drawObstacle(ctx, obstacleX, laneY, obstacle.type);
  }
  
  // Draw cars
  for (const player of room.players) {
    const playerIndex = room.players.indexOf(player);
    const laneY = trackY + (playerIndex * LANE_HEIGHT) + (LANE_HEIGHT / 2);
    const carX = (player.position / TRACK_LENGTH) * canvas.width;
    
    // Draw car with effects
    drawCarShape(ctx, carX, laneY - 5, player.color, player.effects, player.customization);
    
    // Draw player name and stats - phông chữ lớn hơn
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 16px Arial"; // Tăng kích thước từ 12 lên 16
    ctx.textAlign = "left";
    
    const playerName = player.isBot ? `🤖 ${player.name}` : player.name;
    ctx.fillText(playerName, 10, laneY - 12); // Điều chỉnh vị trí cho phù hợp
    
    // Speed indicator - phông chữ lớn hơn
    ctx.font = "14px Arial"; // Tăng kích thước từ 10 lên 14
    ctx.fillText(`⚡ ${player.speed.toFixed(1)}`, 10, laneY + 18); // Điều chỉnh vị trí
    
    // Skill status - phông chữ lớn hơn
    const skillReady = player.skill.cooldownRemaining === 0;
    ctx.fillStyle = skillReady ? "#00FF00" : "#FF0000";
    ctx.fillText(`💪 ${player.skill.displayName}${skillReady ? ' ✓' : ` (${player.skill.cooldownRemaining})`}`, 80, laneY + 18); // Điều chỉnh vị trí
    
    // Rank indicator
    const rank = room.getPlayerRank(player.playerId);
    drawRankIndicator(ctx, canvas.width - 30, laneY - 10, rank);
    
    // Lap indicator for multi-lap races
    if (room.options.laps > 1) {
      const completedLaps = room.lapProgress[playerIndex] || 0;
      ctx.fillStyle = "#FFCC00";
      ctx.fillText(`Lap: ${completedLaps + 1}/${room.options.laps}`, canvas.width - 80, laneY + 15);
    }
  }
  
  // Draw race progress minimap
  drawRaceProgress(ctx, room, 50, trackY + trackHeight + 20, canvas.width - 100, 20);
  
  // Draw detailed minimap
  drawRaceMiniMap(ctx, room, 50, trackY + trackHeight + 50, canvas.width - 100, 80);
  
  // Draw leaderboard
  drawLeaderboard(ctx, room);
  
  return canvas;
}

// Apply weather visual effects to canvas
function applyWeatherEffects(ctx, width, height, weather) {
  switch (weather) {
    case "rainy":
      // Rain effect
      ctx.fillStyle = "rgba(120, 160, 255, 0.2)";
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const length = 10 + Math.random() * 10;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 1, y + length);
        ctx.stroke();
      }
      
      // Darker overlay
      ctx.fillStyle = "rgba(0, 0, 50, 0.1)";
      ctx.fillRect(0, 0, width, height);
      break;
      
    case "foggy":
      // Fog overlay
      const fogGradient = ctx.createLinearGradient(0, 0, 0, height);
      fogGradient.addColorStop(0, "rgba(200, 200, 200, 0.5)");
      fogGradient.addColorStop(0.5, "rgba(200, 200, 200, 0.3)");
      fogGradient.addColorStop(1, "rgba(200, 200, 200, 0.5)");
      
      ctx.fillStyle = fogGradient;
      ctx.fillRect(0, 0, width, height);
      break;
      
    case "sandstorm":
      // Sand particles
      ctx.fillStyle = "rgba(210, 180, 140, 0.3)";
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 2;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Sand overlay
      ctx.fillStyle = "rgba(210, 180, 140, 0.2)";
      ctx.fillRect(0, 0, width, height);
      break;
      
    case "snowy":
      // Snowflakes
      ctx.fillStyle = "#FFFFFF";
      for (let i = 0; i < 150; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = 1 + Math.random() * 2;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Snow overlay
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(0, 0, width, height);
      break;
      
    case "sunny":
      // Sun lens flare
      const flareGradient = ctx.createRadialGradient(
        width * 0.8, height * 0.2, 5,
        width * 0.8, height * 0.2, 50
      );
      flareGradient.addColorStop(0, "rgba(255, 255, 200, 0.8)");
      flareGradient.addColorStop(1, "rgba(255, 200, 50, 0)");
      
      ctx.fillStyle = flareGradient;
      ctx.beginPath();
      ctx.arc(width * 0.8, height * 0.2, 50, 0, Math.PI * 2);
      ctx.fill();
      
      // Brightness overlay
      ctx.fillStyle = "rgba(255, 255, 200, 0.05)";
      ctx.fillRect(0, 0, width, height);
      break;
      
    case "night":
      // Dark overlay
      ctx.fillStyle = "rgba(0, 0, 50, 0.3)";
      ctx.fillRect(0, 0, width, height);
      
      // Stars
      ctx.fillStyle = "#FFFFFF";
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * width;
        const y = Math.random() * (height * 0.4); // Stars only in upper part
        const size = Math.random() * 1.5;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Moon
      ctx.fillStyle = "rgba(220, 220, 255, 0.8)";
      ctx.beginPath();
      ctx.arc(width * 0.1, height * 0.15, 15, 0, Math.PI * 2);
      ctx.fill();
      break;
  }
}

// Draw race header with information
function drawRaceHeader(ctx, room) {
  // Header background
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, ctx.canvas.width, 50);
  
  // Race title
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`${TRACK_THEMES[room.options?.trackType || 'city'].name} Race`, ctx.canvas.width / 2, 20);
  
  // Weather info
  const weather = WEATHER_TYPES[room.currentWeather];
  if (weather) {
    ctx.font = "12px Arial";
    ctx.fillText(`${weather.icon} ${weather.name}: ${weather.description}`, ctx.canvas.width / 2, 40);
  }
  
  // Turn counter
  ctx.textAlign = "left";
  ctx.font = "12px Arial";
  ctx.fillText(`Lượt: ${room.turn}`, 10, 20);
  
  // Lap info for multi-lap races
  if (room.options.laps > 1) {
    ctx.fillText(`Vòng đua: ${room.options.laps}`, 10, 40);
  }
  
  // Race time
  const minutes = Math.floor(room.turn / 60);
  const seconds = room.turn % 60;
  ctx.textAlign = "right";
  ctx.fillText(`Thời gian: ${minutes}:${seconds.toString().padStart(2, '0')}`, ctx.canvas.width - 10, 20);
  
  // Player count
  ctx.fillText(`Người chơi: ${room.players.length}/${room.maxPlayers}`, ctx.canvas.width - 10, 40);
}

// Draw leaderboard
function drawLeaderboard(ctx, room) {
  const leaderboardX = 10;
  const leaderboardY = ctx.canvas.height - 90;
  const leaderboardWidth = 150;
  const leaderboardHeight = 80;
  
  // Background
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(leaderboardX, leaderboardY, leaderboardWidth, leaderboardHeight);
  
  // Border
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 1;
  ctx.strokeRect(leaderboardX, leaderboardY, leaderboardWidth, leaderboardHeight);
  
  // Title
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 12px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Bảng xếp hạng", leaderboardX + leaderboardWidth / 2, leaderboardY + 15);
  
  // Sort players by position
  const sortedPlayers = [...room.players].sort((a, b) => {
    // First by lap progress for multi-lap races
    if (room.options.laps > 1) {
      const aLap = room.lapProgress[room.players.indexOf(a)] || 0;
      const bLap = room.lapProgress[room.players.indexOf(b)] || 0;
      if (aLap !== bLap) return bLap - aLap;
    }
    // Then by position
    return b.position - a.position;
  });
  
  // List top 5 players
  ctx.textAlign = "left";
  ctx.font = "10px Arial";
  
  const topPlayers = sortedPlayers.slice(0, 5);
  for (let i = 0; i < topPlayers.length; i++) {
    const player = topPlayers[i];
    
    // Position and name
    ctx.fillStyle = i === 0 ? "#FFD700" : // Gold
                  i === 1 ? "#C0C0C0" : // Silver
                  i === 2 ? "#CD7F32" : // Bronze
                  "#FFFFFF";  // White
    
    const botIcon = player.isBot ? "🤖 " : "";
    const playerName = `${i + 1}. ${botIcon}${player.name.substring(0, 10)}`;
    ctx.fillText(playerName, leaderboardX + 10, leaderboardY + 35 + (i * 12));
    
    // Speed
    ctx.fillStyle = "#80D8FF";
    ctx.fillText(`${player.speed.toFixed(1)}`, leaderboardX + 120, leaderboardY + 35 + (i * 12));
  }
  
  // Player count if more than 5
  if (room.players.length > 5) {
    ctx.fillStyle = "#AAAAAA";
    ctx.textAlign = "center";
    ctx.fillText(`+ ${room.players.length - 5} người chơi khác`, 
                 leaderboardX + leaderboardWidth / 2, leaderboardY + 75);
  }
}

// Draw rank indicator
function drawRankIndicator(ctx, x, y, rank) {
  const colors = {
    1: "#FFD700", // Gold
    2: "#C0C0C0", // Silver
    3: "#CD7F32", // Bronze
    default: "#FFFFFF" // White
  };
  
  const color = colors[rank] || colors.default;
  const rankText = rank.toString();
  
  // Background circle
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fill();
  
  // Text
  ctx.fillStyle = "#000000";
  ctx.font = "bold 12px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(rankText, x, y);
  ctx.textBaseline = "alphabetic"; // Reset
}

// Generate race results summary canvas
function generateRaceResultsCanvas(raceStats) {
  // Create canvas
  const canvas = createCanvas(600, 400);
  const ctx = canvas.getContext('2d');
  
  // Background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#1A2980");
  gradient.addColorStop(1, "#26D0CE");
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Title
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.fillText("KẾT QUẢ CUỘC ĐUA", canvas.width / 2, 40);
  
  // Track info
  const trackName = TRACK_THEMES[raceStats.trackType]?.name || raceStats.trackType;
  const weatherName = WEATHER_TYPES[raceStats.weather]?.name || raceStats.weather;
  const weatherIcon = WEATHER_TYPES[raceStats.weather]?.icon || "";
  
  ctx.font = "14px Arial";
  ctx.fillText(`Đường đua: ${trackName} | ${weatherIcon} ${weatherName} | ${raceStats.laps} vòng đua`, canvas.width / 2, 70);
  
  // Race duration
  const minutes = Math.floor(raceStats.totalTurns / 60);
  const seconds = raceStats.totalTurns % 60;
  ctx.fillText(`Thời gian: ${minutes}:${seconds.toString().padStart(2, '0')} (${raceStats.totalTurns} lượt)`, canvas.width / 2, 90);
  
  // Fastest lap
  if (raceStats.fastestLap) {
    ctx.fillStyle = "#FFFF00";
    ctx.fillText(`🏎️ Vòng đua nhanh nhất: ${raceStats.fastestLap.player} - ${raceStats.fastestLap.time} lượt`, canvas.width / 2, 110);
  }
  
  // Results table
  const tableTop = 140;
  const rowHeight = 30;
  const colWidths = [40, 220, 90, 90, 70, 90]; // Rank, Name, Avg Speed, Max Speed, Overtakes, Result
  
  // Table headers
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 12px Arial";
  ctx.textAlign = "left";
  
  let xPos = 10;
  ctx.fillText("Hạng", xPos, tableTop);
  xPos += colWidths[0];
  
  ctx.fillText("Tay đua", xPos, tableTop);
  xPos += colWidths[1];
  
  ctx.fillText("Tốc độ TB", xPos, tableTop);
  xPos += colWidths[2];
  
  ctx.fillText("Tốc độ cao", xPos, tableTop);
  xPos += colWidths[3];
  
  ctx.fillText("Vượt", xPos, tableTop);
  xPos += colWidths[4];
  
  ctx.fillText("Kết quả", xPos, tableTop);
  
  // Draw horizontal line
  ctx.strokeStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.moveTo(10, tableTop + 10);
  ctx.lineTo(canvas.width - 10, tableTop + 10);
  ctx.stroke();
  
  // Draw player data
  ctx.font = "12px Arial";
  
  for (let i = 0; i < raceStats.players.length; i++) {
    const player = raceStats.players[i];
    const rowY = tableTop + 25 + (i * rowHeight);
    
    // Highlight winner
    if (i === 0) {
      // Winner highlight
      ctx.fillStyle = "rgba(255, 215, 0, 0.3)";
      ctx.fillRect(10, rowY - 15, canvas.width - 20, rowHeight);
    }
    
    // Rank with medal
    xPos = 10;
    ctx.fillStyle = "#FFFFFF";
    
    const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "";
    ctx.fillText(`${medal}${player.rank}`, xPos, rowY);
    xPos += colWidths[0];
    
    // Player name
    const botIcon = player.isBot ? "🤖 " : "";
    ctx.fillText(`${botIcon}${player.name}`, xPos, rowY);
    xPos += colWidths[1];
    
    // Average speed
    ctx.fillText(`⚡ ${player.averageSpeed}`, xPos, rowY);
    xPos += colWidths[2];
    
    // Max speed
    ctx.fillText(`🔥 ${player.highestSpeed}`, xPos, rowY);
    xPos += colWidths[3];
    
    // Overtakes
    ctx.fillText(`↗️ ${player.overtakes}`, xPos, rowY);
    xPos += colWidths[4];
    
    // Result (complete/incomplete)
    if (player.raceCompleted) {
      ctx.fillStyle = "#00FF00";
      ctx.fillText("Hoàn thành", xPos, rowY);
    } else {
      ctx.fillStyle = "#FF6666";
      ctx.fillText("Chưa hoàn thành", xPos, rowY);
    }
  }
  
  return canvas;
}

// Helper function to adjust color brightness
function adjustColor(hexColor, percent) {
  // Remove # if present
  hexColor = hexColor.replace("#", "");
  
  // Convert to RGB
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);
  
  // Adjust brightness
  const adjustR = Math.max(0, Math.min(255, r + percent));
  const adjustG = Math.max(0, Math.min(255, g + percent));
  const adjustB = Math.max(0, Math.min(255, b + percent));
  
  // Convert back to hex
  return `#${adjustR.toString(16).padStart(2, '0')}${adjustG.toString(16).padStart(2, '0')}${adjustB.toString(16).padStart(2, '0')}`;
}

module.exports = {
  TRACK_THEMES,
  drawCarShape,
  drawObstacle,
  generateRaceCanvas,
  applyWeatherEffects,
  drawRaceHeader,
  drawLeaderboard,
  drawRankIndicator,
  generateRaceResultsCanvas,
  adjustColor
};