JLG.fiche('civ3', [
  {id:'legal', t:'Le régime légal', items:[
    {d:'Depuis le 1er février 1966', v:'Communauté réduite aux acquêts'},
    {d:'Avant', v:'Communauté de meubles et acquêts : tous les meubles sont communs'},
    {l:'Commun', items:['Les acquêts : achetés pendant le mariage', 'Les revenus professionnels et ce qui les remplace', 'Les revenus des propres non consommés', 'Les biens donnés aux deux époux']},
    {l:'Propre', items:['Les biens possédés au jour du mariage', 'Les biens reçus par donation ou succession', 'Les propres par nature (art. 1404)', 'Accessoires, accroissements et remplacements d’un propre (art. 1406)']},
    {a:'Art. 1402 C. civ.', v:'Dans le doute, un bien est présumé commun'}
  ]},
  {id:'remploi', t:'Remploi et donations', items:[
    {a:'Art. 1434 C. civ.', v:'Déclaration de remploi dans l’acte d’achat ; faite après coup, elle ne vaut qu’entre époux'},
    {a:'Art. 1436 C. civ.', v:'Le bien est commun si la communauté paie plus que l’époux'},
    {d:'Récompense', v:'Le rééquilibrage des masses à la dissolution'},
    {tab:{head:['Donation', 'Le bien', 'Les droits'], rows:[['Enfant seul', 'Propre', 'Ligne directe'], ['Enfant et conjoint', 'Commun', 'Moitié ligne directe, moitié à 60 %'], ['Enfant seul + clause', 'Commun', 'Ligne directe sur le tout']]}},
    {m:'Seul : propre. À deux : commun, mais cher. Seul + clause : commun, et pas cher.'}
  ]},
  {id:'separation', t:'La séparation de biens', items:[
    {kv:[['Les biens', 'Patrimoines distincts, aucune masse commune'], ['La preuve', 'Par tous moyens ; sinon indivis pour moitié'], ['Les dettes', 'Chacun les siennes, sauf ménagères (art. 220) ou solidaires'], ['Les pouvoirs', 'Pleins pouvoirs, sauf le logement de la famille (art. 215 al. 3)']]},
    {l:'Avantages', items:['L’autonomie', 'La protection contre les dettes de l’autre (profession à risques)']},
    {p:'Injuste pour l’époux au foyer : aucune part de l’enrichissement de l’autre'}
  ]},
  {id:'participation', t:'La participation aux acquêts', items:[
    {d:'Pendant le mariage', v:'Comme une séparation de biens'},
    {d:'Acquêts nets', v:'Patrimoine final − patrimoine originaire'},
    {d:'Créance de participation', v:'La moitié de la différence, due par celui qui s’est le plus enrichi'},
    {x:'Cours : Madame + 50 000, Monsieur + 200 000 : Monsieur doit 75 000 €'},
    {p:'Au divorce, l’entreprise créée pendant le mariage gonfle les acquêts'}
  ]},
  {id:'conventionnelle', t:'La communauté conventionnelle', items:[
    {l:'Modifier la masse', items:['L’élargir : meubles et acquêts, communauté universelle', 'La réduire : exclure l’entreprise, les immeubles…']},
    {l:'Le partage', items:['Par moitié, sauf clause', 'Partage inégal (1/3, 2/3)', 'Attribution intégrale : tout au survivant']},
    {d:'Préciput', v:'Le survivant prélève un bien ou une somme avant partage, sans fiscalité (art. 1516)'},
    {kv:[['Artisan, commerçant', 'Séparation de biens'], ['Retraités', 'Communauté universelle + attribution intégrale']]}
  ]},
  {id:'contrat', t:'Contrat et changement de régime', items:[
    {kv:[['Contrat de mariage', 'Acte notarié solennel, signé avant la célébration (art. 1394 et 1395)'], ['Le jour de la signature', 'Certificat remis à l’officier de l’état civil'], ['Le coût', 'Émoluments, formalités ; apport d’immeuble : TPF sur la moitié + CSI ; sinon 125 €']]},
    {l:'Le changement de régime (art. 1397)', num:true, items:['Acte notarié, avec la liquidation si besoin', 'Information des enfants majeurs ; avis aux créanciers dans un journal d’annonces légales', 'Trois mois pour s’opposer', 'En cas d’opposition : homologation (avocat)', 'Mention en marge de l’acte de mariage']},
    {d:'Les effets', v:'Entre époux : à l’acte (ou au jugement). Pour les tiers : 3 mois après la mention'},
    {p:'Depuis 2019 : plus de délai de 2 ans, ni d’homologation automatique avec des mineurs'}
  ]}
]);
