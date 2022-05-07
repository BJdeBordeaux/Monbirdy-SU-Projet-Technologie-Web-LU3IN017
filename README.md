# Guide de tourner l'application
### par LI Junji 28610187 && Mohamed BABAALI 28601465

********

1. Fichiers et leur rôle
    * Client : `client`
    * Serveur : `server` 
        * À noter que les database se trouve ici, dans le répertoire `mongo`
    * pièces jointes
        * `architecture.jpg` : l'achitecture du Client
        * `structure diagram` : la structure de la base de données.
            * Pour le voir, entrez et cliquez sur `index.html`
        * `monbirdytest.postman_collection.json` : le fichier exporté pour le test postman
        * `README.md` : fichier de présentation.
1. Préparation
    1. Avec terminal, accédez dans le répertoire du projet
    1. Installation des modules
        1. Dans le répertoire du projet, fait
            ```shell
                cd client && npm install
                cd ../server && npm install
            ```
1. Démarrage
    * Dans le répertoire de travail
        ```shell
            # si vous suivez les instructions précédantes dans Préparation
            cd ..
            # sinon, par exemple je fais
            cd ~/Bureau/etudes/projets/Monbirdy-SU-Projet-Technologie-Web-LU3IN017
        ```
    1. Ouverture de server de mongoDB
        * il faut d'abord installer le server de [mongoDB](https://www.mongodb.com/docs/manual/installation/)
        ```shell
            mongod --dbpath ./server/mongo/mongo --logpath ./server/mongo/mongod.log --fork
        ```
    1. Ouverture de back-end
        ```shell
            cd server && npm start
        ```
    1. Ouverture de front-end
        * ouvrez un autre terminal et fait
        ```shell
            cd client && npm start
        ```
