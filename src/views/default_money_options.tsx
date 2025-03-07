import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Swal from 'sweetalert2';
import './home.css';
import './transaction.css';

const DefaultMoneyOptions = () => {
    const navigate = useNavigate();
    const [useDefault, setUseDefault] = useState(true);
    const [amount, setAmount] = useState<number>(0);

    const saveAmount = (amount: number) => {
        if (amount % 10000 !== 0 || amount > 2400000) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El valor debe ser multiplo de 10000 y no puede ser mayor a 2.400.000.00',
                confirmButtonText: 'Ok'
            })
            return;
        }
        sessionStorage.setItem('amount', amount.toString());
        navigate('/validation');
    };

    return (
        <div style={{
            display: 'flex', alignItems: 'center', width: '100%', height: '100vh', flexDirection: 'column', overflow:'hidden',
        }}>
            <div className="default-money-options">

                {
                    useDefault &&
                    (
                        <div className="opcion">
                            <button onClick={() => saveAmount(50000)} className='right'>$ 50 000</button>
                            <button onClick={() => saveAmount(200000)} className='right'>$ 200 000</button>
                            <button onClick={() => saveAmount(1200000)} className='right'>$ 1 200 000</button>
                        </div>
                    )
                }

                <div className="middle-text">
                    {
                        useDefault ?
                            (
                                <h2>Escoja la cantidad de dinero que desea retirar</h2>
                            )
                            :
                            (
                                <h2>Ingrese la cantidad de dinero que desea retirar, no puede ser mayor a 2.400.000.00</h2>
                            )
                    }

                </div>
                {
                    useDefault &&
                    (
                        <div className="opcion">
                            <button onClick={() => saveAmount(100000)} className='left'>$ 100 000</button>
                            <button onClick={() => saveAmount(300000)} className='left'>$ 300 000</button>
                            <button onClick={() => setUseDefault(false)} className='left'>Solicitar un valor diferente</button>
                        </div>
                    )
                }

            </div>
            {
                !useDefault &&
                (
                    <div className='give-money'>
                        <input
                            type="number"
                            value={amount === 0 ? '' : amount}
                            min="1"
                            onChange={(e) => {
                                setAmount(Number(e.target.value));
                            }
                            }
                        />
                        <div className="buttons">
                            <button onClick={() => saveAmount(amount)} style={{ background: "Green" }}>Confirmar</button>
                            <button onClick={() => navigate('/')} style={{ background: "Red" }}>Cancelar</button>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default DefaultMoneyOptions;