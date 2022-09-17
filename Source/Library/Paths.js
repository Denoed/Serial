
import { fromFileUrl , dirname , join }
from 'https://deno.land/std@0.156.0/path/mod.ts'


export const project =
    dirname(fromFileUrl(import.meta.url));

export const sharedLibrary =
    join(project,'Serial.so');
