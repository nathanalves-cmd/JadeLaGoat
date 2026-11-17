JLG.fiche('immo4', [
  {id:'marche', t:'Le marché et la négociation', items:[
    {d:'Négociation immobilière notariale', v:'Activité traditionnelle mais accessoire du notaire (Conseil d’État, 23 février 2000), encadrée par le règlement professionnel du notariat (art. 7.1.2.2, arrêté du 29 janvier 2024).'},
    {l:'Les règles', items:['Mandat écrit : honoraires, débiteur, durée raisonnable', 'Pas de démarchage', 'Pas d’annonces générales ni de vitrine de boutique', 'Groupement et fichier commun autorisés', 'Pas de succursale dédiée avec entrée distincte']},
    {kv:[['Honoraires', 'Libres depuis le 1er mars 2016 (ton cours : 3 à 6 %, agents 4 à 8 %)'], ['Pic des ventes', '2021 : environ 1,25 million sur douze mois'], ['Paris', 'Sous 10 000 €/m² depuis fin 2023']]},
    {x:'Le 15 % de parts de marché des notaires : dépassé, retiens « minoritaire et décroissant »'}]},
  {id:'perval', t:'PERVAL et BIEN', items:[
    {kv:[['PERVAL', 'Province'], ['BIEN', 'Île-de-France'], ['Loi', 'Loi du 28 mars 2011 : alimentation obligatoire'], ['Délais', '30 jours (avant-contrat), 60 jours (acte)']]},
    {p:'Elle sert à estimer la valeur vénale : succession, donation, partage, conseil patrimonial.'},
    {a:'Art. 6 loi de ventôse an XI', v:'Les notaires contribuent à la diffusion des informations sur les mutations d’immeubles'}]},
  {id:'comparaison', t:'Comparaison directe', items:[
    {d:'Valeur vénale', v:'Prix auquel le bien pourrait se vendre dans des conditions normales de marché.'},
    {l:'Les quatre calculs', num:true, items:['Prix ÷ surface = prix au m² de chaque vente', 'Total des prix au m² ÷ nombre de ventes = moyenne', 'Moyenne × surface du bien = valeur vénale', 'Arrondir : pas de dizaines ni de centimes']},
    {tab:{head:['Exemple Nancy', 'Résultat'], rows:[['Prix moyen', '2 637,19 €/m²'], ['Surface', '49,42 m²'], ['Valeur', '130 329,78 € → 130 300 €']]}},
    {m:'Comparer : même type, même secteur, même époque, même état'}]},
  {id:'surfaces', t:'Surfaces', items:[
    {tab:{head:['Surface', 'Sert à', 'Texte'], rows:[['Habitable', 'Bail, décence', 'Art. R. 156-1 CCH'], ['Carrez', 'Vente d’un lot de copropriété', 'Loi 1965, décret 1967, art. 4-1'], ['Pondérée', 'Estimation d’un immeuble bâti', 'Grille d’usage (arrêté de 1974)']]}},
    {kv:[['Hors habitable', 'Combles non aménagés, caves, sous-sols, garages, terrasses, loggias, balcons, vérandas, parties sous 1,80 m'], ['Carrez', 'Locaux clos et couverts ; lots de moins de 8 m² écartés'], ['Dimensions', '14 m² et 33 m³ par habitant (4 premiers), 10 m² et 23 m³ ensuite']]},
    {x:'Une véranda compte dans la Carrez, jamais dans la surface habitable'}]},
  {id:'ponderee', t:'Le m² pondéré', items:[
    {tab:{head:['Partie', 'Coef.'], rows:[['Rez-de-chaussée aménagé, étage habitable', '1'], ['Sas couvert et fermé', '0,70'], ['Loggia ou salle ouverte sur deux faces', '0,60'], ['Porche couvert et ouvert', '0,50'], ['Terrasse, balcon (1 m de saillie, 2 m²)', '0,40'], ['Garage', 'Exclu']]}},
    {p:'Chalet de Gérardmer : 1,89 + 46,71 = 48,60 m², soit 121 100 € à 2 491 €/m².'}]},
  {id:'revenu', t:'Méthode par le revenu', items:[
    {d:'Formule', v:'Valeur vénale = (loyer mensuel hors charges × 12) ÷ taux de capitalisation'},
    {kv:[['Produit', 'Versé une fois : le prix'], ['Fruits', 'Périodiques : les loyers'], ['Taux usuel', '4 à 6 % (2 à 12 % selon catégorie)']]},
    {tab:{head:['Catégorie', 'Taux (usage)'], rows:[['II A, II B', '2 à 4 %'], ['II C', '3 à 6 %'], ['III A', '4 à 7 %'], ['III B', '5 à 10 %'], ['IV', '8 à 12 %']]}},
    {p:'Paris, II B : (1 370 − 120) × 12 = 15 000 € ; ÷ 3 % = 500 000 €.'},
    {x:'Les taux ne sont pas dans la loi : ce sont des usages d’expertise'}]},
  {id:'location', t:'Louer : décence et encadrement', items:[
    {a:'Décret n° 2002-120 du 30 janvier 2002', v:'Logement décent : surface, sécurité et santé, pas de nuisibles, énergie, équipements'},
    {kv:[['Pièce principale', '9 m² et 2,20 m, ou 20 m³'], ['Colocation (ton cours)', '16 m² pour deux, + 9 m² par colocataire'], ['G', 'Exclu depuis le 1er janvier 2025'], ['F / E', 'Exclus en 2028 / 2034']]},
    {kv:[['Loi ALUR', '24 mars 2014'], ['Plafond', 'Loyer de référence majoré (+ 20 %)'], ['Zones tendues', 'Décret du 25 août 2023'], ['Zonage A/B/C', 'Arrêté du 5 juillet 2024 (PTZ)']]},
    {x:'Encadrement du niveau : expérimentation jusqu’au 24 novembre 2026, prolongation en discussion'}]},
  {id:'expertise', t:'Estimation ou expertise', items:[
    {tab:{head:['', 'Estimation', 'Expertise'], rows:[['Prix', 'Gratuite', 'Payante'], ['Forme', 'Informelle', 'Rapport écrit officiel'], ['Responsabilité', 'Non', 'Oui (assurance)'], ['Demandeur', 'Le vendeur', 'Tribunal, fisc, banque']]}},
    {p:'Notexpert : réseau et label du CSN ; plus de deux ans de pratique ; règles de TEGoVA.'}]},
  {id:'ventes', t:'Enchères et vente interactive', items:[
    {tab:{head:['', 'Enchères en salle', 'Immo-interactif'], rows:[['Lieu', 'Salle de ventes', 'Salle virtuelle'], ['Fin', 'Feux de 30 s (2 feux)', '24 heures d’offres'], ['Qui décide', 'Le plus offrant', 'Le vendeur'], ['Acte', 'Procès-verbal d’adjudication', 'Compromis'], ['Rétractation', 'Aucune', '10 jours'], ['Délais', 'Surenchère 10 % sous 10 jours', 'Mandat 6 à 8 semaines']]}},
    {m:'Enchères : on gagne en dernier. Interactif : on choisit.'}]}
]);
