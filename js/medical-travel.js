/**
 * medical-travel.js
 * Renders the "Medical & Travel Expense Request" form. Each of the
 * six expense tables is driven by an array of row objects — an
 * empty array renders a friendly "no expenses submitted" row, and
 * a long array wraps onto additional pages automatically (see
 * paginate.js). This is the clearest place to demonstrate the
 * "1 row vs 10 rows" requirement in the video.
 */

function row(cells) { return cells; } // just documents intent; plain arrays of strings

const MEDICAL_DATASETS = {
  sample1: {
    label: 'Sample 1 — matches the source PDF',
    claimNo: '20042047',
    workerAppId: '712041',
    submittedAt: 'March 28, 2024 20:43',
    name: 'Madeleine Willson',
    privacyChecked: true,
    tables: {
      prescriptionDrugs: [
        ['Naproxen', 'February 28, 2024', 'February 29, 2024', 'Dr. Best', '$20.00'],
      ],
      otcDrugs: [
        ['Advil', 'March 28, 2024', '$8.00', 'Shoppers Drug Mart', 'Pain'],
      ],
      bandages: [
        ['Tensor', 'February 28, 2024', 'Yes', 'Dr. Best', '$10.00', 'Shoppers DrugMart'],
      ],
      parking: [
        ['333 St Mary Ave, Winnipeg MB R3C 4A5, Canada', 'March 28, 2024', '$10.00', 'Yes', '12245'],
      ],
      mileage: [
        ['March 28, 2024', 'HSC, 820 Sherbrook St, Winnipeg MB R3A 1R9, Canada', 'WCB, 333 Broadway, Winnipeg MB R3C 4W3, Canada', '20 km'],
      ],
      busTaxi: [
        ['March 28, 2024', '', 'HSC Winnipeg Women\u2019s Hospital, 665 William Ave, Winnipeg MB R3E 0Z2, Canada', 'Bus', '$3.00'],
        ['March 27, 2024', '25 Furby St, Winnipeg MB R3C 2A2, Canada', '440 Edmonton St, Winnipeg MB R3B 2M4, Canada', 'Taxi', '$15.00'],
      ],
    },
  },

  sample2: {
    label: 'Sample 2 — no expenses submitted yet',
    claimNo: '20051193',
    workerAppId: '803355',
    submittedAt: 'June 3, 2025 09:50',
    name: 'Devon Okafor',
    privacyChecked: true,
    tables: {
      prescriptionDrugs: [],
      otcDrugs: [],
      bandages: [],
      parking: [],
      mileage: [],
      busTaxi: [],
    },
  },

  sample3: {
    label: 'Sample 3 — a busy month (many rows, forces extra pages)',
    claimNo: '20063820',
    workerAppId: '918820',
    submittedAt: 'August 14, 2025 14:10',
    name: 'Priya Natarajan',
    privacyChecked: true,
    tables: {
      prescriptionDrugs: [
        ['Naproxen 250mg', 'Jul 2, 2025', 'Jul 3, 2025', 'Dr. A. Feldman', '$18.50'],
        ['Cyclobenzaprine', 'Jul 2, 2025', 'Jul 3, 2025', 'Dr. A. Feldman', '$24.00'],
        ['Naproxen 250mg (refill)', 'Jul 30, 2025', 'Jul 31, 2025', 'Dr. A. Feldman', '$18.50'],
        ['Acetaminophen 500mg', 'Aug 5, 2025', 'Aug 5, 2025', 'Dr. A. Feldman', '$9.75'],
      ],
      otcDrugs: [
        ['Advil', 'Jul 10, 2025', '$9.00', 'Shoppers Drug Mart', 'Pain'],
        ['Voltaren Gel', 'Jul 18, 2025', '$16.50', 'Rexall', 'Inflammation'],
        ['Epsom salts', 'Jul 25, 2025', '$7.20', 'Walmart', 'Soak / muscle relief'],
      ],
      bandages: [
        ['Lumbar brace', 'Jul 3, 2025', 'Yes', 'Dr. A. Feldman', '$65.00', 'MedEquip Winnipeg'],
        ['Tensor wrap', 'Jul 20, 2025', 'No', '', '$9.00', 'Shoppers Drug Mart'],
      ],
      parking: [
        ['River City Physio, 100 Main St, Winnipeg MB, Canada', 'Jul 3, 2025', '$6.00', 'Yes', '4471'],
        ['River City Physio, 100 Main St, Winnipeg MB, Canada', 'Jul 10, 2025', '$6.00', 'Yes', '4471'],
        ['HSC, 820 Sherbrook St, Winnipeg MB, Canada', 'Aug 9, 2025', '$12.00', 'No', ''],
      ],
      mileage: [
        ['Jul 3, 2025', 'River City Physio, 100 Main St, Winnipeg MB, Canada', 'Head Office, 55 Innovation Dr, Winnipeg MB, Canada', '14 km'],
        ['Jul 10, 2025', 'River City Physio, 100 Main St, Winnipeg MB, Canada', 'Head Office, 55 Innovation Dr, Winnipeg MB, Canada', '14 km'],
        ['Jul 17, 2025', 'River City Physio, 100 Main St, Winnipeg MB, Canada', 'Head Office, 55 Innovation Dr, Winnipeg MB, Canada', '14 km'],
        ['Jul 24, 2025', 'River City Physio, 100 Main St, Winnipeg MB, Canada', 'Head Office, 55 Innovation Dr, Winnipeg MB, Canada', '14 km'],
        ['Aug 9, 2025', 'HSC, 820 Sherbrook St, Winnipeg MB, Canada', 'Head Office, 55 Innovation Dr, Winnipeg MB, Canada', '9 km'],
      ],
      busTaxi: [
        ['Jul 31, 2025', '', 'Shoppers Drug Mart, 200 Portage Ave, Winnipeg MB, Canada', 'Bus', '$3.00'],
        ['Aug 9, 2025', 'Home', 'HSC, 820 Sherbrook St, Winnipeg MB, Canada', 'Taxi', '$22.00'],
      ],
    },
  },
};

function buildMedicalHeader(data) {
  return el('div', { className: 'form-header' }, [
    el('div', { className: 'brand' }, [
      el('img', { attrs: { src: 'assets/wcb-logo.svg', alt: 'WCB logo' } }),
      el('div', { className: 'brand-name', html: 'WCB<br>Workers Compensation<br>Board of Manitoba' }),
    ]),
    el('div', { className: 'title-block' }, [
      el('h1', { text: 'Medical & Travel Expense Request' }),
      el('div', { className: 'claim-boxes' }, [
        el('div', { className: 'box' }, [
          el('span', { text: 'Claim No. ' }),
          el('span', { className: 'claim-no', text: data.claimNo }),
        ]),
      ]),
    ]),
  ]);
}

function buildMedicalFooter(pageNum, totalPages, data) {
  return el('div', { className: 'form-footer' }, [
    el('div', { text: `Worker App ID: ${data.workerAppId}` }),
    el('div', { className: 'page-no' }, [
      el('div', { text: `Submitted: ${data.submittedAt}` }),
      el('div', { text: `Page ${pageNum} of ${totalPages}` }),
    ]),
  ]);
}

/**
 * Builds one <table> block. `rows` is an array of arrays (one array
 * per row, in column order). An empty `rows` array still renders the
 * table with a single "no expenses submitted" line, matching how a
 * worker with nothing to claim in that category would see the form.
 */
function expenseTable(title, columns, rows, note) {
  const thead = el('thead', {}, [
    el('tr', {}, columns.map((c) => el('th', { text: c }))),
  ]);

  const tbody = el('tbody', {}, []);
  if (rows.length === 0) {
    const tr = el('tr', { className: 'empty-row' }, [
      el('td', { attrs: { colspan: String(columns.length) }, text: 'No expenses submitted for this category.' }),
    ]);
    tbody.appendChild(tr);
  } else {
    rows.forEach((cells) => {
      const tr = el('tr', {}, cells.map((v) => el('td', { className: 'answer', text: v || '' })));
      tbody.appendChild(tr);
    });
  }

  const table = el('table', { className: 'data-table' }, [
    el('caption', { text: title }),
    thead,
    tbody,
  ]);

  if (note) {
    return el('div', {}, [el('p', { className: 'note', text: note }), table]);
  }
  return el('div', {}, [table]);
}

function buildMedicalBlocks(data) {
  const t = data.tables;
  const blocks = [];

  blocks.push(
    el('p', { className: 'intro-line', html: `<span class="name answer">${data.name}</span> requested reimbursement for the following medical and/or travel expenses:` })
  );

  blocks.push(expenseTable('Prescription Drugs', ['Drug Name', 'Prescription Date', 'Date Purchased', 'Healthcare Provider Name', 'Paid Amount'], t.prescriptionDrugs));
  blocks.push(expenseTable('Over-the-Counter Drugs', ['Drug Name', 'Date Purchased', 'Paid Amount', "Seller's Name", 'Reason for Purchasing'], t.otcDrugs));
  blocks.push(expenseTable('Bandages, Braces or Other Medical Supplies', ['Item Purchased', 'Date Purchased', 'Was this Prescribed?', 'Healthcare Provider Name', 'Paid Amount', "Seller's Name"], t.bandages));
  blocks.push(expenseTable('Parking for Medical Appointments', ['Address of Healthcare Provider/Medical Facility', 'Date', 'Paid Amount', 'Meter Used?', 'Meter Number'], t.parking));
  blocks.push(expenseTable(
    'Mileage to Medical Appointments',
    ['Appointment Date', 'Address of Healthcare Provider/Medical Facility', 'Address of Workplace', 'Number of km (Round Trip)'],
    t.mileage,
    'The WCB will generally reimburse only those transportation costs which are in excess of costs that would be incurred by the worker while travelling to and from work.'
  ));
  blocks.push(expenseTable(
    'Bus or Taxi Fare for Medical Appointments',
    ['Appointment Date', 'Address of Starting Point', 'Address of Healthcare Provider/Medical Facility', 'Bus or Taxi', 'Total Fare Paid'],
    t.busTaxi,
    '*Note: Pre-approval is required from your WCB representative to claim taxi fare(s).'
  ));

  blocks.push(
    el('div', { attrs: { style: 'margin-top:10px;display:flex;gap:8px;align-items:flex-start;' } }, [
      el('span', { className: 'chk' + (data.privacyChecked ? ' checked' : '') }),
      el('span', { text: 'I understand that the Privacy Notice applies to the personal information collected in this document.' }),
    ])
  );

  return blocks;
}

function renderMedicalTravel(datasetKey) {
  const data = MEDICAL_DATASETS[datasetKey];
  const blocks = buildMedicalBlocks(data);
  paginateDocument({
    mountEl: document.getElementById('pages'),
    blocks,
    buildHeader: () => buildMedicalHeader(data),
    buildFooter: (n, total) => buildMedicalFooter(n, total, data),
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('dataset-select');
  Object.entries(MEDICAL_DATASETS).forEach(([key, d]) => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = d.label;
    select.appendChild(opt);
  });
  select.addEventListener('change', () => renderMedicalTravel(select.value));
  renderMedicalTravel('sample1');

  document.getElementById('print-btn').addEventListener('click', () => window.print());
});
