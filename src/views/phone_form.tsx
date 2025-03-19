import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './transaction.css';
import Swal from 'sweetalert2';
import AccountController from '../controllers/account_controller';

const handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const next = input.nextElementSibling as HTMLInputElement | null;
    const prev = input.previousElementSibling as HTMLInputElement | null;

    let currentValue = input.value;
    currentValue = currentValue.replace(/[^0-9]/g, '');

    if (currentValue.length > 1) {
        currentValue = currentValue.slice(0, 1);
    }

    input.value = currentValue;

    if (event instanceof KeyboardEvent && event.key === 'Backspace' && currentValue.length === 0 && prev) {
        prev.focus();
    } else if (next && currentValue.length === 1) {
        next.focus();
    }
};

const validateAccountNumber = (account: string, type: string) => {

    switch (type) {

        case 'nequi':
            if (account[0] !== '3' || account.length !== 10) {
                throw new Error('Su cuenta de nequi debe ser un número de teléfono de 10 dígitos. El primer dígito debe ser un 3');
            }
            break;

        case 'bancolombia':
            if (account.length !== 11) throw new Error('Su cuenta de bancolombia debe ser de 11 dígitos');
            break;

        case 'ahorro a la mano':
            if ((account[0] !== '0' && account[0] !== '1') || account[1] !== '3' || account.length !== 11) {
                throw new Error('Su cuenta de ahorro a la mano debe ser de 11 dígitos. El primer dígito debe ser 0/1, mientras que el segundo debe ser 3');
            }
            break;

        default:
            throw new Error('Invalid argument: unexpected account type');
    }


}

const PhoneForm = () => {
    const navigate = useNavigate();
    const { type } = useParams();

    useEffect(() => {
        const otpInputs = document.querySelectorAll('.otp-input');

        otpInputs.forEach(input => {
            input.addEventListener('keyup', handleInput as EventListener);
        });

        // Cleanup event listeners on component unmount
        return () => {
            otpInputs.forEach(input => {
                input.removeEventListener('keyup', handleInput as EventListener);
            });
        };
    }, []);

    const handleConfirm = async () => {
        let account: string = "";
        const otpInputs = document.querySelectorAll('.otp-input');

        otpInputs.forEach(input => {
            if (!(input as HTMLInputElement).value) {
                Swal.fire({
                    title: 'Error!',
                    text: 'No puede haber espacios de dígitos sin completar',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                }).then(() => navigate('/'));
            } else {
                account += (input as HTMLInputElement).value;
            }
        });

        try {
            if (type) {
                validateAccountNumber(account, type);
            } else {
                throw new Error('Account type is undefined');
            }
            const controller = new AccountController();
            account = type === "nequi" ? `0${account}` : account;
            if (type && await controller.getAccount(account, type)) {
                sessionStorage.setItem('accountNumber', account);
                sessionStorage.setItem('type', type);
                navigate('/options');
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: (error as Error).message,
                icon: 'error',
                confirmButtonText: 'Ok'
            }).then(() => navigate('/'));
        }
    }

    return (
        <div className="phone-form">
            {
                type === "bancolombia" ?
                    (<h2>Ingrese el número de su tarjeta</h2>)
                    : type === 'ahorro a la mano' ?
                        (<h2>Ingrese su numero cuenta de de 11 dígitos</h2>)
                        :
                        (<h2>Ingrese su numero telefónico de 10 dígitos</h2>)
            }
            <div className="phone-number">
                {[...Array(type === "nequi" ? 10 : 11)].map((_, index) => (
                    <input
                        key={index}
                        type="number"
                        className="otp-input"
                        maxLength={1}
                        placeholder="__"
                    />
                ))}
            </div>
            <div className="buttons">
                <button onClick={() => handleConfirm()} style={{ background: "Green" }}>Confirmar</button>
                <button onClick={() => navigate('/')} style={{ background: "Red" }}>Cancelar</button>
            </div>
        </div>
    );
}

export default PhoneForm;