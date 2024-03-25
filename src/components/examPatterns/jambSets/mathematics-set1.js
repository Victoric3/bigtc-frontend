import mathematicsTopics from '../topics/mathematicsTopics';
import { generateRandomNumbers } from '../topics/generateRandomNumbers';

const randomNumbers = generateRandomNumbers(28, 29);
const mathematicsPreset = Array.from({ length: 25 }, (_, index) => ({
    course: "mathematics",
    difficulty: ['hard'],
    topic: mathematicsTopics[randomNumbers[0 + index] - 1],
    questions: 2,
  }));

export default mathematicsPreset;