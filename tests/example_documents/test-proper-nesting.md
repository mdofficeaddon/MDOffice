# Test de Listes Imbriquées Correctes

## Listes avec Indentation Standard

### Exemple 1: Liste à puces simple

- Level 1 - First item
  - Level 2 - Nested bullet
    - Level 3 - Even deeper
      - Level 4 - Very deep
        - Level 5 - Maximum nesting
          - Level 6 - Still going

### Exemple 2: Liste numérotée

1. Level 1 - First item
  1. Level 2 - Nested number
    1. Level 3 - Deeper
      1. Level 4 - Even deeper

### Exemple 3: Liste mixte

1. Level 1 - First item
  - Level 2 - Bullet under numbered
    - Level 3 - More bullets
      1. Level 4 - Back to numbers
        - Level 5 - And bullets again

### Exemple 4: Task lists imbriquées

- [ ] Level 1 - First task
  - [ ] Level 2 - Nested task
    - [x] Level 3 - Completed nested
      - [ ] Level 4 - Very nested task
      - [ ]

### Exemple 5: Retour aux niveaux supérieurs

1. Level 1 - First
  - Level 2 - Nested
    - Level 3 - Deep
2. Level 2 - Back to level 2

1. Level 1 - Back to level 1

## Test avec le format du fichier d'origine (invalide mais à supporter)

### Format non-standard (numéros répétés)

1. Level 1 - First item

1. - Level 2 - Should be under item 2?

- - Level 3 - Nested bullet

- - Level 4 - Even deeper

