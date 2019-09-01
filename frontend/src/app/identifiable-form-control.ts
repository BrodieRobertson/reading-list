import { FormControl } from '@angular/forms';
export class IdentifiableFormControl extends FormControl{
    id: string

    constructor(text: string, id?: string) {
        super(text)
        if(id) {
            this.id = id
        }
    }

}
