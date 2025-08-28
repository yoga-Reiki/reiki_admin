import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Toaster } from 'react-hot-toast';
import DefaultLayout from './layout/DefaultLayout';
import PrivateAuthRoute from './PrivateAuthRoute';
import PrivateRoute from './PrivateRoute';
import Login from './view/login/Login';

function App() {
  return (
    <>
      <Toaster
        top-left
        toastOptions={{
          duration: 5000,
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route>
            <Route element={<PrivateAuthRoute />}>
              <Route path="/" element={<Login />} />
              {/* <Route path="/forgotpassword" element={<ForgotPassword />} /> */}
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path="*" name="Home" element={<DefaultLayout />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
