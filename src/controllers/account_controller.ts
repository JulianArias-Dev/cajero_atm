import Account from "../models/account_model";

export default class AccountController {
    accounts: Account[];

    constructor() {
        this.accounts = [];
    }

    async loadAccounts() {
        const response = await fetch('/db.json');
        if (!response.ok) {
            throw new Error('Error al cargar los datos');
        }
        this.accounts = await response.json();

    }

    async getAccounts() {
        if (this.accounts.length === 0) {
            await this.loadAccounts();
        }
        return this.accounts;
    }

    async getAccount(account: string, type: string): Promise<Account> {
        if (this.accounts.length === 0) {
            await this.loadAccounts();
        }

        if (this.accounts.length === 0) {
            throw new Error('No hay cuentas disponibles para buscar.');
        }

        const element = this.accounts.find(acc => (acc.accountNumber === account && acc.type === type));
        
        if (element)
            return element;

        throw new Error(`La cuenta: ${account} no existe o no es de tipo: ${type}`);
    }

    async validatePassword(account: string, password: string): Promise<boolean> {
        const find_account = await this.getAccount(account, "bancolombia");

        if (find_account.password === password)
            return true;

        throw new Error('La clave ingresada es incorrecta')

    }

}
