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

function simpleDeepCompare(obj1, obj2){
    return JSON.stringify(Object.entries(obj1).sort()) === JSON.stringify(Object.entries(obj2).sort());
}
function deepCompare(a, b){
    let iguais;
    if(a == null || b == null){
        iguais = false;
    }else if(a === b){
        iguais = true;
    }else if(Array.isArray(a) && Array.isArray(b)){
        if(a.length === b.length){
            iguais = true;
            let i = 0;
            while(iguais && i < a.length){
                if(!deepCompare(a[i], b[i])){
                    iguais = false;
                }
                i++;
            }
        }else{
            iguais = false;
        }
    }else if(typeof a === 'object' && typeof b === 'object'){
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if(keysA.length === keysB.length){
            iguais = true;
            let i = 0;
            while(iguais && i < keysA.length){
                if(keysB.includes(keysA[i])){
                    if(!deepCompare(a[keysA[i]], b[keysA[i]])){
                        iguais = false;
                    }
                }else{
                    iguais = false;
                }
                i++;
            }
        }else{
            iguais = false;
        }
    }else{
        iguais = false;
    }
    return iguais;
}

function createSafeArr(initArr = [], safeMethods = []){
    return getSafeVersionOfArray(JSON.parse(JSON.stringify(initArr)), safeMethods);
}
function getSafeVersionOfArray(arr = [], safeMethods = []){
    let internalArr = arr;
    const methods = {};
    for(const method of safeMethods){
        if(typeof method !== 'function' || !method.name) throw new Error('todos elementos do array safeMethods precisam ser funções com nome')
        methods[method.name] = function(...args){
            return method.apply(internalArr, args);
        };
    }
    return new Proxy(internalArr, {
        get(target, prop){
            let value;
            if(methods[prop]){
                value = methods[prop];
            }else{
                const blocked = ['push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse', 'fill', 'copyWithin'];
                if(blocked.includes(prop)){
                    throw new Error('Vc não mode usar nenhum método mutável neste array');
                }
                value = target[prop];
            }
            
            return value;
        },
        set(){
            throw new Error('Vc não pode alterar nenhuma propriedade desse array');
        },
        deleteProperty(){
            throw new Error('Vc não pode deletar nenhuma propriedade desse array');
        },
        defineProperty(){
            throw new Error('Vc não pode definir nenhuma propriedade desse array');
        },
        getOwnPropertyDescriptor(target, prop) {
            return Reflect.getOwnPropertyDescriptor(target, prop);
        },
        ownKeys(target) {
            return Reflect.ownKeys(target);
        }
    });
}

export {
    excluirObjRepetidos,
    relacionarObjs,
    renameObjPropertys,
    simpleDeepCompare,
    deepCompare,
    createSafeArr,
    getSafeVersionOfArray
}

