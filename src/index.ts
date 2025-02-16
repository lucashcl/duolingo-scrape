import * as cheerio from "cheerio"
import * as csv from "@std/csv"

function extract(html: string) {
   const $ = cheerio.load(html)
   const jp = $("div > h3").map((_, el) => $(el).text()).get()
   const en = $("div > p").map((_, el) => $(el).text()).get()
   return Array.from({ length: jp.length }, (_, i) => ({ jp: jp[i], en: en[i].trim().replaceAll(",", ";") }))
}

const duolingo = await Bun.file("input/data.html").text()
const output = extract(duolingo)

const csvText = csv.stringify(output, { columns: ["jp", "en"] })
console.log(csvText)

const today = new Date();
const formattedDate = today.toISOString().split('T')[0].replace(/-/g, '_');
Bun.write(`output/${formattedDate}-output.csv`, csvText);
