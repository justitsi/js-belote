export class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }

    getInfo() {
        return {
            rank: this.rank,
            suit: this.suit
        }
    }

}