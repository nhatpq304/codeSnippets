/**
 *
 * @param {Object} obj an Object
 * @param {String} findingKey the property name
 *
 * # Example
 * ```
 * const obj = { a: { b: 1, c: {d: 3}}}
 * 
 * getObjectWithKey(obj, 'c' ); // { b: 1, c: {d: 3}}
 * getObjectWithKey(obj, 'd' ); // {d: 3}
 * ```
 */

function getObjectWithKey(obj, findingKey){
    return Object.keys(obj).reduce((res,key)=> {
        const el = obj[key];
	    if(res){
		    return res;
	    }        
        if(el && typeof el === 'object'){
            if(el.hasOwnProperty(findingKey)){
            	return el;
            }

            return getObjectWithKey(el, findingKey);
        }
        return res;
    }, null);
}