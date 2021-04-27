function getObjectKey(obj, findingKey){
    return Object.keys(obj).reduce((res,key)=> {
        const el = obj[key];

	    if(res){
		    return res;
	    }        
        if(el && typeof el === 'object'){
            if(el.hasOwnProperty(findingKey)){
            	return el;
            }

            return getObjectKey(el, findingKey);
        }
        return res;
    });
}