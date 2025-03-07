import './home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home">
            <h1>Bienvenido</h1>
            <h3>¿Que operación desea realizar?</h3>
            <div className="content">
                <div className="opcion">
                    <button onClick={()=>navigate('/wallet/nequi')} className='right'>Retiro Nequi</button>
                    <button onClick={()=>navigate('/wallet/ahorro a la mano')} className='right'>Retiro Ahorro a la mano</button>
                </div>
                <img src="src\assets\imaege1.svg" alt="image" />
                <div className="opcion">
                    <button className='left'>Retiro Bancolombia</button>
                    <button className='left'>Otros Bancos</button>
                </div>
            </div>
        </div>
    );
}

export default Home;