// get unique array from two array
let arr1 = [1, 2, 3, 4, 5, 6, 7];
let arr2 = [2, 4, 7, 4];

let combinedSet = new Set([...arr1, ...arr2]);
console.log(Array.from(combinedSet));
// output:- [ 1, 2, 3, 4, 5, 6, 7]
