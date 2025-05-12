import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [rolBasico] = useState(1); 
  const navigate = useNavigate();

  const endpoint = "http://localhost:8000";

  const loginUser = async (username, password) => {
    await axios.get(`${endpoint}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });

    const csrf = Cookies.get("XSRF-TOKEN");
    axios.defaults.headers.common["X-XSRF-TOKEN"] = csrf;

    try {
      const response = await axios.post(
        `${endpoint}/login`,
        {
          email: username,
          password: password,
        },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error en el login";
    }
  };

  const registerUser = async (username, password, rol) => {
    await axios.get(`${endpoint}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });

    const csrf = Cookies.get("XSRF-TOKEN");
    axios.defaults.headers.common["X-XSRF-TOKEN"] = csrf;

    try {
      const response = await axios.post(
        `${endpoint}/registro`,
        {
          name: username,
          email: username,
          password: password,
          password_confirmation: password,
          id_rol: rolBasico,
        },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error en el registro";
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(username, password);
      setLoginError("");
      localStorage.setItem("user", JSON.stringify(data)); 
      navigate("/admin/crear-olimpiada");
    } catch (error) {
      setLoginError(error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(newUsername, newPassword, rol);
      alert("Usuario registrado correctamente");
      setShowRegister(false);
      setNewUsername("");
      setNewPassword("");
      setRegisterError("");
    } catch (error) {
      setRegisterError(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 w-96">
        <h2 className="text-2xl font-bold text-center mb-4">
          {showRegister ? "Registro" : "Acceso Administrador"}
        </h2>

        {showRegister ? (
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Nuevo usuario</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full mt-1 p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full mt-1 p-2 border rounded"
                required
              />
            </div>
            {registerError && <p className="text-red-600 text-sm mb-2">{registerError}</p>}
            <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-blue-700">
              Registrar
            </button>
            <p className="mt-4 text-center text-sm">
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => setShowRegister(false)}
                className="text-blue-500 hover:underline"
              >
                Iniciar sesión
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mt-1 p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 p-2 border rounded"
                required
              />
            </div>
            {loginError && <p className="text-red-600 text-sm mb-2">{loginError}</p>}
            <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-blue-700">
              Iniciar sesión
            </button>
            <p className="mt-4 text-center text-sm">
              ¿No tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => setShowRegister(true)}
                className="text-blue-500 hover:underline"
              >
                Registrarse
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
