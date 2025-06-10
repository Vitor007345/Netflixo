import { getInApi } from "./APIs.mjs";

function isBase64Image(path) {
  return typeof path === 'string' && path.startsWith('data:image/');
}
function isApiRequestImg(path){
    return typeof path === 'string' && path.startsWith('/imgs'); 
}
function isLocalImg(path){
    return typeof path === 'string' && 
        !isBase64Image(path) && 
        !isApiRequestImg(path);
}
function getImageType(path){
    let tipo = 'unknown';
    if(isBase64Image(path)){
        tipo = 'base64'
    }else if(isApiRequestImg(path)){
        tipo = 'apiRequest'
    }else if(typeof path === 'string'){
        tipo = 'local'
    }
    return tipo;
}

async function resolveImgPath(path) {
    let tipo = getImageType(path);
    let finalPath = null;
    if(tipo === 'base64' || tipo === 'local'){
        finalPath = path;
    }else if(tipo === 'apiRequest'){
        let imgData = undefined;
        try{
            imgData = await getInApi(path);
            finalPath = imgData.content;
        }catch(e){
            console.error('Erro ao Buscar img:', e);
        }
    }
    return finalPath;
}

function base64ToFile(base64){
    const arr = base64.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';

    const ext = mime.split('/')[1];
    const filename = `imagem.${ext}`;

    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    n--;
    while (n >= 0) {
        u8arr[n] = bstr.charCodeAt(n);
        n--;
    }

    return new File([u8arr], filename, { type: mime });
}

async function pathImgToFile(path){
    const res = await fetch(path);
    const blob = await res.blob();
    return new File([blob], path.split('/').pop(), { type: blob.type})
}


async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => resolve(reader.result); 
        reader.onerror = error => reject(error); 
  });
}
export {
    isBase64Image,
    base64ToFile,
    pathImgToFile,
    fileToBase64,
    isApiRequestImg,
    isLocalImg,
    getImageType,
    resolveImgPath
}