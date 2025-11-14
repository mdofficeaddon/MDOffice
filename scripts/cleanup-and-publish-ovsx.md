# Cleanup and Publish to Open VSX

This guide helps you clean up old namespaces and publish with the new `MDOffice` namespace.

## Quick Start

### Option 1: Use the Batch Script (Windows)

```cmd
.\scripts\cleanup-and-publish-ovsx.bat
```

### Option 2: Manual Commands

```cmd
# 1. Set your token
set OVSX_PAT=your_open_vsx_token

# 2. Create MDOffice namespace
ovsx create-namespace MDOffice

# 3. Publish the extension
ovsx publish dist\md-office-editor-0.2.2.vsix
```

## Removing Old Extensions

The `ovsx` CLI does **not** support deleting extensions or namespaces. You must use the web interface:

### Via Web Interface:

1. **Sign in to Open VSX:**
   - Go to [https://open-vsx.org/](https://open-vsx.org/)
   - Sign in with your account

2. **Check for old extensions:**
   - Old GUID: https://open-vsx.org/extension/06401f15-a30d-6a97-82a3-8ca0e379c4eb/md-office-editor
   - Old name: https://open-vsx.org/extension/mdofficeaddon/md-office-editor

3. **Delete if they exist:**
   - Navigate to the extension page
   - Click on your profile/extension settings
   - Look for "Delete Extension" or "Unpublish" option
   - Confirm deletion

### Via API (Advanced):

If you have API access, you can use:

```bash
# Get extension details
curl -X GET "https://open-vsx.org/api/mdofficeaddon/md-office-editor"

# Delete extension (requires admin token)
curl -X DELETE "https://open-vsx.org/api/mdofficeaddon/md-office-editor" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Troubleshooting

### "Namespace already exists"
- This is fine! The namespace was created in a previous attempt.
- Just proceed to publish.

### "Extension already exists"
- You need to increment the version number in `package.json`
- Rebuild: `npm run package`
- Publish again

### "No permission to delete"
- Contact Open VSX support: https://github.com/eclipse/openvsx/issues
- Provide your username and the extension ID to remove

### "Invalid token"
- Regenerate your token at https://open-vsx.org/
- Make sure it has the correct permissions
- Set it again: `set OVSX_PAT=new_token`

## Contact Support

If you need help removing extensions or namespaces:

- **Open VSX Issues:** https://github.com/eclipse/openvsx/issues
- **Documentation:** https://github.com/eclipse/openvsx/wiki

Provide:
- Your username
- Extension IDs to remove:
  - `06401f15-a30d-6a97-82a3-8ca0e379c4eb.md-office-editor`
  - `mdofficeaddon.md-office-editor`
- Reason: Consolidating to `MDOffice.md-office-editor`





