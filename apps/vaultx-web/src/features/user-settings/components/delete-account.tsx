export function DeleteAccount() {
  return (
    <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-md bg-destructive/10">
      <div>
        <h4 className="font-semibold text-destructive">Danger Zone</h4>
        <p className="text-sm text-muted-foreground">
          Once you delete your account, there is no going back. Please be certain.
        </p>
      </div>
      <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors font-semibold whitespace-nowrap">
        Delete account
      </button>
    </div>
  )
}
