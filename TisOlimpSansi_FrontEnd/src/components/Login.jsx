import { useState,useEffect } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import obtenerUsuario from "../funciones/obtenerUser";
import { API_URL } from "../utils/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [rolBasico] = useState(2); // Cambiado a 2 para CreadorDeOlimpiada
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validarAuth = async () => {
      const user = await obtenerUsuario();
      setAuth(user);
      setLoading(false);
    };

    validarAuth();
  }, []);
  if (loading) return <p>Cargando...</p>;
  if (auth) return <Navigate to="/" replace />;


  const loginUser = async (username, password) => {
    await axios.get(`${API_URL}/sanctum/csrf-cookie`, { withCredentials: true });
    const csrf = Cookies.get("XSRF-TOKEN");
    axios.defaults.headers.common["X-XSRF-TOKEN"] = csrf;
    const response = await axios.post(
      `${API_URL}/login`,
      { email: username, password },
      { withCredentials: true }
    );
    return response.data;
  };

  const registerUser = async (username, password, rol) => {
    await axios.get(`${API_URL}/sanctum/csrf-cookie`, { withCredentials: true });
    const csrf = Cookies.get("XSRF-TOKEN");
    axios.defaults.headers.common["X-XSRF-TOKEN"] = csrf;
    const response = await axios.post(
      `${API_URL}/registro`,
      {
        name: username,
        email: username,
        password,
        password_confirmation: password,
        id_rol: rol,
      },
      { withCredentials: true }
    );
    return response.data;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(username, password);
      setLoginError("");
      // Redirigir a inicio en lugar de crear olimpiada
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      setLoginError(error.response?.data?.message || "Error al iniciar sesión");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(newUsername, newPassword, rolBasico);
      alert("Usuario registrado correctamente");
      setShowRegister(false);
      setNewUsername("");
      setNewPassword("");
      setRegisterError("");
    } catch (error) {
      console.error(error);
      setRegisterError(error.response?.data?.message || "Error al registrarse");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-1/2 bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 text-white items-center justify-center">
        <div className="text-left px-10">
          <motion.h1
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-5xl font-extrabold leading-tight"
          >
            Bienvenido a <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-red-400 to-pink-500">
              O! SANSI
            </span>
          </motion.h1>
          <motion.p
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="text-lg mt-4 text-gray-200"
          >
            Olimpiada de Ciencia y Tecnología
          </motion.p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            {showRegister ? "Registrate" : "Acceso Administrador"}
          </h2>

          <form onSubmit={showRegister ? handleRegister : handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {showRegister ? "Nuevo usuario" : "Usuario"}
              </label>
              <input
                type="text"
                value={showRegister ? newUsername : username}
                onChange={(e) =>
                  showRegister ? setNewUsername(e.target.value) : setUsername(e.target.value)
                }
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                value={showRegister ? newPassword : password}
                onChange={(e) =>
                  showRegister ? setNewPassword(e.target.value) : setPassword(e.target.value)
                }
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {(loginError || registerError) && (
              <p className="text-sm text-red-600">
                {showRegister ? registerError : loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              {showRegister ? "Registrar" : "Ingresar"}
            </button>
          </form>

         {<p className="mt-6 text-center text-sm text-gray-600">
            {showRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
            <button
              onClick={() => setShowRegister(!showRegister)}
              className="text-indigo-600 hover:underline font-medium"
            >
              {showRegister ? "Iniciar sesión" : "Registrarse"}
            </button>
          </p> } 
        </div>
      </div>
    </div>
  );
};

export default Login;