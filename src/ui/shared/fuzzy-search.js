/**
 * Módulo de Búsqueda Difusa (Fuzzy Search)
 * Permite filtrar listas de objetos por coincidencia difusa de texto
 * @module fuzzy-search
 */

/**
 * Filtra un array de elementos comparando la consulta difusa contra una clave
 * @param {Array<Object>} list - Array de elementos a filtrar
 * @param {string} query - Término de búsqueda
 * @param {string} key - Clave del objeto a inspeccionar
 * @returns {Array<Object>} Array con los elementos coincidentes
 */
export function fuzzySearch(list, query, key) {
  if (!query || !query.trim()) return list;
  const cleanQuery = query.toLowerCase().trim();

  return list.filter(item => {
    const val = (item[key] || "").toString().toLowerCase();
    if (val.includes(cleanQuery)) return true;

    // Coincidencia por subsecuencia de caracteres
    let queryIdx = 0;
    for (let i = 0; i < val.length && queryIdx < cleanQuery.length; i++) {
      if (val[i] === cleanQuery[queryIdx]) {
        queryIdx++;
      }
    }
    return queryIdx === cleanQuery.length;
  });
}
