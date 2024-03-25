function generateRandomNumbers(count, poolSize) {
    if (count > poolSize) {
      throw new Error('Count must be less than or equal to the pool size');
    }
  
    const numbers = Array.from({ length: poolSize }, (_, index) => index + 1);
  
    // Fisher-Yates (Knuth) Shuffle
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
  
    // Take the first 'count' elements
    const randomNumbers = numbers.slice(0, count);
  
    return randomNumbers;
  }
  

  module.exports = {generateRandomNumbers}