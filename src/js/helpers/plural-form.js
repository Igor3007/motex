/**
 *
 * @param num - число перечисляемых единиц
 * @param titles - массив форм типа ['день','дня','дней']
 * @returns {*} - подходящая к числу форма
 */
export const pluralForm = (num, titles) => {
  const n = parseInt(num, 10);
  const index = n%10===1 && n%100!==11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2;
  return(titles[index]);
};
