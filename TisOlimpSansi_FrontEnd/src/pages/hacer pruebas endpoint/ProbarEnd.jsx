import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function ProbarEnd() {
  const [jsonInput, setJsonInput] = useState('{\n  "email": "poly",\n  "password": "1234"\n}');
  const [resultado, setResultado] = useState('');

  const probar = async () => {
    try {
      const data = JSON.parse(jsonInput);

      // await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
      //   withCredentials: true,
      // });

      // const csrf = Cookies.get('XSRF-TOKEN');
      // axios.defaults.headers.common['X-XSRF-TOKEN'] = csrf;

      // const response = await axios.get('http://localhost:8000/api/olimpiadas/1/areas',  {
      //   withCredentials: true,
      // });
      const response = await axios.get(
        'http://localhost:8000/user',
        { withCredentials: true }
      );
      setResultado(`✅ Éxito:\n${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      setResultado(`❌ Error:\n${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="pt-20 p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Probar Login Endpoint</h1>

      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        rows={6}
        className="w-full border p-2 font-mono text-sm rounded mb-4"
      />

      <button
        onClick={probar}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Enviar JSON
      </button>

      <pre className="mt-4 bg-gray-100 p-4 rounded whitespace-pre-wrap text-sm">
        {resultado}
      </pre>
    </div>
  );
}
