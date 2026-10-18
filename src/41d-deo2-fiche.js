
JLG.fiche('deo2', [
  {id:'avant', t:'Les formalités préalables', items:[
    {d:'Formalités préalables', v:'Vérifications, pièces et démarches accomplies avant la signature, pour rédiger l’acte. La publication au SPF est postérieure.'},
    {l:'Les trois enquêtes', num:true, items:['QUI : les personnes (identité, capacité, pouvoirs)', 'QUOI : le bien (titre, cadastre, hypothèques)', 'QUELLES règles : urbanisme et diagnostics']},
    {p:'Un acte rédigé avec des pièces manquantes est un acte qu’on risque de devoir refaire.'}]},
  {id:'identite', t:'Les personnes physiques', items:[
    {l:'Les six mentions', items:['Nom', 'Prénoms (ordre de l’état civil)', 'Domicile', 'Profession', 'Date et lieu de naissance', 'Nom du conjoint, s’il y a lieu']},
    {kv:[['Français', 'CNI ou passeport en cours de validité, avec photo'], ['Étranger', 'Pièce d’identité (passeport) + actes d’état civil traduits au besoin'], ['Titre de séjour', 'Pas exigé de tout étranger : EEE et Suisses dispensés']]},
    {p:'Pas de « durée de validité » universelle pour les actes d’état civil : des actes récents.'}]},
  {id:'etatcivil', t:'État civil et situation de famille', items:[
    {tab:{head:['Pièce', 'Où la demander'], rows:[['Acte de naissance avec filiation', 'COMEDEC ou service d’état civil'], ['Acte de mariage', 'Mairie du lieu de célébration ou COMEDEC'], ['Français né ou marié à l’étranger', 'SCEC, à Nantes'], ['Contrat de mariage', 'Notaire détenteur de l’acte']]}},
    {kv:[['PACS', 'En marge de l’acte de naissance ; mairie ou notaire depuis le 1er novembre 2017'], ['Divorce', 'Jugement ou convention déposée chez un notaire, et caractère définitif']]},
    {kv:[['Mineur', 'Représentants légaux, parfois le juge des tutelles'], ['Tutelle', 'Le tuteur représente'], ['Curatelle', 'Le curateur assiste']]}]},
  {id:'morales', t:'Personnes morales et pouvoirs', items:[
    {d:'Kbis', v:'L’extrait d’immatriculation : la carte d’identité de la société. Il ne prouve pas les pouvoirs.'},
    {l:'Les pièces d’une société', items:['Statuts à jour', 'Kbis le plus récent possible', 'Décisions sociales (compte rendu d’AG)', 'BODACC : procédure collective ?']},
    {kv:[['Société civile', 'Pouvoirs : statuts ou délibérations d’associés'], ['Société commerciale', 'Statuts, AG, conseil, PDG ou directoire selon la forme'], ['Association', 'Date et lieu de dépôt des statuts (préfecture)']]},
    {kv:[['Procuration de vente', 'Sous signature privée possible'], ['Procuration pour donation', 'Authentique']]}]},
  {id:'bien', t:'L’identification du bien', items:[
    {a:'Art. 7 du décret du 4 janvier 1955', v:'Tout acte indique pour chaque immeuble : la nature, la situation, la contenance et la désignation cadastrale.'},
    {kv:[['Titre de propriété', 'Qui est propriétaire, désignation, origine trentenaire'], ['Cadastre', 'Extrait modèle 1, plan ; matrice = fiscal, pas un titre'], ['EHF', 'Propriété, servitudes, hypothèques, démembrement, copropriété publiée']]},
    {m:'Titre, Cadastre, EHF : le trio du bien.'},
    {p:'Le SPF du lieu de situation de l’immeuble délivre l’état hypothécaire.'}]},
  {id:'urbanisme', t:'Les pièces d’urbanisme', items:[
    {tab:{head:['Document', 'À quoi il sert'], rows:[['CUa', 'Règles applicables, servitudes, taxes : 1 mois'], ['CUb', 'Faisabilité d’un projet précis : 2 mois'], ['Alignement', 'Limite du domaine public routier'], ['Numérotage', 'Adresse attribuée à l’immeuble'], ['Carrière', 'Risques du sol et du sous-sol'], ['DIA', 'À déposer si DPU ou ZAD : réponse sous 2 mois']]}},
    {kv:[['Certificat d’urbanisme', 'Gratuit, valable 18 mois, pas une autorisation']]},
    {m:'a = 1 mois (1re lettre) ; b = 2 mois (2e lettre).'},
    {p:'La DIA n’est pas un certificat : on la dépose, on ne la reçoit pas.'}]},
  {id:'ddt', t:'Les diagnostics et leurs durées', items:[
    {d:'DDT', v:'Dossier de diagnostic technique : fourni dès la promesse de vente.'},
    {tab:{head:['Diagnostic', 'Durée'], rows:[['Termites', '6 mois'], ['État des risques (ERP)', 'Moins de 6 mois'], ['Gaz · Électricité · ANC', '3 ans'], ['Audit énergétique', '5 ans'], ['DPE', '10 ans'], ['Plomb (absent) · Amiante récent', 'Illimitée'], ['Carrez · Détecteur de fumée', 'Pas de durée légale']]}},
    {kv:[['Plomb', 'Avant 1949'], ['Amiante', 'Permis avant le 1er juillet 1997'], ['Gaz, électricité', 'Installation de plus de 15 ans']]},
    {m:'6 mois : les termites et les risques. 3 ans : gaz, électricité, assainissement. 10 ans : DPE.'}]}
]);
