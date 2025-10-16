import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'card';
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div, index) => {
      if (index === 0) div.className = 'card-image';
      else if (index === 1) div.className = 'card-content';
      else if (index === 2) {
        div.className = 'card-links';
        const links = div.querySelectorAll('a');
        links.forEach((link, index) => {
            switch (index) {
                case 1:
                    link.className = 'button';
                    break;
                case 2:
                    link.className = 'button secondary';
                    break;
                default:
                    break;
            }
        })
      }
      else div.className = 'card-extra';
    });

    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.replaceChildren(ul);
}
