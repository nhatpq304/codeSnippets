/**
 *
 * @param {Array} arr array of functions which return a promise
 * @param {Boolean} stopOnReject should the function stop on the fist rejection
 *
 * # Example
 * ```
 * const value = [1,2,3,4];
 * const arr = value.map(el=> ()=> new Promise((resolve)=> {setTimeout(()=> { console.log(el); resolve(el) }, el*1000)}))
 * 
 * await queuePromises(arr, true); //{ rejected: [], resolved:[1,2]}
 * ```
 */

function queuePromises(arr, stopOnReject) {
    let resolved= [];
    let rejected= [];
    const next = async (prm)=>{
        if(!prm){
            return Promise.resolve({resolved,rejected});
        }
        try{
            const res= await prm();
            
            resolved.push(res);
        }catch(err){
            rejected.push(err);
		if(stopOnReject){
			return Promise.resolve({resolved,rejected});
		}
        }

        return next(arr.splice(0, 1)[0]);
     }

     return next(arr.splice(0, 1)[0]);
	
}