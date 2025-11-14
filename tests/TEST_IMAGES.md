# Test d'Affichage des Images

Ce fichier teste l'affichage des images du dossier screenshots.

## Test 1: Image avec chemin relatif standard

![Screenshot 1](screenshots/1%20-%20Right%20Click%20to%20Open%20with%20MDOffice%20-%20Markdown%20Office%20Editor.png)

## Test 2: Image avec chemin relatif ./ explicite

![Screenshot 2](./screenshots/2%20%20-%20Split%20View.png)

## Test 3: Image avec espaces

![Screenshot 3](screenshots/3 - Editor View.png)

## Test 4: Image URL encodée

![Screenshot 4](screenshots/4%20-%20Office%20View.png)

## Test 5: Toutes les images

![Image 1](screenshots/1%20-%20Right%20Click%20to%20Open%20with%20MDOffice%20-%20Markdown%20Office%20Editor.png)
![Image 2](screenshots/2%20%20-%20Split%20View.png)
![Image 3](screenshots/3%20-%20Editor%20View.png)
![Image 4](screenshots/4%20-%20Office%20View.png)
![Image 5](screenshots/5%20-%20Easy%20to%20navigate%20to%20settings.png)
![Image 6](screenshots/6-%20Settings%20page%20preview.png)
![Image 7](screenshots/7%20-%20Open%20as%20Default%20deactivated%20by%20default.png)

## Instructions

1. Ouvrez ce fichier avec MDOffice
2. Les images ci-dessus devraient s'afficher
3. Si une image a une bordure rouge, elle n'a pas pu se charger
4. Ouvrez la console développeur (Help > Toggle Developer Tools) pour voir les logs de débogage

## Débogage

Si les images ne s'affichent pas:
1. Vérifiez la console pour les messages `[MDOffice] Image path resolution:`
2. Vérifiez que `documentDir` est défini
3. Vérifiez que les chemins résolus sont corrects
4. Vérifiez les erreurs dans la console

## Attendu

✅ Toutes les 7 images devraient s'afficher  
✅ Pas de bordure rouge  
✅ Les chemins avec espaces fonctionnent  
✅ Les chemins encodés en URL fonctionnent

