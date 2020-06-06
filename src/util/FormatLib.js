import moment from 'moment';
export class FormatLib {
    secondsToDate(seconds) {
        return moment(seconds).format('MMMM D, YYYY');
    }
    secondsToTime(seconds) {
        return moment(seconds).format('h:mm a'); 
    }
    //Stolen from Stack Overflow
    //http://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript
    dynamicSort(property) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {
            var result = (a[property].toLowerCase() < b[property].toLowerCase()) ? -1 : (a[property].toLowerCase() > b[property].toLowerCase()) ? 1 : 0;
            return result * sortOrder;
        }
    }
}