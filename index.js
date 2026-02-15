import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

const git = simpleGit();
const path = "./data.json";

// SK heatmap pattern (week, day)
const SK_PATTERN = [
  // S
  [1, 1],
  [2, 1],
  [3, 1],
  [4, 1],
  [5, 1],
  [1, 2],
  [1, 3],
  [2, 3],
  [3, 3],
  [4, 3],
  [5, 4],
  [1, 5],
  [2, 5],
  [3, 5],
  [4, 5],
  [5, 5],
  // gap
  [7, 1],
  [7, 2],
  [7, 3],
  [7, 4],
  [7, 5],
  // K
  [9, 1],
  [9, 2],
  [9, 3],
  [9, 4],
  [9, 5],
  [10, 1],
  [11, 2],
  [12, 3],
  [10, 2],
  [11, 3],
  [10, 5],
  [11, 4],
  [12, 3],
  [10, 4],
  [11, 3],
];

// Start date: after GitHub join
const START_DATE = moment("2025-05-22");

const markCommit = async (week, day, strength = 5) => {
  const date = START_DATE.clone().add(week, "weeks").add(day, "days").format();

  for (let i = 0; i < strength; i++) {
    await jsonfile.writeFile(path, { date: `${date}-${i}` });
    await git.add([path]);
    await git.commit(`SK pixel ${week}:${day}`, { "--date": date });
  }
};

const drawGraph = async () => {
  for (let i = 0; i < SK_PATTERN.length; i++) {
    const [week, day] = SK_PATTERN[i];
    await markCommit(week, day, 6); // increase for darker green
  }

  console.log("✅ SK drawing completed. Pushing to GitHub...");
  await git.push("origin", "main", ["--force"]);
  console.log("🚀 Push complete! Check your GitHub heatmap.");
};

drawGraph();
