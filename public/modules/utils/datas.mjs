export function convertStrDataToNormalStrData(str){
    if(!str) return null;
    let strDividda = str.split('-');
    return `${strDividda[2]}/${strDividda[1]}/${strDividda[0]}`
}