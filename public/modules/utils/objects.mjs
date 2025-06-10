function relacionarObjs(idPrincipal, obj, objRelacao, chave1, chave2){
    let ids = objRelacao
                .filter(elem => parseInt(elem[chave1]) === parseInt(idPrincipal))
                .map(elem => elem[chave2]);
    return obj.filter(elem =>{
        let retorno = false;
        for(let i = 0; i < ids.length && !retorno; i++){
            retorno = parseInt(elem.id) === parseInt(ids[i]);
        }
        return retorno;
    });
}

function excluirObjRepetidos(arr){
    if(arr.every(elem => elem !== null && typeof elem === 'object')){
        for(let i = 0; i < arr.length; i++){
            for(let j = i + 1; j < arr.length; j++){
                if(JSON.stringify(arr[i]) === JSON.stringify(arr[j])){
                    //indexRepetidos.push(j);
                    arr.splice(j, 1);
                    j--;
                }
            }
        }
    }

}

function renameObjPropertys(obj, oldNames, newNames){
    let newObj = {...obj};
    if (oldNames.length === newNames.length){
        for(let i = 0; i < oldNames.length; i++){
            const oldName = oldNames[i];
            const newName = newNames[i];

            if(Object.prototype.hasOwnProperty.call(newObj, oldName)){
                newObj[newName] = newObj[oldName];
                delete newObj[oldName];
            }else{
                console.warn(`A propriedade ${oldName} não existe`)
            }
        }
    }else{
        console.error("Os arrays de nomes antigos e novos devem ter o msm tamanho");
    }
    return newObj;
}

export {
    excluirObjRepetidos,
    relacionarObjs,
    renameObjPropertys
}

