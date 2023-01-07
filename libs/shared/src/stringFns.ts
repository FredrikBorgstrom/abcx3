
export class StringFns {

    static decapitalizeFileName (name: string, fileType: string) {
        return this.decapitalize(name) + '.' + fileType;
    }

    static decapitalize(str: string): string {
        return this.transformFirstCharCase(str, 'toLowerCase');
    }

    static capitalize (str: string): string | null {
        return this.transformFirstCharCase(str, 'toUpperCase');
    }

    static transformFirstCharCase(str: string, fnName: 'toUpperCase' | 'toLowerCase'): string {
        if (str == null || str.length === 0) {
            return '';
        } else {
            const firstChar = (fnName === 'toLowerCase') ? str[0].toLowerCase() : str[0].toUpperCase();
            return firstChar + str.substring(1);
        }
    }

}