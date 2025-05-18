import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../../supabase/supabase.config.jsx";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

  const signIn = async (email, password) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  const signUp = async (email, password, displayName) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          displayName: displayName,
        },
      },
    });
  };

  useEffect(() => {
    // Obtiene la sesión actual cuando se monta el componente
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
    };
    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error:", error);
    } else {
      setSession(null);
    }
  };

  return (
    <AuthContext.Provider value={{ session, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { useAuth };
