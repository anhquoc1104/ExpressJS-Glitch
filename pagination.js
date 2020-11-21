module.exports = (user, page, itemsPerPage, nameItems, arrItems, route) => {
  let page5Num = [
    parseInt(page) - 2,
    parseInt(page) - 1,
    parseInt(page),
    parseInt(page) + 1,
    parseInt(page) + 2,
  ];
  let perPage = itemsPerPage;
  let dropIx = (page - 1) * perPage;
  let limitIx = page * perPage;
  let totalPage = Math.ceil(arrItems.length / perPage);
  let objReturn = {
    user,
    page,
    totalPage,
    page5Num,
    route,
  };
  objReturn[nameItems] = arrItems.slice(dropIx, limitIx);
  return objReturn;
};
