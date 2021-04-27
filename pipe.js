function pipe(...fns) {
	return data => fns.reduce((v, f) => f(v), data);
}