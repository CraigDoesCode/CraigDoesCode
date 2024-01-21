import Mustache from "mustache";
import * as path from "path";
import * as fs from "fs";
const MUSTACHE_MAIN_DIR = "./main.mustache";
const directory = "./images";
/**
 * DATA is the object that contains all
 * the data to be provided to Mustache
 * Notice the "name" and "date" property.
 */
let DATA = {
  name: "Craig",
  date: new Date().toLocaleDateString("en-GB", {
    weekday: "long",
  }),
};
const stack = fs.readdir(directory, (err, files) => {
  let stackItems = [];
  files.forEach((file) => {
    // get the details of the file
    let fileDetails = fs.lstatSync(path.resolve(directory, file));
    // check if the file is directory
    if (fileDetails.isDirectory()) {
      console.log("Directory: " + file);
    } else {
      stackItems.push(file);
    }
  });
  console.log(stackItems);
});

const generateReadMe = () => {
  fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync("README.md", output);
  });
};
generateReadMe();
