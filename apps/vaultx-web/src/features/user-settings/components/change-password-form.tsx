export function ChangePasswordForm() {
  return (
    <div className="border rounded-lg p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Change Password</h3>
          <p className="text-sm text-muted-foreground">
            Update your password to keep your account secure.
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded-md bg-background"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded-md bg-background"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm New Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded-md bg-background"
            />
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
