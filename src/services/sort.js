module.exports = (sort) => {
    switch (sort) {
        case "DateUp":
            return { createAt: 1 };
        case "DateDown":
            return { createAt: -1 };
        case "TitleUp":
            return { title: 1 };
        case "TitleDown":
            return { title: -1 };
        case "NameUp":
            return { name: 1 };
        case "NameDown":
            return { name: -1 };
        default:
            return { createAt: 1 };
    }
};
