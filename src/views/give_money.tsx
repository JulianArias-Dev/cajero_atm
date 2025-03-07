import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import RetiroController from '../controllers/retiro_controller';
import AccountController from '../controllers/account_controller';
import { useNavigate } from 'react-router-dom';
import Account from '../models/account_model';
import './transaction.css';
import Swal from 'sweetalert2';

const GiveMoney = () => {
    const controller = useMemo(() => new RetiroController(), []);
    const accountController = useRef(new AccountController()); // 👈 Evita recreación
    const navigate = useNavigate();

    const [account, setAccount] = useState<Account | null>(null);
    const [amount, setAmount] = useState<number | null>(null);
    const [myMap, setMyMap] = useState<Map<string, number>>(new Map());

    const billetes = {
        "10000": 'src/assets/billete10k.jpg',
        "20000": 'src/assets/billete20k.jpg',
        "50000": 'src/assets/billete50k.jpg',
        "100000": 'src/assets/billete100k.jpg',
    };

    const retirar = useCallback((amount: number) => {
        if (amount > 0) {
            const result = controller.retiro(amount);
            if (result instanceof Map) {
                setMyMap(result);
            }
        }
    }, [controller]);

    useEffect(() => {
        const accountNumber = sessionStorage.getItem('accountNumber');
        const type = sessionStorage.getItem('type');
        const storedAmount = sessionStorage.getItem('amount');

        if (!accountNumber || !type || !storedAmount) {
            Swal.fire({
                title: 'Error!',
                text: 'Parece que algo ha fallado, por favor intenta de nuevo',
                icon: 'error',
                confirmButtonText: 'Ok'
            }).then(() => {
                sessionStorage.clear();
                navigate('/');
            });
            return;
        }

        const parsedAmount = parseInt(storedAmount, 10);
        if (isNaN(parsedAmount)) {
            Swal.fire({
                title: 'Error!',
                text: 'El monto ingresado no es válido',
                icon: 'error',
                confirmButtonText: 'Ok'
            }).then(() => {
                sessionStorage.clear();
                navigate('/');
            });
            return;
        }

        setAmount(parsedAmount);

        accountController.current.getAccount(accountNumber, type)
            .then(data => {
                const accountInstance = new Account(
                    data.type,
                    data.accountNumber,
                    data.password,
                    data.owner,
                    data.balance,
                    data.status
                );
                setAccount(accountInstance);
            })
            .catch(error => {
                Swal.fire({
                    title: 'Error!',
                    text: (error as Error).message,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    sessionStorage.clear();
                    navigate('/');
                });
            });
    }, [navigate]);

    useEffect(() => {
        if (account && amount !== null) {
            try {
                if (account.retire(amount)) {
                    retirar(amount);
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: (error as Error).message,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
        }
    }, [account, amount, retirar]);

    const finalizar = () => {
        sessionStorage.clear();
        navigate('/')
    }

    const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    };

    const formatNumber = (number: number) => {
        return new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);
    };

    return (
        <div className="give-money">
            <h2>Por favor retire su dinero...</h2>
            <div>
                {
                    account &&
                    (
                        <div className="receipt">
                            <p>Retiro: {account.type}</p>
                            <p>Fecha: {formatDate(new Date())}</p>
                            <p>Titular: {account.owner}</p>
                            <p>Nuevo saldo: $ {formatNumber(account.balance)}</p>
                            <p>Valor retirado: $ {formatNumber(amount!)}</p>
                        </div>
                    )
                }
                <div className="money">
                    {[...myMap.entries()].flatMap(([key, value]) =>
                        Array.from({ length: value }, (_, index) => (
                            <img key={`${key}-${index}`} src={billetes[key as keyof typeof billetes] || ''} alt="money" />
                        ))
                    )}
                </div>
            </div>
            <button onClick={() => finalizar()} >Finalizar</button>
        </div>
    );
};

export default GiveMoney;
