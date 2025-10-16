import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  footer.classList.add('footer-links');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const disclosuresResp = await fetch('/disclosures.json');
  const disclosuresData = await disclosuresResp.json();

  const disclosuresMeta = getMetadata('fragments/disclosures');
  const disclosuresPath = disclosuresMeta ? new URL(disclosuresMeta, window.location).pathname : '/fragments/disclosures';
  const disclosuresFragment = await loadFragment(disclosuresPath);

  const disclosures = document.createElement('div');
  disclosures.classList.add('disclosures');
  while (disclosuresFragment.firstElementChild) {
    disclosures.append(disclosuresFragment.firstElementChild);
  }

  disclosures.querySelectorAll('li').forEach((li) => {
    const [id, sub_id] = li.textContent.split('_');
    const { disclosure } = disclosuresData.data.find((d) => d.id === id && d.sub_id === sub_id);
    li.textContent = disclosure;
  });

  block.append(disclosures, footer);
}
