import physicsTopics from "../topics/physicsTopics";
import { generateRandomNumbers } from '../topics/generateRandomNumbers';

const randomNumbers = generateRandomNumbers(30, 38);
const physicsPreset1 = Array.from({ length: 25 }, (_, index) => ({
    course: "physics",
    difficulty: ['hard'],
    topic: physicsTopics[randomNumbers[0 + index]],
    questions: 2
  }));

export default physicsPreset1;