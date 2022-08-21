export function getMultipleRandom(arr, num) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
  
    return shuffled.slice(0, num);
}

export function pushRandomReturnArr(arr, element) {
    let newArr = arr;
    newArr.splice(Math.floor(Math.random() * (arr.length + 1)), 0, element);

    return newArr;
}

export default getMultipleRandom;