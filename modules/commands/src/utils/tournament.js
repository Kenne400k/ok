// Class quản lý giải đấu
class Tournament {
  constructor(id, name, creatorId, format = 'elimination', maxPlayers = 8) {
    this.id = id;
    this.name = name;
    this.creatorId = creatorId;
    this.format = format; // 'elimination' hoặc 'league'
    this.maxPlayers = maxPlayers;
    this.players = [];
    this.matches = [];
    this.standings = [];
    this.status = 'registration'; // registration, ongoing, completed
    this.startTime = null;
    this.endTime = null;
    this.currentRound = 0;
  }
  
  addPlayer(playerId, playerName) {
    if (this.players.length >= this.maxPlayers) return false;
    if (this.players.some(p => p.id === playerId)) return false;
    
    this.players.push({
      id: playerId,
      name: playerName,
      wins: 0,
      losses: 0,
      points: 0
    });
    
    return true;
  }
  
  removePlayer(playerId) {
    if (this.status !== 'registration') return false;
    
    const initialCount = this.players.length;
    this.players = this.players.filter(p => p.id !== playerId);
    
    return initialCount !== this.players.length;
  }
  
  start() {
    if (this.players.length < 2) return false;
    if (this.status !== 'registration') return false;
    
    this.status = 'ongoing';
    this.startTime = new Date();
    this.currentRound = 1;
    
    // Initialize tournament structure based on format
    if (this.format === 'elimination') {
      this.initializeEliminationBracket();
    } else if (this.format === 'league') {
      this.initializeLeagueMatches();
    }
    
    return true;
  }
  
  initializeEliminationBracket() {
    // Shuffle players for random seeding
    const shuffledPlayers = this.shuffleArray([...this.players]);
    
    // Calculate number of byes (empty spots to reach power of 2)
    const numPlayers = shuffledPlayers.length;
    const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(numPlayers)));
    const numByes = nextPowerOf2 - numPlayers;
    
    // Create first round matches with byes
    const matches = [];
    let matchId = 1;
    
    for (let i = 0; i < numPlayers; i += 2) {
      if (i + 1 < numPlayers) {
        // Regular match between two players
        matches.push({
          id: matchId++,
          round: 1,
          player1: shuffledPlayers[i].id,
          player2: shuffledPlayers[i + 1].id,
          winner: null,
          status: 'pending'
        });
      } else {
        // Bye (player automatically advances)
        matches.push({
          id: matchId++,
          round: 1,
          player1: shuffledPlayers[i].id,
          player2: null, // bye
          winner: shuffledPlayers[i].id, // automatic winner
          status: 'completed'
        });
      }
    }
    
    // Add placeholder matches for future rounds
    let roundMatches = Math.floor(matches.length / 2);
    let currentRound = 2;
    
    while (roundMatches > 0) {
      for (let i = 0; i < roundMatches; i++) {
        matches.push({
          id: matchId++,
          round: currentRound,
          player1: null, // to be determined
          player2: null, // to be determined
          winner: null,
          status: 'pending'
        });
      }
      
      roundMatches = Math.floor(roundMatches / 2);
      currentRound++;
    }
    
    this.matches = matches;
  }
  
  initializeLeagueMatches() {
    // Create round-robin tournament where each player plays against every other player
    const matches = [];
    let matchId = 1;
    
    for (let i = 0; i < this.players.length; i++) {
      for (let j = i + 1; j < this.players.length; j++) {
        matches.push({
          id: matchId++,
          round: 1, // All league matches are in "round 1"
          player1: this.players[i].id,
          player2: this.players[j].id,
          winner: null,
          status: 'pending'
        });
      }
    }
    
    this.matches = matches;
  }
  
  recordMatchResult(matchId, winnerId) {
    const match = this.matches.find(m => m.id === matchId);
    if (!match) return false;
    
    // Make sure the winner is actually in the match
    if (match.player1 !== winnerId && match.player2 !== winnerId) return false;
    
    // Record winner
    match.winner = winnerId;
    match.status = 'completed';
    
    // Update player stats
    const winnerIdx = this.players.findIndex(p => p.id === winnerId);
    const loserId = match.player1 === winnerId ? match.player2 : match.player1;
    const loserIdx = this.players.findIndex(p => p.id === loserId);
    
    if (winnerIdx !== -1) {
      this.players[winnerIdx].wins++;
      this.players[winnerIdx].points += 3; // 3 points for a win
    }
    
    if (loserIdx !== -1) {
      this.players[loserIdx].losses++;
      // No points for a loss
    }
    
    // Check if we need to advance to next round
    if (this.format === 'elimination') {
      this.advanceToNextRound();
    }
    
    // Check if tournament is complete
    this.checkTournamentCompletion();
    
    return true;
  }
  
  advanceToNextRound() {
    // Check if current round is complete
    const currentRoundMatches = this.matches.filter(m => m.round === this.currentRound);
    const pendingMatches = currentRoundMatches.filter(m => m.status === 'pending');
    
    if (pendingMatches.length === 0) {
      // All matches in the current round are complete
      // Advance winners to the next round
      const nextRound = this.currentRound + 1;
      const nextRoundMatches = this.matches.filter(m => m.round === nextRound);
      
      if (nextRoundMatches.length > 0) {
        // Pair winners for next round
        let nextMatchIndex = 0;
        
        for (let i = 0; i < currentRoundMatches.length; i += 2) {
          if (i + 1 < currentRoundMatches.length) {
            const winner1 = currentRoundMatches[i].winner;
            const winner2 = currentRoundMatches[i + 1].winner;
            
            if (nextMatchIndex < nextRoundMatches.length) {
              nextRoundMatches[nextMatchIndex].player1 = winner1;
              nextRoundMatches[nextMatchIndex].player2 = winner2;
              nextMatchIndex++;
            }
          }
        }
        
        this.currentRound = nextRound;
      }
    }
  }
  
  checkTournamentCompletion() {
    if (this.format === 'elimination') {
      // Tournament is complete when the final match has a winner
      const finalMatch = this.matches[this.matches.length - 1];
      if (finalMatch.winner) {
        this.status = 'completed';
        this.endTime = new Date();
        
        // Update final standings
        this.updateFinalStandings();
      }
    } else if (this.format === 'league') {
      // Tournament is complete when all matches are completed
      const pendingMatches = this.matches.filter(m => m.status === 'pending');
      if (pendingMatches.length === 0) {
        this.status = 'completed';
        this.endTime = new Date();
        
        // Update final standings
        this.updateFinalStandings();
      }
    }
  }
  
  updateFinalStandings() {
    if (this.format === 'elimination') {
      // For elimination, winner is the winner of the final match
      // Second place is the loser of the final match
      const finalMatch = this.matches[this.matches.length - 1];
      const winner = this.players.find(p => p.id === finalMatch.winner);
      const runnerUp = this.players.find(p => 
        p.id === (finalMatch.player1 === finalMatch.winner ? finalMatch.player2 : finalMatch.player1)
      );
      
      this.standings = [
        { position: 1, player: winner },
        { position: 2, player: runnerUp }
      ];
      
      // Add semifinalists (losers of semifinal matches)
      const semiFinals = this.matches.filter(m => m.round === this.currentRound - 1);
      const semifinalists = semiFinals.map(match => 
        this.players.find(p => p.id === (match.player1 === match.winner ? match.player2 : match.player1))
      );
      
      for (const semifinalist of semifinalists) {
        if (semifinalist) {
          this.standings.push({ position: 3, player: semifinalist });
        }
      }
    } else if (this.format === 'league') {
      // For league, sort by points (then by wins if tied)
      const sortedPlayers = [...this.players].sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        return b.wins - a.wins;
      });
      
      this.standings = sortedPlayers.map((player, index) => ({
        position: index + 1,
        player
      }));
    }
  }
  
  shuffleArray(array) {
    // Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  getStandings() {
    if (this.status === 'completed') {
      return this.standings;
    }
    
    // For ongoing tournaments, calculate current standings
    if (this.format === 'elimination') {
      // For elimination, only show eliminated players
      const standings = [];
      
      // Players with losses
      const eliminatedPlayers = this.players.filter(p => p.losses > 0);
      for (const player of eliminatedPlayers) {
        standings.push({
          position: 'Eliminated',
          player
        });
      }
      
      return standings;
    } else if (this.format === 'league') {
      // For league, sort by current points
      const sortedPlayers = [...this.players].sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        return b.wins - a.wins;
      });
      
      return sortedPlayers.map((player, index) => ({
        position: index + 1,
        player
      }));
    }
    
    return [];
  }
  
  getRemainingMatches() {
    return this.matches.filter(m => m.status === 'pending' && m.player1 && m.player2);
  }
  
  getBracketDisplay() {
    if (this.format !== 'elimination') return null;
    
    const rounds = [];
    const maxRound = Math.max(...this.matches.map(m => m.round));
    
    for (let round = 1; round <= maxRound; round++) {
      const roundMatches = this.matches
        .filter(m => m.round === round)
        .map(match => {
          const player1Name = this.players.find(p => p.id === match.player1)?.name || 'TBD';
          const player2Name = this.players.find(p => p.id === match.player2)?.name || 'TBD';
          const winnerName = this.players.find(p => p.id === match.winner)?.name || null;
          
          return {
            id: match.id,
            player1: player1Name,
            player2: player2Name,
            winner: winnerName,
            status: match.status
          };
        });
      
      rounds.push({ round, matches: roundMatches });
    }
    
    return rounds;
  }
}

module.exports = { Tournament };