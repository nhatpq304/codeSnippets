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