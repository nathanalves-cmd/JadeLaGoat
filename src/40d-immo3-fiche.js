JLG.fiche('immo3', [
  {id:'signataires', t:'Les cinq signataires', items:[
    {tab:{head:['Signataire', 'Effets de l’acte ?', 'Clause'], rows:[['Partie', 'Oui', 'Comparution'], ['Intervenant', 'Non, mais nécessaire', 'Intervention'], ['Représentant', 'Non', 'Présence – représentation'], ['Témoin', 'Non', 'Cité s’il est présent'], ['Notaire', '—', 'Clôture : signature et sceau']]}},
    {m:'« Pierre Invite Rose, Théo et Nina » : Parties, Intervenants, Représentants, Témoins, Notaire'},
    {a:'Art. 971 C. civ.', v:'Testament authentique : deux notaires, ou un notaire et deux témoins'}
  ]},
  {id:'identite', t:'Identifier et certifier', items:[
    {kv:[['Tous (décret de 1971)', 'Nom, prénoms, domicile'], ['Pour publier (décret de 1955)', '+ prénoms dans l’ordre, naissance, profession, nom du conjoint'], ['Personne morale', 'Dénomination, forme, siège, SIREN ; représentants']]},
    {d:'Certification d’identité', v:'Extrait d’acte de naissance ou extrait RNE (INPI) de moins de 3 mois'},
    {l:'Pourquoi vérifier ?', items:['La publicité foncière (sinon, rejet)', 'TRACFIN (lutte anti-blanchiment)', 'L’authenticité (art. 1369)']},
    {x:'COMEDEC : l’état civil dématérialisé ; SCEC de Nantes : les Français nés à l’étranger'}
  ]},
  {id:'signature', t:'La signature', items:[
    {kv:[['Acte papier', 'Paraphes sur chaque page, signature en dernière page, sceau du notaire'], ['Acte électronique', 'Une signature sur tablette ; le notaire signe avec sa clé REAL']]},
    {d:'Ne sait pas signer', v:'Deux notaires, ou un notaire et deux témoins'},
    {p:'Depuis la loi Macron : seuls les notaires recueillent les signatures'}
  ]},
  {id:'representation', t:'Présence et représentation', items:[
    {a:'Art. 1984 C. civ.', v:'Le mandat : le mandant donne au mandataire le pouvoir d’agir en son nom'},
    {d:'Parallélisme des formes', v:'Acte solennel (hypothèque, VEFA) : procuration authentique'},
    {d:'Vente ordinaire', v:'Procuration sous signature privée, signature vérifiée ou certifiée'},
    {d:'Brevet', v:'L’original de la procuration authentique, annexé à l’acte'},
    {l:'Les incapables', items:['Mineur : représenté (parents, tuteur, juge)', 'Curatelle : assisté (contreseing du curateur)', 'Tutelle : représenté (tuteur, avec autorisation si besoin)']}
  ]},
  {id:'intervenants', t:'Les intervenants', items:[
    {a:'Art. 215 al. 3 C. civ.', v:'Logement de la famille : consentement du conjoint, quel que soit le régime ; sinon nullité, dans l’année'},
    {p:'Logement commun : le conjoint est covendeur (partie), pas intervenant'},
    {d:'Donation', v:'Interdiction d’aliéner : le donateur intervient'},
    {a:'Art. 924-4 C. civ.', v:'Le donateur et tous les réservataires consentent : plus d’action contre l’acquéreur'},
    {x:'Donateur décédé depuis moins de 10 ans : les réservataires interviennent (art. 921)'}
  ]},
  {id:'spf', t:'Publicité foncière et EHF', items:[
    {d:'SPF', v:'Service de la publicité foncière (ex-conservation des hypothèques), au lieu de l’immeuble'},
    {d:'Sanction', v:'Inopposabilité aux tiers, pas nullité ; dommages-intérêts pour les actes à cause de mort et les conventions d’indivision'},
    {d:'EHF', v:'Cerfa 3233-SD ; aucune validité légale, 2 mois en pratique'},
    {l:'Ce que l’EHF apprend', items:['Le propriétaire actuel et son titre', 'Les hypothèques et les charges', 'La chaîne des propriétaires sur 30 ans']}
  ]}
]);
