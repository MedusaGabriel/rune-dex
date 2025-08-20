// Script ESM para definir custom claim 'admin' para um usuário no Firebase
// Como usar:
// 1. Baixe a chave de serviço do Firebase e coloque em scripts/serviceAccountKey.json
// 2. Instale o firebase-admin: npm install firebase-admin
// 3. Execute: node scripts/setAdminClaim.mjs <UID_DO_USUARIO>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error('serviceAccountKey.json não encontrado em scripts/. Baixe do console do Firebase > Configurações do projeto > Contas de serviço.');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
initializeApp({
  credential: cert(serviceAccount)
});

const uid = process.argv[2];
if (!uid) {
  console.error('Informe o UID do usuário como argumento. Exemplo: node setAdminClaim.mjs qHv4mPeSesWB2BhaOitPxHGR6923');
  process.exit(1);
}

getAuth().setCustomUserClaims(uid, { role: 'admin' })
  .then(() => {
    console.log(`Custom claim 'admin' definido para o usuário ${uid}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Erro ao definir custom claim:', error);
    process.exit(1);
  });
