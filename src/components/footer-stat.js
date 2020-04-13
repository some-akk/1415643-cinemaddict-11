export const createFooterStatTemplate = (number) => {
  const filmCount = new Intl.NumberFormat(`ru-RU`).format(number);
  return `<p>${filmCount} movies inside</p>`;
};
