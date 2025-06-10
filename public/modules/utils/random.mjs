function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomMaisChanceLowHigh(min, max, maisChance) {
    maisChance = maisChance.toUpperCase();
    if (maisChance !== "LOW" && maisChance !== "HIGH") return null;
    let rand;
    if (maisChance === "LOW") {
        rand = Math.random() ** 2;
    } else {
        rand = 1 - ((1 - Math.random()) ** 2);
    }
    return Math.floor(rand * (max - min + 1)) + min;
}

function randomSequence(min, max) {
    let sequencia = new Array(max - min + 1).fill(null);
    let numbersToMix = new Array(sequencia.length);
    for (let i = 0; i < numbersToMix.length; i++) {
        numbersToMix[i] = min + i;
    }

    for (let i = 0; i < sequencia.length; i++) {
        let randomIndex = random(0, numbersToMix.length - 1);
        sequencia[i] = numbersToMix[randomIndex];
        numbersToMix.splice(randomIndex, 1);

    }

    return sequencia;
}

function randomPorDia(min, max, index) {
    const hoje = new Date();
    const seed = parseInt(index.toString() + hoje.getFullYear().toString() + (hoje.getMonth() + 1).toString() + hoje.getDate().toString());
    let rand = Math.abs(Math.sin(seed)); //quase aleatorio de -1 a 1, valores possíveis em um seno, função seno retorna valores caóticos
    return Math.floor(rand * (max - min + 1)) + min;
}

function randomSequencePorDia(min, max, index) {
    let sequencia = new Array(max - min + 1).fill(null);
    let numbersToMix = new Array(sequencia.length);
    for (let i = 0; i < numbersToMix.length; i++) {
        numbersToMix[i] = min + i;
    }

    for (let i = 0; i < sequencia.length; i++) {
        let randomIndex = randomPorDia(0, numbersToMix.length - 1, index + i);
        sequencia[i] = numbersToMix[randomIndex];
        numbersToMix.splice(randomIndex, 1);

    }
    return sequencia;
}

export {
    random,
    randomMaisChanceLowHigh,
    randomSequence,
    randomPorDia,
    randomSequencePorDia
}