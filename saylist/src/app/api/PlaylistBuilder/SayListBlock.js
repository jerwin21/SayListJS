export class SayListBlock {
  constructor(index, wordIndex, maxSize) {
    this.index = index;
    this.wordIndex = wordIndex;
    this.sizesNotTried = this.createSizeList(maxSize);
    this.sizeLastTried = 0; // Assuming a default value
    this.track = null; // Assuming a default value, adjust based on your needs
    this.phrase = ""; // Assuming a default value
  }

  createSizeList(maxSize) {
    let list = [];
    for (let i = 1; i <= maxSize; i++) {
      list.push(i);
    }

    // Shuffling the list
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]]; // Swap elements
    }

    return list;
  }
}
