module.exports = (date) => {
    return {
        getMonthFormat: (date.getMonth() + 1).toString().padStart(2, "0"),
        getDateFormat: date.getDate().toString().padStart(2, "0"),
        getHoursFormat: date.getHours().toString().padStart(2, "0"),
        getMinutesFormat: date.getMinutes().toString().padStart(2, "0"),
    };
};
