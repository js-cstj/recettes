/**
 * @module Recette
 */
export default class Recette {
	/**
	 * Méthode principale. Sera appelée après le chargement de la page.
	 */
	static main() {
		this.chargerJson('donnees/piq.json').then(objRecette => {
			console.log(objRecette);
			var vieilArticle = document.querySelector("article");
			var nouvelArticle = this.html_article(objRecette);
			vieilArticle.replaceWith(nouvelArticle);
		});

		// document.querySelector("article").replaceWith(this.html_article());
	}
	static html_article(objRecette) {
		var resultat = document.createElement("article");
		var h1 = resultat.appendChild(document.createElement("h1"));
		h1.innerHTML = objRecette.titre;
		var p = resultat.appendChild(document.createElement("p"));
		p.classList.add("intro");
		p.innerHTML = objRecette.intro;
		var p = resultat.appendChild(document.createElement("p"));
		p.innerHTML = objRecette.description;

		resultat.appendChild(this.html_image(objRecette.image));

		var h2 = resultat.appendChild(document.createElement("h2"));
		h2.innerHTML = "Ingrédients";
		resultat.appendChild(this.html_ingredients(objRecette.ingredients));

		var h2 = resultat.appendChild(document.createElement("h2"));
		h2.innerHTML = "Procédure";
		resultat.appendChild(this.html_instructions(objRecette.instructions));

		return resultat;
	}
	static html_volet(objIngredient) {
		var resultat = document.createElement("section");
		resultat.classList.add("volet");
		var h1 = resultat.appendChild(document.createElement("h1"));
		h1.innerHTML = objIngredient.nom;
		var figure = resultat.appendChild(document.createElement("figure"));
		var img = figure.appendChild(document.createElement("img"));
		img.src = "images/ingredients/"+objIngredient.image+"";
		img.alt = objIngredient.nom;
		var h2 = resultat.appendChild(document.createElement("h2"));
		h2.innerHTML = "Valeurs nutritives";
		var table = resultat.appendChild(document.createElement("table"));
		var tbody = table.appendChild(document.createElement("tbody"));
		for (var i = 0; i < 5; i += 1) {
			var tr = tbody.appendChild(document.createElement("tr"));
			var th = tr.appendChild(document.createElement("th"));
			th.innerHTML = "Calories";
			var td = tr.appendChild(document.createElement("td"));
			td.innerHTML = "3";
		}
		return resultat;
	}
	static html_ingredients(tIngredients) {
		var resultat = document.createElement("ul");
		resultat.classList.add("ingredients");
		for (let i = 0; i < tIngredients.length; i += 1) {
			var objIngredient = tIngredients[i];
			var li = resultat.appendChild(document.createElement("li"));
			li.innerHTML = "" + objIngredient.quantite + " " + objIngredient.unite + " &mdash; " + objIngredient.ingredient + "";
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
		this.chargerJson("donnees/piq.json").then(donnees => {
			var vn = donnees.valeurs_nutritives;
			var objIngredient = vn[slug];
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
		// 	<figure class="photoprincipale">
		// 	<img src="images/painisgood.jpg" alt="Pain Is Good">
		// 	<figcaption>Pain Is Good</figcaption>
		// </figure>
		var resultat = document.createElement("figure");
		resultat.classList.add("photoprincipale");
		var img = resultat.appendChild(document.createElement("img"));
		img.src = "images/painisgood.jpg";
		img.alt = "Pain Is Good"
		var figcaption = resultat.appendChild(document.createElement("figcaption"));
		figcaption.innerHTML = "Pain Is Good";
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
