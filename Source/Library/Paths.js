
import { Path } from './Imports.ts'

const { fromFileUrl , dirname , join } = Path


export const project =
    dirname(fromFileUrl(import.meta.url));

export const sharedLibrary =
    join(project,'Serial.so');
