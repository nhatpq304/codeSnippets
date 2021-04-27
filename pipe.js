/**
 *
 * @param {Function} fns funtions as paramters
 * @param {any} data the mutual data
 *
 * # Example
 * ```
 * const add= (x) => (data)=> data+x ;
 * const toString= (y) => y+'';
 * const data = 10;
 *
 * const value = pipe(add(2), toString)(data) //value = '12'
 *
 * ```
 */

function pipe(...fns) {
	return data => fns.reduce((v, f) => f(v), data);
}