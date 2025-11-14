# Guide de Test - Correctif du Bouton Image

## Ce qui a été corrigé

### 1. Bouton Image 🖼️
Le bouton image a été complètement réécrit avec :
- **Interface moderne** : Dialogue HTML au lieu de `prompt()`
- **Meilleure gestion d'erreurs** : Try-catch avec logs détaillés
- **Vérification d'existence** : Vérifie que l'élément existe avant d'attacher l'événement
- **Logs de débogage** : Messages dans la console pour suivre l'exécution

### 2. Clipboard (Coller des Images) 📋
Améliorations de la fonction de collage :
- **Logs détaillés** : Affiche dans la console ce qui se passe
- **Gestion d'erreurs** : Meilleurs messages d'erreur
- **Support editor et preview** : Fonctionne dans les deux modes

## Comment Tester

### Étape 1 : Compiler l'extension
```bash
npm run compile
```

### Étape 2 : Recharger VS Code
1. Appuyez sur `F5` pour lancer l'extension en mode debug
   OU
2. Rechargez la fenêtre : `Ctrl+Shift+P` → "Developer: Reload Window"

### Étape 3 : Ouvrir la Console de Débogage
1. Ouvrez un fichier `.md` avec MDOffice
2. Ouvrez Developer Tools : `Help` → `Toggle Developer Tools`
3. Cliquez sur l'onglet `Console`

### Étape 4 : Tester le Bouton Image

#### Test A : Vérifier que le bouton existe
1. Regardez dans la console pour le message : `[MDOffice] btn-image element found, attaching event listener`
2. ✅ Si vous voyez ce message, l'élément existe
3. ❌ Si vous voyez "btn-image element not found", il y a un problème

#### Test B : Cliquer sur le bouton
1. Cliquez sur le bouton **🖼️ Image** dans la barre d'outils
2. Vous devriez voir :
   - Un dialogue moderne avec 4 options
   - Un fond semi-transparent
   - Messages dans la console : `[MDOffice] Image button clicked`

#### Test C : Tester "Browse File"
1. Cliquez sur "🖼️ Browse File"
2. La fenêtre de sélection de fichier devrait s'ouvrir
3. Sélectionnez une image
4. Choisissez le type de chemin (relatif recommandé)
5. Entrez un texte alternatif
6. L'image devrait être insérée dans le markdown

#### Test D : Tester "Enter URL"
1. Cliquez sur "🔗 Enter URL"
2. Entrez une URL d'image (ex: `https://via.placeholder.com/400x200`)
3. Entrez un texte alternatif
4. L'image devrait être insérée : `![alt text](url)`

#### Test E : Tester "Paste from Clipboard"
1. Copiez une image (screenshot ou image du web)
2. Cliquez dans l'éditeur
3. Collez avec `Ctrl+V` (ou `Cmd+V` sur Mac)
4. Regardez la console pour les messages :
   - `[MDOffice] Paste event in editor`
   - `[MDOffice] Clipboard items count: X`
   - `[MDOffice] Item 0 type: image/png` (ou autre type)
   - `[MDOffice] Image detected in clipboard!`
   - `[MDOffice] Image blob size: XXXX`
   - `[MDOffice] Image data loaded, length: XXXXX`
5. Une boîte de dialogue devrait demander le texte alternatif
6. L'image devrait être sauvegardée dans `images/pasted-image-[timestamp].png`
7. Le markdown devrait être inséré automatiquement

## Problèmes Possibles et Solutions

### Le bouton ne fait que "clignoter" sans ouvrir le dialogue

**Diagnostic** :
- Ouvrez la console et cliquez sur le bouton
- Cherchez les messages d'erreur en rouge

**Solutions possibles** :
1. **Si rien n'apparaît dans la console** :
   - Le fichier n'est pas compilé → Exécutez `npm run compile`
   - L'extension n'est pas rechargée → Rechargez VS Code

2. **Si vous voyez une erreur JavaScript** :
   - Notez l'erreur exacte
   - Vérifiez si le dialogue se crée correctement

### Le collage d'images ne fonctionne pas

**Diagnostic** :
1. Copiez une image
2. Collez dans l'éditeur avec `Ctrl+V`
3. Regardez la console

**Messages attendus** :
```
[MDOffice] Paste event in editor
[MDOffice] Clipboard items count: 1
[MDOffice] Item 0 type: image/png
[MDOffice] Image detected in clipboard!
[MDOffice] Image blob size: 12345
[MDOffice] Image data loaded, length: 16460
[MDOffice] Sending saveImageFromClipboard message
```

**Si aucun message n'apparaît** :
- L'image n'est pas dans le clipboard
- Essayez avec un screenshot (`Win+Shift+S` sur Windows)

**Si les messages apparaissent mais l'image n'est pas insérée** :
- Vérifiez que le handler `saveImageFromClipboard` fonctionne côté extension
- Regardez les logs de l'extension dans la console

### Le dialogue s'affiche mais rien ne se passe

**Pour "Browse File"** :
- Vérifiez que le message `selectImage` est envoyé : `[MDOffice] Posting selectImage message`
- Vérifiez que le handler existe dans `markdownEditorProvider.ts`

**Pour "Enter URL"** :
- Vérifiez que vous entrez une URL valide
- Vérifiez que la fonction `insertText()` fonctionne

## Exemples d'Images à Tester

### URLs d'images de test :
```
https://via.placeholder.com/400x200?text=Test+Image+1
https://via.placeholder.com/300x300/FF5733/FFFFFF?text=Colored
https://picsum.photos/400/300
```

### Test avec image locale :
1. Créez un dossier `test-images` dans le même répertoire que votre fichier `.md`
2. Copiez-y une image
3. Utilisez le bouton "Browse File" pour la sélectionner
4. Choisissez "Relative Path"
5. Vérifiez que le chemin est correct : `![alt](test-images/image.png)`

## Résultat Attendu

✅ **Tout fonctionne si** :
- Le bouton image ouvre un dialogue moderne avec 4 options
- "Browse File" ouvre la fenêtre de sélection de fichier
- "Enter URL" permet d'insérer une URL d'image
- Le collage d'images (Ctrl+V) sauvegarde et insère l'image automatiquement
- Tous les logs apparaissent correctement dans la console
- Les images s'affichent dans la prévisualisation

## Support

Si le problème persiste :
1. Copiez tous les messages de la console
2. Notez exactement ce qui se passe quand vous cliquez sur le bouton
3. Vérifiez que vous avez bien compilé et rechargé l'extension

