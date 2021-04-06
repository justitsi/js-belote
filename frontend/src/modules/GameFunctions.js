const sort_rank_order = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A']
const sort_suit_order = ['C', 'D', 'H', 'S']

export function sortCards(cards) {
    const cardsBySuit = []
    const sortedCards = []

    for (const suit of sort_suit_order) {
        const cardsInThisSuit = []
        for (const card of cards) {
            if (card.suit === suit) {
                cardsInThisSuit.push(card)
            }
        }
        cardsBySuit.push(cardsInThisSuit)
    }

    for (const cards of cardsBySuit) {
        const sortedCardsFromSuit = sortCardsSeries(cards)
        for (const card of sortedCardsFromSuit) {
            sortedCards.push(card)
        }
    }

    return sortedCards;
}


const sortCardsSeries = (cards) => {
    const sortedCards = [...cards]
    const compareCards = (card1, card2) => {
        let card1rankIndex = sort_rank_order.indexOf(card1.rank);
        let card2rankIndex = sort_rank_order.indexOf(card2.rank);
        if (card1rankIndex > card2rankIndex) return 1;
        if (card1rankIndex < card2rankIndex) return -1;
        return 0;
    }
    return sortedCards.sort(compareCards);
}