export class Accordion {
  constructor(accordionElem, options) {

    let defaultOptions = {
      speed: 300,
      turn : false
    }
    this.accordion = document.querySelector(`[data-accordion="${accordionElem}"]`);
    this.options = Object.assign(defaultOptions, options);
    this.allAccordionCollapse = this.accordion.querySelectorAll('.accordion__collapse');
    this.allAccordionButton = this.accordion.querySelectorAll('.accordion__button');

    this.initialize();
    this.setupEventListeners();
  }

  initialize() {
    this.allAccordionCollapse.forEach(collapseElement => {
      collapseElement.setAttribute('aria-hidden', 'true');
      collapseElement.setAttribute('id', 'accordion__collapse');
      this.updateCollapseStyles(collapseElement);
    });

    this.allAccordionButton.forEach(buttonElement => {
      buttonElement.setAttribute('aria-expanded', 'false');
      buttonElement.setAttribute('aria-controls', 'accordion__collapse');
    });
  }

  updateCollapseStyles(collapseElement) {
    const isOpen = collapseElement.classList.contains('accordion__collapse_open');
    collapseElement.style.cssText = `
      transition-duration: ${this.options.speed + 'ms'};
      transition-property: grid-template-rows;
      display: grid;
      grid-template-rows: ${isOpen ? '1fr' : '0fr'};
    `;

    collapseElement.querySelector('.accordion__content').style.cssText = `
      min-height:0;
      overflow: hidden;
    `;
  }

  setupEventListeners() {
    this.accordion.addEventListener('click', (event) => {
      this.allAccordionCollapse.forEach(collapseElement => {
        collapseElement.setAttribute('aria-hidden', 'true');
        collapseElement.setAttribute('id', 'accordion__collapse');
      });

      const accordionButton = event.target.closest('.accordion__button');
      const accordionCollapse = accordionButton?.nextElementSibling;
      const accordionCollapseOpen = accordionCollapse?.classList.contains('accordion__collapse_open');

      if (accordionCollapse && accordionButton && !accordionCollapseOpen && this.options.turn) {
        this.allAccordionButton.forEach(buttonElement => {
          buttonElement.classList.remove('accordion__button_active');
          buttonElement.setAttribute('aria-expanded', 'false');
        });

        accordionButton.classList.add('accordion__button_active');
        accordionButton.setAttribute('aria-expanded', 'true');

        this.allAccordionCollapse.forEach(collapseElement => {
          collapseElement.classList.remove('accordion__collapse_open');
          this.updateCollapseStyles(collapseElement);
          collapseElement.setAttribute('aria-hidden', 'true');
        });

        accordionCollapse.classList.add('accordion__collapse_open');
        this.updateCollapseStyles(accordionCollapse);
        accordionCollapse.removeAttribute('aria-hidden', 'true');
      } else if (accordionCollapse) {
        accordionCollapse.classList.remove('accordion__collapse_open');
        accordionCollapse.setAttribute('aria-hidden', 'true');
        this.updateCollapseStyles(accordionCollapse);

        accordionButton?.classList.remove('accordion__button_active');
        accordionButton?.setAttribute('aria-expanded', 'false');
      }

      if (accordionCollapse && accordionButton && !accordionCollapseOpen) {
        accordionButton.classList.add('accordion__button_active');
        accordionButton.setAttribute('aria-expanded', 'true');
        accordionCollapse.classList.add('accordion__collapse_open');
        this.updateCollapseStyles(accordionCollapse);
        accordionCollapse.removeAttribute('aria-hidden', 'true');
      }
    });
  }
}