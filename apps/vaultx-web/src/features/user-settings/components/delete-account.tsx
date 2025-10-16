/**
 * @file: delete-account.tsx
 * @author: Raul Daramus
 * @date: 2025
 * Copyright (C) 2025 VaultX by Raul Daramus
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
 * or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
 *
 * You are free to:
 *   - Share — copy and redistribute the material in any medium or format
 *   - Adapt — remix, transform, and build upon the material
 *
 * Under the following terms:
 *   - Attribution — You must give appropriate credit, provide a link to the license,
 *     and indicate if changes were made.
 *   - NonCommercial — You may not use the material for commercial purposes.
 *   - ShareAlike — If you remix, transform, or build upon the material, you must
 *     distribute your contributions under the same license as the original.
 */

export function DeleteAccount() {
  return (
    <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-md bg-destructive/10">
      <div>
        <h4 className="font-semibold text-destructive">Danger Zone</h4>
        <p className="text-sm text-muted-foreground">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
      </div>
      <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors font-semibold whitespace-nowrap">
        Delete account
      </button>
    </div>
  );
}
