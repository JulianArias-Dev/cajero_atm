import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './transaction.css';
import Swal from 'sweetalert2';
import AccountController from '../controllers/account_controller';

function handleInput(event: Event, type: string) {
    const input = event.target as HTMLInputElement;
    const index = Number(input.dataset.index); //
    const next = input.nextElementSibling as HTMLInputElement | null;
    const prev = input.previousElementSibling as HTMLInputElement | null;

    let currentValue = input.value;
    currentValue = currentValue.replace(/[^0-9]/g, '');

    if (currentValue.length > 1) {
        currentValue = currentValue.slice(0, 1);
    }

    if (validateAccountNumber(index, Number(currentValue) || 0, type)) {
        input.value = currentValue;
        if (event instanceof KeyboardEvent && event.key === 'Backspace' && currentValue.length === 0 && prev) {
            prev.focus();
        } else if (next && currentValue.length === 1) {
            next.focus();
        }
    }
    else
        input.value = '';
};

function validateAccountNumber(index: number, input: number, type: string) {
    switch (type) {

        case 'nequi':
            if (index === 0 && input !== 3) {
                return false;
            }
            break;

        case 'bancolombia':
            break;

        case 'ahorro a la mano':
            if ((index === 0 && (input !== 1 && input !== 0)) || (index === 1 && input !== 3)) {
                return false;
            }
            break;

        default:
            throw new Error('Invalid argument: unexpected account type');
    }
    return true;
}

const PhoneForm = () => {
    const navigate = useNavigate();
    const { type } = useParams();

    useEffect(() => {
        const otpInputs = document.querySelectorAll('.otp-input');

        otpInputs.forEach(input => {
            input.addEventListener('keyup', (event) => handleInput(event, type as string));
        });

        return () => {
            otpInputs.forEach(input => {
                input.removeEventListener('keyup', (event) => handleInput(event, type as string));
            });
        };
    }, [type]);


    const handleConfirm = async () => {
        try {
            let account: string = "";
            const otpInputs = document.querySelectorAll('.otp-input');

            otpInputs.forEach(input => {
                if (!(input as HTMLInputElement).value) {
                    throw new Error('No puede haber espacios de dígitos sin completar');
                } else {
                    account += (input as HTMLInputElement).value;
                }
            });


            if ((type === 'nequi' && account.length < 10) || (type !== 'nequi' && account.length < 11))
                throw new Error(type === 'nequi' ? 'Su cuenta nequi debe ser de 10 dígitos' : 'El numero de su cuenta debe ser de 11 dígitos');

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
                        type="text"
                        inputMode='numeric'
                        pattern="[0-9]*"
                        className="otp-input"
                        maxLength={1}
                        placeholder="__"
                        data-index={index}
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