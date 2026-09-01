# Diona-Internship Assignment — Worker Progress Report & Medical/Travel Expense Request

Plain HTML/CSS/JavaScript (no build step, no framework) recreation of the two
WCB Manitoba PDFs, driven entirely by JS data objects so the page can show
any amount of data.

## Run it
Open `index.html` in a browser (or use VS Code's "Live Server" extension —
see the setup guide below). No build step, no server-side code, no
dependencies.

## Files
```
index.html                     landing page linking to both forms
worker-progress-report.html    Worker Progress Report
medical-travel-expense.html    Medical & Travel Expense Request
css/common.css                 all layout/print styling for both forms
js/ui-helpers.js               tiny DOM-building helpers (el, choice, textBox...)
js/paginate.js                 generic engine: measures real rendered block
                                heights and flows them across A4 pages, so
                                "Page X of Y" is always correct for whatever
                                data is loaded — never hard-coded
js/worker-progress.js          data + rendering for the Progress Report
js/medical-travel.js           data + rendering for the Expense Request
assets/wcb-logo.svg            placeholder logo mark
PROMPTS.md                     AI prompt history used while building this
```

## What's dynamic (use the "Dataset" dropdown on each page to see it live)
- **Worker Progress Report**: claim number, worker name, every checkbox
  selection, every date/free-text answer, the 1–10 pain scale marker, and
  the page count/footer — three sample people with very different amounts
  of text are provided, including one long enough to push the certification
  paragraph onto an extra page.
- **Medical & Travel Expense Request**: all six expense tables (Prescription
  Drugs, OTC Drugs, Bandages/Braces, Parking, Mileage, Bus/Taxi) are rendered
  from row arrays. Sample 2 has zero rows in every table (shows the "no
  expenses submitted" fallback row); Sample 3 has several rows in each table
  and spills onto more pages, still with correct running page numbers.

## Assumptions made (source PDFs were forms filled out by a worker; a few
details had to be inferred since the brief didn't specify them)
- The original PDF's page 2 footer shows a blank "Worker App ID" field —
  treated as a source-form quirk rather than intentional and kept
  consistent across all pages here.
- Page breaks are decided **per section/table** (a whole table is kept
  together), not per table row. This matches the two sample PDFs, but means
  a single table with an unusually large number of rows could overflow one
  physical page rather than splitting mid-table. Row-level splitting (with
  a repeated table header) would be the next improvement if a table
  regularly needs to hold hundreds of rows.
- Checkbox/"select one" groups are rendered as read-only, styled to match
  the filled-in PDF exactly (this is a submitted-report replica, not a
  live input form), per "generate content similar to the two PDFs."
- Colors, fonts and the WCB logo are a close visual approximation, not an
  exact brand asset, since the real logo file wasn't provided.

## Print / PDF output
Each page uses `@page { size: A4; margin: 0; }` and the toolbar is hidden
in print via `@media print`. Use the "Print / Save as PDF" button (or
Ctrl/Cmd+P) to generate a PDF that mirrors the on-screen pagination exactly.

# DEMO Files

## 1. Medical-travel Video
[Open File 1](https://drive.google.com/file/d/1yenmLyuuy3NYRdjUnfuiHh81bzBP0zmA/view?usp=drive_link)

## 2. Worker-progress Video 
[Open File 2](https://drive.google.com/file/d/1hqQSy7LDc8seypUQcpLBo6DOkt9I4GWP/view?usp=drive_link)





