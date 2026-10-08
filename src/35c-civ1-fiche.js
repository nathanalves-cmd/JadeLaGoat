
JLG.fiche('civ1', [
  {id:'concubinage', t:'Le concubinage', items:[
    {a:'Art. 515-8 C. civ.', v:'Union de fait : une vie commune stable et continue, entre deux personnes de sexe différent ou de même sexe, qui vivent en couple.'},
    {l:'Les trois « pas »', items:['Pas de conditions, ni à l’entrée ni à la sortie', 'Pas de solidarité des dettes (sauf contrat signé à deux)', 'Pas de patrimoine commun']},
    {d:'La propriété des biens', v:'Chacun est propriétaire exclusif de ses biens, s’il le prouve. Sinon : présomption simple de propriété par moitié.'},
    {kv:[['Certificat de concubinage', 'Délivré par certaines mairies, atteste la vie commune, valeur très relative'], ['Convention de concubinage', 'Contrat libre : inventaire, dépenses, rupture. Ni biens futurs, ni obligations personnelles']]},
    {kv:[['Préavis du signataire du bail', 'Le concubin non signataire doit partir'], ['Décès ou abandon', 'Bail transféré au concubin notoire (1 an de vie commune)']]}]},
  {id:'pacs', t:'Le PACS : définition et conditions', items:[
    {a:'Art. 515-1 C. civ.', v:'Un contrat conclu par deux personnes physiques majeures, de sexe différent ou de même sexe, pour organiser leur vie commune.'},
    {l:'PACS interdit (art. 515-2)', items:['Entre ascendant et descendant', 'Entre alliés en ligne directe', 'Entre collatéraux jusqu’au 3e degré inclus', 'Si l’un est déjà marié', 'Si l’un est déjà pacsé']},
    {p:'Pas de PACS pour un mineur, même émancipé. Et aucune dispense possible.'},
    {kv:[['Cousins germains', '4e degré : PACS possible'], ['Majeur sous tutelle ou curatelle', 'Possible, assisté pour signer la convention']]}]},
  {id:'former', t:'Conclure le PACS', items:[
    {l:'Les étapes', num:true, items:['Convention : sous signature privée ou notariée', 'Déclaration conjointe : mairie de la résidence commune, ou notaire', 'Enregistrement : date certaine, effet entre partenaires', 'Mention en marge de l’acte de naissance : opposable aux tiers']},
    {l:'Les pièces', items:['Pièce d’identité', 'Acte de naissance', 'Attestation sur l’honneur : pas de lien de parenté ou d’alliance', 'Justificatif de résidence commune', 'La convention']},
    {x:'PACS notarié : le notaire garde la minute, enregistre lui-même et fait la publicité.'}]},
  {id:'effets', t:'Les effets du PACS', items:[
    {a:'Art. 515-4 C. civ.', v:'Vie commune, aide matérielle et assistance réciproques. L’aide est proportionnelle aux facultés de chacun.'},
    {d:'Solidarité', v:'Pour les dettes de la vie courante, sauf dépenses manifestement excessives (et achats à tempérament ou emprunts conclus par un seul).'},
    {tab:{head:['', 'Séparation', 'Indivision'], rows:[['Quand ?', 'Par défaut (loi du 23 juin 2006)', 'Sur option, dans la convention'], ['Biens achetés pendant le PACS', 'À celui qui les achète', 'Indivis par moitié'], ['Dettes personnelles', 'Chacun les siennes', 'Chacun les siennes']]}},
    {l:'Restent personnels même en indivision (art. 515-5-2)', items:['L’argent non utilisé pour acheter', 'Les biens créés', 'Les biens à caractère personnel', 'Les biens payés avec des fonds d’avant le PACS', 'Les biens reçus ou payés par donation ou succession']},
    {m:'Indépendant à risque → séparation. Partenaire sans revenus → indivision.'}]},
  {id:'fin', t:'La fin du PACS', items:[
    {l:'Quatre causes', items:['Le décès', 'Le mariage', 'La déclaration conjointe', 'La décision unilatérale, signifiée par commissaire de justice']},
    {kv:[['Qui enregistre ?', 'La mairie ou le notaire qui a enregistré le PACS'], ['Effet entre partenaires', 'À l’enregistrement de la dissolution'], ['Effet à l’égard des tiers', 'Après la publicité']]},
    {kv:[['Logement', 'Jouissance gratuite pendant un an'], ['Héritage', 'Seulement par testament (légataire), exonéré de droits'], ['Adoption', 'Possible à deux depuis la loi du 21 février 2022']]},
    {p:'Sans testament, le partenaire pacsé n’hérite de rien.'}]}
]);
