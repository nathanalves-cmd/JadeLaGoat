
JLG.fiche('civ2', [
  {id:'fiancailles', t:'Les fiançailles', items:[
    {d:'Fiançailles', v:'Une promesse de mariage, simple fait juridique : elles n’obligent pas à se marier.'},
    {kv:[['Rupture', 'Libre ; dommages-intérêts seulement si elle est abusive'], ['Bijou de famille', 'Restitué : il était prêté'], ['Donations en vue du mariage', 'Caduques si le mariage n’a pas lieu (art. 1088)']]}]},
  {id:'fond', t:'Les conditions de fond', items:[
    {kv:[['Âge', '18 ans ; dispense du procureur pour motif grave'], ['Bigamie', 'Interdite ; mention en marge de l’acte de naissance'], ['Inceste', 'Ligne directe, frère et sœur, oncle et nièce, alliés en ligne directe']]},
    {tab:{head:['Lien', 'Dispense du Président ?'], rows:[['Ligne directe, frère et sœur', 'Jamais'], ['Oncle et nièce, tante et neveu', 'Oui, pour causes graves'], ['Alliés en ligne directe', 'Oui, si l’auteur de l’alliance est décédé']]}},
    {l:'Consentir, c’est', items:['Être capable (mineur : dispense + parents ; leur désaccord vaut consentement)', 'Être sain d’esprit', 'Vouloir vraiment se marier : pas de mariage blanc (arrêt Appietto)', 'Être présent (sauf mariage posthume)', 'Être libre de vices : erreur, violence, crainte révérencielle']},
    {p:'Mariage blanc (but étranger, ex. la nationalité) = nul. Limiter seulement les effets = valable.'}]},
  {id:'forme', t:'Les conditions de forme', items:[
    {l:'Le parcours', num:true, items:['Le dossier : acte de naissance de moins de 3 mois, identité, témoins, certificat du notaire…', 'L’audition des futurs époux', 'Les bans : 10 jours à la porte de la mairie', 'La célébration publique, portes ouvertes, à la mairie d’un époux', 'L’échange oral des consentements, puis la signature', 'La mention en marge de l’acte de naissance']},
    {kv:[['Témoins', '2 à 4, majeurs'], ['Certificat du notaire', 'S’il y a un contrat de mariage']]}]},
  {id:'opposition', t:'Les oppositions', items:[
    {d:'Opposition', v:'Acte qui avise l’officier de l’état civil d’un empêchement : la célébration est bloquée tant qu’elle n’est pas levée.'},
    {kv:[['Ascendants', 'Tout motif légal, jamais responsables'], ['Conjoint non divorcé', 'Bigamie'], ['Frères, oncles, cousins germains', 'Seulement à défaut d’ascendant'], ['Tuteur ou curateur', 'Pour le majeur protégé'], ['Ministère public', 'Ordre public, cas de nullité']]},
    {kv:[['Forme', 'Acte de commissaire de justice'], ['Durée', '1 an, renouvelable ; celle du procureur, jusqu’à décision de justice'], ['Mainlevée', 'Volontaire ou judiciaire (tribunal judiciaire)']]}]},
  {id:'nullites', t:'Les nullités', items:[
    {p:'Principe : pas de nullité sans texte.'},
    {tab:{head:['', 'Relative', 'Absolue'], rows:[['Protège', 'Un époux', 'L’ordre public'], ['Causes', 'Erreur, violence, défaut d’autorisation des parents', 'Âge, absence de consentement, bigamie, inceste, absence, clandestinité, officier incompétent'], ['Qui agit ?', 'L’époux concerné (+ ministère public pour la violence)', 'Époux, tout intéressé, ministère public'], ['Délai', '5 ans à compter du mariage', '30 ans à compter de la célébration']]}},
    {kv:[['Régularisation', 'Défaut d’âge : 6 mois après la majorité ; décès d’un époux : le ministère public ne peut plus agir'], ['Effet', 'Rétroactif : nom, alliance, nationalité perdus ; biens liquidés comme entre concubins'], ['Enfants', 'Jamais touchés (art. 202)'], ['Mariage putatif (art. 201)', 'Époux de bonne foi : les effets passés sont maintenus']]}]},
  {id:'effets', t:'Les effets du mariage', items:[
    {a:'Art. 212 C. civ.', v:'« Les époux se doivent mutuellement respect, fidélité, secours, assistance. »'},
    {kv:[['Régime primaire', 'Pour tous les époux, quel que soit leur régime (art. 226)'], ['Communauté de vie', 'Art. 215 al. 1 ; pactes de séparation nuls'], ['Direction de la famille', 'Ensemble (art. 213)'], ['Charges du mariage', 'À proportion des ressources (art. 214)']]},
    {a:'Art. 220 C. civ.', v:'Dettes ménagères : l’autre époux est solidaire, sauf dépenses manifestement excessives.'},
    {a:'Art. 215 al. 3 C. civ.', v:'Logement de la famille et ses meubles : aucun acte sans l’accord des deux, même si le bien est à un seul. Nullité dans l’année.'},
    {kv:[['Seul', 'Profession (223), comptes (221), biens personnels (225), meubles détenus seul (222)'], ['Crise', 'Autorisation du juge (217), mesures urgentes du JAF pour 3 ans max (220-1)']]}]},
  {id:'compare', t:'Bilan : les trois couples', items:[
    {tab:{head:['', 'Concubinage', 'PACS', 'Mariage'], rows:[['Nature', 'Fait', 'Contrat', 'Union célébrée'], ['Dettes', 'Pas solidaires', 'Solidaires (vie courante)', 'Solidaires (ménagères)'], ['Biens', 'Chacun les siens', 'Séparation ou indivision', 'Régime matrimonial'], ['Héritier ?', 'Non', 'Non (testament)', 'Oui']]}},
    {m:'Plus l’engagement est formel, plus la loi protège.'}]}
]);
