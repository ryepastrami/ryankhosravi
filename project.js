const slug = new URLSearchParams(window.location.search).get('project');
const projects = window.PROJECTS || [];
const index = projects.findIndex((project) => project.slug === slug);
const project = projects[index];
const container = document.querySelector('#project');

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function addMedia(images, chapter) {
  if (!images?.length) return;
  const media = element('div', '', images.length > 1 ? 'project-media pair' : 'project-media');
  images.forEach((image, imageIndex) => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt || '';
    img.loading = 'lazy';
    figure.appendChild(img);
    figure.appendChild(element('span', String(imageIndex + 1).padStart(2, '0'), 'project-image-number'));
    media.appendChild(figure);
  });
  chapter.appendChild(media);
}

if (!project) {
  document.title = 'Project not found • Ryan Khosravi';
  container.innerHTML = '<h1>Project not found</h1><p>That project wandered off. Try the <a href="tech.html">tech index</a>.</p>';
} else {
  document.title = `${project.title} • Ryan Khosravi`;
  container.classList.add('editorial-project');

  const brief = project.blocks.find((block) => block.type === 'section' && block.heading.toLowerCase() === 'brief');
  const summary = brief?.paragraphs?.[0] || '';

  const header = element('header', '', 'project-header');
  const titleBlock = document.createElement('div');
  titleBlock.appendChild(element('p', `project no. ${String(index + 1).padStart(2, '0')}`, 'project-kicker'));
  titleBlock.appendChild(element('h1', project.title));
  header.appendChild(titleBlock);

  const intro = element('div', '', 'project-intro');
  intro.appendChild(element('p', summary));
  const meta = element('p', '', 'project-meta');
  [project.company, ...(project.disciplines || [])].forEach((value) => meta.appendChild(element('span', value)));
  intro.appendChild(meta);
  header.appendChild(intro);
  container.appendChild(header);

  if (project.cover) {
    const hero = element('figure', '', 'project-hero');
    const image = document.createElement('img');
    image.src = project.cover;
    image.alt = `${project.title} project cover`;
    hero.appendChild(image);
    container.appendChild(hero);
  }

  const story = element('div', '', 'project-story');
  let chapterIndex = 0;
  project.blocks.forEach((block) => {
    const paragraphs = block === brief ? block.paragraphs.slice(1) : (block.paragraphs || []);
    const images = block.images || [];
    if (!paragraphs.length && !images.length) return;

    chapterIndex += 1;
    const chapter = element('section', '', 'project-chapter');
    if (paragraphs.length && images.length) chapter.classList.add('has-media');
    if (paragraphs.length && !images.length) chapter.classList.add('text-only');
    if (!paragraphs.length && images.length) chapter.classList.add('media-only');
    if (chapterIndex % 2 === 0) chapter.classList.add('reverse');

    if (paragraphs.length) {
      const copy = element('div', '', 'project-copy');
      copy.appendChild(element('p', String(chapterIndex).padStart(2, '0'), 'project-step'));
      paragraphs.forEach((text) => copy.appendChild(element('p', text)));
      chapter.appendChild(copy);
    }
    addMedia(images, chapter);
    story.appendChild(chapter);
  });
  container.appendChild(story);

  const next = projects[(index + 1) % projects.length];
  const nextLink = document.querySelector('#next-project');
  nextLink.href = `project.html?project=${next.slug}`;
  nextLink.textContent = `${next.title} →`;
}
