# 📚 Documentation MDOffice - Index

## 🎯 Navigation Rapide

### Pour Utilisateurs

| Document | Description | Lien |
|----------|-------------|------|
| **Guide Utilisateur** | Guide complet de toutes les fonctionnalités | [USER_GUIDE.md](./USER_GUIDE.md) |
| **Support des Images** | Comment insérer et gérer des images | [IMAGE_SUPPORT.md](./IMAGE_SUPPORT.md) |
| **Édition Preview** | Guide WYSIWYG et édition dans la preview | [PREVIEW_EDITING_GUIDE.md](./PREVIEW_EDITING_GUIDE.md) |

### Pour Développeurs

| Document | Description | Lien |
|----------|-------------|------|
| **Guide de Test Images** | Comment tester le support des images | [TESTING_IMAGES.md](./TESTING_IMAGES.md) |
| **Guide Publication** | Comment publier l'extension | [PUBLISHING.md](./PUBLISHING.md) |

### Général

| Document | Description | Lien |
|----------|-------------|------|
| **README** | Vue d'ensemble du projet | [../README.md](../README.md) |
| **CHANGELOG** | Historique des versions | [../CHANGELOG.md](../CHANGELOG.md) |
| **CONTRIBUTING** | Guide de contribution | [../CONTRIBUTING.md](../CONTRIBUTING.md) |

---

## 🖼️ Support des Images (v0.2.7)

### Nouveau!

MDOffice supporte maintenant **4 méthodes** d'insertion d'images:

1. **🖼️ File Browser** - Parcourir les fichiers
2. **🎯 Drag & Drop** - Glisser-déposer
3. **📋 Clipboard** - Coller (Ctrl+V)
4. **🌐 URL** - Images en ligne

→ **[Guide Complet](./IMAGE_SUPPORT.md)**

---

## 📖 Guides par Fonctionnalité

### Interface et Éditeur
- Barre d'outils et raccourcis clavier
- Modes de vue (Editor / Preview / Split)
- Mode focus
- → [USER_GUIDE.md](./USER_GUIDE.md)

### Édition WYSIWYG
- Éditer directement dans la preview
- Tous les boutons fonctionnent
- Synchronisation bidirectionnelle
- → [PREVIEW_EDITING_GUIDE.md](./PREVIEW_EDITING_GUIDE.md)

### Images
- 4 méthodes d'insertion
- Chemins relatifs/absolus/base64
- Organisation automatique
- → [IMAGE_SUPPORT.md](./IMAGE_SUPPORT.md)

### Export
- Export HTML
- Export PDF
- Configuration papier et marges
- → [USER_GUIDE.md](./USER_GUIDE.md#export)

### Personnalisation
- Thèmes (Light/Dark)
- Polices et tailles
- Marges et espacements
- CSS personnalisé
- → [USER_GUIDE.md](./USER_GUIDE.md#configuration)

---

## 🧪 Tests et Validation

### Tests Images
```bash
# Test rapide
tests/TEST_IMAGES_ROOT.md

# Tests complets
tests/images/test-image-support.md
```

### Autres Tests
```bash
tests/
├── blockquotes/     # Tests blockquotes
├── checklists/      # Tests checklists
├── formatting/      # Tests formatage
├── lists/           # Tests listes
├── tables/          # Tests tableaux
└── math/            # Tests mathématiques
```

→ **[Guide de Test](./TESTING_IMAGES.md)**

---

## 🔧 Développement

### Pour Démarrer
```bash
npm install
npm run compile
# F5 pour lancer en mode développement
```

### Structure du Code
```
src/
├── extension.ts                # Point d'entrée
├── markdownEditorProvider.ts  # Provider principal
├── webviewContent.ts           # Contenu webview
├── exportService.ts            # Export HTML/PDF
└── util.ts                     # Utilitaires
```

### Documentation Interne
Voir [`docs-internal/`](../docs-internal/) pour:
- Analyses de bugs
- Détails d'implémentation
- Changelogs détaillés
- Notes de développement

---

## 📝 Changelog

### v0.2.7 (2024-11-14) - Actuelle
- ✨ Support images amélioré (4 méthodes)
- ✨ Navigation liens intelligente
- 🐛 Correction ordre parsing markdown
- 🐛 Chemins relatifs images résolus

### v0.2.6 (2024-11-14)
- 🐛 Correction boutons toolbar
- 🐛 Correction boutons export
- ⚡ Amélioration export HTML/PDF

### v0.2.5 (2024-11-12)
- ✨ Support Tab/Shift+Tab
- ✨ Édition preview en split view
- ⚡ Amélioration listes imbriquées

→ **[CHANGELOG Complet](../CHANGELOG.md)**

---

## 🆘 Support

### Problèmes Courants

#### Images ne s'affichent pas
→ [IMAGE_SUPPORT.md - Dépannage](./IMAGE_SUPPORT.md#-dépannage)

#### Export ne fonctionne pas
→ [USER_GUIDE.md - Export](./USER_GUIDE.md#export)

#### Édition preview ne fonctionne pas
→ [PREVIEW_EDITING_GUIDE.md](./PREVIEW_EDITING_GUIDE.md)

### Obtenir de l'Aide
- 📖 Consultez les guides ci-dessus
- 🐛 [Ouvrir une issue](https://github.com/mdofficeaddon/MDOffice/issues)
- 💬 Décrivez le problème avec captures d'écran

---

## 🎓 Tutoriels Rapides

### Insérer une Image (3 façons)

**Méthode 1: Drag & Drop**
1. Trouvez une image dans l'explorateur
2. Glissez-la dans MDOffice
3. Entrez un alt text
4. ✅ Fait!

**Méthode 2: Clipboard**
1. Copiez une image (screenshot, web, etc.)
2. Ctrl+V dans MDOffice
3. Entrez un alt text
4. ✅ Fait!

**Méthode 3: File Browser**
1. Cliquez sur 🖼️ Image
2. Choisissez "1 - Browse file"
3. Sélectionnez l'image
4. Choisissez le type de chemin
5. ✅ Fait!

→ [Guide Complet Images](./IMAGE_SUPPORT.md)

### Export en PDF

1. Cliquez sur 📑 Export PDF
2. Choisissez le nom du fichier
3. ✅ PDF créé!

→ [Guide Export](./USER_GUIDE.md#export)

### Mode Focus

1. Appuyez sur F11 (ou cliquez 🎯 Focus)
2. Éditez sans distraction
3. Esc pour sortir

→ [Guide Mode Focus](./USER_GUIDE.md#focus-mode)

---

## 🔗 Liens Externes

- [GitHub Repository](https://github.com/mdofficeaddon/MDOffice)
- [VS Code Marketplace](https://marketplace.visualstudio.com/)
- [Issues & Support](https://github.com/mdofficeaddon/MDOffice/issues)

---

## 📅 Dernière Mise à Jour

**Date:** 14 novembre 2024  
**Version:** 0.2.7  
**Statut:** ✅ À jour

---

**🎉 Bienvenue dans MDOffice!**

Pour commencer, consultez le [Guide Utilisateur](./USER_GUIDE.md) ou explorez les guides spécifiques ci-dessus.

