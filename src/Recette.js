/**
 * @module Recette
 */
export default class Recette {
	/**
	 * Méthode principale. Sera appelée après le chargement de la page.
	 */
	static main() {
		this.chargerJson('donnees/por.json').then(objRecette => {
			document.title = objRecette.titre + " 🍽 Recettes extrêmes";
			var vieilArticle = document.querySelector("article");
			var nouvelArticle = this.html_article(objRecette);
			vieilArticle.replaceWith(nouvelArticle);
			// document.querySelector("article").replaceWith(this.html_article());
			var reference = document.querySelector("#reference");
			reference.href = objRecette.reference.url;
			reference.innerHTML = objRecette.reference.titre;
		});
	}
	static html_article(objRecette) {
		var resultat = document.createElement("article");
		resultat.classList.add("recette");
		var h1 = resultat.appendChild(document.createElement("h1"));
		h1.innerHTML = objRecette.titre;
		var p = resultat.appendChild(document.createElement("p"));
		p.classList.add("intro");
		p.innerHTML = objRecette.intro;
		var div = resultat.appendChild(document.createElement("div"));
		div.innerHTML = this.html_paragraphes(objRecette.description);

		resultat.appendChild(this.html_image(objRecette.image));

		var h2 = resultat.appendChild(document.createElement("h2"));
		h2.innerHTML = "Ingrédients";
		resultat.appendChild(this.html_ingredients(objRecette.ingredients));

		var h2 = resultat.appendChild(document.createElement("h2"));
		h2.innerHTML = "Procédure";
		resultat.appendChild(this.html_instructions(objRecette.instructions));

		return resultat;
	}
	static html_paragraphes(texte) {
		return texte.split(/\r\n|\n\r|\r|\n/g).map(p => `<p>${p}</p>`).join("");
	}
	static html_volet(objIngredient) {
		var resultat = document.createElement("section");
		resultat.classList.add("volet");
		resultat.tabIndex = 1;
		var close = resultat.appendChild(document.createElement("button"));
		close.classList.add("close");
		var h1 = resultat.appendChild(document.createElement("h1"));
		h1.innerHTML = objIngredient.nom;
		var figure = resultat.appendChild(document.createElement("figure"));
		var img = figure.appendChild(document.createElement("img"));
		img.src = "images/ingredients/" + objIngredient.image + "";
		img.alt = objIngredient.nom;
		var h2 = resultat.appendChild(document.createElement("h2"));
		h2.innerHTML = "Valeurs nutritives";
		var table = resultat.appendChild(document.createElement("table"));
		var tbody = table.appendChild(document.createElement("tbody"));
		tbody.appendChild(this.html_tr("Valeurs pour :", objIngredient.quantite));
		tbody.appendChild(this.html_tr("Calories", objIngredient.calories));
		tbody.appendChild(this.html_tr("Protéines", objIngredient.proteines));
		tbody.appendChild(this.html_tr("Glucides", objIngredient.glucides));
		tbody.appendChild(this.html_tr("Lipides", objIngredient.lipides));
		resultat.addEventListener("DOMNodeInserted", e => {
			e.currentTarget.focus();
		});
		resultat.addEventListener("blur", e => {
			e.currentTarget.classList.remove("ouvert");
		});
		resultat.focus();
		return resultat;
	}
	static html_tr(label,valeur) {
		var tr = document.createElement("tr");
		var th = tr.appendChild(document.createElement("th"));
		th.innerHTML = label;
		var td = tr.appendChild(document.createElement("td"));
		td.innerHTML = valeur;
		return tr;
	}
	static html_ingredients(tIngredients) {
		var resultat = document.createElement("ul");
		resultat.classList.add("ingredients");
		for (let i = 0; i < tIngredients.length; i += 1) {
			var objIngredient = tIngredients[i];
			var li = resultat.appendChild(document.createElement("li"));
			var span = li.appendChild(document.createElement("span"));
			span.innerHTML = "" + objIngredient.quantite + " " + objIngredient.unite + "";
			var span = li.appendChild(document.createElement("span"));
			span.innerHTML = "" + objIngredient.ingredient + "";
			li.dataset.slug = objIngredient.slug;
			li.addEventListener("click", e => {
				var volet = document.querySelector("section.volet");
				volet.classList.toggle("ouvert");
				this.updateVolet(e.currentTarget.dataset.slug);
			});
		}
		return resultat;
	}
	static updateVolet(slug) {
		this.chargerJson("donnees/valeurs-nutritives.json").then(valeursNutritives => {
			var objIngredient = valeursNutritives[slug];
			var vieuxVolet = document.querySelector("section.volet");
			var nouveauVolet = this.html_volet(objIngredient);
			vieuxVolet.replaceWith(nouveauVolet);
			setTimeout(() => {
				nouveauVolet.classList.add("ouvert");
			}, 50);
		});


	}
	static html_instructions(tInstructions) {
		var resultat = document.createElement("ol");
		resultat.classList.add("instructions");
		for (let i = 0; i < tInstructions.length; i += 1) {
			var instruction = tInstructions[i];
			var li = resultat.appendChild(document.createElement("li"));
			li.innerHTML = instruction;
		}
		return resultat;
	}
	static html_image(objImage) {
		var resultat = document.createElement("figure");
		resultat.classList.add("photoprincipale");
		var img = resultat.appendChild(document.createElement("img"));
		img.src = objImage.url;
		img.alt = objImage.legende;
		var figcaption = resultat.appendChild(document.createElement("figcaption"));
		figcaption.innerHTML = objImage.legende;
		return resultat;
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
