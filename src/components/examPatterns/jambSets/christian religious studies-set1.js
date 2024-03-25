import crsTopics from "../topics/christian religious studiesTopics";
import { generateRandomNumbers } from '../topics/generateRandomNumbers';

const randomNumbers = generateRandomNumbers(19, 20);
const crsPresset1 = Array.from({ length: 20 }, (_, index) => ({
    course: "Christian Religious Studies",
    difficulty: ['hard'],
    topic: crsTopics[randomNumbers[0 + index]],
    questions: 4,
  }));

export default crsPresset1;