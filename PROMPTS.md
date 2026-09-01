# AI Prompt History

This project's starting scaffold was generated with the help of an AI
assistant. Below is the prompt history and how the output was
used/reviewed.

1. **Prompt:** "Explain the problem statement briefly."
   Asked the AI to explain the assignment requirements before starting,
   to make sure I understood what was expected.

2. **Prompt:** Uploaded the two source PDFs (`Worker_Progress_Report.pdf`,
   `Medical_and_Travel_Expense_Request.pdf`) and asked it to guide me
   step by step while coding an HTML/CSS/JS replica with dynamic data,
   a header/footer, and page numbers.

3. **AI output:** A starter project with both form pages, shared CSS,
   a data file per form, and a `paginate.js` engine that measures
   rendered content and flows it across A4 pages so the page numbers
   in the footer are calculated rather than hard-coded.

4. **Prompt:** "How to remove the blank extra page which is appearing
   in the middle of the PDF generated."
   Tested the printed output across all four sample datasets myself,
   found the blank-page bug, and asked for help understanding the
   cause. Traced it to `js/paginate.js` packing page content too close
   to the exact physical page height — a known print-rendering edge
   case — and fixed it by increasing the `SAFETY` margin constant from
   `6` to `48` in that file. Re-tested printing across all datasets to
   confirm the blank page was gone.