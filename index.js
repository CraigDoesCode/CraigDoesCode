import Mustache from "mustache";
import * as path from "path";
import * as fs from "fs";
import { promisify } from "util";

const MUSTACHE_MAIN_DIR = "./main.mustache";
const directory = "./images";
const readdirAsync = promisify(fs.readdir);
const lstatAsync = promisify(fs.lstat);

const getStack = async () => {
  let stackItems = [];
  try {
    const files = await readdirAsync(directory);
    for (const file of files) {
      const fileDetails = await lstatAsync(path.resolve(directory, file));
      if (fileDetails.isDirectory()) {
        console.log("Directory: " + file);
      } else {
        stackItems.push(file);
      }
    }
  } catch (err) {
    console.error("Error reading directory:", err);
  }
  return stackItems;
};

const stack = await getStack();

const capitalize = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

const trim = (text) => {
  console.log(text);
  if (!text) {
    console.log("No text");
    return;
  }
  let result = text.replace(/\.png/gi, "");
  result = result.replace(/-/gi, " ");
  result = result.replace(/js/gi, "JS");
  if (result.includes(" ")) {
    result = result
      .split(" ")
      .map((word) => {
        if (word.length > 2) {
          return capitalize(word);
        } else {
          return word;
        }
      })
      .join(" ");
  }

  return capitalize(result);
};

const DATA = {
  name: "Craig",
  date: new Date().toLocaleDateString("en-GB", {
    weekday: "long",
  }),
  stack: stack.map((item) => {
    return { name: trim(item), icon: item };
  }),
};

const generateReadMe = () => {
  fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    console.log("data: ", DATA);
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync("README.md", output);
  });
};
generateReadMe();
