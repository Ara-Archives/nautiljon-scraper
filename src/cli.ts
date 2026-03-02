import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { select } from "@inquirer/prompts";
import { searchManga } from "./scraper/search.js";

yargs(hideBin(process.argv))
  .command(
    "nautiljon",
    "Scrape a series from nautiljon",
    (y) =>
      y.option("search", {
        type: "string",
        demandOption: true,
        describe: "the series title to search for",
      }),
    async (argv) => {
      const choices = await searchManga({
        search: argv.search,
      });

      if (!choices.length) {
        console.log("No results found.");
        return;
      }

      const selected = await select({
        message: "Choose a manga:",
        choices: choices.map((manga) => ({
          name: manga.title,
          value: manga,
        })),
      });

      console.log("You selected:", selected);
    },
  )
  .demandCommand()
  .strict()
  .help()
  .parse();
