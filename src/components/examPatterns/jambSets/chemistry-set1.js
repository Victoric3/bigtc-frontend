import chemistryTopics from "../topics/chemistryTopics";
import { generateRandomNumbers } from '../topics/generateRandomNumbers';

const randomNumbers = generateRandomNumbers(60, 62);
const chemistryPreset1 = Array.from({ length: 25 }, (_, index) => ({
    course: "chemistry",
    difficulty: ['hard'],
    topic: chemistryTopics[randomNumbers[0 + index]],
    questions: 2,
  }));

export default chemistryPreset1;