export function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Settings</h1>
      <p className="text-slate-400 mb-8">Manage your account and preferences</p>
      <div className="card space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium mb-1.5">API Configuration</label>
          <p className="text-sm text-slate-400">
            OpenAI API key is configured server-side via environment variables.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Theme</label>
          <p className="text-sm text-slate-400">Dark mode (default)</p>
        </div>
      </div>
    </div>
  );
}
