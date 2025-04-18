# 📚 Scrapademic

**Scrapademic** is a powerful, zero-setup JavaScript CLI + library to scrape academic profile data from **Google Scholar**.  
Built using Puppeteer with stealth plugin to avoid detection, Scrapademic extracts full publication lists including authors, journal info, citation count, and more.

---

## ✨ Features

- 🔍 Scrapes Google Scholar profiles
- 🧠 Detects all publications, not just recent ones
- 📊 Sort publications by **citations** or **year**
- 🛡️ Uses stealth mode to bypass bot detection
- 📦 Use as both CLI and Node.js library
- 📃 Output to **txt**, **json**, **csv**, **sql**, or **markdown**

---

## 🚀 Installation

```bash
npm install -g scrapademic   # for CLI use
# or
npm install scrapademic      # for programmatic use
```

---

## 🔪 CLI Usage

```bash
scrapademic <userId> [options]
```

### CLI Examples

```bash
scrapademic TESLA1618
  # Scrape all publications sorted by citations (default)

scrapademic TESLA1618 -y -r -l 5
  # Scrape 5 recent publications sorted by year

scrapademic TESLA1618 -r -l 3 -o json -f output.json
  # Scrape 3 recent pubs and save as JSON to output.json

scrapademic TESLA1618 -o md
  # Scrape all and save as Markdown (scholar_output.md)
```

### CLI Options

| Flag                    | Description                                               |
| ----------------------- | --------------------------------------------------------- |
| `<userId>`              | Required. Google Scholar user ID                          |
| `-y, --year`            | Sort publications by year instead of citations            |
| `-a, --all`             | Scrape all publications (default behavior)                |
| `-r, --recent`          | Scrape only recent publications                           |
| `-l, --limit <number>`  | Limit results when using `--recent`                       |
| `--no-stealth`          | Disable stealth mode (enabled by default)                 |
| `-o, --output <format>` | Save to file: txt, json, csv, sql, md                     |
| `-f, --file <filename>` | Specify output filename (default: `scholar_output.<ext>`) |

---

## 🧪 Library Usage

```js
import { scrapeScholar } from "scrapademic";

const data = await scrapeScholar("TESLA1618", {
  sortBy: "year", // or "citations" (default)
  allPublications: true, // true: fetch all, false: first page only
  limit: 10, // max results if allPublications is false
  useStealth: true, // default true
});

console.log(data);
```

### Example Output:

```json
[
  {
    "title": "Deep Learning for Cats",
    "authors": ["Jane Doe", "John Smith", "and others"],
    "journal": "Journal of Feline Studies",
    "year": "2022",
    "citedBy": 54
  }
]
```

### scrapeScholar Options

| Option            | Type    | Default     | Description                                                   |
| ----------------- | ------- | ----------- | ------------------------------------------------------------- |
| `sortBy`          | String  | "citations" | Sort publications by `"citations"` or `"year"`                |
| `allPublications` | Boolean | true        | If true, loads all papers by clicking "Show more" repeatedly  |
| `limit`           | Number  | 6           | If `allPublications` is false, sets max publications to fetch |
| `useStealth`      | Boolean | true        | Use Puppeteer stealth plugin to avoid detection               |

---

## 🧰 Output Formats

| Format | Description                          |
| ------ | ------------------------------------ |
| `txt`  | Title only per line                  |
| `json` | Full structured data (default print) |
| `csv`  | Spreadsheet-friendly                 |
| `sql`  | SQL insert statements                |
| `md`   | Markdown list                        |

---

## 🤩 Tech Stack

- [puppeteer-extra](https://github.com/berstend/puppeteer-extra)
- [puppeteer-extra-plugin-stealth](https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth)

---

## 📚 Roadmap

- [x] Google Scholar scraper
- [x] CLI support with file export
- [ ] Add support for ResearchGate
- [ ] Add support for Semantic Scholar
- [ ] Automatic citation tracking

---

## 🧑‍💻 Author

Made with 🧠 by [Rajieb R.](https://github.com/tesla1618)

---

## 📄 License

MIT — free to use, modify, and share.

---

## ⭐️ Star the Repo

If you find this helpful, please consider giving it a ⭐️ on [GitHub](https://github.com/tesla1618/scrapademic)!
