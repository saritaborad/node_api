//  if input is {a:1,b:2,c:3} then output should be {a:3,b:6,c:9}

let input = { a: 1, b: 2, c: 3 };

//  1)
for (key in input) {
 input[key] = input[key] * 3;
}

// 2)
Object.keys(input).forEach((key) => {
 input[key] = input[key] * 3;
});

// 3)
// Object.entries(input) // [ [ 'a', 1 ], [ 'b', 2 ], [ 'c', 3 ] ]
// [key,value] is array destructuring returns a, b, c in key and 1,2,3 in value
Object.entries(input).forEach(([key, value]) => {
 input[key] = value * 3;
});

// 4)
Object.entries(input).map(([key, value]) => [key, value * 3]); // returns [ [ 'a', 3 ], [ 'b', 6 ], [ 'c', 9 ] ]
Object.fromEntries(Object.entries(input)); // return { a: 1, b: 2, c: 3 } from [ [ 'a', 1 ], [ 'b', 2 ], [ 'c', 3 ] ]
Object.fromEntries(Object.entries(input).map(([key, value]) => [key, value * 3])); // returns { a: 3, b: 6, c: 9 }

// 5)
Object.entries(input).map(([key, value]) => {
 input[key] = value * 3;
});

console.log(input);

// ------------------------------------------------------------
// if input is array of integer return even number from array
let arr = [1, 2, 3, 4, 5, 6];

// 1)
let newArr1 = arr.map((item) => {
 if (item % 2 == 0) {
  return item;
 }
});
//output:-  [ undefined, 2, undefined, 4, undefined, 6, undefined ]

// 2)
let newArr2 = arr.filter((item) => item % 2 === 0);
console.log(newArr2); //output:- [ 2, 4, 6 ]
