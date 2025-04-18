import { program } from "commander";
import { scrapeScholar } from "../lib/scholar.js";
const pkg = require("../package.json");

program
  .name("scrapademic")
  .description("Scrape Google Scholar profiles from the command line")
  .version(pkg.version)
  .argument("<userId>", "Google Scholar user ID")
  .option("-y, --year", "Sort by year instead of citations")
  .option("-a, --all", "Scrape all publications (default)")
  .option("-r, --recent", "Scrape only recent publications")
  .option(
    "-l, --limit <number>",
    "Number of results if using --recent",
    parseInt
  )
  .option("--no-stealth", "Disable stealth mode")
  .action(async (userId, options) => {
    const sortBy = options.year ? "year" : "citations";
    const allPublications = options.recent ? false : true;
    const limit = options.limit || 6;
    const useStealth = options.stealth !== false;

    try {
      const results = await scrapeScholar(userId, {
        sortBy,
        allPublications,
        limit,
        useStealth,
      });

      console.log(JSON.stringify(results, null, 2));
    } catch (err) {
      console.error("Error scraping:", err.message);
      process.exit(1);
    }
  });

program.parse();
