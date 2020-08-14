import {
    DatasetInstance,
    DatasetInstanceAsync,
    DatasetMeta,
    GeckoboardInstance,
    GeckoboardInstanceAsync, GeckoboardResponse,
} from "./Geckoboard";

function transformDatasetToAsync(dataset: DatasetInstance, fields: DatasetMeta["fields"]): DatasetInstanceAsync {
    return {
        async add(body, options = {}) {
            const state = validData(fields, body);
            if (!state.success) {
                return state;
            }
            return new Promise((resolve, reject) => {
                dataset.post(body, options, (err: string) => {
                    if (err) {
                        return resolve({success: false, content: err});
                    }
                    return resolve({success: true});
                });
            });
        },
        async set(body) {
            const state = validData(fields, body);
            if (!state.success) {
                return state;
            }
            return new Promise((resolve, reject) => {
                dataset.put(body, (err: string) => {
                    if (err) {
                        return resolve({success: false, content: err});
                    }
                    return resolve({success: true});
                });
            });
        },
    };
}

export default function TransformCallback(gb: GeckoboardInstance): GeckoboardInstanceAsync {
    return {
        VERSION: gb.VERSION,
        ping: () => {
            return new Promise((resolve, reject) => {
                gb.ping((err: string) => {
                    if (err) {
                        return resolve({success: false, content: err});
                    }
                    return resolve({success: true});
                });
            });
        },
        datasets: {
            findOrCreate: async (body: DatasetMeta) => {
                const state = validateDataset(body);
                if (!state.success) {
                    return state;
                }
                return new Promise((resolve, reject) => {
                    gb.datasets.findOrCreate(body, (err: string, dataset: DatasetInstance) => {
                        if (err) {
                            return resolve({success: false, content: err});
                        }
                        return resolve({success: true, dataset: transformDatasetToAsync(dataset, body.fields)});
                    });
                });
            },
            delete: (id: string) => {
                return new Promise((resolve, reject) => {
                    gb.datasets.delete(id, (err: string) => {
                        if (err) {
                            return resolve({success: false, content: err});
                        }
                        return resolve({success: true});
                    });
                });
            },
        },
    } as GeckoboardInstanceAsync;
}

function validateDataset(body: DatasetMeta): GeckoboardResponse {
    const fieldKeys = Object.keys(body.fields);
    if (fieldKeys.some(fieldKey => fieldKey.toLowerCase() !== fieldKey)) {
        return {
            success: false,
            content: "All key from fields must be in lowercase",
        };
    }
    if (fieldKeys.some(fieldKey => ["date", "datetime", "number", "percentage", "string", "money"].indexOf(body.fields[fieldKey].type) === -1)) {
        return {
            success: false,
            content: `Only types accepted are : "date", "datetime", "number", "percentage", "string", "money"`,
        };
    }
    if (fieldKeys.some(fieldKey => {
        const field = body.fields[fieldKey];
        return (field.type === "money" && (!field.currency_code || field.currency_code.toUpperCase() !== field.currency_code || [
            "AED",
            "AFN",
            "ALL",
            "AMD",
            "ANG",
            "AOA",
            "ARS",
            "AUD",
            "AWG",
            "AZN",
            "BAM",
            "BBD",
            "BDT",
            "BGN",
            "BHD",
            "BIF",
            "BMD",
            "BND",
            "BOB",
            "BOV",
            "BRL",
            "BSD",
            "BTN",
            "BWP",
            "BYN",
            "BZD",
            "CAD",
            "CDF",
            "CHE",
            "CHF",
            "CHW",
            "CLF",
            "CLP",
            "CNY",
            "COP",
            "COU",
            "CRC",
            "CUC",
            "CUP",
            "CVE",
            "CZK",
            "DJF",
            "DKK",
            "DOP",
            "DZD",
            "EGP",
            "ERN",
            "ETB",
            "EUR",
            "FJD",
            "FKP",
            "GBP",
            "GEL",
            "GHS",
            "GIP",
            "GMD",
            "GNF",
            "GTQ",
            "GYD",
            "HKD",
            "HNL",
            "HRK",
            "HTG",
            "HUF",
            "IDR",
            "ILS",
            "INR",
            "IQD",
            "IRR",
            "ISK",
            "JMD",
            "JOD",
            "JPY",
            "KES",
            "KGS",
            "KHR",
            "KMF",
            "KPW",
            "KRW",
            "KWD",
            "KYD",
            "KZT",
            "LAK",
            "LBP",
            "LKR",
            "LRD",
            "LSL",
            "LYD",
            "MAD",
            "MDL",
            "MGA",
            "MKD",
            "MMK",
            "MNT",
            "MOP",
            "MRU[11]",
            "MUR",
            "MVR",
            "MWK",
            "MXN",
            "MXV",
            "MYR",
            "MZN",
            "NAD",
            "NGN",
            "NIO",
            "NOK",
            "NPR",
            "NZD",
            "OMR",
            "PAB",
            "PEN",
            "PGK",
            "PHP",
            "PKR",
            "PLN",
            "PYG",
            "QAR",
            "RON",
            "RSD",
            "RUB",
            "RWF",
            "SAR",
            "SBD",
            "SCR",
            "SDG",
            "SEK",
            "SGD",
            "SHP",
            "SLL",
            "SOS",
            "SRD",
            "SSP",
            "STN[13]",
            "SVC",
            "SYP",
            "SZL",
            "THB",
            "TJS",
            "TMT",
            "TND",
            "TOP",
            "TRY",
            "TTD",
            "TWD",
            "TZS",
            "UAH",
            "UGX",
            "USD",
            "USN",
            "UYI",
            "UYU",
            "UYW",
            "UZS",
            "VES",
            "VND",
            "VUV",
            "WST",
            "XAF",
            "XAG",
            "XAU",
            "XBA",
            "XBB",
            "XBC",
            "XBD",
            "XCD",
            "XDR",
            "XOF",
            "XPD",
            "XPF",
            "XPT",
            "XSU",
            "XTS",
            "XUA",
            "XXX",
            "YER",
            "ZAR",
            "ZMW",
            "ZWL"
        ].indexOf(field.currency_code) === -1))
    })) {
        return {
            success: false,
            content: `The currency_code is invalid check https://en.wikipedia.org/wiki/ISO_4217#Active_codes`,
        };
    }
    return {success: true};
}

function validData(fields: DatasetMeta["fields"], datas: Array<{ [key: string]: string | number }>): GeckoboardResponse {
    const fieldKeys = Object.keys(fields);
    for (let data of datas) {
        const dataKeys = Object.keys(data);
        if (dataKeys.length !== fieldKeys.length) {
            return {
                success: false,
                content: `Fields attributes not matching with attributes inside the data`,
            };
        }
        for (let dataKey of dataKeys) {
            if (fieldKeys.indexOf(dataKey) === -1) {
                return {
                    success: false,
                    content: `Fields attributes not matching with attributes inside the data`,
                };
            }
            const value = data[dataKey];
            const type = fields[dataKey].type;
            if ((["number", "percentage", "money"].indexOf(type) !== -1 && typeof value === "string") || typeof value !== "string") {
                return {
                    success: false,
                    content: `Data value not matching with the type of the attributes`,
                };
            }
        }
    }

    return {success: true};
}