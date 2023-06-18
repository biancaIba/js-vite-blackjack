/**
 * 
 * @param {String} carta 
 * @returns {HTMLElement} retorna una imagen
 */
export const crearCartaHTML = (carta) => {
    if (!carta) throw new Error ('carta es obligatoria.');

    const imgCarta = document.createElement('img');
    imgCarta.src = `assets/cartas/${ carta }.png`; //3H, JD
    imgCarta.classList.add('carta');

    return imgCarta;
}