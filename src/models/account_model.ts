export default class Account {
    type: string;
    accountNumber: string;
    password: string;
    owner: string;
    balance: number;
    status: string;

    constructor(type: string, accountNumber: string, password: string, owner: string, balance: number, status: string) {
        this.type = type;
        this.accountNumber = accountNumber;
        this.password = password;
        this.owner = owner;
        this.balance = balance;
        this.status = status;
    }

    deposit(amount: number) {
        if (amount <= 0)
            throw new Error('La cantidad a depositar debe ser mayor a 0');
        this.balance += amount;
    }

    retire(amount: number): boolean {
        if (amount <= 0)
            throw new Error('La cantidad a retirar debe ser mayor a 0');
        if (this.balance < amount)
            throw new Error('El monto a retirar es mayor al saldo de la cuenta');
        this.balance -= amount;
        return true;
    }

}