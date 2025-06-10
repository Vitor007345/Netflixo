function converterYTWatchParaEmbed(link) {
    try {
        const URLwatch = new URL(link);
        const videoId = URLwatch.searchParams.get("v");
        return `https://www.youtube.com/embed/${videoId}`;
    } catch (e) {
        console.log('Link Invalido')
        console.log(`Erro: ${e}`);
        return null;
    }

}
export {
    converterYTWatchParaEmbed
}