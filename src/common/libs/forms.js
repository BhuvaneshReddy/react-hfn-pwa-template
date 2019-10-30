export const isnotnull = (x) => (x !== undefined && x !== null && x !== "");
export const isnull = (x) => !isnotnull(x);

export const dict_get = (d, x, f) => {
    try {
        if (x in d) {
            return d[x]
        } else return f
    } catch (e) {
        return f
    }
}

export const options_get = (d, x, f) => {
    try {
        return d.find(r => r.name === x).label
    } catch (e) {
        return f
    }
}


export const idcard_options = {
    srcmid: "SRCM / Heartfulness ID",
    aadhar: "Aadhar",
    passport: "Passport",
    otherid: "Any Other Govt Issued ID",
    child: "Child (under 15 years)",
};

export function new_batch_code(name) {
    var d = new Date();
    var n = d.getTime() - 1520000000000;
    var out = '';
    var sumrem = 0;
    var itr = n;
    while (itr > 0) {
        var div = Math.floor(itr / 26);
        var rem = itr % 26;
        var out = String.fromCharCode(65 + rem) + out;
        itr = div;
        sumrem = sumrem + rem;
    }
    return name.replace("-", '').replace("_", '').replace(".", '').replace("@", '').slice(0, 2).toUpperCase() + "-" + out.slice(0, 4) + "-" + out.slice(out.length - 4, out.length);
};

