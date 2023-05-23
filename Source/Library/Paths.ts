
export { sharedLibrary , project }

import { Path } from './Imports.ts'


const { fromFileUrl , dirname , join } = Path


const project =
    dirname(fromFileUrl(import.meta.url))

const sharedLibrary =
    join(project,'Serial.so')
