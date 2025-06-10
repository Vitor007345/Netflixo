export {
    carregaAPIs,
    postInApi,
    putInApi,
    deleteInApi,
    getInApi,
    patchInApi,
    multiplesCrudResquests,
    crudRequest,
    waitUltilJsonServerIsAvailable
} from './APIs.mjs'
export{
    relacionarObjs,
    excluirObjRepetidos,
    renameObjPropertys 
} from './objects.mjs'
export{
    random,
    randomMaisChanceLowHigh,
    randomSequence,
    randomPorDia,
    randomSequencePorDia
} from './random.mjs'
export {
    converterYTWatchParaEmbed
} from './yt.mjs'
export {
    getParam,
    hasParam
}from './queryStrings.mjs'
export {
    isBase64Image,
    base64ToFile,
    pathImgToFile,
    fileToBase64,
    isApiRequestImg,
    isLocalImg,
    getImageType,
    resolveImgPath
}from './imgsFILES.mjs'