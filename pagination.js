module.exports.pagination = (user, page, itemsPerPage, items, arrItems, route) => {
    let page5Num = [
        parseInt(page) - 2,
        parseInt(page) - 1,
        parseInt(page),
        parseInt(page) + 1,
        parseInt(page) + 2
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
        route
    };
    objReturn[items] = arrItems.slice(dropIx, limitIx);
    return objReturn;
}