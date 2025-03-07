import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home, PhoneForm, DefaultMoneyOptions, CodeForm, GiveMoney } from './views/views';
import InactivityHandler from './inactivity_handler';
import Swal from 'sweetalert2';

function App() {


  const handleInactivity = () => {
    Swal.fire({
      title: 'Auto close alert!',
      text: 'Transaccion cancelada por inactividad',
      timer: 1500
    }).then(() => {
      sessionStorage.clear();
      window.location.href = '/';
    });
  };

  return (
    <Router>
      <InactivityHandler timeout={30000} onTimeout={handleInactivity} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/wallet/:type' element={<PhoneForm />} />
        <Route path='/options' element={<DefaultMoneyOptions />} />
        <Route path='/validation' element={<CodeForm />} />
        <Route path='/money' element={<GiveMoney />} />
      </Routes>
    </Router>
  );
}

export default App;
