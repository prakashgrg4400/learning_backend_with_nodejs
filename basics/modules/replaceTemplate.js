module.exports = (template, item) => {
    let output = template.replace(/{%PRODUCTNAME%}/g, item.productName);
    output = output.replace(/{%IMAGE%}/g, item.image);
    output = output.replace(/{%QUANTITY%}/g, item.quantity);
    output = output.replace(/{%PRICE%}/g, item.price);
    output = output.replace(/{%ID%}/g, item.id);
    output = output.replace(/{%FROM%}/g , item.from);
    output = output.replace(/{%DESCRIPTION%}/g , item.description);
    output = output.replace(/{%NUTRIENTS%}/g , item.nutrients)
    if (!item.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
    return output;
};

//!==> module is a object which is globally available in every files of node.