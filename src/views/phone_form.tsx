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
        let phone: string = "";
        const otpInputs = document.querySelectorAll('.otp-input');

        otpInputs.forEach(input => {
            if (!(input as HTMLInputElement).value) {
                Swal.fire({
                    title: 'Error!',
                    text: 'El numero de teléfono debe ser de 10 dígitos',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                }).then(() => navigate('/'));
            } else {
                phone += (input as HTMLInputElement).value;
            }
        });


        try {
            const controller = new AccountController();
            const account = type === "nequi" ? `0${phone}` : phone;
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
                    :
                    (<h2>Ingrese su numero telefónico de 10 dígitos</h2>)
            }
            <div className="phone-number">
                {[...Array(type === "bancolombia" ? 11 : 10)].map((_, index) => (
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