    const obtenerUsuario = async () => {
      try {
        const response = await axios.get("http://localhost:8000/user", {
          withCredentials: true,
        });

        console.log("Usuario autenticado:", response.data);
        return response.data;

      } catch (error) {
        console.error("No autenticado o error:", error);
        return null;
      }
    };

    //sirve para validar si esta autenticado y si no entonces lo vota al inicio