/**
 * @module Recette
 */
export default class Recette {
	/**
	 * Méthode principale. Sera appelée après le chargement de la page.
	 */
	static main() {
	}
	static html_paragraphes(texte) {
		return texte.split(/\r\n|\n\r|\r|\n/g).map(p => `<p>${p}</p>`).join("");
	}
	static chargerJson(url) {
		return new Promise(resolve => {
			var xhr = new XMLHttpRequest();
			xhr.open("get", url);
			xhr.responseType = "json";
			xhr.addEventListener("load", e => {
				resolve(e.target.response); // Retourne les données
			});
			xhr.send();
		});
	}
}
