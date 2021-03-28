import { Card } from './Card'

export class Deck {
    // clubs, diamonds, hearts, spadeS
    // this is the rank of the suits in belote
    validSuits = ['C', 'D', 'H', 'S']
    validRanks = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A']


    constructor() {
        this.cards = []
    }

    async initDeck() {
        for (const suit of this.validSuits)
            for (const rank of this.validRanks)
                this.cards.push(new Card(suit, rank))
    }

    readDeck() {
        return this.cards
    }

}