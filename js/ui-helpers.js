/**
 * ui-helpers.js
 * Tiny helpers for building the form DOM without a framework.
 */

function el(tag, { className, text, html, attrs } = {}, children = []) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  if (html != null) node.innerHTML = html;
  if (attrs) Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  children.forEach((c) => c && node.appendChild(c));
  return node;
}

/** A single "checkbox + label" choice, e.g. "[x] I returned to work on: <date>" */
function choice(checked, labelHtml) {
  return el('div', { className: 'choice' }, [
    el('span', { className: 'chk' + (checked ? ' checked' : '') }),
    el('span', { html: labelHtml }),
  ]);
}

/** A bordered box titled e.g. "Select one:" holding a row of choices */
function choiceBox(caption, choices) {
  return el('div', { className: 'field-box' }, [
    caption ? el('div', { className: 'box-label', text: caption }) : null,
    el('div', { className: 'choice-row' }, choices),
  ]);
}

/** A bordered free-text answer box with an optional label above it */
function textBox(label, answer, tall) {
  return el('div', {}, [
    label ? el('div', { className: 'section-title', text: label }) : null,
    el('div', { className: 'free-text-box' + (tall ? ' tall' : '') }, [
      el('span', { className: 'answer', text: answer || '' }),
    ]),
  ]);
}

/** An underlined inline answer, e.g. "___answer___ \n Date" */
function underlineField(answer, caption) {
  return el('div', { attrs: { style: 'display:inline-block;text-align:center;' } }, [
    el('span', { className: 'underline-field answer', text: answer || '\u00A0' }),
    caption ? el('div', { className: 'field-caption', text: caption }) : null,
  ]);
}

function paragraph(text, className) {
  return el('p', { className: className || '', text });
}
