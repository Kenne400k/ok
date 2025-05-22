/**
 * Quản lý cơ sở dữ liệu SQLite cho trò chơi đua xe PCAR
 */
const fs = require('fs');
const path = require('path');
const sqlite3 = require('better-sqlite3');

// Đường dẫn đến file database
const DB_PATH = path.join(__dirname, '../../data/pcar.db');

// Đảm bảo thư mục data tồn tại
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Kết nối tới database
let db;
try {
    db = sqlite3(DB_PATH);
} catch (err) {
    console.error('Lỗi kết nối SQLite:', err.message);
    throw err;
}

// Khởi tạo các bảng cần thiết nếu chưa tồn tại
function initDatabase() {
    // Bảng người chơi
    db.exec(`
    CREATE TABLE IF NOT EXISTS players (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        xp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        season_points INTEGER DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Bảng thành tích đua xe
    db.exec(`
    CREATE TABLE IF NOT EXISTS race_stats (
        player_id TEXT PRIMARY KEY,
        wins INTEGER DEFAULT 0,
        races INTEGER DEFAULT 0,
        best_time INTEGER,
        FOREIGN KEY (player_id) REFERENCES players(id)
    )`);

    // Bảng thành tựu
    db.exec(`
    CREATE TABLE IF NOT EXISTS achievements (
        player_id TEXT,
        achievement_id TEXT,
        earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (player_id, achievement_id),
        FOREIGN KEY (player_id) REFERENCES players(id)
    )`);

    // Bảng tùy chỉnh xe
    db.exec(`
    CREATE TABLE IF NOT EXISTS car_customizations (
        player_id TEXT PRIMARY KEY,
        color TEXT,
        decal TEXT,
        wheels TEXT,
        spoiler TEXT,
        nitro TEXT,
        FOREIGN KEY (player_id) REFERENCES players(id)
    )`);

    // Bảng vật phẩm đã mở khóa
    db.exec(`
    CREATE TABLE IF NOT EXISTS unlocked_items (
        player_id TEXT,
        item_type TEXT,
        item_id TEXT,
        unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (player_id, item_type, item_id),
        FOREIGN KEY (player_id) REFERENCES players(id)
    )`);

}

// Lưu hoặc cập nhật thông tin người chơi
function savePlayer(playerId, playerData) {
    try {
        const stmt = db.prepare(`
        INSERT INTO players (id, name, xp, level, season_points, last_updated)
        VALUES (@id, @name, @xp, @level, @seasonPoints, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
            name = @name,
            xp = @xp,
            level = @level,
            season_points = @seasonPoints,
            last_updated = CURRENT_TIMESTAMP
        `);

        stmt.run({
            id: playerId,
            name: playerData.name || 'Unknown',
            xp: playerData.xp || 0,
            level: playerData.level || 1,
            seasonPoints: playerData.seasonPoints || 0
        });

        // Lưu tùy chỉnh xe nếu có
        if (playerData.car) {
            const carStmt = db.prepare(`
            INSERT INTO car_customizations (player_id, color, decal, wheels, spoiler, nitro)
            VALUES (@playerId, @color, @decal, @wheels, @spoiler, @nitro)
            ON CONFLICT(player_id) DO UPDATE SET
                color = @color,
                decal = @decal,
                wheels = @wheels,
                spoiler = @spoiler,
                nitro = @nitro
            `);

            carStmt.run({
                playerId: playerId,
                color: playerData.car.color || null,
                decal: playerData.car.decal?.id || null,
                wheels: playerData.car.wheels?.id || null,
                spoiler: playerData.car.spoiler?.id || null,
                nitro: playerData.car.nitro?.id || null
            });
        }

        return true;
    } catch (error) {
        console.error('Lỗi khi lưu người chơi:', error);
        return false;
    }
}

// Lưu thống kê đua xe
function saveRaceStats(playerId, statsData) {
    try {
        const stmt = db.prepare(`
        INSERT INTO race_stats (player_id, wins, races, best_time)
        VALUES (@playerId, @wins, @races, @bestTime)
        ON CONFLICT(player_id) DO UPDATE SET
            wins = @wins,
            races = @races,
            best_time = @bestTime
        `);

        stmt.run({
            playerId: playerId,
            wins: statsData.wins || 0,
            races: statsData.races || 0,
            bestTime: statsData.bestTime || null
        });

        return true;
    } catch (error) {
        console.error('Lỗi khi lưu thống kê đua xe:', error);
        return false;
    }
}

// Thêm thành tựu mới
function addAchievement(playerId, achievementId) {
    try {
        const stmt = db.prepare(`
        INSERT INTO achievements (player_id, achievement_id)
        VALUES (?, ?)
        ON CONFLICT(player_id, achievement_id) DO NOTHING
        `);

        stmt.run(playerId, achievementId);
        return true;
    } catch (error) {
        console.error('Lỗi khi thêm thành tựu:', error);
        return false;
    }
}

// Lấy tất cả thành tựu của người chơi
function getPlayerAchievements(playerId) {
    try {
        const stmt = db.prepare(`
        SELECT achievement_id FROM achievements
        WHERE player_id = ?
        `);

        return stmt.all(playerId).map(row => row.achievement_id);
    } catch (error) {
        console.error('Lỗi khi lấy thành tựu:', error);
        return [];
    }
}

// Thêm vật phẩm đã mở khóa
function addUnlockedItem(playerId, itemType, itemId) {
    try {
        const stmt = db.prepare(`
        INSERT INTO unlocked_items (player_id, item_type, item_id)
        VALUES (?, ?, ?)
        ON CONFLICT(player_id, item_type, item_id) DO NOTHING
        `);

        stmt.run(playerId, itemType, itemId);
        return true;
    } catch (error) {
        console.error('Lỗi khi thêm vật phẩm mở khóa:', error);
        return false;
    }
}

// Lấy tất cả vật phẩm đã mở khóa của người chơi
function getUnlockedItems(playerId) {
    try {
        const stmt = db.prepare(`
        SELECT item_type, item_id FROM unlocked_items
        WHERE player_id = ?
        `);

        return stmt.all(playerId);
    } catch (error) {
        console.error('Lỗi khi lấy vật phẩm mở khóa:', error);
        return [];
    }
}

// Lấy thông tin cơ bản của người chơi
function getPlayer(playerId) {
    try {
        const stmt = db.prepare(`
        SELECT * FROM players
        WHERE id = ?
        `);

        return stmt.get(playerId);
    } catch (error) {
        console.error('Lỗi khi lấy thông tin người chơi:', error);
        return null;
    }
}

// Lấy thống kê đua xe của người chơi
function getRaceStats(playerId) {
    try {
        const stmt = db.prepare(`
        SELECT * FROM race_stats
        WHERE player_id = ?
        `);

        return stmt.get(playerId);
    } catch (error) {
        console.error('Lỗi khi lấy thống kê đua xe:', error);
        return null;
    }
}

// Lấy tùy chỉnh xe của người chơi
function getCarCustomization(playerId) {
    try {
        const stmt = db.prepare(`
        SELECT * FROM car_customizations
        WHERE player_id = ?
        `);

        return stmt.get(playerId);
    } catch (error) {
        console.error('Lỗi khi lấy tùy chỉnh xe:', error);
        return null;
    }
}

// Lấy bảng xếp hạng theo số trận thắng
function getWinLeaderboard(limit = 10) {
    try {
        const stmt = db.prepare(`
        SELECT p.id, p.name, rs.wins, rs.races
        FROM players p
        JOIN race_stats rs ON p.id = rs.player_id
        ORDER BY rs.wins DESC, rs.races ASC
        LIMIT ?
        `);

        return stmt.all(limit);
    } catch (error) {
        console.error('Lỗi khi lấy bảng xếp hạng thắng:', error);
        return [];
    }
}

// Lấy bảng xếp hạng theo điểm mùa giải
function getSeasonLeaderboard(limit = 10) {
    try {
        const stmt = db.prepare(`
        SELECT id, name, season_points, level
        FROM players
        ORDER BY season_points DESC, level DESC
        LIMIT ?
        `);

        return stmt.all(limit);
    } catch (error) {
        console.error('Lỗi khi lấy bảng xếp hạng mùa giải:', error);
        return [];
    }
}

// Lưu toàn bộ dữ liệu từ Map vào database
function saveAllPlayerData(progressionMap, statsMap) {
    const savePlayerTransaction = db.transaction((progressionMap, statsMap) => {
        for (const [playerId, progression] of progressionMap.entries()) {
            savePlayer(playerId, progression);
            
            // Lưu thành tựu
            if (progression.achievements) {
                for (const achievementId of progression.achievements) {
                    addAchievement(playerId, achievementId);
                }
            }
            
            // Lưu vật phẩm đã mở khóa
            if (progression.unlockedItems) {
                for (const item of progression.unlockedItems) {
                    addUnlockedItem(playerId, item.type, item.id);
                }
            }
        }
        
        // Lưu thống kê đua xe
        for (const [playerId, stats] of statsMap.entries()) {
            saveRaceStats(playerId, stats);
        }
    });
    
    try {
        savePlayerTransaction(progressionMap, statsMap);
        console.log('Đã lưu toàn bộ dữ liệu người chơi vào database');
        return true;
    } catch (error) {
        console.error('Lỗi khi lưu dữ liệu người chơi:', error);
        return false;
    }
}

// Tải toàn bộ dữ liệu từ database
function loadAllPlayerData() {
    try {
        // Tải thông tin người chơi
        const players = db.prepare('SELECT * FROM players').all();
        const progression = new Map();
        const stats = new Map();
        
        for (const player of players) {
            const playerId = player.id;
            
            // Tải thành tựu
            const achievements = getPlayerAchievements(playerId);
            
            // Tải vật phẩm đã mở khóa
            const unlockedItems = getUnlockedItems(playerId);
            
            // Tải tùy chỉnh xe
            const car = getCarCustomization(playerId);
            
            // Tạo đối tượng tiến trình
            progression.set(playerId, {
                name: player.name,
                xp: player.xp,
                level: player.level,
                seasonPoints: player.season_points,
                achievements: achievements,
                unlockedItems: unlockedItems,
                car: car ? {
                    color: car.color,
                    decal: car.decal ? { id: car.decal } : undefined,
                    wheels: car.wheels ? { id: car.wheels } : undefined,
                    spoiler: car.spoiler ? { id: car.spoiler } : undefined,
                    nitro: car.nitro ? { id: car.nitro } : undefined
                } : undefined,
                stats: { wins: 0, races: 0, bestTime: null }
            });
            
            // Tải thống kê đua xe
            const raceStats = getRaceStats(playerId);
            if (raceStats) {
                stats.set(playerId, {
                    name: player.name,
                    wins: raceStats.wins,
                    races: raceStats.races,
                    bestTime: raceStats.best_time
                });
                
                // Cập nhật thông tin thống kê vào đối tượng tiến trình
                progression.get(playerId).stats = {
                    wins: raceStats.wins,
                    races: raceStats.races,
                    bestTime: raceStats.best_time
                };
            }
        }
        
        return { progression, stats };
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu người chơi:', error);
        return { progression: new Map(), stats: new Map() };
    }
}

// Khởi tạo database khi module được import
initDatabase();

module.exports = {
    savePlayer,
    saveRaceStats,
    addAchievement,
    getPlayerAchievements,
    addUnlockedItem,
    getUnlockedItems,
    getPlayer,
    getRaceStats,
    getCarCustomization,
    getWinLeaderboard,
    getSeasonLeaderboard,
    saveAllPlayerData,
    loadAllPlayerData
};