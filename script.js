// Define the numbers and suits separately
const numbers = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "Jack",
  "Queen",
  "King",
  "Ace",
];
const suits = ["♠", "♥", "♦", "♣"];

const btnDeal = document.getElementById("deal");
const btnHit = document.getElementById("hit");
const btnStand = document.getElementById("stand");

// Function to create a deck of cards
function createDeck() {
  const deck = [];
  for (const suit of suits) {
    for (const number of numbers) {
      deck.push({ number, suit });
    }
  }
  return deck;
}

// Function to shuffle the deck of cards
function shuffleDeck(deck) {
  let shuffledCards = [...deck];
  for (let i = shuffledCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
  }
  return shuffledCards;
}

// Create a shuffled deck

// Global variables
let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let dealerFaceDown = true;

// Deal two initial cards to the player and dealer
// Deal two initial cards to the player and dealer
function dealInitialCards() {
  dealerFaceDown = true;
  document.querySelector(".result").textContent = ``;

  // Create and shuffle a new deck for each deal
  deck = shuffleDeck(createDeck());

  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];
  updateDisplay();
}

// Calculate the score of a hand
function calculateHandScore(hand) {
  let score = 0;
  let aceCount = 0;

  for (const card of hand) {
    if (card.number === "Ace") {
      score += 11;
      aceCount++;
    } else if (["King", "Queen", "Jack"].includes(card.number)) {
      score += 10;
    } else {
      score += parseInt(card.number);
    }
  }

  // Adjust for aces if necessary
  while (aceCount > 0 && score > 21) {
    score -= 10;
    aceCount--;
  }

  return score;
}

function addSuitColor(suit) {
  if (suit === "♦" || suit === "♥") {
    return "red-suit";
  } else {
    return null;
  }
}

function revealHiddenCard() {
  dealerFaceDown = false;
  document.querySelectorAll("#dealer div")[1].textContent =
    dealerHand[1].number + dealerHand[1].suit;

  document
    .querySelectorAll("#dealer div")[1]
    .classList.add(addSuitColor(dealerHand[1].suit));
}

// Update the display with current game state
function updateDisplay() {
  // Display player's hand
  const playerHandElement = document.querySelector(".player .hand");
  playerHandElement.innerHTML = "";
  for (const card of playerHand) {
    const cardElement = document.createElement("div");
    cardElement.textContent = card.number + card.suit;
    cardElement.classList.add(addSuitColor(card.suit));
    playerHandElement.appendChild(cardElement);
  }

  // Display dealer's hand
  const dealerHandElement = document.querySelector(".dealer .hand");
  dealerHandElement.innerHTML = "";
  for (let i = 0; i < dealerHand.length; i++) {
    let card = dealerHand[i];
    // for (const card of dealerHand) {
    const cardElement = document.createElement("div");
    if (i == 1 && dealerFaceDown) {
      cardElement.innerHTML = "*******";
    } else {
      cardElement.textContent = card.number + card.suit;
      cardElement.classList.add(addSuitColor(card.suit));
    }
    dealerHandElement.appendChild(cardElement);
  }

  // Update scores
  playerScore = calculateHandScore(playerHand);

  if (dealerFaceDown) {
    dealerScore = "???";
  } else {
    dealerScore = calculateHandScore(dealerHand);
  }
  document.querySelector(
    ".player h2"
  ).textContent = `Player's Hand (Score: ${playerScore})`;
  document.querySelector(
    ".dealer h2"
  ).textContent = `Dealer's Hand (Score: ${dealerScore})`;
}

// Event listener for the "Deal" button
btnDeal.addEventListener("click", () => {
  dealInitialCards();
});

// Event listener for the "Hit" button
btnHit.addEventListener("click", () => {
  if (playerScore < 21) {
    playerHand.push(deck.pop());
    updateDisplay();

    if (playerScore === 21) {
      // Player wins with blackjack
      revealHiddenCard();
      updateDisplay();
      document.querySelector(".result").textContent =
        "Player wins with Blackjack!";
    } else if (playerScore > 21) {
      // Player busts
      revealHiddenCard();
      updateDisplay();
      document.querySelector(".result").textContent =
        "Player busts. Dealer wins!";
    }
  }
});

// Event listener for the "Hit" button
// document.getElementById2("hit").addEventListener("click", () => {
//   if (playerScore < 21) {
//     // Draw a new card from the deck (you need to implement this logic)
//     const newCard = deck.pop();

//     // Add the new card to the player's hand
//     playerHand.push(newCard);

//     // Use the addCardToHand function to display the new card
//     addCardToHand(playerHand, newCard.number, newCard.suit, true);

//     // Update the player's score
//     playerScore = calculateHandScore(playerHand);

//     // Check for win, bust, or continue the game
//     if (playerScore === 21) {
//       document.querySelector(".result").textContent =
//         "Player wins with Blackjack!";
//     } else if (playerScore > 21) {
//       document.querySelector(".result").textContent =
//         "Player busts. Dealer wins!";
//     }
//   }
// });

// Event listener for the "Stand" button
btnStand.addEventListener("click", () => {
  revealHiddenCard();
  updateDisplay();
  // Dealer's turn
  while (dealerScore < 17) {
    dealerHand.push(deck.pop());
    updateDisplay();
  }

  if (dealerScore > 21 || playerScore > dealerScore) {
    document.querySelector(".result").textContent = "Player wins!";
  } else if (playerScore === dealerScore) {
    document.querySelector(".result").textContent = "It's a tie!";
  } else {
    document.querySelector(".result").textContent = "Dealer wins!";
  }
});

function createCardSVG(number, suit) {
  // Define the SVG template for a playing card
  const svgTemplate = `
      <svg xmlns="http://www.w3.org/2000/svg" width="150" height="200" viewBox="0 0 150 200">
          <!-- Card Background -->
          <rect width="100%" height="100%" rx="10" ry="10" fill="#fff" stroke="#000" stroke-width="2"/>
          
          <!-- Suit Icon -->
          <text x="20" y="30" font-size="24" fill="${
            suit === "♦" || suit === "♥" ? "red" : "black"
          }">${suit}</text>
          
          <!-- Card Number -->
          <text x="20" y="60" font-size="24" fill="black">${number}</text>
          
          <!-- Additional Elements (e.g., for face cards) can be added here -->
      </svg>
  `;

  return svgTemplate;
}

// Example usage:
const cardSVG = createCardSVG("A", "♠"); // Creates an Ace of Spades SVG

// Function to add a card to a hand and display it
function addCardToHand(hand, number, suit, isPlayer) {
  // Create the card SVG
  const cardSVG = createCardSVG(number, suit);

  // Create a container for the card
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card");

  // Set the card SVG as the inner HTML of the container
  cardContainer.innerHTML = cardSVG;

  // Append the card container to the player's or dealer's hand
  const handElement = isPlayer
    ? document.querySelector(".player .hand")
    : document.querySelector(".dealer .hand");

  handElement.appendChild(cardContainer);
}
