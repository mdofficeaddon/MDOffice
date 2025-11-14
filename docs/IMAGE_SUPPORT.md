# 🖼️ Amélioration du Support des Images dans MDOffice

## 📋 Résumé des Améliorations

MDOffice supporte maintenant **4 méthodes d'insertion d'images** avec une gestion complète des chemins locaux et distants.

---

## ✨ Nouvelles Fonctionnalités

### 1. 📂 Sélection de Fichier (File Browser)

**Comment utiliser:**
1. Cliquez sur le bouton **🖼️ Image** dans la barre d'outils
2. Sélectionnez l'option **"1 - Browse file"**
3. Choisissez une image dans le file picker natif
4. Sélectionnez le type d'insertion:
   - **Relative Path** (recommandé) - Chemin relatif au document
   - **Absolute Path** - Chemin absolu Windows/Mac/Linux
   - **Embed as Base64** - Image encodée directement dans le markdown
5. Entrez un alt text descriptif

**Formats supportés:** PNG, JPG, JPEG, GIF, SVG, BMP, WEBP

### 2. 🌐 URL en Ligne

**Comment utiliser:**
1. Cliquez sur le bouton **🖼️ Image**
2. Sélectionnez l'option **"2 - Enter URL"**
3. Entrez l'URL de l'image (http:// ou https://)
4. Entrez un alt text

**Exemple:**
```markdown
![Logo](https://via.placeholder.com/400x200?text=Logo)
```

### 3. 🎯 Glisser-Déposer (Drag & Drop)

**Comment utiliser:**
1. Trouvez une image dans votre explorateur de fichiers
2. Faites-la glisser dans l'éditeur MDOffice (zone editor ou preview)
3. Relâchez la souris
4. Entrez un alt text quand demandé
5. L'image est automatiquement sauvegardée dans `images/`

**Résultat:**
- L'image est copiée dans `document-folder/images/`
- Le markdown contient le chemin relatif: `![Alt](./images/image-name.png)`

### 4. 📋 Coller depuis le Presse-Papiers

**Comment utiliser:**
1. Copiez une image (Ctrl+C / Cmd+C ou clic droit > Copier l'image)
2. Dans MDOffice, placez le curseur à l'endroit désiré
3. Collez avec **Ctrl+V** (Windows/Linux) ou **Cmd+V** (Mac)
4. Entrez un alt text quand demandé
5. L'image est automatiquement sauvegardée avec timestamp

**Résultat:**
- L'image est sauvegardée comme `images/pasted-image-[timestamp].png`
- Le markdown contient: `![Alt](./images/pasted-image-1234567890.png)`

---

## 🔧 Corrections Techniques

### Résolution des Chemins Relatifs

**Problème résolu:** Les chemins relatifs comme `./images/photo.png` ne s'affichaient pas dans le preview.

**Solution implémentée:**

1. **`localResourceRoots` étendu** - Le webview peut maintenant accéder au dossier du document:
```typescript
localResourceRoots: [
    vscode.Uri.joinPath(this.context.extensionUri, 'assets'),
    vscode.Uri.joinPath(this.context.extensionUri, 'media'),
    vscode.Uri.joinPath(this.context.extensionUri, 'node_modules'),
    documentDir // ✅ Nouveau: accès aux images locales
]
```

2. **Conversion automatique des URIs** - Les chemins relatifs sont convertis en URIs webview valides:
```typescript
// Avant: ./images/photo.png
// Après: vscode-webview://[guid]/path/to/document/images/photo.png
```

3. **Content Security Policy (CSP) mis à jour:**
```
img-src ${webview.cspSource} data: https: http: file:;
```

Autorise maintenant:
- ✅ Ressources locales via webview
- ✅ Data URIs (base64)
- ✅ HTTPS/HTTP
- ✅ Protocole file:

### Gestion des Différents Types de Chemins

Le système détecte et gère automatiquement:

| Type de Chemin | Exemple | Traitement |
|----------------|---------|------------|
| URL HTTPS | `https://example.com/img.png` | Direct, aucune conversion |
| URL HTTP | `http://example.com/img.png` | Direct, aucune conversion |
| Data URI | `data:image/png;base64,iVBO...` | Direct, aucune conversion |
| Chemin relatif | `./images/photo.png` | Converti en URI webview |
| Chemin relatif parent | `../images/logo.svg` | Converti en URI webview |
| Chemin sans ./ | `images/icon.png` | Converti en URI webview |

---

## 📁 Structure des Fichiers

Quand vous insérez une image via drag-and-drop ou clipboard, elle est organisée automatiquement:

```
mon-document/
├── document.md
└── images/
    ├── pasted-image-1699876543210.png
    ├── dropped-image-1699876544315.png
    └── photo.jpg
```

**Avantages:**
- ✅ Organisation claire et prévisible
- ✅ Chemins relatifs courts: `![Photo](./images/photo.jpg)`
- ✅ Facile à partager (tout dans un dossier)
- ✅ Pas de duplication d'images

---

## 🧪 Tests

### Fichier de Test Complet

Utilisez le fichier `tests/images/test-image-support.md` qui teste:

1. ✅ Images avec URL en ligne
2. ✅ Images encodées en base64
3. ✅ Images locales avec chemins relatifs
4. ✅ Images dans listes, citations, tableaux
5. ✅ Images inline dans paragraphes
6. ✅ URLs avec paramètres
7. ✅ Alt text avec caractères spéciaux

### Test Manuel Rapide

1. **Test URL:**
   ```markdown
   ![Test](https://via.placeholder.com/300x200?text=Test)
   ```

2. **Test Base64:**
   ```markdown
   ![Pixel](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==)
   ```

3. **Test Drag & Drop:**
   - Glissez une image PNG dans l'éditeur
   - Vérifiez que `images/` est créé
   - Vérifiez que l'image s'affiche

4. **Test Clipboard:**
   - Copiez une image depuis un navigateur
   - Ctrl+V dans MDOffice
   - Vérifiez la sauvegarde et l'affichage

---

## 🎯 Compatibilité

### Systèmes d'exploitation
- ✅ Windows 10/11
- ✅ macOS
- ✅ Linux

### Éditeurs
- ✅ VS Code 1.75+
- ✅ Cursor

### Formats d'images
- ✅ PNG
- ✅ JPG / JPEG
- ✅ GIF
- ✅ SVG
- ✅ BMP
- ✅ WEBP

---

## 💡 Meilleures Pratiques

### 1. Utilisez des Chemins Relatifs
```markdown
✅ Recommandé: ![Photo](./images/photo.jpg)
⚠️ Éviter: ![Photo](C:\Users\...\photo.jpg)
```

**Pourquoi?** Les chemins relatifs fonctionnent sur tous les systèmes et quand vous partagez le dossier.

### 2. Organisez vos Images
```
project/
├── README.md
├── docs/
│   ├── guide.md
│   └── images/      # Images pour guide.md
└── images/          # Images pour README.md
```

### 3. Nommez vos Images de Façon Descriptive
```markdown
✅ Bon: ![Architecture diagram](./images/architecture-diagram.png)
❌ Mauvais: ![](./images/img1.png)
```

### 4. Utilisez des Alt Texts Significatifs
```markdown
✅ Bon: ![User dashboard showing statistics and charts](./images/dashboard.png)
❌ Mauvais: ![Image](./images/dashboard.png)
```

### 5. Base64: Seulement pour Petites Images
```markdown
✅ Bon pour: Icônes, pixels de tracking, petits logos (<10KB)
❌ Éviter pour: Photos, screenshots, grandes images (>50KB)
```

**Pourquoi?** Les images base64 augmentent la taille du fichier markdown et ralentissent l'édition.

---

## 🔍 Dépannage

### Les images ne s'affichent pas

**Vérifiez:**
1. ✅ Le chemin est-il correct?
2. ✅ L'image existe-t-elle dans le dossier?
3. ✅ Les permissions de lecture sont-elles correctes?
4. ✅ Le format est-il supporté?

**Solution:** Utilisez le bouton Image > Browse file pour réinsérer l'image.

### Les images collées ne fonctionnent pas

**Vérifiez:**
1. ✅ Avez-vous bien copié une IMAGE (pas juste le chemin)?
2. ✅ Le dossier du document est-il accessible en écriture?
3. ✅ Y a-t-il de l'espace disque disponible?

**Solution:** Essayez le drag-and-drop comme alternative.

### Les chemins absolus Windows ne fonctionnent pas

**Problème:** `C:\Users\...\image.png` ne s'affiche pas.

**Solution:** Utilisez plutôt:
1. Chemin relatif: `./images/image.png`
2. Ou réinstallez avec "Browse file" > "Relative Path"

---

## 📚 Exemples d'Utilisation

### Galerie d'Images

```markdown
## Nos Produits

![Produit A](./images/product-a.jpg)
![Produit B](./images/product-b.jpg)
![Produit C](./images/product-c.jpg)
```

### Documentation avec Screenshots

```markdown
## Installation

1. Téléchargez l'installeur
   
   ![Download page](./screenshots/download.png)

2. Lancez l'installation
   
   ![Setup wizard](./screenshots/setup.png)

3. Configurez les options
   
   ![Configuration](./screenshots/config.png)
```

### Image avec Lien

```markdown
[![Cliquez pour agrandir](./images/thumbnail.jpg)](./images/fullsize.jpg)
```

### Images dans Tableaux

```markdown
| Fonctionnalité | Screenshot |
|----------------|-----------|
| Dashboard | ![Dashboard](./images/dashboard.png) |
| Settings | ![Settings](./images/settings.png) |
| Reports | ![Reports](./images/reports.png) |
```

---

## 🚀 Prochaines Améliorations Possibles

- [ ] Redimensionnement d'images dans l'éditeur
- [ ] Optimisation automatique (compression)
- [ ] Support de Markdown Extended pour spécifier la taille: `![Alt](img.png){width=300}`
- [ ] Galerie d'images avec lightbox
- [ ] Import en masse d'images
- [ ] Conversion automatique WebP
- [ ] Annotation d'images

---

## 📝 Notes de Version

### Version 0.2.6 - Support Images Amélioré

**Ajouté:**
- ✅ File browser pour sélection d'images
- ✅ Support drag-and-drop
- ✅ Support clipboard paste
- ✅ Conversion automatique Base64
- ✅ Résolution des chemins relatifs
- ✅ Sauvegarde automatique dans images/
- ✅ CSP mis à jour pour images

**Corrigé:**
- ✅ Chemins relatifs ne s'affichaient pas dans preview
- ✅ localResourceRoots n'incluait pas le dossier du document
- ✅ Images dans listes/tableaux/citations

**Amélioré:**
- ✅ Interface du bouton Image avec 3 options
- ✅ Gestion de tous les types de chemins
- ✅ Messages d'erreur plus clairs

---

## 🤝 Contribution

Des questions ou suggestions sur le support des images?

- 🐛 [Signaler un bug](https://github.com/mdofficeaddon/MDOffice/issues)
- 💡 [Suggérer une amélioration](https://github.com/mdofficeaddon/MDOffice/issues)
- ⭐ [Star le projet](https://github.com/mdofficeaddon/MDOffice)

---

**Créé avec ❤️ pour MDOffice**  
*Votre éditeur markdown de style Office*

