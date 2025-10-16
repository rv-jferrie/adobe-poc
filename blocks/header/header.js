import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  // const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  // button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const navFragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';

  const nav = document.createElement('nav');
  nav.id = 'header-menu';
  nav.className = 'navbar';
  while (navFragment.firstElementChild) nav.append(navFragment.firstElementChild);

  const primaryNavMeta = getMetadata('primary-nav');
  const primaryNavPath = primaryNavMeta ? new URL(primaryNavMeta, window.location).pathname : '/primary-nav';
  const primaryNavFragment = await loadFragment(primaryNavPath);

  const primaryNav = document.createElement('nav');
  primaryNav.id = 'primary-nav';
  primaryNav.className = 'primary-nav';
  while (primaryNavFragment.firstElementChild) {
    primaryNav.append(primaryNavFragment.firstElementChild);
  }

  primaryNav.querySelector('a').classList.add('active');

  const breadcrumbsMeta = getMetadata('fragments/breadcrumbs');
  const breadcrumbsPath = breadcrumbsMeta ? new URL(breadcrumbsMeta, window.location).pathname : '/fragments/breadcrumbs';
  const breadcrumbsFragment = await loadFragment(breadcrumbsPath);

  const breadcrumbs = document.createElement('nav');
  breadcrumbs.id = 'breadcrumbs';
  breadcrumbs.className = 'breadcrumbs';
  while (breadcrumbsFragment.firstElementChild) {
    breadcrumbs.append(breadcrumbsFragment.firstElementChild);
  }

  // console.log(primaryNavFragment);

  // const classes = ['brand', 'items'];
  // classes.forEach((c, i) => {
  //   const section = nav.children[i];
  //   if (section) section.classList.add(`nav-${c}`);
  // });

  // const navBrand = nav.querySelector('.nav-brand');
  // const brandLink = navBrand.querySelector('.button');
  // if (brandLink) {
  //   brandLink.className = '';
  //   brandLink.closest('.button-container').className = '';
  // }

  // hamburger for mobile
  // const hamburger = document.createElement('div');
  // hamburger.classList.add('nav-hamburger');
  // hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
  //     <span class="nav-hamburger-icon"></span>
  //   </button>`;
  // hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  // nav.prepend(hamburger);
  // nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  // toggleMenu(nav, navSections, isDesktop.matches);
  // isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  nav.lastElementChild.querySelector('a').classList.add('button');

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  const primaryNavWrapper = document.createElement('div');
  primaryNavWrapper.className = 'primary-nav-wrapper';
  primaryNavWrapper.append(primaryNav);
  block.append(primaryNavWrapper);

  const breadcrumbsWrapper = document.createElement('div');
  breadcrumbsWrapper.className = 'breadcrumbs-wrapper';
  breadcrumbsWrapper.append(breadcrumbs);
  block.append(breadcrumbsWrapper);
}
