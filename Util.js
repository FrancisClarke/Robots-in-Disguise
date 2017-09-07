function replaceAll(str, find, replace) {
    "use strict";
    return str.toString().replace(new RegExp(find, 'g'), replace);
}

function stringToInt(str) {
    "use strict";
    return parseInt(str.toString(), 10);
}
