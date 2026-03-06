class Blackjack {
    constructor() {
        this.deck = [];
        this.playerCards = [];
        this.dealerCards = [];
        this.gameOver = false;
        this.playerStand = false;
        
        this.suits = ['♠', '♥', '♦', '♣'];
        this.values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        
        this.initElements();
        this.initEventListeners();
        this.newGame();
    }
    
    initElements() {
        this.dealerCardsEl = document.getElementById('dealer-cards');
        this.playerCardsEl = document.getElementById('player-cards');
        this.dealerScoreEl = document.getElementById('dealer-score');
        this.playerScoreEl = document.getElementById('player-score');
        this.messageEl = document.getElementById('message');
        this.btnHit = document.getElementById('btn-hit');
        this.btnStand = document.getElementById('btn-stand');
        this.btnNew = document.getElementById('btn-new');
    }
    
    initEventListeners() {
        this.btnHit.addEventListener('click', () => this.hit());
        this.btnStand.addEventListener('click', () => this.stand());
        this.btnNew.addEventListener('click', () => this.newGame());
    }
    
    createDeck() {
        this.deck = [];
        for (const suit of this.suits) {
            for (const value of this.values) {
                this.deck.push({ suit, value });
            }
        }
        this.shuffleDeck();
    }
    
    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }
    
    drawCard() {
        return this.deck.pop();
    }
    
    getCardValue(card) {
        if (['J', 'Q', 'K'].includes(card.value)) {
            return 10;
        }
        if (card.value === 'A') {
            return 11;
        }
        return parseInt(card.value);
    }
    
    calculateScore(cards) {
        let score = 0;
        let aces = 0;
        
        for (const card of cards) {
            score += this.getCardValue(card);
            if (card.value === 'A') aces++;
        }
        
        while (score > 21 && aces > 0) {
            score -= 10;
            aces--;
        }
        
        return score;
    }
    
    renderCard(card, container, hidden = false) {
        if (hidden) {
            const cardEl = document.createElement('div');
            cardEl.className = 'card-back';
            container.appendChild(cardEl);
            return;
        }
        
        const cardEl = document.createElement('div');
        const isRed = card.suit === '♥' || card.suit === '♦';
        cardEl.className = `card ${isRed ? 'red' : 'black'}`;
        cardEl.innerHTML = `
            <div>${card.value}</div>
            <div class="suit">${card.suit}</div>
        `;
        container.appendChild(cardEl);
    }
    
    updateDisplay() {
        this.dealerCardsEl.innerHTML = '';
        this.playerCardsEl.innerHTML = '';
        
        // Render dealer cards (first card hidden until player stands)
        this.dealerCards.forEach((card, index) => {
            this.renderCard(card, this.dealerCardsEl, index === 0 && !this.playerStand && !this.gameOver);
        });
        
        // Render player cards
        this.playerCards.forEach(card => {
            this.renderCard(card, this.playerCardsEl);
        });
        
        // Update scores
        const playerScore = this.calculateScore(this.playerCards);
        this.playerScoreEl.textContent = `Score: ${playerScore}`;
        
        if (this.playerStand || this.gameOver) {
            const dealerScore = this.calculateScore(this.dealerCards);
            this.dealerScoreEl.textContent = `Score: ${dealerScore}`;
        } else {
            // Show only visible cards score
            const visibleDealerCards = this.dealerCards.slice(1);
            const visibleScore = this.calculateScore(visibleDealerCards);
            this.dealerScoreEl.textContent = `Score: ? + ${visibleScore}`;
        }
    }
    
    newGame() {
        this.createDeck();
        this.playerCards = [this.drawCard(), this.drawCard()];
        this.dealerCards = [this.drawCard(), this.drawCard()];
        this.gameOver = false;
        this.playerStand = false;
        this.messageEl.textContent = '';
        
        this.btnHit.disabled = false;
        this.btnStand.disabled = false;
        
        this.updateDisplay();
        
        // Check for blackjack
        const playerScore = this.calculateScore(this.playerCards);
        if (playerScore === 21) {
            this.endGame('¡Blackjack! ¡Ganaste! 🎉');
        }
    }
    
    hit() {
        if (this.gameOver) return;
        
        this.playerCards.push(this.drawCard());
        this.updateDisplay();
        
        const playerScore = this.calculateScore(this.playerCards);
        
        if (playerScore > 21) {
            this.endGame('¡Te pasaste! Pierdes 💥');
        } else if (playerScore === 21) {
            this.stand();
        }
    }
    
    stand() {
        if (this.gameOver) return;
        
        this.playerStand = true;
        this.updateDisplay();
        
        // Dealer plays
        this.dealerPlay();
    }
    
    async dealerPlay() {
        this.btnHit.disabled = true;
        this.btnStand.disabled = true;
        
        // Small delay for dramatic effect
        await this.sleep(500);
        
        let dealerScore = this.calculateScore(this.dealerCards);
        
        while (dealerScore < 17) {
            this.dealerCards.push(this.drawCard());
            this.updateDisplay();
            dealerScore = this.calculateScore(this.dealerCards);
            await this.sleep(500);
        }
        
        const playerScore = this.calculateScore(this.playerCards);
        
        if (dealerScore > 21) {
            this.endGame('¡El dealer se pasó! ¡Ganaste! 🎉');
        } else if (dealerScore > playerScore) {
            this.endGame('El dealer gana 😞');
        } else if (playerScore > dealerScore) {
            this.endGame('¡Ganaste! 🎉');
        } else {
            this.endGame('Empate 🤝');
        }
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    endGame(message) {
        this.gameOver = true;
        this.playerStand = true;
        this.messageEl.textContent = message;
        this.updateDisplay();
        this.btnHit.disabled = true;
        this.btnStand.disabled = true;
    }
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Blackjack();
});
