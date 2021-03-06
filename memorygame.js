// ===============================================================================================
//  CREATE GAMEBOARD WITH ALL NEEDED CARDS
// ===============================================================================================

const gameWindow = document.querySelector('.game-window');

let pokemonArr = ['pikachu', 'squirtle', 'charmander', 'charizard', 'ivysaur', 'blastoise', 'gyarados', 'bulbasaur', 'pidgey',
 'onix', 'psyduck', 'meowth', 'vulpix', 'nidoqueen', 'nidoking', 'clefairy', 'zubat', 'growlithe', 'beedrill', 'ekans', 'arbok', 
  'ponyta', 'chansey', 'jynx', 'eevee', 'snorlax', 'vileplume', 'dugtrio', 'koffing'];

let cardColors = ['#d49898', '#da6f6f', '#f1825f', '#d66845', '#d69b2e', '#e0b043',
 '#b1ce5a', '#92c57c', '#7bc59c', '#7bb1c5', '#7b92c5', '#8b8ad8', '#dda1de',
  '#ffbdaa', '#b58c50', '#905a5a', '#9c9c9c', '#bbbab9', '#b38ad8', '#885a90'];

let numOfPokemon =  6 ; // This declares number of pokemon to be used for game. Must be less than length of cardColors

let shuffledColors = shuffle(cardColors);  
let shuffledPokemon = shuffle(pokemonArr);
let selectedPokemon = shuffledPokemon.slice(0, numOfPokemon); //declared outside a function bc needed for 2 functions
let beginButton = document.querySelector('#begin');
let intro = document.querySelector('.intro');


beginButton.addEventListener('click', function() {
    intro.style.display='none';
    makePlayingBoard();
    startGame();
})

// makePlayingBoard();


// ==========================
// NEEDED FUNCTIONS
// ==========================

function createDeck(numOfPokemon) {
    let listDoubled = [];
    listDoubled = listDoubled.concat(selectedPokemon);
    listDoubled = listDoubled.concat(selectedPokemon);
    let finalPokemonList = shuffle(listDoubled);
    return finalPokemonList;
}

function makeCard(pokemonStr, colorStr) {
    // Create needed divs and add classes
    let cardWindowDiv = document.createElement('div');
    cardWindowDiv.classList.add('card-window');
    let cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    let cardFrontFigure = document.createElement('figure');
    cardFrontFigure.classList.add('card-front');
    let cardBackFigure = document.createElement('figure');
    cardBackFigure.classList.add('card-back');
    let cardContainerDiv = document.createElement('div');
    cardContainerDiv.classList.add('card-container');
    let cardImgWindowDiv = document.createElement('div');
    cardImgWindowDiv.classList.add('card-img-window');
    cardImgWindowDiv.style.backgroundColor = colorStr;
    let cardTextDiv = document.createElement('div');
    cardTextDiv.classList.add('card-text');

    // Create pokemon image and add pokemon-specific info
    let pokemonURL = `https://img.pokemondb.net/sprites/ruby-sapphire/normal/${pokemonStr}.png`;
    let newPokemonImg = document.createElement('img');
    newPokemonImg.setAttribute('src', pokemonURL);
    cardTextDiv.innerText = pokemonStr;

    // Nest things in right order
    cardImgWindowDiv.append(newPokemonImg);
    cardContainerDiv.append(cardImgWindowDiv);
    cardContainerDiv.append(cardTextDiv);
    cardBackFigure.append(cardContainerDiv);
    cardDiv.append(cardFrontFigure);
    cardDiv.append(cardBackFigure);
    cardWindowDiv.append(cardDiv);

    gameWindow.append(cardWindowDiv);
}


function makePlayingBoard() {
    let lineUp = createDeck(numOfPokemon);
    for (let pokemon of lineUp) {
        let colorIndex = selectedPokemon.indexOf(pokemon); // so matches have same random bg color
        let color = shuffledColors[colorIndex]; 
        makeCard(pokemon, color);
    }
}

function shuffle(array) {
    let counter = array.length;
    while (counter > 0) {
      let index = Math.floor(Math.random() * counter);
      counter--;
      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }
    return array;
}

// ===============================================================================================
//  GAME LOGIC
// ===============================================================================================
let notificationsWindow = document.querySelector('.notifications-window');
let notificationText = document.querySelector('.notification-text-window');
let scoreSpan = document.querySelector('#score');
let bestScoreSpan = document.querySelector('#best-score');

// let score = Number(scoreSpan.innerText)
// let bestScore = Number(bestScoreSpan.innerText)

if (localStorage.hasSavedGame) {
    bestScoreSpan.innerText = localStorage.best;
}

let score = Number(scoreSpan.innerText)
let bestScore = Number(bestScoreSpan.innerText)

function startGame() {
    let cards = document.querySelectorAll('.card');

    let card1 = "";
    let card2 = "";
    let cardsFoundNum = 0;    

    for (let card of cards) {
        card.classList.add('hide');
        card.addEventListener('click', function(event) {
            if (card2 === "" && !card.classList.contains('found')) {
                if (card1 === "") { // if this is the first flip 
                    card1 = card.innerText;
                    card.classList.add('first-flip');
                    reveal(card);
                } else { // if this is the second flip
                    card2 = card.innerText;
                    card.classList.add('second-flip')
                    reveal(card);
                    if (card1 === card2 && !card.classList.contains('first-flip')) { // if card 1 matches card 2 but is not the same card
                        // EVENT: SUCCESS
                        profOakSays('Excellent!', 1300);
                        card.classList.add('found');
                        document.querySelector('.first-flip').classList.add('found');
                        card.classList.remove('second-flip');
                        document.querySelector('.first-flip').classList.remove('first-flip'); ///////////////////////////
                        cardsFoundNum += 2;
                        card1 = "";
                        card2 = "";
                        if (cardsFoundNum === cards.length) { // if the amount of cards found is the same as total cards
                            increaseScore() // 
                            youWin();
                            return; // short-cirtcuits game function. Game is over. 
                        }
                    } else if (card1 === card2){ // if card 1 matches card 2 but card 2 contains class first-slip, then user clicked on same card
                        // EVENT: FAIL (CLICKED ON SAME CARD)
                        profOakSays('same card?!', 1300);
                        card.classList.remove('second-flip'); // then remove any designations of card picked as being card2 but card 1 remains flipped
                        card2 = "";
                    } else { // if card 2 doesn't match card 1
                        // EVENT: FAIL (NO MATCH)
                        setTimeout(function() { // we hide the cards after 700ms 
                            document.querySelector('.first-flip').classList.remove('reveal');
                            hide(card);
                            document.querySelector('.first-flip').classList.remove('first-flip'); 
                            card.classList.remove('second-flip');   
                            card1 = "";
                            card2 = "";                               
                        }, 700)                 
                    }
                }
                increaseScore(); // as long as user doesn't click on already-exposed card, card score will increase.
            }
        })
    }
}

function profOakSays(message, time) {
    notificationsWindow.style.display = 'flex';
    notificationText.innerText = message;
    setTimeout(function() {
        notificationsWindow.style.display = 'none';
    }, time)
}

function increaseScore() {
    score ++;
    scoreSpan.innerText = String(score);
}

function reveal(thisCard) {
    thisCard.classList.remove('hide');
    thisCard.classList.add('reveal');
}

function hide(thisCard) {
    thisCard.classList.add('hide');
    thisCard.classList.remove('reveal');
}

function youWin() {
    if (score < bestScore) {
        notificationsWindow.style.display = 'flex';
        notificationText.innerText = "New Record!";
        localStorage.setItem('best', String(score));
        bestScoreSpan.innerText=score;
    } else {
        notificationsWindow.style.display = 'flex';
        notificationText.innerText = "All pokémon found!";
    }
    localStorage.setItem('hasSavedGame', 'true');
    setTimeout(function(){
        let cardWindows = document.querySelectorAll('.card-window');
        let introText = document.querySelector('.intro-text');
        introText.innerText = `Spectacular job today! You found all the lost pokemon in just ${score} tries. You are shaping up to be an excellent pokémon-trainer.`;
        intro.style.display ="flex";
        
        for (let cardWindow of cardWindows) {
            cardWindow.remove()
        }
    }, 2000)

}
