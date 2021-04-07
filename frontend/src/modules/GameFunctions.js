export const sort_rank_order_normal = ['7', '8', '9', 'J', 'Q', 'K', '10', 'A']
export const sort_rank_order_trump = ['7', '8', 'Q', 'K', '10', 'A', '9', 'J']
export const sort_suit_order = ['C', 'D', 'H', 'S']

export function sortCards(cards, roundStatus) {
    const cardsBySuit = []
    const sortedCards = []

    // determine round trump
    let roundTrump = 'N'
    if (roundStatus)
        if (roundStatus.suitInfo)
            roundTrump = roundStatus.suitInfo.suit

    // split cards by suit
    for (const suit of sort_suit_order) {
        const cardsInThisSuit = []
        for (const card of cards) {
            if (card.suit === suit) {
                cardsInThisSuit.push(card)
            }
        }
        cardsBySuit.push(cardsInThisSuit)
    }

    // sort cards by suit and correct order
    for (const cards of cardsBySuit) {
        let sortedCardsFromSuit = []
        if (cards[0])
            if (cards[0].suit === roundTrump || roundTrump === 'A')
                sortedCardsFromSuit = sortCardsSeries(cards, sort_rank_order_trump)
            else
                sortedCardsFromSuit = sortCardsSeries(cards, sort_rank_order_normal)
        for (const card of sortedCardsFromSuit) {
            sortedCards.push(card)
        }
    }

    return sortedCards;
}


const sortCardsSeries = (cards, card_order) => {
    const sortedCards = [...cards]
    const compareCards = (card1, card2) => {
        let card1rankIndex = card_order.indexOf(card1.rank);
        let card2rankIndex = card_order.indexOf(card2.rank);
        if (card1rankIndex > card2rankIndex) return 1;
        if (card1rankIndex < card2rankIndex) return -1;
        return 0;
    }
    return sortedCards.sort(compareCards);
}