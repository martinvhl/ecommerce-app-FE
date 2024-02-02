import { FormControl, ValidationErrors } from "@angular/forms";

export class CustomFormValidators {

    //první custom validační static metoda, ve třídě jich může být X
    static notOnlyWhitespace(control:FormControl): ValidationErrors | null {
        if ((control.value != null) && (control.value.trim().length === 0)) {
            //validation error object vracímke když je zadná hdonta nenulová ale zase je po trimu délka 0 -> zadány jen whitespaces
            return { 'notOnlyWhiteSpace': true }; // validation error key - HTML template check for this
        } else {
            return null; // null = valid
        }
    }
}