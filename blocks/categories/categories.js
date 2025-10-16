export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'category-item';
    while (row.firstElementChild) li.append(row.firstElementChild);
    const picture = li.querySelector('picture');
    const anchor = li.querySelector('a');

    if (window.location.pathname === anchor.pathname) {
      li.classList.add('active');
    }

    anchor.innerHTML = `<span>${anchor.textContent}</span>`;
    anchor.prepend(picture);

    li.replaceChildren(anchor);
    ul.append(li);
  });
  block.replaceChildren(ul);
}
