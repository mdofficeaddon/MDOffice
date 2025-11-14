# 🧪 Test Rapide du Support des Images

## Étape 1: Compiler l'Extension

Ouvrez un terminal PowerShell dans le dossier du projet et exécutez:

```powershell
npm run compile
```

## Étape 2: Tester l'Extension

### Option A: Mode Développement (F5)

1. Ouvrez le projet dans VS Code/Cursor
2. Appuyez sur **F5** pour lancer le Extension Development Host
3. Dans la nouvelle fenêtre, ouvrez `TEST_IMAGES.md`
4. Clic droit → **"Open with MDOffice - Markdown Office Editor"**
5. Les 7 images devraient s'afficher

### Option B: Installer le VSIX

```powershell
# Créer le package
npm run package

# Installer dans VS Code/Cursor
# Extensions → ... → Install from VSIX → Sélectionner le fichier .vsix
```

## Étape 3: Vérifier les Images

Ouvrez **`TEST_IMAGES.md`** ou **`README.md`** avec MDOffice:

### ✅ Ce qui devrait fonctionner:

1. Images avec URL en ligne (https://)
2. Images avec chemin relatif (`screenshots/file.png`)
3. Images avec chemin relatif explicite (`./screenshots/file.png`)
4. Images avec espaces dans le nom
5. Images avec encodage URL (`%20` pour espace)
6. Images base64 (data:image/...)

### 🐛 Si les images ne s'affichent pas:

1. **Ouvrir la Console Développeur**
   - Menu: `Help` → `Toggle Developer Tools`
   - Onglet `Console`

2. **Chercher les logs:**
   ```
   [MDOffice] Image path resolution: {
     original: "screenshots/1 - Right Click...",
     cleaned: "screenshots/1 - Right Click...",
     documentDir: "vscode-webview://[guid]/path/to/project",
     resolved: "vscode-webview://[guid]/path/to/project/screenshots/1 - Right Click..."
   }
   ```

3. **Vérifier les erreurs:**
   - Images avec bordure rouge = échec de chargement
   - Erreurs dans la console = problème de CSP ou de chemin

## Étape 4: Tester les Nouvelles Fonctionnalités

### Test Drag & Drop

1. Ouvrez `TEST_IMAGES.md` avec MDOffice
2. Trouvez une image PNG/JPG dans l'explorateur Windows
3. Glissez-la dans l'éditeur MDOffice
4. Entrez un alt text
5. Vérifiez qu'un dossier `images/` est créé
6. Vérifiez que l'image s'affiche

### Test Clipboard Paste

1. Copiez une image (screenshot, image web, etc.)
2. Dans MDOffice, pressez `Ctrl+V`
3. Entrez un alt text
4. Vérifiez que `images/pasted-image-[timestamp].png` est créé
5. Vérifiez que l'image s'affiche

### Test Bouton Image

1. Cliquez sur le bouton **🖼️ Image** dans la toolbar
2. Entrez `1` pour Browse file
3. Sélectionnez une image
4. Choisissez "Relative Path"
5. Entrez un alt text
6. Vérifiez que l'image s'affiche

## Étape 5: Résolution des Problèmes Communs

### Problème: "documentDir is null"

**Cause:** Les settings ne sont pas passés correctement au webview.

**Solution:** Vérifiez que `src/markdownEditorProvider.ts` contient:
```typescript
documentUri: webview.asWebviewUri(document.uri).toString(),
documentDir: webview.asWebviewUri(vscode.Uri.joinPath(document.uri, '..')).toString()
```

### Problème: "Failed to load image"

**Cause:** Le chemin résolu est incorrect ou le webview n'a pas accès au dossier.

**Solution:** Vérifiez que `localResourceRoots` contient:
```typescript
localResourceRoots: [
    vscode.Uri.joinPath(this.context.extensionUri, 'assets'),
    vscode.Uri.joinPath(this.context.extensionUri, 'media'),
    vscode.Uri.joinPath(this.context.extensionUri, 'node_modules'),
    documentDir // Important!
]
```

### Problème: Images avec espaces ne fonctionnent pas

**Cause:** Les espaces ne sont pas correctement encodés/décodés.

**Solution:** Le code utilise maintenant `decodeURIComponent()` pour gérer les `%20`.

## Étape 6: Tests Avancés

### Test avec README.md

Le README contient 7 images dans le dossier `screenshots/`:

```bash
screenshots/
├── 1 - Right Click to Open with MDOffice - Markdown Office Editor.png
├── 2  - Split View.png
├── 3 - Editor View.png
├── 4 - Office View.png
├── 5 - Easy to navigate to settings.png
├── 6- Settings page preview.png
└── 7 - Open as Default deactivated by default.png
```

Toutes devraient s'afficher dans MDOffice quand vous ouvrez `README.md`.

## 📋 Checklist de Test

- [ ] Compilation réussie (`npm run compile`)
- [ ] Extension lancée (F5 ou VSIX installé)
- [ ] `TEST_IMAGES.md` ouvert avec MDOffice
- [ ] 7 images visibles sans bordure rouge
- [ ] Console sans erreurs
- [ ] `README.md` ouvert avec MDOffice
- [ ] 7 screenshots visibles
- [ ] Drag & drop d'image fonctionne
- [ ] Clipboard paste fonctionne
- [ ] Bouton Image → Browse file fonctionne
- [ ] Dossier `images/` créé automatiquement
- [ ] Chemins relatifs dans le markdown

## 🎉 Succès!

Si tous les tests passent, le support des images est maintenant **complètement fonctionnel** dans MDOffice! 

---

**Besoin d'aide?** 

- Consultez `IMAGE_SUPPORT_IMPROVEMENTS.md` pour la documentation complète
- Consultez les logs dans la console développeur
- Vérifiez les fichiers modifiés dans le commit

