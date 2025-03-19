import Swal from 'sweetalert2';
import './home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const disabledOption = () => {
        Swal.fire(
            {
                title: 'Lo sentimos',
                icon: 'info',
                text: 'Lo sentimos, esta funcion se encuentra inahbilitada por el momento',
                confirmButtonText: 'Ok'
            }
        )
    }

    return (
        <div className="home">
            <h1>Bienvenido</h1>
            <h3>¿Que operación desea realizar?</h3>
            <div className="content">
                <div className="opcion">
                    <button onClick={() => navigate('/wallet/nequi')} className='right'>Retiro Nequi</button>
                    <button onClick={() => navigate('/wallet/ahorro a la mano')} className='right'>Retiro Ahorro a la mano</button>
                </div>
                <img src="src\assets\image1.svg" alt="image" />
                <div className="opcion">
                    <button onClick={() => navigate('/wallet/bancolombia')} className='left'>Retiro Bancolombia</button>
                    <button onClick={() => disabledOption()} className='left'>Otros Bancos</button>
                </div>
            </div>
        </div>
    );
}

export default Home;