export const RENDER_AFTER_BEGIN = `afterbegin`;
export const RENDER_BEFORE_END = `beforeend`;
export const RENDER_AFTER = `after`;

/**
 *
 * @param {string} template
 * @return {ChildNode}
 */
export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

/**
 *
 * @param {Element} container
 * @param {AbstractComponent} component
 * @param {string} place
 */
export const render = (container, component, place = RENDER_BEFORE_END) => {
  switch (place) {
    case RENDER_AFTER_BEGIN:
      container.prepend(component.getElement());
      break;
    case RENDER_BEFORE_END:
      container.append(component.getElement());
      break;
    case RENDER_AFTER:
      container.after(component.getElement());
      break;
  }
};

/**
 *
 * @param {AbstractComponent} newComponent
 * @param {AbstractComponent} oldComponent
 */
export const replace = (newComponent, oldComponent) => {
  const parentElement = oldComponent.getElement().parentElement;
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();

  const isExistElements = !!(parentElement && newElement && oldElement);

  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};

/**
 *
 * @param {AbstractComponent}component
 */
export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

