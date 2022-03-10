const months = [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre'
]

const days = [
    'dimanche',
    'lundi',
    'mardi',
    'mercredi',
    'jeudi',
    'vendredi',
    'samedi',
]

export var getDayNumbersMonthLettersYearNumbers = function (nonFormattedDate) {
    var date = new Date(nonFormattedDate);
    if (date.getDate() < 10) {
        return "0" + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
    } else {
        return date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
    }
}

export var getHours = function (nonFormattedDate) {
    var date = new Date(nonFormattedDate);
    return date.getHours() + "h" + date.getMinutes(); 
}

export var getDateDiff = function (nonFormattedStartDate, nonFormattedEndDate) {
    var startDate = new Date(nonFormattedStartDate); 
    var endDate = new Date(nonFormattedEndDate); 
    var stringResult = ""; 
    stringResult += getDayNumbersMonthLettersYearNumbers(startDate); 
    stringResult += " - " + getHours(startDate); 
    if (startDate.getDate() < endDate.getDate()) {
        stringResult += " au " + getDayNumbersMonthLettersYearNumbers(endDate); 
        stringResult += " - " + getHours(endDate); 
    } else {
        stringResult += " à " + getHours(endDate); 
    }
    return stringResult; 
}

//var formatDate = /*days[date.getDay()] + " " +*/ date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear() + " - " + date.getHours() + "h à ";
