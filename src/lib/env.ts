import { parseEnv } from './env.schema';

// Valide les variables d'environnement dès le premier import de ce module — échoue tôt plutôt
// que de laisser une variable manquante se manifester plus tard sous forme d'un bug obscur.
export const env = parseEnv(import.meta.env);
