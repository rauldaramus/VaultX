import { SecretsList } from "@/features/secrets/components/SecretsList"
import { SearchSecrets } from "@/features/secrets/components/SearchSecrets"

export default function SecretsPage() {
  return (
    <div className="space-y-8 animate-fade-in-up opacity-0">
      <div className="animate-fade-in-up opacity-0" style={{ animationDelay: "0.1s" }}>
        <h1 className="text-3xl font-bold transition-colors duration-300 hover:text-primary">My Secrets</h1>
        <p className="text-gray-400 transition-colors duration-200 hover:text-gray-300">
          Manage your secrets and view their current status.
        </p>
      </div>
      <div className="animate-fade-in-up opacity-0" style={{ animationDelay: "0.2s" }}>
        <SearchSecrets />
      </div>
      <div className="animate-fade-in-up opacity-0" style={{ animationDelay: "0.3s" }}>
        <SecretsList />
      </div>
    </div>
  )
}
