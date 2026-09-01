/**
 * worker-progress.js
 * Renders the "Worker Progress Report" form from a plain JS data
 * object. Every visible field on the page comes from `data` below —
 * nothing is hard-coded in the HTML. Swap datasets (see the
 * dropdown) to see checkboxes, dates, text and the page count all
 * change together.
 */

// ---------------------------------------------------------------
// Sample datasets. In a real system these would come from an API;
// here they stand in for "1 row of data" vs "10 rows of data" so
// the dynamic behaviour can be demonstrated.
// ---------------------------------------------------------------
const WORKER_DATASETS = {
  sample1: {
    label: 'Sample 1 — matches the source PDF',
    claimNo: '20042047',
    workerAppId: '712041',
    submittedAt: 'March 19, 2024 19:21',
    name: 'Madeleine Willson',
    returnToWork: { status: 'returnedOn', returnedDate: 'March 15, 2024' },
    working: { mode: 'modReduced', otherText: '' },
    goingText: 'Terrible. Testing Testing',
    expectedReturnDate: '',
    concernsText: '',
    lastContact: { name: '', date: '' },
    recovery: { status: 'recovered', comments: '' },
    painScale: null,
    medicalTreatment: { receiving: false, providerType: '', last: { date: '', name: '' }, next: '', frequency: '' },
    homeExercises: { doing: false, list: '' },
    medication: { taking: false, name: '' },
    otherInfo: 'No info Testing Testing',
  },

  sample2: {
    label: 'Sample 2 — early days, not yet back at work',
    claimNo: '20051193',
    workerAppId: '803355',
    submittedAt: 'June 3, 2025 09:47',
    name: 'Devon Okafor',
    returnToWork: { status: 'notMissed', returnedDate: '' },
    working: { mode: '', otherText: '' },
    goingText: '',
    expectedReturnDate: 'June 24, 2025',
    concernsText: 'My shoulder still locks up when I reach overhead, so I am worried about lifting equipment again.',
    lastContact: { name: 'B. Chartrand (Site Supervisor)', date: 'May 30, 2025' },
    recovery: { status: 'notRecovered', comments: 'Physiotherapist says range of motion is improving week over week.' },
    painScale: 6,
    medicalTreatment: {
      receiving: true,
      providerType: 'Physiotherapist',
      last: { date: 'May 28, 2025', name: 'River City Physio' },
      next: 'June 5, 2025',
      frequency: 'twice a week',
    },
    homeExercises: { doing: true, list: 'Resistance band rows, wall slides, pendulum swings — 3 sets of 15, twice daily.' },
    medication: { taking: true, name: 'Naproxen 250mg' },
    otherInfo: '',
  },

  sample3: {
    label: 'Sample 3 — long-form answers (forces extra pages)',
    claimNo: '20063820',
    workerAppId: '918820',
    submittedAt: 'August 14, 2025 14:02',
    name: 'Priya Natarajan',
    returnToWork: { status: 'returnedOn', returnedDate: 'August 1, 2025' },
    working: { mode: 'other', otherText: 'Alternating between the warehouse floor and the front office, 3 days a week' },
    goingText:
      'It has been a gradual process. The first week back was mostly desk work while I rebuilt tolerance for standing, ' +
      'and my supervisor has been flexible about swapping tasks when my lower back starts to flare up during longer shifts.',
    expectedReturnDate: '',
    concernsText:
      'I am concerned about the upcoming inventory count, which usually involves several hours of repetitive bending ' +
      'and lifting boxes above shoulder height. I would like to discuss whether a modified duty plan can stay in place ' +
      'through that period, and whether a second worker can be assigned to the heavier bins so I am not doing that alone.',
    lastContact: { name: 'T. Nguyen (HR Case Manager)', date: 'August 10, 2025' },
    recovery: {
      status: 'notRecovered',
      comments:
        'My surgeon says the fusion is healing on schedule per the last imaging, but recommends at least another ' +
        'two months before lifting anything over 20 lbs without assistance.',
    },
    painScale: 4,
    medicalTreatment: {
      receiving: true,
      providerType: 'Orthopaedic Surgeon / Physiotherapist',
      last: { date: 'August 9, 2025', name: 'Dr. A. Feldman' },
      next: 'September 2, 2025',
      frequency: 'weekly physiotherapy, monthly surgeon follow-up',
    },
    homeExercises: {
      doing: true,
      list:
        'Core stability holds, glute bridges, gentle McKenzie extensions, and a 20-minute daily walk, ' +
        'progressing distance only when pain stays under 3/10 the next morning.',
    },
    medication: { taking: true, name: 'Acetaminophen 500mg as needed, Cyclobenzaprine at night' },
    otherInfo:
      'I have attached my employer\u2019s modified-duty agreement separately and would appreciate confirmation ' +
      'that it has been received, since my last two submissions did not show up in the online portal.',
  },
};

// ---------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------
function buildWorkerHeader(data) {
  return el('div', { className: 'form-header' }, [
    el('div', { className: 'brand' }, [
      el('img', { attrs: { src: 'assets/wcb-logo.svg', alt: 'WCB logo' } }),
      el('div', { className: 'brand-name', html: 'WCB<br>Workers Compensation<br>Board of Manitoba' }),
    ]),
    el('div', { className: 'title-block' }, [
      el('h1', { text: 'Worker Progress Report' }),
      el('div', { className: 'claim-boxes' }, [
        el('div', { className: 'box' }, [
          el('span', { text: 'Claim No. ' }),
          el('span', { className: 'claim-no', text: data.claimNo }),
        ]),
        el('div', { className: 'box', text: 'WP' }),
      ]),
    ]),
  ]);
}

function buildWorkerFooter(pageNum, totalPages, data) {
  return el('div', { className: 'form-footer' }, [
    el('div', { text: `Worker App ID: ${data.workerAppId}` }),
    el('div', { className: 'page-no' }, [
      el('div', { text: `Submitted: ${data.submittedAt}` }),
      el('div', { text: `Page ${pageNum} of ${totalPages}` }),
    ]),
  ]);
}

function buildWorkerBlocks(data) {
  const blocks = [];

  // --- Intro + Return to Work status ---
  blocks.push(
    el('div', {}, [
      el('p', { className: 'intro-line', html: `<span class="name answer">${data.name}</span> provided the following updates in relation to their claim:` }),
      el('div', { className: 'section-title', text: 'Return to Work' }),
    ])
  );

  const rtw = data.returnToWork;
  blocks.push(
    choiceBox('Select one:', [
      choice(rtw.status === 'notMissed', 'I have not missed time from work'),
      choice(rtw.status === 'notReturned', 'I have not returned to work'),
      choice(rtw.status === 'returnedOn', `I returned to work on: <span class="answer">${rtw.returnedDate || '\u2014'}</span>`),
    ])
  );

  const w = data.working;
  const modeChoices = [
    choice(w.mode === 'fullRegular', 'Full duties, regular hours'),
    choice(w.mode === 'fullReduced', 'Full duties, reduced hours'),
    choice(w.mode === 'modRegular', 'Modified duties, regular hours'),
    choice(w.mode === 'modReduced', 'Modified duties, reduced hours'),
  ];
  const otherRow = choice(w.mode === 'other', `Other: <span class="answer">${w.otherText || ''}</span>`);
  blocks.push(
    el('div', { className: 'field-box' }, [
      el('div', { className: 'box-label', text: 'I am working:' }),
      el('div', { className: 'choice-row' }, modeChoices),
      el('div', { className: 'choice-row', attrs: { style: 'margin-top:8px;' } }, [otherRow]),
    ])
  );

  blocks.push(textBox('My return to work is going:', data.goingText));

  blocks.push(
    el('div', { attrs: { style: 'margin-bottom:10px;' } }, [
      el('span', { text: 'I expect to return to work on: ' }),
      underlineField(data.expectedReturnDate, 'Date'),
    ])
  );

  blocks.push(textBox('I have the following concerns about returning to work:', data.concernsText, true));

  blocks.push(
    el('div', { attrs: { style: 'margin-bottom:10px;' } }, [
      el('span', { text: 'I was most recently in contact with: ' }),
      underlineField(data.lastContact.name, '(Name of employer contact)'),
      el('span', { text: ' on ' }),
      underlineField(data.lastContact.date, 'Date'),
    ])
  );

  // --- Recovery ---
  blocks.push(el('div', { className: 'section-title', text: 'Recovery' }));
  const rec = data.recovery;
  blocks.push(
    choiceBox('Select one:', [
      choice(rec.status === 'notRecovered', 'I have not fully recovered from my workplace injury.'),
      choice(rec.status === 'recovered', 'I have fully recovered from my workplace injury.'),
    ])
  );
  blocks.push(textBox('I have provided the following comments about my recovery:', rec.comments, true));

  // --- Pain scale ---
  const scaleNums = [];
  for (let n = 1; n <= 10; n++) {
    scaleNums.push(el('div', { className: 'num' + (data.painScale === n ? ' selected' : ''), text: String(n) }));
  }
  blocks.push(
    el('div', {}, [
      el('div', {
        className: 'section-title',
        text: 'I rate my current pain/discomfort on a scale of 1-10, where 1 is no pain and 10 is severe pain.',
      }),
      el('div', { className: 'pain-scale' }, scaleNums),
    ])
  );

  // --- Medical treatment ---
  const mt = data.medicalTreatment;
  blocks.push(
    choiceBox('Select one:', [
      choice(!mt.receiving, 'I am not continuing to receive medical treatment for my workplace injury.'),
      choice(mt.receiving, `I am continuing to receive medical treatment from: <span class="answer">${mt.providerType || ''}</span> (Medical Provider Type)`),
    ])
  );
  blocks.push(
    el('div', { attrs: { style: 'margin-bottom:10px;' } }, [
      el('span', { text: 'My last medical treatment was from ' }),
      underlineField(mt.last.date, 'Date'),
      underlineField(mt.last.name, '(Medical Provider Name)'),
    ])
  );
  blocks.push(
    el('div', { attrs: { style: 'margin-bottom:10px;' } }, [
      el('span', { text: 'My next medical treatment is ' }),
      underlineField(mt.next, 'Date'),
      el('span', { className: 'answer', text: mt.frequency ? `  (${mt.frequency})` : '' }),
    ])
  );

  // --- Home exercises ---
  const he = data.homeExercises;
  blocks.push(
    choiceBox('Select one:', [
      choice(!he.doing, 'I am not doing home exercises for my workplace injury.'),
      choice(he.doing, 'I am doing home exercises for my workplace injury.'),
    ])
  );
  blocks.push(textBox('List the exercises you are doing:', he.list));

  // --- Medication ---
  const med = data.medication;
  blocks.push(
    choiceBox('Select one:', [
      choice(!med.taking, 'I am not taking medication for my workplace injury.'),
      choice(med.taking, `I am taking medication for my workplace injury: <span class="answer">${med.name || ''}</span> (Name of prescribed medication)`),
    ])
  );

  // --- Other information ---
  blocks.push(el('div', { className: 'section-title', text: 'Other Information' }));
  blocks.push(textBox('I would like to provide the following additional information about my claim/injury:', data.otherInfo));

  // --- Certification ---
  blocks.push(
    el('p', {
      attrs: { style: 'font-size:11px;line-height:1.5;' },
      text:
        'I certify that the information given on this form is true, correct and complete to the best of my knowledge. ' +
        'I agree to notify the Workers Compensation Board of Manitoba (WCB) immediately once I return to any form of ' +
        'work and/or employment. I understand that it is an offence to knowingly make a false statement to the WCB. ' +
        'I also understand that it is an offence to withhold information from WCB which affects my entitlement to ' +
        'compensation (e.g., full or partial recovery from injury, ability to return to work, sources of additional ' +
        'income, etc.). I understand that refusing to co-operate with, or follow my treatment, may result in the WCB ' +
        'reducing or suspending my benefits. I understand that the Privacy Notice applies to the personal information ' +
        'collected in this document.',
    })
  );

  return blocks;
}

function renderWorkerProgress(datasetKey) {
  const data = WORKER_DATASETS[datasetKey];
  const blocks = buildWorkerBlocks(data);
  paginateDocument({
    mountEl: document.getElementById('pages'),
    blocks,
    buildHeader: () => buildWorkerHeader(data),
    buildFooter: (n, total) => buildWorkerFooter(n, total, data),
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('dataset-select');
  Object.entries(WORKER_DATASETS).forEach(([key, d]) => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = d.label;
    select.appendChild(opt);
  });
  select.addEventListener('change', () => renderWorkerProgress(select.value));
  renderWorkerProgress('sample1');

  document.getElementById('print-btn').addEventListener('click', () => window.print());
});
