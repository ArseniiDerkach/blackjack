// TODO: 1) User function constructor
//       2) Dealer and player who inherit from Gamer
//       3) Table with deck and 2 fields: one for dealer, 2 for player
//       4) Deck with functionality for shuffle

// index = 0 => 2s
// index % 13 = quality
// Math.round(index / 13) = color
// spades, diamonds, clubs, hearts


function Deck() {
    const allCards = new Array(52).fill(0).map((item,index)=>{
        return `${['2','3','4','5','6','7','8','9','10','J','Q','K','A'][index % 13]}${['s','c','d','h'][Math.floor(index/13)]}`
    });
    let [...cardOrder] = allCards;
    this.takeCard = () => cardOrder.shift();
    this.turnCards = () => cardOrder;
    const getRandomCard = () => Math.floor(Math.random()*cardOrder.length);
    const gatherAllCards = () => {
        [...cardOrder] = allCards;
    }
    this.shuffle = () => {
        gatherAllCards();
        const newOrder = [];
        for (let i = 0; i < 52; i++) {
            const index = getRandomCard();
            const card = cardOrder.splice(index,1)[0];
            newOrder.push(card);
        }
        [...cardOrder] = newOrder;
        console.log(cardOrder);
    }
}

const deck = new Deck();

function Table() {
    const deck = new Deck();
    this.playerCards = [];
    this.dealerCards = [];
    this.init = () => {
        // deck.shuffle();
        const wrapper = document.getElementsByClassName('wrapper')[0];
        const dealerCards = document.createElement('div');
        dealerCards.classList.add('dealer-cards');
        const playerCards = document.createElement('div');
        playerCards.classList.add('player-cards');
        const playerButtons = document.createElement('div');
        const gameResults = document.createElement('div');
        playerButtons.classList.add('player-buttons');
        gameResults.classList.add('game-result');
        wrapper.appendChild(dealerCards);
        wrapper.appendChild(playerCards);
        wrapper.appendChild(playerButtons);
        wrapper.appendChild(gameResults);
        dealerCards.innerHTML = `<h2>Dealer cards</h2><div class="cards"></div>`;
        playerCards.innerHTML = `<h2>Player cards</h2><div class="cards"></div>`;
        playerButtons.innerHTML = `<button class="new-round">New Round</button>`;
    }
    const drawDealerCards = () => {
        const dealerCards = document.querySelector('.dealer-cards .cards');
        dealerCards.innerHTML = `${this.dealerCards.map(card => card)} (${this.dealerScore()})`;
    }
    const drawPlayerCards = () => {
        const playerCards = document.querySelector('.player-cards .cards');
        playerCards.innerHTML = `${this.playerCards.map(card => card)} (${this.playerScore()})`;
    }
    this.deal = () => {
        deck.shuffle();
        this.playerCards = [];
        this.dealerCards = [];
        this.playerCards.push(deck.takeCard());
        this.dealerCards.push(deck.takeCard());
        this.playerCards.push(deck.takeCard());
        this.dealerCards.push(deck.takeCard());
        drawDealerCards();
        drawPlayerCards();
        const playerButtons = document.getElementsByClassName('player-buttons')[0];
        playerButtons.innerHTML = `<button class="more">More</button><button class="enough">Enough</button>`;
        document.getElementsByClassName('game-result')[0].innerHTML = '';
    }
    const count = (cards) => {
        debugger;
        let currentCount = 0;
        let acesCount = 0;
        for (let i = 0; i < cards.length; i++) {
            const value = cards[i].slice(0,-1);
            if (!isNaN(+value)) {
                currentCount += (+value);
                continue;
            }
            if (value !== 'A') {
                currentCount += 10;
                continue;
            }
            acesCount++;
            currentCount += 11;
        }
        while(acesCount) {
            if (currentCount > 21) {
                currentCount-=10;
                acesCount--;
            } else break;
        }
        return currentCount;
    }
    const addDealerCards = () => {
        while (count(this.dealerCards)<17) {
            this.dealerCards.push(deck.takeCard());
        }
        drawDealerCards();
    }
    this.playerScore = () => count(this.playerCards)> 21 ? 'busted' : count(this.playerCards);
    this.dealerScore = () => count(this.dealerCards)> 21 ? 'busted' : count(this.dealerCards);

    this.getCard = () => {
        this.playerCards.push(deck.takeCard());
        drawPlayerCards();
        if (this.playerScore() === 'busted') {
            this.showdown();
        }
    }
    const result = () => {

        const playerScore = this.playerScore();
        if (playerScore === 'busted') {
            return 'lost';
        } else {}
        addDealerCards();
        const dealerScore = this.dealerScore();
        if (dealerScore === 'busted') {
            return 'won'
        }
        switch (true) {
            case (playerScore > dealerScore): return 'won';
            case (playerScore < dealerScore): return 'lost';
            default: return 'draw';
        }
    }
    this.showdown = () => {
        const gameRes = result();
        const resultHTML = document.getElementsByClassName('game-result')[0];
        
        resultHTML.innerHTML = `<div> You ${gameRes}</div>`;
        
        const playerButtons = document.getElementsByClassName('player-buttons')[0];
        playerButtons.innerHTML = '<button class="new-round">New Round</button>';
    }
}



const newGameButton = document.getElementById('new-game');
const table = new Table();
document.addEventListener('click',function(event){
    let isRunning = false;
    if (!isRunning) {
        if (event.target === newGameButton) {
            newGameButton.parentElement.removeChild(newGameButton);
            isRunning = true;
            table.init();
            isRunning = false;
            return true;
        }
        if (event.target.classList.contains('new-round')) {
            isRunning = true;
            table.deal();
            isRunning = false;
            return true;
        }
        if (event.target.classList.contains('more')) {
            isRunning = true;
            table.getCard();
            isRunning = false;
            return true;
        }
        if (event.target.classList.contains('enough')) {
            isRunning = true;
            table.showdown();
            isRunning = false;
            return true;
        }
    }
})

