/*
IMPORTANT import lodash to use https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js

interface changeConditionCallbacks {
    id: string;
    condition: (originalData, changeItem, key) => boolean;
    callback: (originalData, changeItem, key) => any;
}
interface changeDetectorSettings {
    comparedKey: string;
    conditionCallbacks?: changeConditionCallbacks[];
}
*/
function detectObjectDeepChange(
    original,
    modified,
    settings = { comparedKey: "id" } //changeDetectorSettings
) {
    const { comparedKey, conditionCallbacks } = settings;
    const getChange = (changeItem, originalData) =>
        _.omitBy(
            _.mapValues(changeItem, (value, key) => {
                const { condition, callback } = _.find(conditionCallbacks, { id: key }) ?? {};

                if (condition && condition(originalData, changeItem, key)) {
                    return callback(originalData, changeItem, key);
                }
                if (_.isArray(value)) {
                    return getChangedDataBetweenTwoObjectArrays(originalData[key], value);
                }
                if (_.isObject(value) && !(value instanceof Date)) {
                    return getChangedDataBetweenTwoObject(originalData[key], value);
                }

                return value;
            }),
            _.isUndefined
        );

    const getChangedDataBetweenTwoObject = (originalItem, modifiedItem) =>
        getChange(compareObject(modifiedItem, originalItem), originalItem);

    const compareObject = (modifiedData, originalData) =>
        _.omit(
            modifiedData,
            _.compact(
                _.map(modifiedData, (value, key) =>
                    _.isEqual((originalData || {})[key], value) && !_.includes([comparedKey], key) ? key : null
                )
            )
        );

    const getChangedDataBetweenTwoObjectArrays = (originalItems, modifiedItems) => {
        const removedItems = _.filter(
            originalItems,
            originalItem =>
                !_.some(modifiedItems, modifiedItem => modifiedItem[comparedKey] === originalItem[comparedKey])
        );
        const addedItems = _.filter(
            modifiedItems,
            modifiedItem =>
                !_.some(originalItems, originalItem => modifiedItem[comparedKey] === originalItem[comparedKey])
        );
        const commonItemsByModifiedData = _.intersectionBy(modifiedItems, originalItems, comparedKey);
        const commonItemsFromOriginalData = _.intersectionBy(originalItems, modifiedItems, comparedKey);
        const updatedItems = _.differenceWith(commonItemsByModifiedData, commonItemsFromOriginalData, _.isEqual);
        const changedItems = _.chain(updatedItems)
            .map(modifiedData =>
                compareObject(
                    modifiedData,
                    _.find(originalItems, originalItem => originalItem[comparedKey] === modifiedData[comparedKey])
                )
            )
            .map(changeItem =>
                getChange(
                    changeItem,
                    _.find(originalItems, originalItem => originalItem[comparedKey] === changeItem[comparedKey])
                )
            )
            .value();
        return {
            removedItems,
            addedItems,
            changedItems
        };
    };

    if (_.isArray(original)) {
        return getChangedDataBetweenTwoObjectArrays(original, modified);
    }

    if (_.isObject(original)) {
        return getChangedDataBetweenTwoObject(original, modified);
    }

    throw new Error("This function compares objects and object arrays only");
}