function getParam(param){
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}
function hasParam(param){
    const params = new URLSearchParams(window.location.search);
    return params.has(param);
}

export {
    getParam,
    hasParam
}