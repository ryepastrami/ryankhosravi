const itemKey = new URLSearchParams(window.location.search).get('item');
const item = window.FUN_DATA?.[itemKey];
const root = document.querySelector('#fun-item');

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function makeTable(headers, rows, className = '') {
  const wrap = element('div', '', `table-wrap ${className}`.trim());
  const table = document.createElement('table');
  const head = document.createElement('thead');
  const headRow = document.createElement('tr');
  headers.forEach((header) => headRow.appendChild(element('th', header)));
  head.appendChild(headRow);
  table.appendChild(head);
  const body = document.createElement('tbody');
  rows.forEach((row) => {
    const tr = document.createElement('tr');
    row.forEach((value) => tr.appendChild(element('td', String(value ?? ''))));
    body.appendChild(tr);
  });
  table.appendChild(body);
  wrap.appendChild(table);
  root.appendChild(wrap);
}

if (!item) {
  root.innerHTML = '<h1>Nothing here</h1><p>Try the <a href="fun.html">side quests index</a>.</p>';
} else {
  document.title = `${item.title} • Ryan Khosravi`;

  if (item.type === 'article') {
    root.classList.add('sidequest-article');
    const header = element('header', '', 'sidequest-header');
    const titleBlock = document.createElement('div');
    titleBlock.appendChild(element('p', 'side quest no. 01', 'sidequest-kicker'));
    const titleRow = element('div', '', 'sidequest-title-row');
    titleRow.appendChild(element('h1', item.title));
    titleRow.appendChild(element('span', item.emoji, 'sidequest-mark'));
    titleBlock.appendChild(titleRow);
    header.appendChild(titleBlock);

    const intro = element('div', '', 'sidequest-intro');
    if (item.description) intro.appendChild(element('p', item.description));
    if (item.meta?.length) {
      const meta = element('p', '', 'sidequest-meta');
      item.meta.forEach((value) => meta.appendChild(element('span', value)));
      intro.appendChild(meta);
    }
    header.appendChild(intro);
    root.appendChild(header);

    let imageIndex = 0;
    item.blocks.forEach((block) => {
      if (block.type === 'heading') root.appendChild(element('h2', block.text));
      if (block.type === 'paragraph') root.appendChild(element('p', block.text));
      if (block.type === 'pullquote') root.appendChild(element('blockquote', block.text, 'sidequest-pullquote'));
      if (block.type === 'image') {
        imageIndex += 1;
        const figure = document.createElement('figure');
        figure.className = `sidequest-image sidequest-image-${imageIndex}`;
        const image = document.createElement('img');
        image.src = block.src;
        image.alt = block.alt || '';
        image.loading = imageIndex === 1 ? 'eager' : 'lazy';
        figure.appendChild(image);
        if (block.caption) figure.appendChild(element('figcaption', block.caption));
        root.appendChild(figure);
      }
    });
  } else {
    root.appendChild(element('p', item.emoji, 'page-emoji'));
    root.appendChild(element('h1', item.title));
    if (item.description) root.appendChild(element('p', item.description));
  }

  if (item.type === 'survivor') {
    root.appendChild(element('h2', 'Watched'));
    makeTable(['Season', 'Name', 'Rating'], item.watched);
    root.appendChild(element('h2', 'Not watched yet'));
    makeTable(['Season', 'Name'], item.unwatched);
  }

  if (item.type === 'housewives') {
    makeTable(['City', ...Array.from({length: 17}, (_, i) => String(i + 1))], item.rows, 'housewives-table');
  }
}
