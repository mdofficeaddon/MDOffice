# 🧪 Test d'Affichage des Images

Ce fichier teste l'affichage des images du dossier screenshots.

## Test 1: Image avec chemin relatif standard

![Screenshot 1](screenshots/1%20-%20Right%20Click%20to%20Open%20with%20MDOffice%20-%20Markdown%20Office%20Editor.png)

## Test 2: Image avec chemin relatif ./ explicite

![Screenshot 2](./screenshots/2%20%20-%20Split%20View.png)

## Test 3: Image avec espaces (sans encodage)

![Screenshot 3](screenshots/3 - Editor View.png)

## Test 4: Image URL en ligne

![Placeholder](https://via.placeholder.com/400x200/4A90E2/FFFFFF?text=Test+URL+Image)

## Test 5: Toutes les images screenshots

![Image 1](screenshots/1%20-%20Right%20Click%20to%20Open%20with%20MDOffice%20-%20Markdown%20Office%20Editor.png)

![Image 2](screenshots/2%20%20-%20Split%20View.png)

![Image 3](screenshots/3%20-%20Editor%20View.png)

![Image 4](screenshots/4%20-%20Office%20View.png)

![Image 5](screenshots/5%20-%20Easy%20to%20navigate%20to%20settings.png)

![Image 6](screenshots/6-%20Settings%20page%20preview.png)

![Image 7](screenshots/7%20-%20Open%20as%20Default%20deactivated%20by%20default.png)

## Test 6: Image Base64 (petit pixel rouge)

![Pixel rouge](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==)

---

## 📋 Instructions de Test

### ✅ Ce que vous devriez voir:

1. **7 grandes images** des screenshots MDOffice (Right Click, Split View, etc.)
2. **1 image en ligne** (placeholder bleu avec texte)
3. **1 petit carré rouge** (pixel en base64)

### ❌ Ce que vous NE devriez PAS voir:

- ❌ Texte comme "!Screenshot 1" ou "![Image](path)"
- ❌ Bordures rouges autour des images
- ❌ Icônes d'image cassée

### 🔍 Si les images ne s'affichent pas:

1. **Compilez le code:**
   ```powershell
   npm run compile
   ```

2. **Relancez l'extension** (F5 ou réinstallez le VSIX)

3. **Ouvrez la console développeur:**
   - Menu: Help → Toggle Developer Tools
   - Console tab
   - Cherchez: `[MDOffice] Image path resolution:`

4. **Vérifiez:**
   - `documentDir` doit être défini (pas null)
   - Les chemins `resolved` doivent commencer par `vscode-webview://`

---

## 🐛 Débogage

### Problème: Je vois "!Screenshot 1" au lieu de l'image

**Cause:** Le markdown n'est pas parsé, le regex des images ne matche pas.

**Solution:** ✅ **CORRIGÉ!** Les images sont maintenant traitées AVANT les liens.

### Problème: Image avec bordure rouge

**Cause:** L'image existe mais le chemin résolu est incorrect.

**Solution:** Vérifiez dans la console le chemin `resolved`.

### Problème: documentDir is null

**Cause:** Les settings ne sont pas passés au webview.

**Solution:** Vérifiez que `markdownEditorProvider.ts` passe `documentDir` dans settings.

---

## ✨ Résultat Attendu

Quand vous ouvrez ce fichier avec MDOffice, vous devriez voir:

1. ✅ Les 7 screenshots MDOffice s'affichent en grand
2. ✅ L'image placeholder bleue s'affiche
3. ✅ Le petit carré rouge s'affiche (1x1 pixel)
4. ✅ Aucun texte markdown brut visible
5. ✅ Aucune bordure rouge
6. ✅ Pas d'erreurs dans la console

**Si vous voyez tout ça, le support des images fonctionne parfaitement!** 🎉

---

**Prochaine étape:** Ouvrez `README.md` avec MDOffice - les 7 screenshots devraient aussi s'afficher!
