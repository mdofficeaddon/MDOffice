# Test d'amélioration du support des images MDOffice

Ce document teste les nouvelles fonctionnalités d'insertion d'images dans MDOffice.

## 🎯 Objectif du test

Tester les 4 méthodes d'insertion d'images:

1. ✅ **URL en ligne** - Entrer une URL manuellement

1. ✅ **Sélection de fichier** - Parcourir les fichiers locaux

1. ✅ **Glisser-déposer** - Faire glisser une image dans l'éditeur

1. ✅ **Coller du presse-papiers** - Ctrl+V pour coller une image

---

## Test 1: Images avec URL en ligne

Ces images utilisent des URLs publiques et devraient s'afficher correctement:

These types of links do not work

### Logo placeholder

![Logo MDOffice](https://via.placeholder.com/400x200/4A90E2/FFFFFF?text=MDOffice+Logo)
### Icône

![Icône](https://via.placeholder.com/100x100/E74C3C/FFFFFF?text=Icon)
---

## Test 2: Images en Base64

Les images encodées en base64 devraient s'afficher directement sans fichier externe:

### Petit carré rouge (1x1 pixel en base64)

![Pixel rouge](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==)
### SVG en base64

![SVG Circle](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iIzRBOTBFMiIvPjwvc3ZnPg==)
---

## Test 3: Images locales relatives

⚠️ **Note**: Ces chemins nécessitent que le webview convertisse correctement les chemins relatifs.

### Image dans le même dossier

![Image locale](https://file%2B.vscode-resource.vscode-cdn.net/c%3A/Users/yanca/OneDrive/Coding%20projects/mdFileEditorExtension/tests/images/sample.png)
### Image dans le dossier parent

![Image parent](https://file%2B.vscode-resource.vscode-cdn.net/c%3A/Users/yanca/OneDrive/Coding%20projects/mdFileEditorExtension/tests/images/../screenshots/1 - Right Click to Open with MDOffice - Markdown Office Editor.png)
---

## Test 4: Images dans différents contextes

### Dans une liste

1. Premier élément

   ![Image liste 1](https://via.placeholder.com/150x100/27AE60/FFFFFF?text=Item+1)

1. Deuxième élément

   ![Image liste 2](https://via.placeholder.com/150x100/8E44AD/FFFFFF?text=Item+2)

1. Troisième élément

   ![Image liste 3](https://via.placeholder.com/150x100/F39C12/FFFFFF?text=Item+3)

### Dans une citation

> Voici une citation avec une image:
> ![Citation](https://via.placeholder.com/300x150/34495E/FFFFFF?text=Quote+Image)
> — Citation avec image

### Dans un tableau

| Fonctionnalité | Aperçu |
| --- | --- |
| Drag & Drop | ![D&D](https://via.placeholder.com/80x60/E74C3C/FFFFFF?text=D%26D) |
| Clipboard | ![Clipboard](https://via.placeholder.com/80x60/3498DB/FFFFFF?text=Clip) |
| File Browse | ![Browse](https://via.placeholder.com/80x60/2ECC71/FFFFFF?text=Browse) |

### Images inline

Texte avant ![petite image](https://via.placeholder.com/30x30/95A5A6/FFFFFF?text=:)) texte après.

---

## 📋 Instructions de test

### Test manuel à effectuer:

#### 1. Test du bouton Image (🖼️)

- [ ] Cliquer sur le bouton Image dans la barre d'outils

- [ ] Option 1: Sélectionner "Browse file"

- [ ] Option 2: Sélectionner "Enter URL" et entrer: `https://via.placeholder.com/300x200?text=Test+URL`

- [ ] Vérifier que l'image s'affiche dans le preview

#### 2. Test Drag & Drop

- [ ] Ouvrir l'explorateur de fichiers Windows

- [ ] Trouver une image (PNG, JPG, etc.)

- [ ] Faire glisser l'image dans l'éditeur MDOffice

- [ ] Entrer un alt text quand demandé

- [ ] Vérifier que l'image est sauvegardée dans le dossier `images/`

- [ ] Vérifier que le markdown contient le bon chemin relatif

#### 3. Test Clipboard (Coller)

- [ ] Copier une image (clic droit > copier sur une image, ou Ctrl+C sur une image)

- [ ] Dans MDOffice, placer le curseur où insérer l'image

- [ ] Appuyer sur Ctrl+V (ou Cmd+V sur Mac)

- [ ] Entrer un alt text quand demandé

- [ ] Vérifier que l'image est sauvegardée dans `images/pasted-image-[timestamp].png`

- [ ] Vérifier que l'image s'affiche correctement

#### 4. Test des trois types de chemins

- [ ] **Chemin relatif**: Vérifier que `./images/sample.png` fonctionne

- [ ] **Chemin absolu**: Tester avec un chemin complet Windows

- [ ] **Base64**: Vérifier que les images en base64 s'affichent

#### 5. Test des URLs

- [ ] **HTTP**: Tester une URL http://

- [ ] **HTTPS**: Tester une URL https://

- [ ] **Data URI**: Tester data:image/png;base64,...

---

## ✅ Critères de réussite

Pour que le support des images soit considéré comme fonctionnel:

1. ✅ Les images avec URL en ligne s'affichent

1. ✅ Les images en base64 s'affichent

1. ⚠️ Les images locales relatives s'affichent (nécessite fix du webview)

1. ✅ Le bouton Image offre 3 options (Browse/URL/Clipboard)

1. ✅ Drag & Drop fonctionne et sauvegarde dans images/

1. ✅ Clipboard paste fonctionne et sauvegarde dans images/

1. ✅ Les images apparaissent dans les listes, citations, et tableaux

1. ✅ Le CSP autorise img-src correctement

---

## 🐛 Problèmes connus

### Chemins relatifs dans le webview

**Problème**: Les chemins relatifs comme `./images/sample.png` ne se résolvent pas correctement dans le webview VS Code.
**Solution potentielle**: 
- Convertir les chemins relatifs en `vscode-resource:` URIs

- Ou utiliser `webview.asWebviewUri()` pour convertir les chemins locaux

**Code à modifier**: `src/webviewContent.ts` ligne ~1351

```

typescript
// Actuel (ne fonctionne pas pour chemins relatifs):
html = html.replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1">');
`// Amélioration nécessaire:
// Détecter si c'est un chemin local relatif et le convertir en URI webview
`

```

---

## 📝 Notes de développement

### CSP mis à jour

Le Content Security Policy a été modifié pour supporter les images:

```

img-src ${webview.cspSource} data: https: http: file:;

```

Cela autorise:

- ✅ Ressources locales via webview

- ✅ Data URIs (base64)

- ✅ HTTPS

- ✅ HTTP

- ✅ Protocole file:

### Nouveaux handlers ajoutés

1. **Message handler `selectImage`**: Ouvre le file picker natif

1. **Message handler `saveImageFromClipboard`**: Sauvegarde l'image collée

1. **Event handler `paste`**: Détecte les images dans le presse-papiers

1. **Event handler `drop`**: Gère le drag & drop d'images

### Structure des dossiers

Quand une image est collée ou droppée, elle est automatiquement sauvegardée:

```

document-folder/
├── document.md
└── images/
    ├── pasted-image-1234567890.png
    └── dropped-image-1234567891.png

```

---

**Date du test**: $(date)  
**Version MDOffice**: 0.2.6 (avec support images amélioré)