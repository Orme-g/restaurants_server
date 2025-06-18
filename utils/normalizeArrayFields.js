const normalizeArrayFields = (body, fields) => {
    for (let field of fields) {
        const value = body[field];
        if (Array.isArray(value)) {
            continue;
        }
        if (value === undefined) {
            body[field] = [];
        } else {
            body[field] = [value];
        }
    }
};

module.exports = {
    normalizeArrayFields,
};
