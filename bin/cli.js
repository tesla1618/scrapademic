import { Command } from "commander";
import { scrapeScholar } from "../index.mjs";

const program = new Command();

program
  .name("scrapademic")
  .description("Scrape Google Scholar profiles")
  .argument("<userId>", "Google Scholar User ID")
  .option("-y, --year", "Sort by year")
  .option("-c, --citations", "Sort by citations")
  .option("-a, --all", "Get all publications")
  .option("-r, --recent", "Only get recent publications (default: 6)")
  .action(async (userId, options) => {
    const sort = options.citations ? "citations" : "year";
    const fullList = options.all ? true : false;

    try {
      const publications = await scrapeScholar({
        userId,
        sortBy: sort,
        getAll: fullList,
      });

      console.log(JSON.stringify(publications, null, 2));
    } catch (error) {
      console.error("❌ Error:", error.message);
    }
  });

program.parse();
