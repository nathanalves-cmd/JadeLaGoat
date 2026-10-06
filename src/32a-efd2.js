JLG.chapter({
  id:'efd2', subject:'efd', order:2, num:'2', added:'2026-10-06', minutes:30,
  kicker:'Chapitre 2', short:'Les droits subjectifs', title:'Les droits subjectifs', titleHtml:'Les droits <em>subjectifs</em>',
  intro:'Le droit objectif, c’est la règle du jeu. Les droits subjectifs, ce sont les cartes que chaque joueur a en main : les prérogatives que le droit reconnaît à une personne, sur des biens ou envers d’autres personnes.',
  objectives:['Définir le droit subjectif et le patrimoine', 'Distinguer droits patrimoniaux et extrapatrimoniaux', 'Distinguer droits réels (principaux, accessoires), personnels et intellectuels', 'Maîtriser usus, fructus, abusus et les démembrements de la propriété', 'Appliquer l’article 9 du Code civil (vie privée, image) dans un cas pratique'],
  traps:[
    {t:'Créancier chirographaire = aucune priorité', h:'Sans sûreté, il n’a ni droit de suite ni droit de préférence : il est payé à égalité avec les autres créanciers.'},
    {t:'Usage ≠ usufruit', h:'L’usufruitier peut louer et encaisser les loyers. L’usager ne prend les fruits que pour ses besoins, jamais pour en tirer des revenus.'},
    {t:'Gage ou nantissement ?', h:'Gage : un meuble que l’on peut toucher (voiture, bijou). Nantissement : un meuble incorporel (fonds de commerce, parts sociales).'},
    {t:'Même célèbre, on a une vie privée', h:'La notoriété justifie l’intérêt du public pour la carrière, pas pour la vie familiale, sentimentale ou la santé.'},
    {t:'Autorisation d’image = expresse et spéciale', h:'Une autorisation donnée pour une publicité ne vaut pas pour une autre utilisation.'},
    {t:'Un patrimoine même vide', h:'Toute personne a un patrimoine, même sans aucun bien, et même s’il est déficitaire.'}
  ],
  sections:[
    {id:'notion', n:'—', eyebrow:'Introduction', title:'Qu’est-ce qu’un droit subjectif ?', blocks:[
      {t:'def', term:'Droit subjectif', h:'Prérogative dont dispose une personne à l’égard de biens ou de personnes. Il est dit « subjectif » car il a un <b>titulaire</b>, qui en est le <b>sujet</b>.'},
      {t:'tip', k:'ex', h:'Le droit de propriété est un droit subjectif : il permet à son titulaire d’utiliser sa chose, de la louer, de la vendre…'},
      {t:'vs', a:{title:'Droit objectif', items:['L’ensemble des règles de droit', 'La règle du jeu, la même pour tous']}, b:{title:'Droits subjectifs', items:['Les prérogatives d’une personne', 'Accordés et sanctionnés par le droit objectif']}},
      {t:'tree', root:{l:'Les droits subjectifs', kids:[
        {l:'Droits patrimoniaux', h:'Évaluables en argent : ils entrent dans le patrimoine', kids:[
          {l:'Droits réels', h:'Sur une chose. Principaux (propriété, usufruit…) ou accessoires (hypothèque, gage, nantissement)'},
          {l:'Droits personnels', h:'Contre une personne : le droit de créance'},
          {l:'Droits intellectuels', h:'Sur une création ou une clientèle : droit d’auteur, brevet, fonds de commerce'}]},
        {l:'Droits extrapatrimoniaux', h:'Non évaluables en argent : vie privée, image, voix, droit moral de l’auteur…'}]}}
    ]},
    {id:'patrimoine', n:'I', eyebrow:'Le contenant', title:'Le patrimoine', blocks:[
      {t:'def', term:'Patrimoine', h:'L’ensemble des droits et obligations d’une personne <b>évaluables en argent</b>. Il comprend un <b>actif</b> (les droits) et un <b>passif</b> (les obligations, les dettes).'},
      {t:'widget', w:'patrimoine'},
      {t:'table', head:['', 'Exemples'], rows:[
        ['Actif immobilier', 'Terrains, maisons, appartements, immeubles'],
        ['Actif mobilier', 'Voiture, comptes bancaires, <b>actions</b> (une petite part d’une entreprise), <b>obligations</b> (un prêt consenti à un État ou à une grande entreprise)'],
        ['Passif', 'Crédit immobilier (long terme), crédit à la consommation, dettes fiscales, dettes de la vie courante']]},
      {t:'h3', h:'Une universalité juridique'},
      {t:'p', h:'Le patrimoine est un <b>tout</b>, distinct des éléments qui le composent : il réunit l’actif et le passif, et <b>l’actif répond du passif</b>. Un créancier impayé peut donc saisir n’importe quel bien de son débiteur, le faire vendre et se payer sur le prix.'},
      {t:'quote', ref:'Article 2284 du Code civil', h:'« Quiconque s’est obligé personnellement, est tenu de remplir son engagement sur tous ses biens mobiliers et immobiliers, présents et à venir. »'},
      {t:'def', term:'Créancier chirographaire', h:'Créancier qui n’a <b>aucune sûreté</b>. Il dispose seulement d’un <b>droit de gage général</b> sur tout le patrimoine de son débiteur (art. 2284).'},
      {t:'h3', h:'Un lien avec la personne'},
      {t:'list', num:true, items:['<b>Seules les personnes ont un patrimoine</b> : les personnes physiques et les personnes morales (sociétés, associations…).', '<b>Toute personne a nécessairement un patrimoine</b>, même vide. Il n’est donc pas transmissible entre vifs : on peut vendre ou donner des biens, mais pas son patrimoine dans sa globalité.', '<b>Une personne n’a qu’un seul patrimoine</b>.']},
      {t:'tip', k:'prof', h:'C’est la théorie classique d’<b>Aubry et Rau</b> (XIXe siècle). Elle connaît aujourd’hui des exceptions : depuis 2022, l’entrepreneur individuel a deux patrimoines (professionnel et personnel), et la fiducie crée un patrimoine affecté à un but.'},
      {t:'tip', k:'notaire', h:'Au décès, le patrimoine, actif <b>et</b> passif, est transmis aux héritiers : c’est tout l’enjeu du règlement d’une succession à l’étude (les héritiers peuvent aussi y renoncer).'}
    ]},
    {id:'patrimoniaux', n:'II', eyebrow:'Évaluables en argent', title:'Les droits patrimoniaux', blocks:[
      {t:'p', h:'Ils sont <b>évaluables en argent</b> et entrent donc dans le patrimoine. Ils sont <b>cessibles</b>, <b>saisissables</b> et <b>transmissibles</b>, entre vifs (vente, donation) ou à cause de mort.'},
      {t:'tip', k:'memo', h:'Patrimonial = je peux le <b>Céder</b>, il peut être <b>Saisi</b>, il se <b>Transmet</b>. Extrapatrimonial = les « 3 I » : <b>I</b>ncessible, <b>I</b>nsaisissable, <b>I</b>mprescriptible.'},
      {t:'h3', h:'Les droits réels', small:'A.'},
      {t:'def', term:'Droit réel', h:'Droit exercé <b>directement</b> par une personne <b>sur une chose</b> (du latin <i>res</i>, la chose).'},
      {t:'vs', a:{title:'Droit de suite', items:['Revendiquer la chose « en quelques mains qu’elle se trouve »', 'Je suis ma chose partout']}, b:{title:'Droit de préférence', items:['Être préféré à toute autre personne qui revendique la chose', 'Je passe devant les autres créanciers']}},
      {t:'tip', k:'ex', h:'Si un bien est saisi et vendu, le créancier qui a un droit réel accessoire (une hypothèque, par exemple) est payé <b>avant</b> les créanciers chirographaires.'},
      {t:'h3', h:'1°) Les droits réels principaux'},
      {t:'quote', ref:'Article 544 du Code civil', h:'« La propriété est le droit de jouir et disposer des choses de la manière la plus absolue, pourvu qu’on n’en fasse pas un usage prohibé par les lois ou par les règlements. »'},
      {t:'chips', groups:[{label:'Les 3 prérogatives du propriétaire', items:[
        {l:'Usus', h:'Le droit d’<b>utiliser</b> la chose : habiter sa maison, conduire sa voiture.'},
        {l:'Fructus', h:'Le droit d’en <b>percevoir les fruits</b> : les loyers d’un appartement loué, les récoltes d’un champ.'},
        {l:'Abusus', h:'Le droit d’en <b>disposer</b> : la vendre, la donner, voire la détruire.'}]}]},
      {t:'widget', w:'demembrement'},
      {t:'p', h:'Les <b>droits réels démembrés</b> ne confèrent qu’une ou deux de ces prérogatives :'},
      {t:'list', items:['<b>Usufruit</b> : usus + fructus ; le <b>nu-propriétaire</b> conserve l’abusus.', '<b>Usage</b> : user et percevoir les fruits, mais seulement <b>dans la limite de ses besoins</b>, pas pour en tirer des revenus.', '<b>Habitation</b> : un droit d’usage limité à l’<b>habitation familiale</b>.', '<b>Servitude</b> : le propriétaire d’un fonds use de certaines prérogatives sur le fonds voisin (passage, puisage, vue, écoulement des eaux). Celui qui en profite est le <b>fonds dominant</b>, celui qui la subit le <b>fonds servant</b>.', '<b>Emphytéose</b> : un bail de très longue durée, de <b>18 à 99 ans</b>.']},
      {t:'tip', k:'memo', h:'<b>USUFRUIT = USUS + FRUCTUS.</b> Le mot contient sa propre définition. Ce qui reste au propriétaire, l’abusus, est une propriété « toute nue » : la nue-propriété.'},
      {t:'tip', k:'notaire', h:'Classique en étude : des parents donnent la <b>nue-propriété</b> de leur maison à leurs enfants et en gardent l’<b>usufruit</b>. Ils y vivent (ou la louent) toute leur vie ; à leur décès, l’usufruit s’éteint et les enfants deviennent pleins propriétaires.'},
      {t:'h3', h:'2°) Les droits réels accessoires'},
      {t:'p', h:'Ils n’existent pas seuls : ils sont l’<b>accessoire d’une créance</b> qu’ils garantissent. On les appelle des <b>sûretés réelles</b>.'},
      {t:'table', head:['Sûreté', 'Porte sur', 'Exemple'], rows:[
        ['Hypothèque', 'Un <b>immeuble</b>', 'La banque prend une hypothèque sur la maison qu’elle finance'],
        ['Gage', 'Un <b>meuble corporel</b>', 'Une voiture, un bijou, un tableau'],
        ['Nantissement', 'Un <b>meuble incorporel</b>', 'Un fonds de commerce, des parts sociales']]},
      {t:'p', h:'Le créancier titulaire d’un gage ou d’une hypothèque a sur le bien un <b>droit de préférence</b> sur les autres créanciers, et un <b>droit de suite</b> : si le bien est vendu, la sûreté le suit, et le créancier peut le saisir entre les mains de l’acheteur.'},
      {t:'tip', k:'notaire', h:'Avant toute vente, le notaire vérifie au service de la publicité foncière si l’immeuble est grevé d’hypothèques : elles doivent être réglées pour que l’acheteur reçoive un bien libre.'},
      {t:'h3', h:'Les droits personnels', small:'B.'},
      {t:'def', term:'Droit personnel (de créance)', h:'Droit qui repose sur une relation entre deux personnes : il permet à l’une (le <b>créancier</b>) d’exiger quelque chose de l’autre (le <b>débiteur</b>). Il ne donne <b>ni droit de suite, ni droit de préférence</b>.'},
      {t:'tip', k:'ex', h:'Tu prêtes 500 € à un ami : tu as un droit personnel contre lui. S’il a d’autres dettes, tu passes au même rang que ses autres créanciers chirographaires.'},
      {t:'vs', a:{title:'Droit réel', items:['Sur une <b>chose</b>', 'Droit de suite + droit de préférence', 'Ex. : propriété, usufruit, hypothèque']}, b:{title:'Droit personnel', items:['Contre une <b>personne</b>', 'Ni suite, ni préférence', 'Ex. : se faire rembourser un prêt']}},
      {t:'h3', h:'Les droits intellectuels', small:'C.'},
      {t:'p', h:'Ils portent sur une <b>création intellectuelle</b> ou une <b>clientèle</b>. Leur objet est immatériel et ils confèrent un <b>droit exclusif d’exploitation</b>.'},
      {t:'list', items:['<b>L’auteur</b> (écrivain, compositeur…) exploite son œuvre et en tire profit. Il a aussi un <b>droit moral</b> pour veiller au respect de son œuvre : ce droit moral est <b>extrapatrimonial</b>.', '<b>L’inventeur</b> titulaire d’un <b>brevet</b> a un monopole d’exploitation : c’est la propriété industrielle.', '<b>Le titulaire d’un fonds de commerce</b> a un droit de clientèle : il l’exploite et peut la céder à son successeur.']}
    ]},
    {id:'extrapatrimoniaux', n:'III', eyebrow:'Hors du patrimoine', title:'Les droits extrapatrimoniaux', blocks:[
      {t:'p', h:'Ils ne sont <b>pas évaluables en argent</b> et n’entrent donc pas dans le patrimoine. Ils sont en principe <b>incessibles, insaisissables et imprescriptibles</b>. Ce sont des droits inhérents à la personne, qui protègent sa personnalité : les <b>droits de la personnalité</b>.'},
      {t:'chips', groups:[{label:'Exemples', items:[
        {l:'Vie privée', h:'Le droit au respect de sa vie privée (art. 9 C. civ.).'},
        {l:'Image', h:'Le droit de s’opposer à la diffusion de son image sans autorisation.'},
        {l:'Voix', h:'Comme l’image, la voix est protégée par la jurisprudence sur le fondement de l’article 9.'},
        {l:'Vie familiale', h:'Le respect de la vie familiale, mais aussi des convictions politiques et de la vie professionnelle.'}]}]},
      {t:'tip', k:'info', title:'Une frontière qui n’est pas étanche', h:'Un droit extrapatrimonial peut produire des effets en argent : un artiste <b>vend</b> à un magazine les photos de son mariage (sa vie privée devient rémunérée) ; une atteinte à la vie privée se répare par des <b>dommages-intérêts</b>. La distinction reste claire et utile.'},
      {t:'h3', h:'Le droit au respect de la vie privée'},
      {t:'quote', ref:'Article 9 du Code civil', h:'« Chacun a droit au respect de sa vie privée. Les juges peuvent, sans préjudice de la réparation du dommage subi, prescrire toutes mesures, telles que séquestre, saisie et autres, propres à empêcher ou faire cesser une atteinte à l’intimité de la vie privée : ces mesures peuvent, s’il y a urgence, être ordonnées en référé. »'},
      {t:'p', h:'La Cour de cassation précise que <b>toute personne</b>, quels que soient son rang, sa naissance, sa fortune ou ses fonctions, a droit au respect de sa vie privée. Le simple constat de l’atteinte ouvre droit à <b>réparation</b>.'},
      {t:'p', h:'La loi ne définit pas la vie privée : ce sont les juges qui en ont fixé les contours.'},
      {t:'list', items:['Vie sentimentale et sexuelle, vie familiale', 'État de santé', 'Domicile', 'Patrimoine des particuliers (les responsables politiques, eux, doivent publier une déclaration de patrimoine)', 'Adhésion à un syndicat ou à un parti politique', 'Numéro de téléphone, numéro de sécurité sociale, correspondances', 'Profil de réseau social, adresse IP d’un ordinateur']},
      {t:'p', h:'<b>Ce n’est pas un droit absolu.</b> Il faut le concilier avec d’autres valeurs d’égale importance : le <b>droit à l’information</b> du public et le <b>droit à la preuve</b>. Le juge exerce un <b>contrôle de proportionnalité</b>.'},
      {t:'tip', k:'ex', h:'La filature d’un salarié organisée par son employeur pour surveiller son activité est un <b>moyen de preuve illicite</b> dès lors qu’elle porte atteinte à sa vie privée.'},
      {t:'h3', h:'Le droit à l’image'},
      {t:'def', term:'Image', h:'La représentation d’une personne, ou même d’un bien, par quelque moyen que ce soit.'},
      {t:'p', h:'Aucun texte ne consacre le droit à l’image : la jurisprudence l’a construit à partir de l’<b>article 9</b>, qui permet de dégager de nouveaux droits (l’image, la voix).'},
      {t:'list', num:true, items:['<b>Principe</b> : publier l’image d’une personne exige son <b>autorisation expresse et spéciale</b> (pour un mineur : celle de ses parents).', '<b>Exception, la liberté d’information</b> : la personne se trouve dans un <b>événement d’actualité</b> ou d’<b>intérêt général</b>…', '… et l’image est <b>pertinente</b>, c’est-à-dire utilisée pour relater cet événement.']},
      {t:'tip', k:'astuce', title:'Repère pratique', h:'Dans un lieu public, une photo de foule où personne n’est isolé pose rarement problème. Un portrait isolé d’un particulier exige son accord. Une personnalité publique peut être montrée dans l’exercice de ses fonctions publiques, pas dans sa vie privée.'}
    ]}
  ],
  essentials:[
    'Un <b>droit subjectif</b> est une prérogative reconnue à une personne, accordée et sanctionnée par le droit objectif.',
    'Le <b>patrimoine</b> = actif + passif évaluables en argent. Universalité : l’actif répond du passif (droit de gage général, art. 2284).',
    'Toute personne a un patrimoine, un seul, intransmissible entre vifs dans sa globalité.',
    'Droits <b>patrimoniaux</b> : cessibles, saisissables, transmissibles. <b>Extrapatrimoniaux</b> : incessibles, insaisissables, imprescriptibles.',
    '<b>Droit réel</b> : sur une chose, avec droit de suite et de préférence. Principaux : propriété (art. 544 : usus, fructus, abusus) et démembrements. Accessoires : hypothèque, gage, nantissement.',
    'Usufruit = usus + fructus ; usage = limité aux besoins ; habitation = logement familial ; servitude = fonds dominant / servant ; emphytéose = 18 à 99 ans.',
    '<b>Droit personnel</b> : contre une personne, sans suite ni préférence. <b>Droits intellectuels</b> : auteur, brevet, clientèle.',
    'Art. 9 : chacun a droit au respect de sa vie privée, même célèbre. Pas absolu : contrôle de proportionnalité.',
    'Image : autorisation <b>expresse et spéciale</b>, sauf événement d’actualité ou d’intérêt général avec image pertinente.'
  ],
