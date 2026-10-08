JLG.chapter({
  id:'civ1', subject:'civ', order:1, num:'1', added:'2026-10-08', minutes:30,
  kicker:'Partie 1', short:'Concubinage et PACS', title:'Le concubinage et le PACS', titleHtml:'Le concubinage <em>et le PACS</em>',
  intro:'Il y a trois façons de vivre en couple, et chacune protège plus ou moins. Cette partie traite des deux premières : le concubinage, une simple situation de fait, et le PACS, un vrai contrat. Le mariage arrive dans la partie 2.',
  objectives:['Définir le concubinage et régler ses conséquences sur les biens', 'Distinguer certificat et convention de concubinage', 'Connaître les conditions, la conclusion et les effets du PACS', 'Conseiller un régime : séparation de biens ou indivision', 'Expliquer la fin du PACS et les droits du partenaire survivant'],
  prereq:'le patrimoine et les droits réels (Droit fondamental, chapitre 2) ; l’indivision et l’acte authentique (Droit immobilier, séance 1).',
  traps:[
    {t:'Pas de solidarité entre concubins', h:'Chacun paie ses propres dettes. Exception : si les deux ont signé le même contrat (un bail, un crédit à deux noms).'},
    {t:'Le certificat de concubinage ne crée aucun droit', h:'Il atteste seulement une situation. La mairie peut d’ailleurs refuser de le délivrer.'},
    {t:'PACS : séparation de biens par défaut', h:'Depuis la loi du 23 juin 2006, l’indivision ne s’applique que si les partenaires l’ont choisie expressément dans la convention.'},
    {t:'Mineur émancipé = pas de PACS', h:'L’article 515-1 exige deux personnes majeures. L’émancipation ne suffit pas.'},
    {t:'Le partenaire pacsé n’est pas héritier', h:'Sans testament, il n’hérite de rien. Il a seulement droit au logement gratuit pendant un an.'},
    {t:'PACS et adoption : ton cours est dépassé', h:'Depuis la loi du 21 février 2022, deux partenaires pacsés peuvent adopter ensemble.'}
  ],
  sections:[
    {id:'trois', n:'—', eyebrow:'Vue d’ensemble', title:'Trois façons de vivre à deux', blocks:[
      {t:'p', h:'Concubinage, PACS, mariage : plus l’engagement est formel, plus la loi protège le couple et chacun de ses membres. Compare-les critère par critère avant d’entrer dans le détail.'},
      {t:'widget', w:'echelle'},
      {t:'tip', k:'notaire', h:'À l’étude, la première question face à un couple est toujours la même : « Êtes-vous mariés, pacsés, ou simplement en couple ? ». La réponse change tout : qui est propriétaire, qui doit les dettes, qui hérite.'}
    ]},
    {id:'concubinage', n:'I', eyebrow:'Une situation de fait', title:'Le concubinage', blocks:[
      {t:'quote', ref:'Article 515-8 du Code civil', h:'« Le concubinage est une union de fait, caractérisée par une vie commune présentant un caractère de stabilité et de continuité, entre deux personnes, de sexe différent ou de même sexe, qui vivent en couple. »'},
      {t:'p', h:'Ton cours le résume en une formule : c’est une <b>liaison de pur fait</b>. Il n’existe aucun statut du concubin : toutes les questions d’argent se règlent avec les <b>règles du droit commun</b> (contrats, propriété, responsabilité).'},
      {t:'chips', groups:[{label:'Les trois « pas » du concubinage', items:[
        {l:'Pas de conditions', h:'Ni à l’entrée ni à la sortie : on se met en couple et on se sépare librement, sans formalité ni juge. Il n’y a donc pas de régime particulier.'},
        {l:'Pas de solidarité', h:'Chacun paie ses propres dettes. Exception : si les deux concubins ont signé le même contrat (bail, crédit), le droit des contrats s’applique et ils sont tenus tous les deux.'},
        {l:'Pas de patrimoine commun', h:'Les patrimoines restent séparés, sauf convention particulière. Aucune règle propre aux concubins ne les mélange.'}]}]},
      {t:'h3', h:'À qui sont les biens ?'},
      {t:'p', h:'Chacun reste <b>propriétaire exclusif</b> de ses biens. Mais en pratique, il faut pouvoir le <b>prouver</b> : facture, relevé bancaire, acte d’achat. Sans preuve, il ne reste qu’une solution : la <b>présomption de propriété par moitié</b>.'},
      {t:'def', term:'Présomption simple', h:'Une supposition admise par le droit, qui peut être renversée par une preuve contraire. Ici : faute de preuve, le bien est supposé appartenir pour moitié à chacun, sauf si l’un prouve qu’il est à lui.'},
      {t:'tip', k:'ex', h:'Sarah et Malik se séparent. Personne ne retrouve la facture du canapé : il est présumé appartenir à moitié à chacun. Si Sarah retrouve la facture à son nom, payée depuis son compte, elle renverse la présomption : le canapé est à elle.'},
      {t:'tip', k:'notaire', h:'Quand des concubins achètent un logement ensemble, le notaire indique dans l’acte la part de chacun (par exemple 60 % et 40 %), selon ce que chacun a financé. En cas de séparation, ces quotes-parts font foi.'},
      {t:'h3', h:'Certificat ou convention ?'},
      {t:'vs', a:{title:'Certificat de concubinage', items:['Il <b>atteste</b> seulement que le couple vit ensemble', 'Délivré gratuitement par <b>certaines mairies</b>, qui peuvent refuser', 'Sur justificatif d’identité, quittances ou factures aux deux noms', 'Valeur juridique <b>très relative</b> ; à défaut, une déclaration sur l’honneur']}, b:{title:'Convention de concubinage', items:['Un vrai <b>contrat</b>, au contenu libre', 'Elle organise la vie commune : inventaire des biens et du mobilier, sort des biens en cas de rupture, participation aux dépenses', 'Elle ne peut pas organiser la propriété des biens achetés plus tard', 'Elle ne peut pas imposer d’obligations personnelles']}},
      {t:'tip', k:'piege', h:'La convention de concubinage ne crée aucun « régime ». Un bien acheté plus tard appartient à celui qui l’achète, ou aux deux en indivision s’ils l’achètent ensemble. Elle a donc moins d’intérêt qu’un contrat de mariage ou qu’un PACS.'},
      {t:'h3', h:'Le logement loué'},
      {t:'table', head:['Situation', 'Conséquence'], rows:[
        ['Les deux concubins ont signé le bail', 'Ils sont cotitulaires : tous les deux locataires, tous les deux tenus.'],
        ['Un seul a signé, et il donne son préavis', 'L’autre n’a aucun droit sur le logement : il doit partir.'],
        ['Le signataire abandonne le logement ou décède', 'Le concubin non signataire peut rester dans les lieux, sous conditions.']]},
      {t:'tip', k:'prof', h:'Ces conditions sont fixées par l’article 14 de la loi du 6 juillet 1989 : le bail continue ou est transféré au <b>concubin notoire</b> qui vivait avec le locataire depuis <b>au moins un an</b>. Pour un partenaire pacsé, le transfert au décès se fait sans condition de durée.'}
    ]},
    {id:'pacs', n:'II', eyebrow:'Un contrat', title:'Le PACS : définition et conditions', blocks:[
      {t:'quote', ref:'Article 515-1 du Code civil', h:'« Un pacte civil de solidarité est un contrat conclu par deux personnes physiques majeures, de sexe différent ou de même sexe, pour organiser leur vie commune. »'},
      {t:'chips', groups:[{label:'Trois mots-clés de la définition', items:[
        {l:'Un contrat', h:'Le PACS se forme par l’accord des partenaires, comme un contrat. Le mariage, lui, est célébré par l’officier de l’état civil.'},
        {l:'Deux personnes physiques majeures', h:'Pas de personne morale, et pas de mineur, même émancipé.'},
        {l:'De sexe différent ou de même sexe', h:'Le PACS est ouvert à tous les couples depuis sa création, en 1999.'}]}]},
      {t:'h3', h:'La capacité'},
      {t:'list', items:['<b>Majeurs seulement</b> : un mineur émancipé ne peut pas conclure de PACS (art. 515-1).', '<b>Majeur sous tutelle ou curatelle</b> : il peut se pacser. Il est assisté de son tuteur ou de son curateur pour certains actes, comme la signature de la convention, et agit seul pour d’autres, comme la déclaration. Il informe son tuteur au préalable.']},
      {t:'h3', h:'Les interdictions (art. 515-2)'},
      {t:'p', h:'À peine de nullité, il ne peut pas y avoir de PACS :'},
      {t:'list', items:['entre <b>ascendant et descendant</b> en ligne directe ;', 'entre <b>alliés en ligne directe</b> (beau-père et belle-fille, par exemple) ;', 'entre <b>collatéraux jusqu’au 3e degré inclus</b> : frère et sœur, oncle et nièce, tante et neveu ;', 'si l’un des deux est <b>déjà marié</b> ;', 'si l’un des deux est <b>déjà pacsé</b>.']},
      {t:'widget', w:'famille', o:{mode:'pacs'}},
      {t:'tip', k:'piege', h:'Les cousins germains sont au 4e degré : ils peuvent se pacser. Et contrairement au mariage, aucune dispense n’existe pour le PACS : une interdiction est absolue.'},
      {t:'tip', k:'memo', title:'Compter les degrés', h:'En ligne collatérale, on remonte jusqu’à l’ancêtre commun, puis on redescend, en comptant chaque génération. Toi → ta mère (1) → ta grand-mère (2) → ton oncle (3). L’oncle est au 3e degré, son fils, ton cousin, au 4e.'}
    ]},
    {id:'former', n:'III', eyebrow:'Conclure le PACS', title:'La formation du PACS', blocks:[
      {t:'widget', w:'proc', o:{eyebrow:'Schéma animé', title:'Les étapes d’un PACS', sub:'Lance l’animation ou touche une étape.', steps:[
        {t:'Rédiger la convention', d:'Sous signature privée, rédigée par les partenaires eux-mêmes, ou par acte notarié : le notaire dresse et conserve la minute.'},
        {t:'Réunir les pièces', d:'Pièce d’identité, acte de naissance (copie intégrale ou extrait), attestation sur l’honneur d’absence de lien de parenté ou d’alliance, justificatif de résidence commune, convention.'},
        {t:'Faire la déclaration conjointe', d:'À la mairie du lieu de résidence commune, ou chez le notaire. L’officier de l’état civil ou le notaire vérifie sa compétence et la recevabilité de la demande.'},
        {t:'Enregistrement', d:'Il donne au PACS une date certaine : le PACS prend effet entre les partenaires.', tag:'effet entre eux'},
        {t:'Mention en marge de l’acte de naissance', d:'De chaque partenaire, avec l’identité de l’autre (art. 515-3-1). Le PACS devient opposable aux tiers.', tag:'opposable aux tiers'}]}},
      {t:'table', head:['Moment', 'Effet'], rows:[
        ['Enregistrement du PACS', 'Il prend effet entre les partenaires et reçoit une date certaine.'],
        ['Publicité (mention en marge)', 'Il devient opposable aux tiers.']]},
      {t:'tip', k:'piege', title:'Une procédure qui a changé', h:'Ton cours parle d’une copie authentique « remise au greffe ». C’est l’ancienne procédure. Depuis 2011, quand le PACS est notarié, c’est le <b>notaire lui-même</b> qui enregistre la déclaration et fait la publicité. Les autres PACS s’enregistrent <b>en mairie</b> depuis le 1er novembre 2017 (avant : au greffe du tribunal d’instance).'},
      {t:'h3', h:'Le travail du notaire'},
      {t:'acc', items:[
        {l:'Ce qu’il faut contrôler', h:'L’état civil des parties, l’absence d’empêchement, la capacité et les pouvoirs des partenaires, le choix du régime, les clauses de la convention, le lieu de publicité, la bonne compréhension du régime choisi, et les déclarations des parties sur le plan juridique et fiscal.'},
        {l:'Les renseignements à demander', h:'La situation matrimoniale antérieure (un mariage dissous, un PACS rompu), la présence d’enfants, l’adresse commune, et un aperçu du patrimoine de chacun.'},
        {l:'Ce que contient la convention', h:'L’identité des partenaires (noms, prénoms, date et lieu de naissance, adresse), leur déclaration qu’ils ne sont ni mariés ni pacsés, ni parents ou alliés à un degré interdit, les modalités de l’aide matérielle, et le régime des biens choisi.'},
        {l:'Acte sous signature privée ou acte notarié ?', h:'Les partenaires peuvent rédiger eux-mêmes leur convention. L’acte notarié apporte le conseil du notaire, la conservation de la minute et une date certaine.'}]},
      {t:'tip', k:'info', title:'Modifier le PACS', h:'Il suffit d’adresser la convention modificative à la mairie ou au notaire qui a enregistré le PACS, pour qu’elle soit enregistrée. C’est ainsi qu’on peut passer de la séparation à l’indivision.'}
    ]},
    {id:'effets', n:'IV', eyebrow:'Vivre pacsés', title:'Les effets du PACS', blocks:[
      {t:'quote', ref:'Article 515-4 du Code civil (al. 1)', h:'« Les partenaires liés par un pacte civil de solidarité s’engagent à une vie commune, ainsi qu’à une aide matérielle et une assistance réciproques. »'},
      {t:'chips', groups:[{label:'Les obligations des partenaires', items:[
        {l:'Vie commune', h:'Les partenaires vivent ensemble. Cette exigence protège aussi les droits du partenaire survivant sur le logement.'},
        {l:'Aide matérielle', h:'Chacun participe aux dépenses du couple. Sauf convention contraire, l’aide est proportionnelle aux facultés respectives de chacun.'},
        {l:'Assistance réciproque', h:'Un soutien moral et personnel, par exemple en cas de maladie.'},
        {l:'Solidarité des dettes', h:'Les partenaires sont tenus solidairement, à l’égard des tiers, des dettes contractées par l’un d’eux pour les besoins de la vie courante : nourriture, santé, habillement, voiture, logement. Pas pour les dépenses manifestement excessives.'}]}]},
      {t:'tip', k:'prof', h:'Comme pour les époux, la solidarité ne joue pas non plus, sans l’accord des deux, pour les achats à tempérament et les emprunts, sauf s’il s’agit de petites sommes nécessaires à la vie courante (art. 515-4 al. 2).'},
      {t:'p', h:'<b>Les recours entre partenaires.</b> Celui qui a payé plus que sa part des dettes courantes peut se faire rembourser l’excédent par l’autre. Et un partenaire dans le besoin qui n’obtient pas d’aide peut saisir le juge, qui peut par exemple ordonner la saisie du compte bancaire de l’autre.'},
      {t:'h3', h:'Le régime des biens'},
      {t:'widget', w:'pacsregime'},
      {t:'vs', a:{title:'Séparation de biens', items:['Le régime <b>par défaut</b> depuis la loi du 23 juin 2006', 'Chacun reste propriétaire des biens qu’il avait et de ceux qu’il achète', 'Chacun est seul tenu de ses dettes personnelles', 'Chacun prouve sa propriété par tous moyens ; sans preuve, le bien est indivis']}, b:{title:'Indivision', items:['Sur <b>option</b>, déclarée expressément dans la convention initiale ou modificative', 'Les biens achetés à titre onéreux pendant le PACS, ensemble ou séparément, sont indivis <b>par moitié</b>', 'Chaque partenaire est gérant de l’indivision, sauf clause contraire', 'À la fin, partage par moitié, comme une communauté']}},
      {t:'p', h:'<b>Même en indivision, certains biens restent personnels</b> (art. 515-5-2) :'},
      {t:'list', items:['les sommes perçues pendant le PACS et non utilisées pour acheter un bien ;', 'les biens créés par un partenaire ;', 'les biens à caractère personnel ;', 'les biens achetés avec de l’argent qu’un partenaire avait avant le PACS (ou avant sa modification) ;', 'les biens achetés avec de l’argent reçu par donation ou succession ;', 'les parts de biens rachetées dans une indivision successorale ou issue d’une donation.']},
      {t:'tip', k:'notaire', title:'La clause d’emploi ou de remploi', h:'Quand un partenaire achète un bien avec ses fonds personnels, le notaire précise dans l’acte d’achat d’où vient l’argent (vente d’un bien possédé avant le PACS, héritage, donation). Le bien reste alors personnel : il ne tombe pas dans l’indivision.'},
      {t:'h3', h:'Les biens possédés au jour du PACS'},
      {t:'p', h:'Chacun les conserve. Inutile de déclarer les immeubles, les fonds de commerce ou les parts sociales : leur <b>titre de propriété</b> prouve déjà leur acquisition. Il est en revanche utile d’annexer un inventaire des biens sans acte d’achat : comptes bancaires, valeurs mobilières, livrets d’épargne, œuvres d’art.'},
      {t:'h3', h:'Conseiller le bon régime'},
      {t:'table', head:['Situation du couple', 'Conseil', 'Pourquoi'], rows:[
        ['Deux revenus, une activité indépendante à risque', 'Séparation de biens', 'Les biens de l’un sont à l’abri des créanciers de l’autre.'],
        ['Un partenaire sans patrimoine ni activité', 'Indivision', 'Il profite de l’enrichissement de l’autre.'],
        ['Un partenaire fortuné qui veut protéger l’autre', 'Indivision', 'Au décès, la moitié des biens indivis appartient déjà au survivant, sans droits de succession.']]},
      {t:'tip', k:'piege', h:'Avec l’indivision, le partenaire le plus fortuné doit être averti : en cas de séparation, il partagera les biens indivis par moitié avec son ex-partenaire.'}
    ]},
    {id:'fin', n:'V', eyebrow:'Rompre ou survivre', title:'La fin du PACS', blocks:[
      {t:'chips', groups:[{label:'Les quatre causes de dissolution', items:[
        {l:'Le décès', h:'Le PACS est dissous à la date du décès d’un partenaire.'},
        {l:'Le mariage', h:'Des partenaires entre eux, ou de l’un d’eux avec une autre personne : le PACS est dissous à la date du mariage.'},
        {l:'La déclaration conjointe', h:'Les deux partenaires remettent ou adressent une déclaration commune à la mairie ou au notaire qui a enregistré le PACS.'},
        {l:'La décision unilatérale', h:'Le partenaire qui veut rompre la fait signifier à l’autre par un commissaire de justice, puis adresse une copie de la signification à la mairie ou au notaire qui a enregistré le PACS.'}]}]},
      {t:'table', head:['Qui enregistre la rupture ?', 'Quand prend-elle effet ?'], rows:[
        ['La mairie du lieu d’enregistrement du PACS, ou le notaire qui l’a enregistré', 'Entre les partenaires : à la date de l’enregistrement de la dissolution. À l’égard des tiers : après la publicité.']]},
      {t:'tip', k:'piege', title:'Huissier, greffe : des mots dépassés', h:'Ton cours parle d’« huissier » et de « greffe ». Depuis le 1er juillet 2022, les huissiers sont devenus des <b>commissaires de justice</b>, et la copie de la signification est adressée à la <b>mairie ou au notaire</b> qui a enregistré le PACS. Selon l’article 515-7, la rupture prend effet entre les partenaires à la date de son <b>enregistrement</b> (ton cours dit « dès la signification »).'},
      {t:'h3', h:'Les conséquences sur les biens'},
      {t:'list', items:['<b>À l’amiable</b> : les ex-partenaires s’accordent sur le partage du mobilier et des biens indivis, et font leurs comptes pour reprendre leur indépendance financière.', '<b>À défaut d’accord</b> : chacun peut saisir le juge, qui règle la liquidation et le partage.', '<b>Les créances entre partenaires</b> : si de l’argent est passé d’un patrimoine à l’autre (par exemple, des fonds indivis ont payé un bien personnel), celui qui en a profité doit rembourser l’autre.', '<b>Une indemnité</b> peut être demandée par le partenaire victime de la rupture : le juge applique la responsabilité civile, ou l’enrichissement injustifié.']},
      {t:'tip', k:'prof', h:'Ton cours parle d’« enrichissement sans cause ». Depuis la réforme du droit des contrats de 2016, le Code civil l’appelle <b>enrichissement injustifié</b> (art. 1303).'},
      {t:'h3', h:'Le décès d’un partenaire'},
      {t:'list', items:['<b>Le logement</b> : le survivant a la jouissance gratuite du logement commun pendant <b>un an</b>.', '<b>L’attribution préférentielle</b> du logement et du mobilier, si le défunt l’a prévue expressément par testament.', '<b>Pas d’héritage automatique</b> : le partenaire n’est pas héritier. Il ne reçoit des biens que par testament ; s’il n’y a pas d’héritiers réservataires, il peut être légataire universel et recevoir tout.']},
      {t:'tip', k:'prof', h:'Le partenaire pacsé légataire est <b>exonéré de droits de succession</b>, comme le conjoint, depuis 2007. Le concubin légataire, lui, paie 60 % de droits.'},
      {t:'tip', k:'notaire', h:'Au décès d’un partenaire pacsé, la première question du notaire : y a-t-il un testament ? Sans testament, le partenaire n’hérite de rien, même après vingt ans de vie commune.'},
      {t:'h3', h:'L’adoption'},
      {t:'tip', k:'piege', title:'Ton cours est dépassé sur ce point', h:'Ton cours dit que les partenaires pacsés ne peuvent pas adopter ensemble, et qu’une personne vivant avec une personne du même sexe peut se voir refuser l’adoption. C’est fini : depuis la <b>loi du 21 février 2022</b>, deux partenaires pacsés ou deux concubins peuvent adopter ensemble (art. 343). Et refuser une adoption à cause de l’orientation sexuelle est discriminatoire (CEDH, E.B. c. France, 2008).'},
      {t:'h3', h:'Le coût de l’acte'},
      {t:'p', h:'Ton cours donne les chiffres de 2007 : un droit fixe d’enregistrement de 125 € (CGI, art. 680) et un émolument fixe du notaire de 101,41 € TTC. Ces montants changent avec les tarifs : demande à ta prof les chiffres à retenir pour l’examen.'}
    ]}
  ],
  essentials:[
    'Le <b>concubinage</b> est une union de fait (art. 515-8) : pas de conditions, pas de solidarité, pas de patrimoine commun.',
    'Entre concubins, chacun est propriétaire de ses biens s’il le <b>prouve</b> ; sinon, présomption simple de propriété <b>par moitié</b>.',
    'Le <b>certificat</b> de concubinage atteste une situation ; la <b>convention</b> organise la vie commune, mais pas les biens futurs.',
    'Le <b>PACS</b> est un contrat entre deux personnes physiques <b>majeures</b>, de même sexe ou non (art. 515-1).',
    'Interdits (art. 515-2) : ascendants et descendants, alliés en ligne directe, collatéraux jusqu’au <b>3e degré</b>, personne déjà mariée ou pacsée. Aucune dispense.',
    'Déclaration conjointe en <b>mairie ou chez le notaire</b> ; effet entre partenaires à l’<b>enregistrement</b>, opposabilité aux tiers après la <b>mention en marge</b>.',
    'Effets : vie commune, aide matérielle, assistance ; <b>solidarité</b> des dettes de la vie courante, sauf dépenses excessives.',
    '<b>Séparation de biens par défaut</b> (loi du 23 juin 2006) ; <b>indivision</b> sur option, avec des biens qui restent personnels (art. 515-5-2).',
    'Fin : décès, mariage, déclaration conjointe ou décision unilatérale signifiée par <b>commissaire de justice</b>.',
    'Au décès : logement gratuit <b>un an</b> ; pas héritier sans testament, mais exonéré de droits s’il est légataire.'
  ],
