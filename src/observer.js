/* 
    options sirve en caso de quere aplicar el observer por bloques, para este calo haremos solo uno en general asi qeu no lo necesitamos 
*/
const lazyLoader = new IntersectionObserver(callback);

/* 
    aca tampoco utilizaremos el observer como parametro ya qeu basa solo con el entries
*/
function callback(entries) {
    /* recorremos cada entries, osea cada imagen qeu estemos observando y asi mismo, podremos aplicar una accion, dentro del forEch tenemos otra arroun functions qeu tiene como parametro cada entrada */
    /* 
        a la insercion de las imganes le pondremos en vez de src directamente un atributo data data-src, data-img y luego lo cambiaremos a src para asi hacer la carga perezosa.
    */
    entries.forEach( (entry) => {
       /*  console.log(entry.target.setAttribute); */
       if (entry.isIntersecting) {
            const dataSrc = entry.target.getAttribute('data-src');
            entry.target.setAttribute('src', dataSrc );
            
       }
       /* dejar de observar una vez ya haya sido cargada la imagen */
    } );
    /* observer.unobserve(entry); */
};