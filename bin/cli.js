#!/usr/bin/env node
import { program } from "commander";
import { scrapeScholar } from "../lib/scholar.js";
import fs from "fs";
import path from "path";

program
  .name("scrapademic")
  .description("Scrape Google Scholar profiles from the command line")
  .version("1.0.2")
  .argument("<userId>", "Google Scholar user ID")
  .option("-y, --year", "Sort publications by year instead of citations")
  .option("-a, --all", "Scrape all publications (default is to scrape all)")
  .option("-r, --recent", "Scrape only recent publications")
  .option(
    "-l, --limit <number>",
    "Limit the number of results when using --recent",
    parseInt
  )
  .option("--no-stealth", "Disable stealth mode (default is enabled)")
  .option(
    "-o, --output <format>",
    "Save output to file: txt, json, csv, sql, md (markdown)"
  )
  .option(
    "-f, --file <filename>",
    "Specify output filename (default: scholar_output.<ext>)"
  )
  .action(async (userId, options) => {
    if (!userId) {
      console.error("Error: Missing required argument 'userId'.");
      console.log("\nUsage: scrapademic <userId> [options]");
      process.exit(1);
    }

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

      if (results.length === 0) {
        console.log("\nNo publications found for this user.");
        return;
      }

      console.log("\nScraping completed successfully.");

      if (options.output) {
        const format = options.output.toLowerCase();
        const filename =
          options.file || `scholar_output.${format === "md" ? "md" : format}`;
        const outputPath = path.resolve(process.cwd(), filename);

        let fileContent = "";

        switch (format) {
          case "json":
            fileContent = JSON.stringify(results, null, 2);
            break;
          case "txt":
            fileContent = results.map((p) => p.title).join("\n");
            break;
          case "csv":
            fileContent =
              "Title,Authors,Journal,Year,CitedBy\n" +
              results
                .map(
                  (p) =>
                    `"${p.title.replace(/"/g, '""')}","${p.authors.join(
                      ", "
                    )}","${p.journal}","${p.year}",${p.citedBy}`
                )
                .join("\n");
            break;
          case "sql":
            fileContent =
              "INSERT INTO publications (title, authors, journal, year, cited_by) VALUES\n" +
              results
                .map(
                  (p) =>
                    `("${p.title.replace(/"/g, '""')}", "${p.authors.join(
                      ", "
                    )}", "${p.journal}", "${p.year}", ${p.citedBy})`
                )
                .join(",\n") +
              ";";
            break;
          case "md":
            fileContent =
              `# Google Scholar Publications for ${userId}\n\n` +
              results
                .map(
                  (p, i) =>
                    `### ${i + 1}. ${p.title}\n` +
                    `- **Authors**: ${p.authors.join(", ")}\n` +
                    `- **Journal**: ${p.journal}\n` +
                    `- **Year**: ${p.year}\n` +
                    `- **Cited By**: ${p.citedBy}\n`
                )
                .join("\n");
            break;
          default:
            console.error(
              "Invalid output format. Use: txt, json, csv, sql, md"
            );
            process.exit(1);
        }

        fs.writeFileSync(outputPath, fileContent);
        console.log(`\nSaved output to ${outputPath}`);
      } else {
        console.log(JSON.stringify(results, null, 2));
        console.log(
          "\nWant to save this as a file? Use the --output flag with format: txt, json, csv, sql, or md"
        );
      }
    } catch (err) {
      console.error("\nError scraping:", err.message);
      process.exit(1);
    }
  });

program.on("command:*", () => {
  program.help();
});

if (process.argv.length === 2) {
  program.help();
}

program.addHelpText(
  "after",
  `
  Examples:
    scrapademic TESLA1618
        Scrape all publications sorted by citations (default)
  
    scrapademic TESLA1618 -y -r -l 5
        Scrape 5 recent publications sorted by year
  
    scrapademic TESLA1618 -r -l 3 -o json -f output.json
        Scrape 3 recent pubs and save as JSON to output.json
  
    scrapademic TESLA1618 -o md
        Scrape all and save as Markdown (scholar_output.md)
  
  Output formats:
    txt       Just titles
    json      Full structured data
    csv       Spreadsheet-friendly
    sql       SQL insert statements
    md        Markdown summary
  `
);

program.parse();
