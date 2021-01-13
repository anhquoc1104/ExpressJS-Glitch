module.exports = (sort) => {
    switch (sort) {
        case "DateUp":
            return { createAt: 1 };
        case "DateDown":
            return { createAt: -1 };
        case "NameUp":
            return { title: 1 };
        case "NameDown":
            return { title: -1 };
        default:
            return { createAt: 1 };
    }
};
