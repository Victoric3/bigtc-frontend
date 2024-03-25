import biologyTopics from "../topics/biologyTopics";
import { generateRandomNumbers } from '../topics/generateRandomNumbers';

const randomNumbers = generateRandomNumbers(29, 30);
const biologyPreset1 = Array.from({ length: 25 }, (_, index) => ({
    course: "biology",
    difficulty: ['hard'],
    topic: biologyTopics[randomNumbers[0 + index]],
    questions: 2,
  }));

export default biologyPreset1;