// BlackJack Game!

//DOM connections:
const hit = document.getElementById("hitBtn");
const stand = document.getElementById("standBtn");
const deal = document.getElementById("dealBtn");
const yourField = document.getElementById("yourCardsFields");
const dealerField = document.getElementById("dealerCardsFields");
const yourScoreDisplay = document.getElementById("yourScore");
const dealerScoreDisplay = document.getElementById("dealerScore");
const resultMessage = document.getElementById("messageDisplay");
const winsCount = document.getElementById("winsCount");
const lossesCount = document.getElementById("lossesCount");
const drawsCount = document.getElementById("drawsCount");
const clearTrack = document.getElementById("clearTrack");

//Objects to retreive data from:
let Blackjack = {
  you: { Score: 0 },
  dealer: { Score: 0 },
  Value: {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    Prince: 10,
    Queen: 10,
    King: 10,
    A: [1, 11],
  },
  cardsImg: [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "Prince",
    "Queen",
    "King",
    "A",
  ],
  wins: 0,
  losses: 0,
  draws: 0,
  standIsActive: false,
  hitNotHit: false,
  roundIsOver: false,
};

//Variables:
const You = Blackjack["you"];
const Dealer = Blackjack["dealer"];
const hitSound = new Audio("sounds/swish.m4a");
const winSound = new Audio("sounds/cash.mp3");
const lossSound = new Audio("sounds/aww.mp3");

// || C O N T R O L L E R:
hit.addEventListener("click", () => {
  if (Blackjack["standIsActive"] === false) {
    let card = randomCardGenerator();
    generateCard(card, yourField, You);
    let newScore = updateScore(card, You);
    showScore(newScore, yourScoreDisplay);
    Blackjack["hitNotHit"] = true;
  }
});

stand.addEventListener("click", () => {
  if (Blackjack["hitNotHit"] === true) {
    dealerTurn();
  } else {
    alert("Please, first make your choice before hitting the 'Stand' button");
  }
});

function sleep(ns) {
  return new Promise((resolve) => setTimeout(resolve, ns));
}

async function dealerTurn() {
  Blackjack["standIsActive"] = true;

  while (Dealer["Score"] < 16 && Blackjack["standIsActive"] === true) {
    let card = randomCardGenerator();
    generateCard(card, dealerField, Dealer);
    let newScore = updateScore(card, Dealer);
    showScore(newScore, dealerScoreDisplay);
    await sleep(1000);
  }

  let winner = computeWinner();
  displayWinner(winner);
  Blackjack["roundIsOver"] = true;
  Blackjack["hitNotHit"] = false;
}

deal.addEventListener("click", () => {
  dealTheGame();
});

clearTrack.addEventListener("click", () => {
  clearTheTrack();
});

// || V I E W:
function generateCard(card, PlayerField, activePlayer) {
  if (activePlayer["Score"] <= 21) {
    const yourCard = document.createElement("img");
    yourCard.classList.add("cardsImg");
    yourCard.src = `images/${card}.png`;
    PlayerField.appendChild(yourCard);
    hitSound.play();
  }
}

function dealTheGame() {
  if (Blackjack["roundIsOver"] === true) {
    let yourCards = document
      .querySelector("#yourCardsFields")
      .querySelectorAll("img");
    for (let i = 0; i < yourCards.length; i++) {
      yourCards[i].remove();
    }

    let dealerCards = document
      .querySelector("#dealerCardsFields")
      .querySelectorAll("img");
    for (let i = 0; i < dealerCards.length; i++) {
      dealerCards[i].remove();
    }

    yourScoreDisplay.textContent = 0;
    dealerScoreDisplay.textContent = 0;
    yourScoreDisplay.style.color = "white";
    dealerScoreDisplay.style.color = "white";
    You["Score"] = 0;
    Dealer["Score"] = 0;

    resultMessage.textContent = "Let's Play";
    resultMessage.style.color = "black";
  }

  Blackjack["roundIsOver"] = false;
  Blackjack["standIsActive"] = false;
}

function showScore(score, playerScoreDisplay) {
  if (score > 21) {
    playerScoreDisplay.textContent = "BUST!";
    playerScoreDisplay.style.color = "red";
  } else {
    playerScoreDisplay.textContent = score;
  }
}

function displayWinner(winner) {
  let message, messageColor;

  if (winner === You) {
    message = "Congrats.\nYou Won!";
    messageColor = "green";
    winSound.play();
  } else if (winner === Dealer) {
    message = "Awwww ):\nYou Lost!";
    messageColor = "red";
    lossSound.play();
  } else {
    message = "Draw Game!";
    messageColor = "darkblue";
  }

  resultMessage.textContent = message;
  resultMessage.style.color = messageColor;
  scoreTracker();
}

function scoreTracker() {
  winsCount.textContent = Blackjack["wins"];
  lossesCount.textContent = Blackjack["losses"];
  drawsCount.textContent = Blackjack["draws"];
}

function clearTheTrack() {
  winsCount.textContent = 0;
  lossesCount.textContent = 0;
  drawsCount.textContent = 0;

  Blackjack["wins"] = 0;
  Blackjack["losses"] = 0;
  Blackjack["draws"] = 0;
}

// || M E D I A:
function randomCardGenerator() {
  let randomNumber = Math.floor(Math.random() * 13);
  return Blackjack["cardsImg"][randomNumber];
}

function updateScore(card, activePlayer) {
  if (card === "A") {
    if (activePlayer["Score"] + Blackjack["Value"][card][1] <= 21) {
      activePlayer["Score"] += Blackjack["Value"][card][1];
    } else {
      activePlayer["Score"] += Blackjack["Value"][card][0];
    }
  } else {
    activePlayer["Score"] += Blackjack["Value"][card];
  }
  return activePlayer["Score"];
}

function computeWinner() {
  let winner;

  if (You["Score"] <= 21) {
    if (You["Score"] > Dealer["Score"] || Dealer["Score"] > 21) {
      winner = You;
      Blackjack["wins"] += 1;
    } else if (You["Score"] < Dealer["Score"]) {
      winner = Dealer;
      Blackjack["losses"] += 1;
    } else if (You["Score"] === Dealer["Score"]) {
      Blackjack["draws"] += 1;
    }
  } else if (You["Score"] > 21 && Dealer["Score"] <= 21) {
    winner = Dealer;
    Blackjack["losses"] += 1;
  } else if (You["Score"] > 21 && Dealer["Score"] > 21) {
    Blackjack["draws"] += 1;
  }

  return winner;
}
