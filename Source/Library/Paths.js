
import { fromFileUrl , dirname , join } from './Imports.ts'


export const project =
    dirname(fromFileUrl(import.meta.url));

export const sharedLibrary =
    join(project,'Serial.so');
