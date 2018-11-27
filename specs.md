# Spécifications techniques
Le kiff, histoire de disparitions

## Présentation du projet

### Une expérience interactive en 3D
“Le kiff” est une expérience interactive en 3D, sur desktop et navigateur uniquement, retraçant la vie d’un caillou de crack depuis sa naissance sous forme de feuille jusqu’à sa consommation par un addicte pour documenter l’ensemble des étapes de vie de cet objet.

### Système d’échelles
L’expérience est vécue du point de vue subjectif de l’objet mais apporte aussi des points de vue plus génériques. L’histoire peut se vivre sous 3 échelles différentes de la plus grande à la plus petite : micro, humaine ou macro afin d’accéder à différents niveaux d’informations. 

### Participation de l’utilisateur
Tout au long de son expérience, l’utilisateur va être amené s’il le souhaite, à découvrir des informations supplémentaires sur le sujet, grâce à des points d’intérêts, ou à questionner ses connaissances et à les comparer à celles des autres utilisateurs, grâce à des points de question. 

## Arborescence

## Environnement technique

### API Wordpress
Wordpress est utilisé en tant que headless CMS. L’interface admin est donc la même que Wordpress et va permettre de modifier facilement les contenus (textes principaux, points d’intérêts, point de question). Wordpress permet de créer une API REST facilement. Nous créons donc nos propres routes pour faciliter l’utilisation côté client. 
Uniquement une requête sera en POST, pour pouvoir mettre à jour les statistiques utilisateurs des réponses aux points de question. 
Nous utilisons ACF qui permet de réaliser facilement des liaisons entre les modèles afin de reproduire les relations d’une base de données classique.

Récupération d’un chapitre
```
.../wp-json/v1/chapters/{id}
```

Récupération des étapes d’un chapitre
```
.../wp-json/v1/chapters/{id}/steps
```

Récupération des informations d’une étapes
```
.../wp-json/v1/steps/{id}/infos
```

### React
    
### Store custom / Redux

### ThreeJS

## Architecture 

## Scope fonctionnel

## Workflow designer / Développeurs
