import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

export async function scrapeScholar(userId, options = {}) {
  const {
    sortBy = "citations", // or "year"
    allPublications = true,
  } = options;

  const url =
    `https://scholar.google.com/citations?hl=en&user=${userId}` +
    (sortBy === "year" ? "&sortby=pubdate" : "");

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle2" });
  await page.waitForSelector("tr.gsc_a_tr");

  if (allPublications) {
    while (true) {
      const isVisible = await page
        .$eval("#gsc_bpf_more", (btn) => {
          return !btn.disabled && btn.offsetParent !== null;
        })
        .catch(() => false);

      if (!isVisible) break;

      await page.click("#gsc_bpf_more");
      await new Promise((res) => setTimeout(res, 1000));
    }
  }

  const results = await page.evaluate(() => {
    const rows = document.querySelectorAll("tr.gsc_a_tr");
    const data = [];

    rows.forEach((row) => {
      const title = row.querySelector(".gsc_a_at")?.textContent.trim() || "";

      const authorsEl = row.querySelectorAll(".gs_gray");
      const authorsRaw = authorsEl[0]?.textContent.trim() || "";
      let authors = authorsRaw.split(",").map((a) => a.trim());
      if (authors.at(-1) === "...") {
        authors.pop();
        authors.push("and others");
      }

      let journal = "",
        year = "";
      if (authorsEl[1]) {
        const rawHTML = authorsEl[1].innerHTML;
        const parts = rawHTML.split("<span");
        const journalText = parts[0]?.trim() || "";
        const div = document.createElement("div");
        div.innerHTML = journalText;
        journal = div.textContent.trim();

        const yearSpan = authorsEl[1].querySelector("span.gs_oph");
        if (yearSpan) year = yearSpan.textContent.replace(",", "").trim();
      }

      const citedByEl = row.querySelector(".gsc_a_c a");
      const citedBy = citedByEl ? parseInt(citedByEl.textContent.trim()) : 0;

      data.push({ title, authors, journal, year, citedBy });
    });

    return data;
  });

  await browser.close();
  return results;
}

// CLI test
if (import.meta.url === `file://${process.argv[1]}`) {
  const userId = process.argv[2] || "KmgAshMAAAAJ";
  const options = {
    sortBy: "citations",
    allPublications: true,
  };

  scrapeScholar(userId, options)
    .then((data) => {
      console.log(JSON.stringify(data, null, 2));
      console.log("Scraping completed successfully.");
    })
    .catch((err) => {
      console.error("Scraping failed:", err);
    });
}
