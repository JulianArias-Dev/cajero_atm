import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './transaction.css';
import Swal from 'sweetalert2';
import AccountController from '../controllers/account_controller';

const handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const next = input.nextElementSibling as HTMLInputElement | null;
    const prev = input.previousElementSibling as HTMLInputElement | null;

    let currentValue = input.value.replace(/[^0-9]/g, '');

    if (currentValue.length > 1) {
        currentValue = currentValue.slice(0, 1);
    }

    input.dataset.realValue = currentValue;

    input.value = currentValue ? 'X' : '';

    // Manejo de navegación con teclas
    if (event instanceof KeyboardEvent && event.key === 'Backspace' && currentValue.length === 0 && prev) {
        prev.focus();
    } else if (next && currentValue.length === 1) {
        next.focus();
    }
};

function generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const CodeForm = () => {
    const navigate = useNavigate();
    const [validationCode, setCode] = useState('');

    useEffect(() => {
        if (validationCode.length === 0) {
            if (sessionStorage.getItem('accountNumber') === null || sessionStorage.getItem('amount') === null) {
                Swal.fire({
                    title: 'Error!',
                    text: 'No se ha ingresado un número de teléfono o monto',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    navigate('/');
                });
            } else {
                if (sessionStorage.getItem("type") !== "bancolombia") {
                    const code = generateCode();
                    setCode(code);
                    console.log(code);
                }
            }
        }
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
    }, [validationCode, navigate]);

    useEffect(() => {
        if (validationCode.length > 0) {
            Swal.fire({
                title: 'Código de verificación',
                text: `Su código es: ${validationCode}`,
                icon: 'info',
                confirmButtonText: 'Ok'
            });
        }
    }, [validationCode]);

    const handleConfirm = async () => {
        let enterCode: string = "";
        const otpInputs = document.querySelectorAll('.otp-input');

        otpInputs.forEach(input => {
            const realValue = (input as HTMLInputElement).dataset.realValue;
            if (!realValue) {
                Swal.fire({
                    title: 'Error!',
                    text: sessionStorage.getItem("type") === "bancolombia" ? 'El código debe ser de 4 dígitos' : 'El código debe ser de 6 dígitos',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    navigate('/');
                });
                return;
            }
            enterCode += realValue;
        });

        let isValid: boolean = false;
        if (sessionStorage.getItem("type") === "bancolombia") {
            const controller = new AccountController();
            const account = sessionStorage.getItem('accountNumber') ?? "";
            try {
                isValid = await controller.validatePassword(account, enterCode);
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: (error as Error).message,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    navigate('/');
                });
            }
        } else {
            isValid = validationCode === enterCode ? true : false;
        }

        if (isValid) {
            Swal.fire({
                title: 'Código correcto',
                text: 'El código ingresado es correcto',
                icon: 'success',
                confirmButtonText: 'Ok'
            }).then(() => {
                navigate('/money');
            });
        } else {
            Swal.fire({
                title: 'Error!',
                text: 'El código ingresado es incorrecto',
                icon: 'error',
                confirmButtonText: 'Ok'
            }).then(() => {
                navigate('/');
            });
        }
    }

    const finalizar = () => {
        sessionStorage.clear();
        navigate('/')
    }

    return (
        <div className="phone-form">
            {
                sessionStorage.getItem("type") === "bancolombia" ?
                    (<h2>Ingrese su clave de 4 dígitos</h2>)
                    :
                    (<h2>Ingrese el codigo de seguridad de 6 dígitos</h2>)
            }
            <div className="phone-number">
                {[...Array(sessionStorage.getItem("type") !== "bancolombia" ? 6 : 4)].map((_, index) => (
                    <input
                        key={index}
                        type="text"
                        className="otp-input"
                        maxLength={1}
                        placeholder="__"
                    />
                ))}
            </div>
            <div className="buttons">
                <button onClick={() => handleConfirm()} style={{ background: "Green" }}>Confirmar</button>
                <button onClick={() => finalizar()} style={{ background: "Red" }}>Cancelar</button>
            </div>
        </div>
    );
}

export default CodeForm;