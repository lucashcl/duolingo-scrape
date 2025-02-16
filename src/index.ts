import * as puppeteer from "puppeteer"
import { input } from "./input"

const DEST_URL = "https://www.duolingo.com/practice-hub/words"

const browser = await puppeteer.launch({headless: false})
const page = await browser.newPage()
await page.goto(DEST_URL)

const username = await input("Enter your Duolingo username: ")
const password = await input("Enter your Duolingo password: ")

if (!username || !password) {
   throw new Error("Username and password are required")
}

await page.type("input[type='text']", username)
await page.type("input[type='password']", password)
await page.click("button[type='submit']")
await Bun.sleep(10000)
await page.goto(DEST_URL)
await Bun.sleep(5000)

while (true) {
   try {
      await page.click("._2NNqw");
      await Bun.sleep(1000);
   } catch {
      break;
   }
}
const words = await page.evaluate(() => {
   const foundWords = document.querySelectorAll("._4JTMa > li");
   return Array.from(foundWords).map(word => [
      word.querySelector("h3")?.textContent,
      word.querySelector("p")?.textContent
   ]).slice(0, -1);
});

const output = `output/${new Date().toISOString().split("T")[0]}-${username}.csv`
const data = words.map(word => `${word[0]}|${word[1]}`).join("\n")
Bun.write(output, data, {createPath: true})
console.log(`Words saved to ${output}`)
await browser.close()

// await page.click("_2NNqw _2g-qq")

// // if incorrect password, close the browser
// if (page.url().includes("?isLoggingIn=true")) {
//    await browser.close()
//    throw new Error("Incorrect password")
// }
