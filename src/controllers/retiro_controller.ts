export default class RetiroController {

    denominaciones: number[] = [10000, 20000, 50000, 100000];

    retiro(valor: number): Map<string, number> {
        if (valor < this.denominaciones[0]) {
            throw new Error(`El valor a retirar debe ser mayor o igual a ${this.denominaciones[0]}`);
        }
        if (valor % 10000 !== 0) {
            throw new Error('El valor a retirar debe ser multiplo de 10000');
        }

        const billetes: { [key: string]: number } = { 10000: 0, 20000: 0, 50000: 0, 100000: 0 };

        let i = 0;
        while (valor > 0 && i < this.denominaciones.length) {
            for (let k = i; k < this.denominaciones.length; k++) {
                if (valor - this.denominaciones[k] >= 0) {
                    valor -= this.denominaciones[k];
                    billetes[this.denominaciones[k].toString()] += 1;
                }
            }
            i++;
            if (i === this.denominaciones.length && valor > 0) i = 0;
        }

        return new Map<string, number>(Object.entries(billetes));
    }

}